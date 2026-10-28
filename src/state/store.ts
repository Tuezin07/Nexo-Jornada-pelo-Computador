/**
 * GameStore: ponte entre a interface, as regras de domínio e a persistência.
 *
 * - Toda ação calcula o próximo estado com um redutor puro de `domain/progress.ts`.
 * - A gravação é enfileirada (ordem garantida) e o resultado real é exposto em
 *   `snapshot.save`, para a interface só dizer "salvo" quando estiver salvo.
 * - Falhas de gravação não desfazem o estado em memória: o jogador é avisado e pode
 *   tentar de novo ou exportar um backup.
 */
import type { MissionDefinition } from '../content/types';
import type { ConceptId } from '../content/concepts';
import { DEFAULT_CATALOG, type Catalog } from '../domain/catalog';
import type { RunSummary } from '../domain/engine';
import {
  applyAssessment,
  applyMissionResult,
  applyOnboarding,
  applyTrainingResult,
  markCodexViewed,
  recordMissionStart,
  restartTutorial,
  updatePreferences,
  updateProfile,
  type MissionReport,
  type OnboardingChoices,
  type ProgressEvents,
  type TrainingReport,
  type TrainingSummary,
} from '../domain/progress';
import { createInitialState, type AssessmentRecord, type GameState, type Preferences } from '../domain/state';
import { exportBackup, importBackup, type ImportResult } from '../persistence/backup';
import { createRepository, type ProgressRepository, type StorageKind } from '../persistence/repository';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export interface Notice {
  id: string;
  tone: 'info' | 'warning' | 'error';
  text: string;
}

export interface StoreSnapshot {
  ready: boolean;
  state: GameState;
  storage: StorageKind | null;
  persistent: boolean;
  /** Save de uma versão mais nova: não sobrescrevemos para não perder dados. */
  readOnly: boolean;
  save: { status: SaveStatus; error: string | null; lastSavedAt: number | null };
  notices: Notice[];
}

export interface StoreOptions {
  repository?: () => Promise<ProgressRepository>;
  catalog?: Catalog;
  clock?: () => number;
}

const BOOT_KEY = 'nexo:boot';

/** Espelha preferências visuais no localStorage para aplicar o tema antes do React carregar. */
function writeBootPreferences(p: Preferences): void {
  try {
    localStorage.setItem(BOOT_KEY, JSON.stringify({ theme: p.theme, motion: p.motion, fontScale: p.fontScale }));
  } catch {
    // armazenamento indisponível: o tema será aplicado após o carregamento
  }
}

let noticeSeq = 0;

export class GameStore {
  private snapshot: StoreSnapshot;
  private readonly listeners = new Set<() => void>();
  private repo: ProgressRepository | null = null;
  private queue: Promise<unknown> = Promise.resolve();
  private readonly repositoryFactory: () => Promise<ProgressRepository>;
  readonly catalog: Catalog;
  readonly now: () => number;

  constructor(options: StoreOptions = {}) {
    this.repositoryFactory = options.repository ?? (() => createRepository());
    this.catalog = options.catalog ?? DEFAULT_CATALOG;
    this.now = options.clock ?? (() => Date.now());
    this.snapshot = {
      ready: false,
      state: createInitialState(this.now()),
      storage: null,
      persistent: false,
      readOnly: false,
      save: { status: 'idle', error: null, lastSavedAt: null },
      notices: [],
    };
  }

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = (): StoreSnapshot => this.snapshot;

  private set(patch: Partial<StoreSnapshot>): void {
    this.snapshot = { ...this.snapshot, ...patch };
    for (const l of this.listeners) l();
  }

  private notify(tone: Notice['tone'], text: string): void {
    this.set({ notices: [...this.snapshot.notices, { id: `n${++noticeSeq}`, tone, text }] });
  }

  dismissNotice(id: string): void {
    this.set({ notices: this.snapshot.notices.filter((n) => n.id !== id) });
  }

  async init(): Promise<void> {
    if (this.snapshot.ready) return;
    const now = this.now();
    try {
      this.repo = await this.repositoryFactory();
    } catch {
      this.repo = null;
    }
    let state = createInitialState(now);
    let readOnly = false;
    if (this.repo) {
      const outcome = await this.repo.load(now).catch(() => ({ status: 'empty' as const }));
      if (outcome.status === 'ok') {
        state = outcome.state;
        if (outcome.migratedFrom !== null) this.notify('info', 'Seu progresso foi atualizado para o formato desta versão. Uma cópia do formato antigo foi guardada.');
        if (outcome.issues.length > 0) this.notify('warning', `Alguns dados salvos estavam inválidos e foram corrigidos: ${outcome.issues.join(' ')}`);
      } else if (outcome.status === 'recovered') {
        if (outcome.state) state = outcome.state;
        this.notify('warning', outcome.message);
      } else if (outcome.status === 'newer') {
        readOnly = true;
        this.notify('error', `${outcome.message} Até lá, nada será gravado para não sobrescrever seu progresso.`);
      }
    }
    const persistent = Boolean(this.repo?.persistent);
    if (!persistent) {
      this.notify('warning', 'Este navegador não permite salvar dados (modo privado ou armazenamento bloqueado). Você pode jogar, mas o progresso será perdido ao fechar a página. Exporte um backup para guardar.');
    }
    writeBootPreferences(state.preferences);
    this.set({ ready: true, state, storage: this.repo?.kind ?? null, persistent, readOnly });
  }

