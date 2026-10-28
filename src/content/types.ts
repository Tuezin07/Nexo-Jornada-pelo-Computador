/**
 * Contrato do conteúdo educativo do Nexo.
 *
 * Todo o conteúdo (missões, Codex, avaliação) é dado estático e tipado.
 * A lógica de avaliação vive em `src/domain` e a renderização em `src/ui`;
 * nada aqui deve conter funções ou JSX.
 *
 * Texto rico: os campos de texto aceitam uma marcação mínima e segura,
 * convertida em elementos React (nunca em innerHTML):
 *   **negrito**     → <strong>
 *   `código`        → <code>
 *   {{Ctrl+C}}      → teclas renderizadas como <kbd> (separe teclas com "+")
 * Quebras de linha com "\n" viram parágrafos.
 */

import type { ConceptId } from './concepts';

// ---------------------------------------------------------------------------
// Taxonomia
// ---------------------------------------------------------------------------

export type CategoryId =
  | 'teclado'
  | 'sistema'
  | 'arquivos'
  | 'internet'
  | 'navegadores'
  | 'programas'
  | 'configuracoes'
  | 'seguranca'
  | 'diagnostico'
  | 'produtividade'
  | 'hardware'
  | 'redes'
  | 'comandos';

export type SectorId = 'fundamentos' | 'sistema' | 'rede-segura' | 'diagnostico' | 'eficiencia';

/** 1 = Básico, 2 = Intermediário, 3 = Avançado, 4 = Especialista. */
export type Difficulty = 1 | 2 | 3 | 4;

export type StartingLevel = 'iniciante' | 'casual' | 'veterano' | 'mestre';

export interface CategoryDefinition {
  id: CategoryId;
  name: string;
  /** Rótulo curto para chips e filtros. */
  short: string;
  description: string;
}

export type SectorUnlockRule =
  | { type: 'always' }
  /** Abre quando o jogador conclui `count` missões do setor indicado. */
  | { type: 'completedInSector'; sector: SectorId; count: number }
  /** Abre quando o nível declarado no onboarding é pelo menos `min`. */
  | { type: 'startingLevel'; min: StartingLevel }
  /** Abre quando a avaliação inicial atinge pelo menos `min` (0..1). */
  | { type: 'assessmentScore'; min: number };

export interface SectorDefinition {
  id: SectorId;
  order: number;
  name: string;
  tagline: string;
  description: string;
  objectives: string[];
  /** Basta UMA regra ser satisfeita para o setor abrir. */
  unlock: SectorUnlockRule[];
  /** Texto exibido enquanto o setor está bloqueado. */
  unlockHint: string;
}

// ---------------------------------------------------------------------------
// Etapas (desafios)
// ---------------------------------------------------------------------------

interface StepBase {
  /** Identificador estável, único dentro da missão (ex.: "teclas-01"). */
  id: string;
  /** Rótulo curto da etapa, exibido no indicador de progresso. */
  title: string;
  /** A tarefa ou pergunta. Deve ser clara e prática. */
  prompt: string;
  /** Situação/cenário opcional exibido antes do prompt. */
  context?: string;
  /** Pista contextual mostrada após o primeiro erro ou sob demanda. */
  hint: string;
  /** Explicação mostrada quando a etapa é concluída (o "porquê"). */
  explanation: string;
  /** Conceito do Codex avaliado por esta etapa (alimenta o domínio). */
  concept: ConceptId;
}

export interface ChoiceOption {
  id: string;
  text: string;
  /** Marque as alternativas corretas. Em escolha única, exatamente uma. */
  correct?: boolean;
  /** Retorno específico para quem escolher esta alternativa. */
  feedback: string;
}

/** Múltipla escolha. `multiple: true` exige marcar todas as corretas e nenhuma errada. */
export interface QuizStep extends StepBase {
  kind: 'quiz';
  options: ChoiceOption[];
  multiple?: boolean;
}

/** Ordenação: `items` está na ORDEM CORRETA; a interface embaralha de forma determinística. */
export interface OrderStep extends StepBase {
  kind: 'order';
  items: { id: string; text: string }[];
}

/** Classificação: distribuir cada item em um grupo. */
export interface ClassifyStep extends StepBase {
  kind: 'classify';
  buckets: { id: string; label: string; description?: string }[];
  items: { id: string; text: string; bucket: string; feedback: string }[];
}

