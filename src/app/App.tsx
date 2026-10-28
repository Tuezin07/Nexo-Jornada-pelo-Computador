import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import { getAchievement } from '../domain/achievements';
import { audio } from '../services/audio';
import { prefersReducedMotion } from '../services/platform';
import { useGame, useStore } from '../state/GameContext';
import { Icon, type IconName } from '../ui/components/Icon';
import { Logo } from '../ui/components/common';
import { useDerived } from '../ui/lib/derived';
import { href, navigate, useRoute, type Route, type RouteName } from './router';
import './App.css';

const Home = lazy(() => import('../ui/screens/Home').then((m) => ({ default: m.Home })));
const Onboarding = lazy(() => import('../ui/screens/Onboarding').then((m) => ({ default: m.Onboarding })));
const Campaign = lazy(() => import('../ui/screens/Campaign').then((m) => ({ default: m.Campaign })));
const MissionHub = lazy(() => import('../ui/screens/MissionHub').then((m) => ({ default: m.MissionHub })));
const MissionBriefing = lazy(() => import('../ui/screens/MissionBriefing').then((m) => ({ default: m.MissionBriefing })));
const MissionPlayer = lazy(() => import('../ui/screens/MissionPlayer').then((m) => ({ default: m.MissionPlayer })));
const Training = lazy(() => import('../ui/screens/Training').then((m) => ({ default: m.Training })));
const TrainingSession = lazy(() => import('../ui/screens/TrainingSession').then((m) => ({ default: m.TrainingSession })));
const Profile = lazy(() => import('../ui/screens/Profile').then((m) => ({ default: m.Profile })));
const Stats = lazy(() => import('../ui/screens/Stats').then((m) => ({ default: m.Stats })));
const Achievements = lazy(() => import('../ui/screens/Achievements').then((m) => ({ default: m.Achievements })));
const Codex = lazy(() => import('../ui/screens/Codex').then((m) => ({ default: m.Codex })));
const Settings = lazy(() => import('../ui/screens/Settings').then((m) => ({ default: m.Settings })));

const MAIN_NAV: { path: string; label: string; icon: IconName; match: RouteName[] }[] = [
  { path: '/', label: 'Início', icon: 'home', match: ['home'] },
  { path: '/campanha', label: 'Campanha', icon: 'map', match: ['campaign'] },
  { path: '/missoes', label: 'Missões', icon: 'list', match: ['missions', 'mission', 'play'] },
  { path: '/treino', label: 'Treino', icon: 'dumbbell', match: ['training', 'trainingSession'] },
  { path: '/codex', label: 'Codex', icon: 'book', match: ['codex', 'codexEntry'] },
];

/** Rotas acessíveis antes da configuração inicial. */
const OPEN_ROUTES: RouteName[] = ['home', 'onboarding', 'settings', 'codex', 'codexEntry'];

function renderRoute(route: Route): ReactNode {
  switch (route.name) {
    case 'home':
      return <Home />;
    case 'onboarding':
      return <Onboarding />;
    case 'campaign':
      return <Campaign sector={route.params.sector} />;
    case 'missions':
      return <MissionHub />;
    case 'mission':
      return <MissionBriefing id={route.params.id!} />;
    case 'play':
      return <MissionPlayer key={route.params.id} id={route.params.id!} />;
    case 'training':
      return <Training />;
    case 'trainingSession':
      return <TrainingSession key={`${route.params.mode}-${route.query.toString()}`} mode={route.params.mode!} query={route.query} />;
    case 'profile':
      return <Profile />;
    case 'stats':
      return <Stats />;
    case 'achievements':
      return <Achievements />;
    case 'codex':
      return <Codex />;
    case 'codexEntry':
      return <Codex entryId={route.params.id} />;
    case 'settings':
      return <Settings />;
    case 'notFound':
      return (
        <div className="page">
          <div className="empty">
            <Icon name="compass" size={28} />
            <strong>Caminho não encontrado</strong>
            <p>O endereço “{route.path}” não existe neste sistema.</p>
            <a className="btn primary" href={href('/')}>
              Voltar ao início
            </a>
          </div>
        </div>
      );
  }
}