  /** Aplica o novo estado e grava. Resolve com true quando a gravação foi confirmada. */
  private commit(next: GameState): Promise<boolean> {
    this.set({ state: next, save: { ...this.snapshot.save, status: 'saving', error: null } });
    if (this.snapshot.readOnly) {
      this.set({ save: { ...this.snapshot.save, status: 'error', error: 'Gravação suspensa: save de versão mais nova.' } });
      return Promise.resolve(false);
    }
    const repo = this.repo;
    const run = async (): Promise<boolean> => {
      if (!repo) {
        this.set({ save: { status: 'error', error: 'Armazenamento indisponível.', lastSavedAt: this.snapshot.save.lastSavedAt } });
        return false;
      }
      try {
        await repo.save(this.snapshot.state, this.now());
        this.set({ save: { status: repo.persistent ? 'saved' : 'error', error: repo.persistent ? null : 'Progresso só na memória.', lastSavedAt: this.now() } });
        return repo.persistent;
      } catch (error) {
        const message = error instanceof Error && error.message ? error.message : 'Falha desconhecida.';
        this.set({ save: { status: 'error', error: message, lastSavedAt: this.snapshot.save.lastSavedAt } });
        return false;
      }
    };
    const result = this.queue.then(run, run);
    this.queue = result;
    return result;
  }

  retrySave(): Promise<boolean> {
    return this.commit(this.snapshot.state);
  }

  get state(): GameState {
    return this.snapshot.state;
  }

  completeOnboarding(choices: OnboardingChoices): Promise<boolean> {
    return this.commit(applyOnboarding(this.state, choices, this.catalog, this.now()));
  }

  async saveAssessment(
    record: AssessmentRecord,
    evidence: { concept: ConceptId; correct: boolean }[],
  ): Promise<{ xp: number; events: ProgressEvents; saved: boolean }> {
    const result = applyAssessment(this.state, record, evidence, this.catalog, this.now());
    const saved = await this.commit(result.state);
    return { xp: result.xp, events: result.events, saved };
  }

  startMission(mission: MissionDefinition): Promise<boolean> {
    return this.commit(recordMissionStart(this.state, mission, this.now()));
  }

  async finishMission(mission: MissionDefinition, summary: RunSummary): Promise<{ report: MissionReport; saved: boolean }> {
    const { state, report } = applyMissionResult(this.state, mission, summary, this.catalog, this.now());
    if (report.alreadyProcessed) return { report, saved: this.snapshot.save.status === 'saved' };
    const saved = await this.commit(state);
    return { report, saved };
  }

  async finishTraining(summary: TrainingSummary): Promise<{ report: TrainingReport; saved: boolean }> {
    const { state, report } = applyTrainingResult(this.state, summary, this.catalog, this.now());
    if (report.alreadyProcessed) return { report, saved: this.snapshot.save.status === 'saved' };
    const saved = await this.commit(state);
    return { report, saved };
  }

  viewCodex(concept: ConceptId): ProgressEvents {
    const { state, events } = markCodexViewed(this.state, concept, this.catalog, this.now());
    if (state !== this.state) void this.commit(state);
    return events;
  }

  setPreferences(patch: Partial<Preferences>): Promise<boolean> {
    const next = updatePreferences(this.state, patch, this.now());
    writeBootPreferences(next.preferences);
    return this.commit(next);
  }

  setProfile(patch: Parameters<typeof updateProfile>[1]): Promise<boolean> {
    return this.commit(updateProfile(this.state, patch, this.now()));
  }

  restartTutorial(): Promise<boolean> {
    return this.commit(restartTutorial(this.state, this.now()));
  }

  exportBackup(): string {
    return exportBackup(this.state, this.now());
  }

  previewImport(text: string): ImportResult {
    return importBackup(text, this.catalog, this.now());
  }

  async applyImport(state: GameState): Promise<boolean> {
    if (this.repo) await this.repo.snapshot().catch(() => undefined);
    writeBootPreferences(state.preferences);
    return this.commit(state);
  }

  /** Apaga todo o progresso local (após confirmação explícita na interface). */
  async resetProgress(): Promise<boolean> {
    const fresh = createInitialState(this.now());
    fresh.preferences = this.state.preferences;
    if (this.repo) {
      try {
        await this.repo.clear();
      } catch {
        this.notify('error', 'Não foi possível apagar todos os dados do navegador. Tente novamente.');
        return false;
      }
    }
    this.set({ readOnly: false });
    return this.commit(fresh);
  }
}
