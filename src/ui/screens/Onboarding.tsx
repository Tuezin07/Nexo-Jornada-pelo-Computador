import { useMemo, useState } from 'react';
import type { AssessmentQuestion, CategoryId, StartingLevel } from '../../content/types';
import { ASSESSMENT_QUESTIONS } from '../../content/assessment';
import { CATEGORIES } from '../../content/categories';
import { getSector } from '../../content/sectors';
import { assessmentVerdict, isAnswerCorrect, scoreAssessment, selectAssessmentQuestions, skippedAssessment } from '../../domain/assessment';
import { recommendMissions } from '../../domain/recommend';
import { unlockedSectors } from '../../domain/unlock';
import type { SectorId } from '../../content/types';
import { href, navigate } from '../../app/router';
import { audio } from '../../services/audio';
import { useGame, useStore } from '../../state/GameContext';
import { Icon } from '../components/Icon';
import { Logo } from '../components/common';
import { RichText } from '../components/RichText';
import { CATEGORY_ICON, STARTING_LEVELS, pct, sectorStyle } from '../lib/format';
import { seededShuffle } from '../lib/shuffle';
import './Onboarding.css';

type Phase = 'intro' | 'level' | 'areas' | 'assess-intro' | 'assess' | 'result';

const PHASE_STEP: Record<Phase, number> = { intro: 0, level: 1, areas: 2, 'assess-intro': 3, assess: 3, result: 4 };
const STEP_LABELS = ['Nível', 'Áreas', 'Avaliação', 'Resultado'];
const LEVEL_COLOR: Record<StartingLevel, string> = {
  iniciante: 'var(--sector-fundamentos)',
  casual: 'var(--sector-sistema)',
  veterano: 'var(--sector-rede-segura)',
  mestre: 'var(--sector-diagnostico)',
};

function LevelGlyph({ level }: { level: StartingLevel }) {
  const count = { iniciante: 1, casual: 2, veterano: 3, mestre: 0 }[level];
  return (
    <svg viewBox="0 0 48 48" width="48" height="48" aria-hidden="true" className="level-glyph">
      <rect x="2" y="2" width="44" height="44" rx="12" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="2" />
      {level === 'mestre' ? (
        <path d="M24 10l4 9 9.5.8-7.2 6.3 2.2 9.4L24 30.6l-8.5 4.9 2.2-9.4-7.2-6.3L20 19z" fill="currentColor" />
      ) : (
        Array.from({ length: count }, (_, i) => (
          <path key={i} d={`M14 ${33 - i * 8}l10-7 10 7`} fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        ))
      )}
    </svg>
  );
}

function Stepper({ phase }: { phase: Phase }) {
  const current = PHASE_STEP[phase];
  if (current === 0) return null;
  return (
    <ol className="ob-stepper" aria-label={`Configuração: etapa ${current} de ${STEP_LABELS.length}`}>
      {STEP_LABELS.map((label, i) => {
        const n = i + 1;
        const state = n < current ? 'done' : n === current ? 'current' : 'todo';
        return (
          <li key={label} className={state} aria-current={state === 'current' ? 'step' : undefined}>
            <span className="dot">{state === 'done' ? <Icon name="check" size={14} /> : n}</span>
            <span className="label">{label}</span>
          </li>
        );
      })}
    </ol>
  );
}