/**
 * Combinação de teclas.
 * `key` segue `KeyboardEvent.key` em minúsculas: 'c', 'v', 'tab', 'escape', 'enter',
 * 'backspace', 'delete', 'f2', 'f5', 'arrowleft', 'arrowright', 'arrowup', 'arrowdown',
 * 'home', 'end', ' ' (espaço), 'printscreen'.
 * `meta` = tecla Windows (⊞) no Windows e Command (⌘) no macOS.
 */
export interface KeyCombo {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
}

/**
 * Atalho de teclado.
 * - `capture: 'real'`: o jogador pressiona as teclas de verdade numa área de prática.
 *   Use apenas combinações que o navegador entrega à página (Ctrl+C/V/X/Z/Y/A/S/F/P/B/I/U,
 *   Ctrl+setas, Shift+setas, F2, Delete, Esc, Enter, Tab, Home/End, Ctrl+L).
 * - `capture: 'virtual'`: o jogador monta a combinação num teclado virtual. Obrigatório
 *   para atalhos reservados ao sistema/navegador (Alt+Tab, Win+E, Win+D, Win+L, Win+V,
 *   Win+Shift+S, Ctrl+Shift+Esc, Ctrl+W, Ctrl+T, Ctrl+N, Ctrl+Tab, Ctrl+Shift+T, Ctrl+J).
 * `combos` é uma SEQUÊNCIA: todas devem ser feitas em ordem (normalmente só uma).
 * Se no macOS o atalho for diferente, informe `mac`. Se não existir equivalente direto,
 * use `windowsOnly: true` e explique em `platformNote`.
 */
export interface ShortcutStep extends StepBase {
  kind: 'shortcut';
  capture: 'real' | 'virtual';
  combos: KeyCombo[];
  mac?: KeyCombo[];
  windowsOnly?: boolean;
  platformNote?: string;
  /** Texto exibido na área de prática (ex.: um parágrafo para selecionar e copiar). */
  practiceText?: string;
}

/**
 * Digitação no modo "para no erro": a tecla errada não avança e conta como erro.
 * Use apenas caracteres de teclado ABNT2 comuns. Evite aspas tipográficas e travessões.
 */
export interface TypingStep extends StepBase {
  kind: 'typing';
  text: string;
  /** Precisão mínima por tecla (0..1). Iniciantes: 0.85; avançados: 0.92–0.95. */
  minAccuracy: number;
  /** Meta opcional de palavras por minuto; apenas informativa (não reprova). */
  targetWpm?: number;
}

// ----- Sistema de arquivos simulado (Explorador e Terminal) -----------------

export interface FsSeedNode {
  name: string;
  type: 'folder' | 'file';
  children?: FsSeedNode[];
  /** Tamanho em KB (arquivos). */
  sizeKb?: number;
}

/**
 * Caminhos usam "/" a partir da raiz virtual. Pastas raiz usuais:
 * "/Área de Trabalho", "/Documentos", "/Downloads", "/Imagens", "/Músicas", "/Vídeos".
 * Exemplo: "/Documentos/Trabalho/relatorio.docx".
 */
export type FsGoal =
  | { type: 'exists'; path: string; nodeType?: 'folder' | 'file'; label: string }
  | { type: 'notExists'; path: string; label: string }
  /** Item (pelo nome) está na Lixeira. */
  | { type: 'inTrash'; name: string; label: string }
  /** Item (pelo nome) NÃO está na Lixeira (ex.: foi restaurado). */
  | { type: 'notInTrash'; name: string; label: string }
  /** O jogador abriu este arquivo (duplo clique ou Enter). */
  | { type: 'opened'; path: string; label: string }
  /** A Lixeira foi esvaziada pelo menos uma vez e está vazia. */
  | { type: 'trashEmpty'; label: string }
  /** A pasta contém exatamente `count` arquivos com a extensão (sem ponto, ex.: "pdf"). */
  | { type: 'countInFolder'; path: string; extension: string; count: number; label: string };

export interface FilesystemFeatures {
  createFolder?: boolean;
  rename?: boolean;
  move?: boolean;
  delete?: boolean;
  trash?: boolean;
  search?: boolean;
  /** Botão "Mostrar extensões". */
  extensions?: boolean;
  /** Compactar seleção em .zip e extrair .zip. */
  compress?: boolean;
}

