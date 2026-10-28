import { useEffect, useMemo, useState } from 'react';
import type { CategoryId } from '../../content/types';
import { CODEX } from '../../content/codex';
import { CATEGORIES, getCategory } from '../../content/categories';
import { isConceptId } from '../../content/concepts';
import { MISSIONS } from '../../content/missions';
import { conceptMastery, MASTERY_LABEL, type MasteryState } from '../../domain/mastery';
import { href } from '../../app/router';
import { useGame, useStore } from '../../state/GameContext';
import { Icon } from '../components/Icon';
import { CategoryChip, EmptyState } from '../components/common';
import { RichText } from '../components/RichText';
import { useDerived } from '../lib/derived';
import './screens.css';

const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

const MASTERY_HELP: Record<MasteryState, string> = {
  'nao-estudado': 'Você ainda não respondeu nenhuma etapa sobre este conceito.',
  aprendendo: 'Você já praticou, mas os acertos ainda não são consistentes.',
  praticado: 'Acertos consistentes. Uma revisão em outro dia leva ao domínio.',
  dominado: 'Acertos consistentes, de primeira, inclusive numa revisão posterior.',
};

export function Codex({ entryId }: { entryId?: string | undefined }) {
  const { state } = useGame();
  const store = useStore();
  const d = useDerived();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryId | ''>('');
  const [mastery, setMastery] = useState<MasteryState | ''>('');
  const entry = entryId ? CODEX.find((e) => e.id === entryId) : undefined;

  useEffect(() => {
    if (entryId && isConceptId(entryId) && state.profile.onboardingCompleted) store.viewCodex(entryId);
  }, [entryId, store, state.profile.onboardingCompleted]);

  const q = normalize(query.trim());
  const filtered = useMemo(
    () =>
      CODEX.filter(
        (e) =>
          (!category || e.category === category) &&
          (!mastery || conceptMastery(state, e.id, d.now).state === mastery) &&
          (!q || normalize(`${e.title} ${e.summary} ${e.shortcuts.join(' ')}`).includes(q)),
      ),
    [category, mastery, q, state, d.now],
  );

  const grouped = CATEGORIES.map((c) => ({ category: c, entries: filtered.filter((e) => e.category === c.id) })).filter((g) => g.entries.length > 0);
  const related = entry ? MISSIONS.filter((m) => m.concepts.includes(entry.id)) : [];
  const info = entry ? conceptMastery(state, entry.id, d.now) : null;

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <span className="eyebrow accent">Biblioteca de conhecimentos</span>
          <h1>Codex</h1>
          <p className="lead">Todos os conceitos do jogo, com explicação simples, exemplo, erros comuns e atalhos. Consulte quando quiser.</p>
        </div>
      </header>

      <div className={`codex-layout ${entry ? 'has-entry' : ''}`}>
        <aside className="panel tight codex-index" aria-label="Índice do Codex">
          <div className="stack" style={{ gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
            <div className="field">
              <label htmlFor="codex-busca">Buscar conceito</label>
              <input id="codex-busca" className="input" type="search" placeholder="Ex.: phishing, Ctrl+Z, DNS" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <div className="row" style={{ gap: 'var(--space-2)', flexWrap: 'nowrap' }}>
              <label className="visually-hidden" htmlFor="codex-cat">
                Categoria
              </label>
              <select id="codex-cat" className="select" value={category} onChange={(e) => setCategory(e.target.value as CategoryId | '')}>
                <option value="">Todas as áreas</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.short}
                  </option>
                ))}
              </select>
              <label className="visually-hidden" htmlFor="codex-dom">
                Domínio
              </label>
              <select id="codex-dom" className="select" value={mastery} onChange={(e) => setMastery(e.target.value as MasteryState | '')}>
                <option value="">Qualquer domínio</option>
                {(Object.keys(MASTERY_LABEL) as MasteryState[]).map((m) => (
                  <option key={m} value={m}>
                    {MASTERY_LABEL[m]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="visually-hidden" aria-live="polite">
            {filtered.length} conceitos encontrados.
          </p>
          {grouped.length === 0 ? (
            <p className="muted">Nenhum conceito encontrado.</p>
          ) : (
            grouped.map((g) => (
              <div key={g.category.id} style={{ marginBottom: 'var(--space-3)' }}>
                <div className="eyebrow" style={{ padding: '4px 10px' }}>
                  {g.category.short}
                </div>
                <ul className="codex-items">
                  {g.entries.map((e) => {
                    const m = conceptMastery(state, e.id, d.now);
                    return (
                      <li key={e.id}>
                        <a href={href(`/codex/${e.id}`)} aria-current={e.id === entryId ? 'page' : undefined}>
                          <span>{e.title}</span>
                          <span className={`mastery-dot ${m.state}`}>
                            <span className="visually-hidden">{MASTERY_LABEL[m.state]}</span>
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </aside>

        {entry && info ? (
          <article className="panel codex-entry stack" aria-labelledby="codex-title">
            <a href={href('/codex')} className="btn ghost small codex-back" style={{ alignSelf: 'flex-start' }}>
              <Icon name="arrow-left" size={16} /> Índice
            </a>
            <div className="row">
              <CategoryChip category={entry.category} />
              <span className={`chip ${info.state === 'dominado' ? 'accent' : info.state === 'praticado' ? 'signal' : info.state === 'aprendendo' ? 'warn' : ''}`}>
                <Icon name="brain" size={14} /> {MASTERY_LABEL[info.state]}
              </span>
              {(info.struggling || info.reviewDue) && (
                <span className="chip warn">
                  <Icon name="repeat" size={14} /> {info.struggling ? 'Precisa de reforço' : 'Pronto para revisão'}
                </span>
              )}
            </div>
            <h1 id="codex-title">{entry.title}</h1>
            <p className="faint" style={{ fontSize: '0.85rem' }}>
              {MASTERY_HELP[info.state]} {info.total > 0 && `(${info.correct} acerto(s) em ${info.total} resposta(s))`}
            </p>
            <section className="codex-section">
              <h2>O que é</h2>
              <RichText text={entry.summary} />
            </section>
            <section className="codex-section">
              <h2>Exemplo prático</h2>
              <RichText text={entry.example} />
            </section>
            <section className="codex-section">
              <h2>Quando usar</h2>
              <RichText text={entry.whenToUse} />
            </section>
            <section className="codex-section">
              <h2>Erros comuns</h2>
              <ul>
                {entry.commonMistakes.map((m, i) => (
                  <li key={i}>
                    <RichText as="inline" text={m} />
                  </li>
                ))}
              </ul>
            </section>
            {entry.shortcuts.length > 0 && (
              <section className="codex-section">
                <h2>Atalhos relacionados</h2>
                <ul>
                  {entry.shortcuts.map((s, i) => (
                    <li key={i}>
                      <RichText as="inline" text={s} />
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {entry.platformNote && (
              <div className="callout info">
                <Icon name="info" />
                <div>
                  <div className="callout-title">Varia conforme o sistema</div>
                  <RichText text={entry.platformNote} />
                </div>
              </div>
            )}
            {related.length > 0 && (
              <section className="codex-section">
                <h2>Missões relacionadas</h2>
                <div className="row">
                  {related.map((m) => (
                    <a key={m.id} className="chip sector" href={href(`/missao/${m.id}`)} style={{ '--sector-color': `var(--sector-${m.sector})`, textDecoration: 'none' } as React.CSSProperties}>
                      {m.title}
                    </a>
                  ))}
                </div>
              </section>
            )}
            {state.profile.onboardingCompleted && (
              <a className="btn" href={href('/treino/inteligente')} style={{ alignSelf: 'flex-start' }}>
                <Icon name="dumbbell" /> Praticar na revisão inteligente
              </a>
            )}
          </article>
        ) : entryId ? (
          <EmptyState icon="book" title="Conceito não encontrado">
            <a href={href('/codex')}>Voltar ao índice</a>
          </EmptyState>
        ) : (
          <section className="panel stack">
            <h2 style={{ fontSize: '1.2rem' }}>Como usar o Codex</h2>
            <p className="muted">
              Escolha um conceito no índice. Cada entrada mostra seu estado de domínio, calculado pelas suas respostas reais: não estudado, em aprendizado,
              praticado ou dominado.
            </p>
            <div className="row">
              {(Object.keys(MASTERY_LABEL) as MasteryState[]).map((m) => (
                <span key={m} className={`mastery-dot ${m}`} style={{ fontSize: '0.8rem' }}>
                  {MASTERY_LABEL[m]}: {CODEX.filter((e) => conceptMastery(state, e.id, d.now).state === m).length}
                </span>
              ))}
            </div>
            <p className="faint" style={{ fontSize: '0.85rem' }}>
              {CODEX.length} conceitos em {new Set(CODEX.map((e) => e.category)).size} áreas. Comece por{' '}
              <a href={href(`/codex/${CODEX[0]!.id}`)}>{CODEX[0]!.title}</a> ou use a busca. Área de exemplo: {getCategory('seguranca').name}.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