function AssessmentCard({
  question,
  index,
  total,
  onAnswer,
}: {
  question: AssessmentQuestion;
  index: number;
  total: number;
  onAnswer: (optionId: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const step = question.step;
  const correct = confirmed && isAnswerCorrect(question, selected ?? undefined);
  const chosen = step.options.find((o) => o.id === selected);
  const options = useMemo(() => seededShuffle(step.options, step.id), [step]);

  return (
    <div className="ob-card enter">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <span className="eyebrow accent">
          Situação {index + 1} de {total}
        </span>
        <span className="chip">
          <Icon name={CATEGORY_ICON[question.category]} size={14} /> {CATEGORIES.find((c) => c.id === question.category)?.short}
        </span>
      </div>
      <h2>{step.title}</h2>
      {step.context && <RichText className="muted" text={step.context} />}
      <RichText text={step.prompt} />
      <fieldset className="options">
        <legend className="visually-hidden">Escolha uma alternativa</legend>
        {options.map((o, i) => {
          const isRight = confirmed && o.correct;
          const isWrong = confirmed && o.id === selected && !o.correct;
          return (
            <label key={o.id} className={`option ${isRight ? 'is-right' : ''} ${isWrong ? 'is-wrong' : ''} ${confirmed ? 'is-locked' : ''}`}>
              <input type="radio" name={`av-${question.id}`} checked={selected === o.id} onChange={() => setSelected(o.id)} disabled={confirmed} />
              <span className="letter" aria-hidden="true">
                {'ABCD'[i]}
              </span>
              <RichText as="inline" text={o.text} />
              {isRight ? (
                <span className="mark">
                  <Icon name="check" size={16} /> Correta
                </span>
              ) : isWrong ? (
                <span className="mark">
                  <Icon name="x" size={16} /> Sua resposta
                </span>
              ) : (
                <span />
              )}
            </label>
          );
        })}
      </fieldset>
      {confirmed && chosen && (
        <div className={`callout ${correct ? 'ok' : 'warn'}`} role="status">
          <Icon name={correct ? 'check' : 'info'} />
          <div>
            <div className="callout-title">{correct ? 'Certo!' : 'Não exatamente'}</div>
            <RichText text={chosen.feedback} />
            <RichText className="muted" text={step.explanation} />
          </div>
        </div>
      )}
      <div className="row">
        {!confirmed ? (
          <button
            type="button"
            className="btn primary"
            disabled={!selected}
            onClick={() => {
              setConfirmed(true);
              audio.play(isAnswerCorrect(question, selected ?? undefined) ? 'correct' : 'wrong');
            }}
          >
            Confirmar
          </button>
        ) : (
          <button type="button" className="btn primary" onClick={() => onAnswer(selected!)} autoFocus>
            {index + 1 === total ? 'Ver resultado' : 'Próxima situação'} <Icon name="arrow-right" />
          </button>
        )}
      </div>
    </div>
  );
}

export function Onboarding() {
  const { state } = useGame();
  const store = useStore();
  const profile = state.profile;
  const [phase, setPhase] = useState<Phase>(profile.startingLevel ? 'level' : 'intro');
  const [level, setLevel] = useState<StartingLevel | null>(profile.startingLevel);
  const [areas, setAreas] = useState<CategoryId[]>(profile.focusAreas);
  const [everything, setEverything] = useState(profile.wantsEverything);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [result, setResult] = useState<{ verdict: string; score: number; skipped: boolean; xp: number; saved: boolean; sectorsBefore: Set<SectorId> } | null>(
    null,
  );
  const [busy, setBusy] = useState(false);

  const questions = useMemo(
    () => (level ? selectAssessmentQuestions(ASSESSMENT_QUESTIONS, level, everything ? [] : areas) : []),
    [level, areas, everything],
  );

  const toggleArea = (id: CategoryId) => {
    audio.play('select');
    setEverything(false);
    setAreas((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));
  };

  const saveChoices = async () => {
    if (!level) return;
    setBusy(true);
    await store.completeOnboarding({ startingLevel: level, focusAreas: everything ? [] : areas, wantsEverything: everything });
    setBusy(false);
    setPhase('assess-intro');
  };

  const finishAssessment = async (finalAnswers: Record<string, string>, skipped: boolean) => {
    if (!level) return;
    setBusy(true);
    const sectorsBefore = unlockedSectors(store.state, store.catalog);
    const record = skipped ? skippedAssessment(store.now()) : scoreAssessment(questions, finalAnswers, store.now());
    const evidence = skipped ? [] : questions.map((q) => ({ concept: q.step.concept, correct: isAnswerCorrect(q, finalAnswers[q.id]) }));
    const { xp, saved } = await store.saveAssessment(record, evidence);
    setResult({ verdict: assessmentVerdict(record, level), score: record.score, skipped, xp, saved, sectorsBefore });
    setBusy(false);
    setPhase('result');
    if (!skipped) audio.play('complete');
  };

  const back = () => {
    const order: Phase[] = ['intro', 'level', 'areas', 'assess-intro'];
    const i = order.indexOf(phase);
    if (i > 0) setPhase(order[i - 1]!);
  };

  return (
    <div className="onboarding">
      <header className="ob-header">
        <a href={href('/')} aria-label="Nexo — início">
          <Logo />
        </a>
        <Stepper phase={phase} />
      </header>

      <div className="ob-body">
        {phase === 'intro' && (
          <section className="ob-card ob-intro enter" aria-labelledby="ob-title">
            <span className="eyebrow accent">Inicialização do agente</span>
            <h1 id="ob-title">Bem-vindo ao Nexo</h1>
            <p className="lead">
              Você vai explorar um sistema dividido em setores: fundamentos, domínio do sistema, internet e segurança, diagnóstico e eficiência.
              Cada missão ensina algo que você usa de verdade no computador.
            </p>
            <ul className="ob-points">
              <li>
                <Icon name="clock" /> Configuração rápida: duas perguntas e uma avaliação opcional de 6 situações.
              </li>
              <li>
                <Icon name="lock" /> Sem cadastro e sem dados pessoais. Tudo fica salvo apenas neste navegador.
              </li>
              <li>
                <Icon name="compass" /> Suas respostas só servem para escolher por onde começar. Nada fica bloqueado por causa delas.
              </li>
            </ul>
            <div className="row">
              <button type="button" className="btn primary large" onClick={() => setPhase('level')} autoFocus>
                Iniciar configuração <Icon name="arrow-right" />
              </button>
            </div>
          </section>
        )}

        {phase === 'level' && (
          <section className="ob-card enter" aria-labelledby="ob-level">
            <span className="eyebrow accent">Etapa 1 · Ponto de partida</span>
            <h1 id="ob-level">Qual nível de experiência você considera ter com computadores?</h1>
            <div className="ob-levels" role="radiogroup" aria-labelledby="ob-level">
              {STARTING_LEVELS.map((l) => (
                <label key={l.id} className="ob-level" style={{ '--level-color': LEVEL_COLOR[l.id] } as React.CSSProperties}>
                  <input
                    type="radio"
                    name="starting-level"
                    value={l.id}
                    checked={level === l.id}
                    onChange={() => {
                      audio.play('select');
                      setLevel(l.id);
                    }}
                  />
                  <LevelGlyph level={l.id} />
                  <span className="ob-level-text">
                    <strong>{l.label}</strong>
                    <span className="tagline">{l.tagline}</span>
                    <span className="desc">{l.description}</span>
                    <span className="expect">
                      <Icon name="chevron-right" size={14} /> {l.expectation}
                    </span>
                  </span>
                </label>
              ))}
            </div>
            <p className="ob-why">
              <Icon name="info" size={16} /> <strong>Por que perguntamos?</strong> Para abrir os setores certos e calibrar a dificuldade das
              primeiras missões. O jogo se ajusta ao seu desempenho real, então você pode começar onde quiser.
            </p>
            <div className="ob-nav">
              <button type="button" className="btn ghost" onClick={back}>
                <Icon name="arrow-left" /> Voltar
              </button>
              <button type="button" className="btn primary" disabled={!level} onClick={() => setPhase('areas')}>
                Continuar <Icon name="arrow-right" />
              </button>
            </div>
          </section>
        )}

        {phase === 'areas' && (
          <section className="ob-card enter" aria-labelledby="ob-areas">
            <span className="eyebrow accent">Etapa 2 · Pontos de atenção</span>
            <h1 id="ob-areas">Em quais áreas você sente mais dificuldade?</h1>
            <p className="muted">Marque quantas quiser. As missões dessas áreas aparecem primeiro nas recomendações.</p>
            <div className="ob-areas" role="group" aria-labelledby="ob-areas">
              {CATEGORIES.map((c) => {
                const on = !everything && areas.includes(c.id);
                return (
                  <button key={c.id} type="button" className="ob-area" aria-pressed={on} onClick={() => toggleArea(c.id)}>
                    <Icon name={CATEGORY_ICON[c.id]} size={20} />
                    <span>
                      <strong>{c.name}</strong>
                      <span className="desc">{c.description}</span>
                    </span>
                    <span className="tick" aria-hidden="true">
                      {on && <Icon name="check" size={16} />}
                    </span>
                  </button>
                );
              })}
              <button
                type="button"
                className="ob-area everything"
                aria-pressed={everything}
                onClick={() => {
                  audio.play('select');
                  setEverything((e) => !e);
                  setAreas([]);
                }}
              >
                <Icon name="sparkles" size={20} />
                <span>
                  <strong>Quero aprender tudo</strong>
                  <span className="desc">Sem prioridade: o jogo segue a campanha e equilibra as áreas.</span>
                </span>
                <span className="tick" aria-hidden="true">
                  {everything && <Icon name="check" size={16} />}
                </span>
              </button>
            </div>
            <p className="ob-why" aria-live="polite">
              <Icon name="info" size={16} />
              {everything ? 'Você vai passar por todas as áreas.' : areas.length === 0 ? 'Escolha pelo menos uma área ou "Quero aprender tudo".' : `${areas.length} área(s) selecionada(s).`}
            </p>
            <div className="ob-nav">
              <button type="button" className="btn ghost" onClick={back}>
                <Icon name="arrow-left" /> Voltar
              </button>
              <button type="button" className="btn primary" disabled={busy || (!everything && areas.length === 0)} onClick={() => void saveChoices()}>
                Salvar e continuar <Icon name="arrow-right" />
              </button>
            </div>
          </section>
        )}

        {phase === 'assess-intro' && (
          <section className="ob-card enter" aria-labelledby="ob-assess">
            <span className="eyebrow accent">Etapa 3 · Calibragem</span>
            <h1 id="ob-assess">Avaliação rápida</h1>
            <p className="lead">
              {questions.length} situações práticas, cerca de 3 minutos. Não é uma prova: cada resposta traz uma explicação e o resultado só ajusta
              a dificuldade e pode abrir setores mais cedo.
            </p>
            <div className="callout info">
              <Icon name="info" />
              <span>Se preferir, pule agora. As recomendações vão se ajustar conforme você joga e você pode refazer a configuração depois.</span>
            </div>
            <div className="ob-nav">
              <button type="button" className="btn ghost" onClick={back}>
                <Icon name="arrow-left" /> Voltar
              </button>
              <div className="row">
                <button type="button" className="btn" disabled={busy} onClick={() => void finishAssessment({}, true)}>
                  Pular por enquanto
                </button>
                <button
                  type="button"
                  className="btn primary"
                  onClick={() => {
                    setAnswers({});
                    setQuestionIndex(0);
                    setPhase('assess');
                  }}
                  autoFocus
                >
                  Começar avaliação <Icon name="arrow-right" />
                </button>
              </div>
            </div>
          </section>
        )}

        {phase === 'assess' && questions[questionIndex] && (
          <AssessmentCard
            key={questions[questionIndex]!.id}
            question={questions[questionIndex]!}
            index={questionIndex}
            total={questions.length}
            onAnswer={(optionId) => {
              const next = { ...answers, [questions[questionIndex]!.id]: optionId };
              setAnswers(next);
              if (questionIndex + 1 < questions.length) setQuestionIndex(questionIndex + 1);
              else void finishAssessment(next, false);
            }}
          />
        )}

        {phase === 'result' && result && (
          <ResultView result={result} />
        )}
      </div>
    </div>
  );
}

function ResultView({ result }: { result: { verdict: string; score: number; skipped: boolean; xp: number; saved: boolean; sectorsBefore: Set<SectorId> } }) {
  const { state } = useGame();
  const store = useStore();
  const now = store.now();
  const sectors = unlockedSectors(state, store.catalog);
  const recs = recommendMissions(state, store.catalog, now, 3);
  const assessment = state.profile.assessment;
  return (
    <section className="ob-card enter" aria-labelledby="ob-result">
      <span className="eyebrow accent">Etapa 4 · Pronto para começar</span>
      <h1 id="ob-result">{result.skipped ? 'Configuração concluída' : `Calibragem concluída: ${pct(result.score)}`}</h1>
      <p className="lead">{result.verdict}</p>
      {!result.skipped && assessment && (
        <div className="ob-breakdown" aria-label="Resultado por área">
          {Object.entries(assessment.perCategory).map(([cat, v]) => (
            <span key={cat} className={`chip ${v.correct === v.total ? 'accent' : 'warn'}`}>
              <Icon name={v.correct === v.total ? 'check' : 'repeat'} size={14} />
              {CATEGORIES.find((c) => c.id === cat)?.short}: {v.correct}/{v.total}
            </span>
          ))}
        </div>
      )}
      <div>
        <div className="eyebrow" style={{ marginBottom: 8 }}>
          Setores abertos para você
        </div>
        <div className="row">
          {store.catalog.sectors.map((s) => {
            const open = sectors.has(s.id);
            return (
              <span key={s.id} className={`chip ${open ? 'sector' : ''}`} style={sectorStyle(s.id)}>
                <Icon name={open ? 'unlock' : 'lock'} size={14} /> {getSector(s.id).name}
                {open && !result.sectorsBefore.has(s.id) && ' · novo'}
              </span>
            );
          })}
        </div>
      </div>
      {recs.length > 0 && (
        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>
            Primeiras missões sugeridas
          </div>
          <ol className="ob-recs">
            {recs.map((r) => (
              <li key={r.mission.id}>
                <a href={href(`/missao/${r.mission.id}`)}>{r.mission.title}</a>
                <span className="muted"> — {r.reasons[0]}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
      <p className={`save-note ${result.saved ? 'ok' : 'warn'}`} role="status">
        <Icon name={result.saved ? 'check' : 'alert'} size={16} />
        {result.saved ? `Escolhas salvas neste navegador${result.xp > 0 ? ` · +${result.xp} XP pela avaliação` : ''}.` : 'Não foi possível salvar neste navegador. Você pode jogar, mas exporte um backup nas configurações.'}
      </p>
      <div className="row">
        {recs[0] && (
          <button type="button" className="btn primary large" onClick={() => navigate(`/missao/${recs[0]!.mission.id}/jogar`)} autoFocus>
            <Icon name="play" /> Jogar a primeira missão
          </button>
        )}
        <a className="btn" href={href('/campanha')}>
          <Icon name="map" /> Ver a campanha
        </a>
        <a className="btn ghost" href={href('/')}>
          Ir para o início
        </a>
      </div>
    </section>
  );
}