/** Explorador de arquivos simulado com estado próprio. */
export interface FilesystemStep extends StepBase {
  kind: 'filesystem';
  root: FsSeedNode[];
  startPath: string;
  goals: FsGoal[];
  features: FilesystemFeatures;
  /** Caminhos que não podem ser apagados ou movidos (fazer isso conta como erro). */
  protectedPaths?: string[];
  /** Itens iniciais na Lixeira. */
  trash?: FsSeedNode[];
}

/**
 * Terminal simulado ("NexoShell"). Aceita nomes Linux/macOS e Windows:
 *   help | pwd | ls, dir | cd <pasta>, cd .., cd / | mkdir <nome> | cat, type <arquivo>
 *   echo <texto> | echo <texto> > <arquivo> | cp, copy <origem> <destino>
 *   mv, move <origem> <destino> | rm, del <arquivo> | rmdir <pasta vazia>
 *   tree | clear, cls | whoami | date | ping <host> | ipconfig | nslookup <host>
 * Curingas simples são aceitos em ls/cp/mv/rm: "*.txt".
 * Nomes com espaço exigem aspas: cd "Área de Trabalho".
 * Nenhum comando toca o computador real.
 */
export type TerminalGoal =
  | { type: 'cwd'; path: string; label: string }
  /** Executou com sucesso um comando (nome canônico: 'ls', 'cd', 'mkdir', 'ping'...). */
  | { type: 'ran'; command: string; argIncludes?: string; label: string }
  | { type: 'exists'; path: string; nodeType?: 'folder' | 'file'; label: string }
  | { type: 'notExists'; path: string; label: string }
  | { type: 'countInFolder'; path: string; extension: string; count: number; label: string };

export interface TerminalStep extends StepBase {
  kind: 'terminal';
  root: FsSeedNode[];
  startPath: string;
  goals: TerminalGoal[];
  /** Comandos sugeridos exibidos como dicas clicáveis (preenchem a linha, não executam). */
  suggestions?: string[];
  /**
   * Condições da rede simulada (padrão: tudo funcionando).
   * - online: false → ping e nslookup falham ("rede inacessível").
   * - dnsWorking: false → ping por nome e nslookup falham, mas ping por IP funciona.
   * `ipconfig` mostra IPv4 192.168.0.23, máscara 255.255.255.0, gateway e DNS 192.168.0.1
   * (ou "Mídia desconectada" quando online é false).
   */
  network?: { online?: boolean; dnsWorking?: boolean };
}

// ----- Painel de configurações simulado --------------------------------------

export type SettingControl =
  | { id: string; type: 'toggle'; label: string; description?: string; initial: boolean }
  | {
      id: string;
      type: 'select';
      label: string;
      description?: string;
      options: { value: string; label: string }[];
      initial: string;
    }
  | {
      id: string;
      type: 'slider';
      label: string;
      description?: string;
      min: number;
      max: number;
      step: number;
      initial: number;
      unit?: string;
    }
  /**
   * Programa instalado, com botão "Desinstalar" (pede confirmação).
   * Valores: 'installed' | 'removed'. Use em objetivos com op 'eq'.
   */
  | {
      id: string;
      type: 'app';
      label: string;
      description?: string;
      publisher: string;
      sizeMb: number;
      initial: 'installed' | 'removed';
    };

export interface SettingsPanel {
  id: string;
  title: string;
  groups: { title: string; controls: SettingControl[] }[];
}

export type SettingCondition =
  | { control: string; op: 'eq'; value: boolean | string | number }
  | { control: string; op: 'gte' | 'lte'; value: number };

export interface SettingsStep extends StepBase {
  kind: 'settings';
  panels: SettingsPanel[];
  goals: (SettingCondition & { label: string })[];
  /** Estados que não podem ocorrer ao verificar (ex.: desligar o antivírus). */
  forbidden?: (SettingCondition & { reason: string })[];
}

// ----- Diagnóstico -----------------------------------------------------------