/** Aplica tema, movimento, escala de texto e áudio a partir das preferências. */
function usePreferenceEffects() {
  const { state } = useGame();
  const p = state.preferences;
  const [systemReduce, setSystemReduce] = useState(prefersReducedMotion());

  useEffect(() => {
    if (typeof matchMedia === 'undefined') return;
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setSystemReduce(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (p.theme === 'escuro') delete root.dataset.theme;
    else root.dataset.theme = p.theme;
    const reduce = p.motion === 'reduzido' || (p.motion === 'sistema' && systemReduce);
    root.dataset.motion = reduce ? 'reduced' : 'full';
    root.style.setProperty('--font-scale', String(p.fontScale));
    audio.configure(p.soundEnabled, p.volume);
  }, [p.theme, p.motion, p.fontScale, p.soundEnabled, p.volume, systemReduce]);
}

function SaveIndicator() {
  const { save, persistent, readOnly } = useGame();
  const store = useStore();
  if (!persistent || readOnly) {
    return (
      <a className="save-indicator warn" href={href('/config')} title="O progresso não está sendo gravado neste navegador">
        <Icon name="alert" size={16} /> <span className="label">Sem salvamento</span>
      </a>
    );
  }
  if (save.status === 'error') {
    return (
      <button type="button" className="save-indicator error" onClick={() => void store.retrySave()} title={save.error ?? undefined}>
        <Icon name="alert" size={16} /> <span className="label">Falha ao salvar · tentar de novo</span>
      </button>
    );
  }
  const saving = save.status === 'saving';
  return (
    <span className={`save-indicator ${saving ? 'saving' : ''}`} role="status" aria-live="polite">
      <Icon name={saving ? 'refresh' : 'check'} size={16} />
      <span className="label">{saving ? 'Salvando…' : 'Salvo'}</span>
    </span>
  );
}

function TopBar({ route }: { route: Route }) {
  const { level, title } = useDerived();
  const { state } = useGame();
  const onboarded = state.profile.onboardingCompleted;
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <a href={href('/')} className="brand" aria-label="Nexo — início">
          <Logo />
        </a>
        {onboarded && (
          <nav className="main-nav" aria-label="Navegação principal">
            {MAIN_NAV.map((item) => (
              <a key={item.path} href={href(item.path)} className="nav-link" aria-current={item.match.includes(route.name) ? 'page' : undefined}>
                <Icon name={item.icon} size={18} />
                {item.label}
              </a>
            ))}
          </nav>
        )}
        <div className="topbar-tools">
          <SaveIndicator />
          {onboarded && (
            <>
              <a href={href('/conquistas')} className="btn ghost icon-only small hide-sm" aria-label="Conquistas" aria-current={route.name === 'achievements' ? 'page' : undefined}>
                <Icon name="trophy" size={18} />
              </a>
              <a href={href('/estatisticas')} className="btn ghost icon-only small hide-sm" aria-label="Estatísticas" aria-current={route.name === 'stats' ? 'page' : undefined}>
                <Icon name="chart" size={18} />
              </a>
            </>
          )}
          <a href={href('/config')} className="btn ghost icon-only small" aria-label="Configurações" aria-current={route.name === 'settings' ? 'page' : undefined}>
            <Icon name="gear" size={18} />
          </a>
          {onboarded && (
            <a href={href('/perfil')} className="player-chip" aria-label={`Perfil: nível ${level.level}, ${title}`} aria-current={route.name === 'profile' ? 'page' : undefined}>
              <span className="player-level">{level.level}</span>
              <span className="player-meta">
                <span className="player-name">{state.profile.nickname}</span>
                <span className="player-xp">
                  <span style={{ width: `${level.progress * 100}%` }} />
                </span>
              </span>
            </a>
          )}
        </div>
      </div>
    </header>
  );
}

