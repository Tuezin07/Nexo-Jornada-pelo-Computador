import { useState } from 'react';
import type { CategoryId } from '../../content/types';
import { CATEGORIES } from '../../content/categories';
import { dayKey } from '../../domain/state';
import { TRAINING_DAILY_CAP, TRAINING_XP_PER_ANSWER } from '../../domain/xp';
import { href } from '../../app/router';
import { useGame } from '../../state/GameContext';
import { Icon, type IconName } from '../components/Icon';
import { Meter, StatTile } from '../components/common';
import { useDerived } from '../lib/derived';
import { CATEGORY_ICON } from '../lib/format';
import './screens.css';

const MODES: { id: string; title: string; icon: IconName; description: string }[] = [
  { id: 'digitacao', title: 'Digitação livre', icon: 'keyboard', description: 'Um texto por rodada, com ppm e precisão. Ótimo para aquecer.' },
  { id: 'atalhos', title: 'Circuito de atalhos', icon: 'command', description: 'Até 6 atalhos das missões que você já liberou, em ordem aleatória.' },
  { id: 'inteligente', title: 'Revisão inteligente', icon: 'brain', description: 'Prioriza conceitos que você errou ou que estão prontos para revisão.' },
];

export function Training() {
  const { state } = useGame();
  const d = useDerived();
  const [category, setCategory] = useState<CategoryId | ''>('');
  const todayXp = state.progress.trainingXpByDay[dayKey(d.now)] ?? 0;
  const stats = state.progress.stats;

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <span className="eyebrow accent">Área de treinamento</span>
          <h1>Treino</h1>
          <p className="lead">
            Pratique fora da campanha. O treino usa as etapas das missões que você já liberou e conta para o domínio dos conceitos.
          </p>
        </div>
      </header>

      <section className="panel" style={{ marginBottom: 'var(--space-5)' }}>
        <div className="grid-2" style={{ alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.05rem' }}>Regras de recompensa</h2>
            <p className="muted" style={{ fontSize: '0.92rem' }}>
              Cada acerto de primeira rende {TRAINING_XP_PER_ANSWER} XP, até {TRAINING_DAILY_CAP} XP por dia. Depois do limite você continua treinando
              normalmente: a prática segue valendo para o domínio e para as estatísticas.
            </p>
          </div>
          <div>
            <Meter value={todayXp / TRAINING_DAILY_CAP} label="XP de treino hoje" />
            <div className="xp-caption">
              <span>Hoje: {todayXp} XP</span>
              <span>limite {TRAINING_DAILY_CAP} XP</span>
            </div>
          </div>
        </div>
      </section>

      <div className="stat-grid" style={{ marginBottom: 'var(--space-5)' }}>
        <StatTile icon="dumbbell" label="Sessões" value={stats.trainingSessions} />
        <StatTile icon="check" label="Respostas no treino" value={stats.trainingAnswers} />
        <StatTile icon="keyboard" label="Melhor ppm" value={stats.bestTypingWpm || '—'} hint={stats.bestTypingWpm ? 'com precisão ≥ 92%' : 'ainda sem registro'} />
      </div>

      <div className="quick-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        {MODES.map((m) => (
          <a key={m.id} className="quick-link" href={href(`/treino/${m.id}`)} style={{ alignItems: 'flex-start' }}>
            <span className="ql-icon">
              <Icon name={m.icon} />
            </span>
            <span>
              <strong>{m.title}</strong>
              <span className="muted">{m.description}</span>
            </span>
          </a>
        ))}
        <div className="quick-link" style={{ alignItems: 'flex-start', flexDirection: 'column' }}>
          <div className="row">
            <span className="ql-icon">
              <Icon name={category ? CATEGORY_ICON[category] : 'repeat'} />
            </span>
            <span>
              <strong>Revisão por área</strong>
              <span className="muted">Perguntas e classificações de uma categoria.</span>
            </span>
          </div>
          <div className="field" style={{ width: '100%' }}>
            <label htmlFor="treino-cat" className="visually-hidden">
              Área
            </label>
            <select id="treino-cat" className="select" value={category} onChange={(e) => setCategory(e.target.value as CategoryId | '')}>
              <option value="">Todas as áreas</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <a className="btn primary small" href={href(`/treino/revisao${category ? `?categoria=${category}` : ''}`)}>
            Começar revisão
          </a>
        </div>
      </div>
    </div>
  );
}