/**
 * Qualidade de uma ação de diagnóstico:
 * - best: o passo mais sensato agora; avança.
 * - good: aceitável, mas não ideal; avança com pequena penalidade.
 * - poor: não ajuda agora; mostra o resultado e o jogador continua na mesma fase.
 * - harmful: arriscado ou destrutivo; aviso forte, penalidade alta, continua na fase.
 * Ações best/good devem ter `next` (próxima fase) OU `resolves: true` (problema resolvido).
 */
export interface DiagnosisAction {
  id: string;
  label: string;
  result: string;
  quality: 'best' | 'good' | 'poor' | 'harmful';
  next?: string;
  resolves?: boolean;
}

export interface DiagnosisStage {
  id: string;
  situation: string;
  /** Informações observadas (resultados simulados de verificações). */
  evidence?: string[];
  actions: DiagnosisAction[];
}

export interface DiagnosisStep extends StepBase {
  kind: 'diagnosis';
  symptom: string;
  startStage: string;
  stages: DiagnosisStage[];
}

// ----- Inspeção (phishing, sites, downloads) ---------------------------------

export interface InspectPart {
  id: string;
  /** Rótulo do campo ("De", "Assunto", "Link", "Anexo", "Mensagem", "Endereço"...). */
  field: string;
  text: string;
  suspicious: boolean;
  explanation: string;
}

/**
 * O jogador marca as partes suspeitas e depois dá um veredito.
 * Passa quando marca pelo menos `minFlags` partes suspeitas e acerta o veredito;
 * marcar partes legítimas conta como erro.
 */
export interface InspectStep extends StepBase {
  kind: 'inspect';
  artifact: 'email' | 'sms' | 'site' | 'download' | 'popup';
  parts: InspectPart[];
  minFlags: number;
  verdict: { question: string; options: ChoiceOption[] };
}

export type ChallengeStep =
  | QuizStep
  | OrderStep
  | ClassifyStep
  | ShortcutStep
  | TypingStep
  | FilesystemStep
  | TerminalStep
  | SettingsStep
  | DiagnosisStep
  | InspectStep;

export type StepKind = ChallengeStep['kind'];

export type StepOfKind<K extends StepKind> = Extract<ChallengeStep, { kind: K }>;

// ---------------------------------------------------------------------------
// Missões
// ---------------------------------------------------------------------------

export interface MissionDefinition {
  /** Identificador estável e permanente (ex.: "f01-primeiro-contato"). Nunca renomeie. */
  id: string;
  /** Incrementar quando o conteúdo mudar de forma relevante. */
  version: number;
  sector: SectorId;
  /** Ordem de exibição dentro do setor. */
  order: number;
  title: string;
  /** Uma frase sobre o que a missão ensina. */
  summary: string;
  /** Introdução narrativa curta (2–3 frases), tom de jogo, sem infantilizar. */
  briefing: string;
  category: CategoryId;
  subcategory: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  /** IDs de missões do MESMO setor que precisam estar concluídas. */
  prerequisites: string[];
  /** O que o jogador saberá fazer ao final (2–4 itens). */
  objectives: string[];
  /** Conceitos do Codex ensinados (os mesmos usados nas etapas). */
  concepts: ConceptId[];
  steps: ChallengeStep[];
  /** Explicação final que consolida o aprendizado (2–4 frases). */
  debrief: string;
  /** Observação sobre variações entre versões de sistema/navegador, se houver. */
  platformNote?: string;
}

// ---------------------------------------------------------------------------
// Codex
// ---------------------------------------------------------------------------

export interface CodexEntry {
  id: ConceptId;
  title: string;
  category: CategoryId;
  /** Explicação simples (2–4 frases), sem jargão não explicado. */
  summary: string;
  /** Exemplo prático do dia a dia. */
  example: string;
  /** Quando utilizar. */
  whenToUse: string;
  /** Erros comuns (2–4). */
  commonMistakes: string[];
  /** Atalhos relacionados, no formato "{{Ctrl+C}} — Copiar". Pode ser vazio. */
  shortcuts: string[];
  /** Observação de plataforma (Windows/macOS/Linux, versões), se aplicável. */
  platformNote?: string;
}

// ---------------------------------------------------------------------------
// Avaliação inicial
// ---------------------------------------------------------------------------

export interface AssessmentQuestion {
  id: string;
  category: CategoryId;
  difficulty: Difficulty;
  /** Etapa de escolha única (quiz) baseada em situação prática. */
  step: QuizStep;
}
