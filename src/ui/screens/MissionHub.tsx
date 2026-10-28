import { useMemo, useState } from 'react';
import type { CategoryId, Difficulty, SectorId } from '../../content/types';
import { CATEGORIES } from '../../content/categories';
import { missionStatus, type MissionStatus } from '../../domain/unlock';
import { useGame, useStore } from '../../state/GameContext';
import { Icon } from '../components/Icon';
import { EmptyState } from '../components/common';
import { MissionRow } from '../components/MissionRow';
import { useDerived } from '../lib/derived';
import { DIFFICULTY_LABEL } from '../lib/format';
import './screens.css';

type Tab = 'recomendadas' | 'disponiveis' | 'concluidas' | 'bloqueadas' | 'todas';

const TABS: { id: Tab; label: string }[] = [
  { id: 'recomendadas', label: 'Recomendadas' },
  { id: 'disponiveis', label: 'Disponíveis' },
  { id: 'concluidas', label: 'Concluídas' },
  { id: 'bloqueadas', label: 'Bloqueadas' },
  { id: 'todas', label: 'Todas' },
];

const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

export function MissionHub() {
  const { state } = useGame();
  const store = useStore();
  const d = useDerived();
  const [tab, setTab] = useState<Tab>('recomendadas');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryId | ''>('');
  const [difficulty, setDifficulty] = useState<Difficulty | 0>(0);
  const [sector, setSector] = useState<SectorId | ''>('');

  const entries = useMemo(
    () => store.catalog.missions.map((m) => ({ mission: m, status: missionStatus(m, state, store.catalog, d.sectors) as MissionStatus })),
    [state, store.catalog, d.sectors],
  );

  const recommendedIds = useMemo(() => {
    // Recomendadas: as 3 do motor + demais disponíveis ordenadas pela campanha.
    const ids = d.recommendations.map((r) => r.mission.id);
    return ids;
  }, [d.recommendations]);

  const inTab = (status: MissionStatus, id: string) => {
    switch (tab) {
      case 'recomendadas':
        return recommendedIds.includes(id);
      case 'disponiveis':
        return status === 'disponivel';
      case 'concluidas':
        return status === 'concluida';
      case 'bloqueadas':
        return status === 'bloqueada-requisito' || status === 'bloqueada-setor';
      default:
        return true;
    }
  };

  const counts: Record<Tab, number> = {
    recomendadas: recommendedIds.length,
    disponiveis: entries.filter((e) => e.status === 'disponivel').length,
    concluidas: entries.filter((e) => e.status === 'concluida').length,
    bloqueadas: entries.filter((e) => e.status.startsWith('bloqueada')).length,
    todas: entries.length,
  };

  const q = normalize(query.trim());
  let visible = entries.filter(
    (e) =>
      inTab(e.status, e.mission.id) &&
      (!category || e.mission.category === category) &&
      (!difficulty || e.mission.difficulty === difficulty) &&
      (!sector || e.mission.sector === sector) &&
      (!q || normalize(`${e.mission.title} ${e.mission.summary} ${e.mission.subcategory}`).includes(q)),
  );
  if (tab === 'recomendadas') {
    visible = recommendedIds.map((id) => visible.find((e) => e.mission.id === id)).filter((e): e is (typeof entries)[number] => Boolean(e));
  }
  const reasons = new Map(d.recommendations.map((r) => [r.mission.id, r.reasons]));

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <span className="eyebrow accent">Central de missões</span>
          <h1>Missões</h1>
          <p className="lead">
            Veja o que pode fazer agora, o que precisa aprender antes e quanto cada missão rende. Missões concluídas podem ser revisadas depois de um
            intervalo, com recompensa menor.
          </p>
        </div>
      </header>

      <div className="tabs" role="tablist" aria-label="Filtrar por situação">
        {TABS.map((t) => (
          <button key={t.id} type="button" role="tab" className="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}>
            {t.label} <span className="count">{counts[t.id]}</span>
          </button>
        ))}
      </div>

      <div className="filters">
        <div className="field">
          <label htmlFor="f-busca">Buscar</label>
          <input id="f-busca" className="input" type="search" placeholder="Título ou assunto" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="f-cat">Categoria</label>
          <select id="f-cat" className="select" value={category} onChange={(e) => setCategory(e.target.value as CategoryId | '')}>
            <option value="">Todas</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="f-dif">Dificuldade</label>
          <select id="f-dif" className="select" value={difficulty} onChange={(e) => setDifficulty(Number(e.target.value) as Difficulty | 0)}>
            <option value={0}>Todas</option>
            {([1, 2, 3, 4] as Difficulty[]).map((n) => (
              <option key={n} value={n}>
                {DIFFICULTY_LABEL[n]}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="f-setor">Setor</label>
          <select id="f-setor" className="select" value={sector} onChange={(e) => setSector(e.target.value as SectorId | '')}>
            <option value="">Todos</option>
            {store.catalog.sectors.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="visually-hidden" aria-live="polite">
        {visible.length} missões encontradas.
      </p>

      {visible.length === 0 ? (
        <EmptyState icon="search" title={tab === 'concluidas' ? 'Nenhuma missão concluída ainda' : 'Nada por aqui'}>
          {tab === 'concluidas'
            ? 'Conclua uma missão para ela aparecer nesta lista.'
            : tab === 'recomendadas'
              ? 'Sem recomendações no momento: tudo em dia. Experimente o Treino.'
              : 'Nenhuma missão corresponde aos filtros escolhidos.'}
        </EmptyState>
      ) : (
        <div className="mission-list">
          {visible.map((e) => (
            <div key={e.mission.id}>
              <MissionRow mission={e.mission} status={e.status} state={state} catalog={store.catalog} showSector />
              {tab === 'recomendadas' && reasons.get(e.mission.id) && (
                <p className="faint" style={{ fontSize: '0.82rem', margin: '4px 0 0 var(--space-4)', display: 'flex', gap: 6 }}>
                  <Icon name="info" size={14} /> {reasons.get(e.mission.id)!.join(' ')}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