function BottomNav({ route }: { route: Route }) {
  return (
    <nav className="bottom-nav" aria-label="Navegação principal (celular)">
      {MAIN_NAV.map((item) => (
        <a key={item.path} href={href(item.path)} aria-current={item.match.includes(route.name) ? 'page' : undefined}>
          <Icon name={item.icon} size={20} />
          <span>{item.label}</span>
        </a>
      ))}
    </nav>
  );
}

function Notices() {
  const { notices } = useGame();
  const store = useStore();
  if (notices.length === 0) return null;
  return (
    <div className="notices" role="region" aria-label="Avisos">
      {notices.map((n) => (
        <div key={n.id} className={`callout ${n.tone === 'error' ? 'error' : n.tone === 'warning' ? 'warn' : 'info'}`} role={n.tone === 'info' ? 'status' : 'alert'}>
          <Icon name={n.tone === 'info' ? 'info' : 'alert'} />
          <div style={{ flex: 1 }}>{n.text}</div>
          <button type="button" className="btn ghost small icon-only" onClick={() => store.dismissNotice(n.id)} aria-label="Fechar aviso">
            <Icon name="x" size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}

/** Mostra conquistas recém-desbloqueadas, venham de onde vierem (missão, treino, Codex). */
function AchievementToasts() {
  const { state, ready } = useGame();
  const known = useRef<Set<string> | null>(null);
  const [toasts, setToasts] = useState<{ id: string; name: string; description: string }[]>([]);

  useEffect(() => {
    if (!ready) return;
    const current = new Set(Object.keys(state.progress.achievements));
    if (known.current === null) {
      known.current = current;
      return;
    }
    const fresh = [...current].filter((id) => !known.current!.has(id));
    known.current = current;
    if (fresh.length === 0) return;
    audio.play('achievement');
    const items = fresh.map((id) => {
      const def = getAchievement(id);
      return { id, name: def?.name ?? id, description: def?.description ?? '' };
    });
    setToasts((t) => [...t, ...items]);
    const timer = setTimeout(() => setToasts((t) => t.filter((x) => !fresh.includes(x.id))), 6000);
    return () => clearTimeout(timer);
  }, [state.progress.achievements, ready]);

  return (
    <div className="toasts" aria-live="polite">
      {toasts.map((t) => (
        <a key={t.id} className="toast" href={href('/conquistas')}>
          <span className="toast-icon">
            <Icon name="trophy" size={20} />
          </span>
          <span>
            <span className="eyebrow accent">Conquista desbloqueada</span>
            <strong>{t.name}</strong>
            <span className="muted">{t.description}</span>
          </span>
        </a>
      ))}
    </div>
  );
}

function BootScreen() {
  return (
    <div className="boot" role="status">
      <Logo size="lg" />
      <p className="muted mono">Carregando seu progresso…</p>
    </div>
  );
}

export function App() {
  const { ready, state } = useGame();
  const route = useRoute();
  const mainRef = useRef<HTMLElement>(null);
  usePreferenceEffects();

  const needsOnboarding = ready && !state.profile.onboardingCompleted && !OPEN_ROUTES.includes(route.name);

  useEffect(() => {
    if (needsOnboarding) navigate('/inicio', { replace: true });
  }, [needsOnboarding]);

  // Ao trocar de tela: volta ao topo e leva o foco ao conteúdo (leitores de tela).
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0 });
    mainRef.current?.focus({ preventScroll: true });
  }, [route.path]);

  if (!ready) return <BootScreen />;
  const immersive = route.name === 'onboarding' || route.name === 'play';

  return (
    <div className={`app ${immersive ? 'immersive' : ''}`}>
      <button type="button" className="skip-link" onClick={() => mainRef.current?.focus()}>
        Pular para o conteúdo
      </button>
      {!immersive && <TopBar route={route} />}
      <Notices />
      <main id="conteudo" ref={mainRef} tabIndex={-1}>
        <Suspense fallback={<div className="screen-loading" role="status" aria-label="Carregando tela" />}>
          {needsOnboarding ? null : renderRoute(route)}
        </Suspense>
      </main>
      {!immersive && state.profile.onboardingCompleted && <BottomNav route={route} />}
      <AchievementToasts />
    </div>
  );
}
