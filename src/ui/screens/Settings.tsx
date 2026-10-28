import { useRef, useState } from 'react';
import type { GameState, Preferences } from '../../domain/state';
import { backupFileName, MAX_BACKUP_BYTES, type BackupPreview } from '../../persistence/backup';
import { currentSyncStatus } from '../../services/sync';
import { audio } from '../../services/audio';
import { detectPlatform } from '../../services/platform';
import { navigate } from '../../app/router';
import { useGame, useStore } from '../../state/GameContext';
import { Icon } from '../components/Icon';
import { Dialog } from '../components/common';
import { formatDateTime } from '../lib/format';
import './screens.css';

const STORAGE_LABEL = {
  indexeddb: 'IndexedDB (banco de dados do navegador)',
  localstorage: 'localStorage (armazenamento simples do navegador)',
  memory: 'Somente memória: nada é gravado',
} as const;

function Segmented<T extends string | number>({
  name,
  value,
  options,
  onChange,
  label,
}: {
  name: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div className="segmented" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <label key={String(o.value)}>
          <input type="radio" name={name} checked={value === o.value} onChange={() => onChange(o.value)} />
          {o.label}
        </label>
      ))}
    </div>
  );
}

function Toggle({ id, checked, onChange, label }: { id: string; checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="switch" htmlFor={id}>
      <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} aria-label={label} />
      <span className="track" aria-hidden="true" />
      <span className="state">{checked ? 'Ligado' : 'Desligado'}</span>
    </label>
  );
}

export function Settings() {
  const snapshot = useGame();
  const { state, storage, persistent, save } = snapshot;
  const store = useStore();
  const p = state.preferences;
  const fileRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState<{ state: GameState; preview: BackupPreview; adjustments: string[] } | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteText, setDeleteText] = useState('');
  const sync = currentSyncStatus();

  const setPref = (patch: Partial<Preferences>) => void store.setPreferences(patch);

  const exportData = () => {
    const blob = new Blob([store.exportBackup()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = backupFileName(store.now());
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage('Backup gerado. Guarde o arquivo em um lugar seguro.');
  };

  const onFile = async (file: File | undefined) => {
    setImportError(null);
    if (!file) return;
    if (file.size > MAX_BACKUP_BYTES) {
      setImportError('Arquivo grande demais para um backup do Nexo (limite de 2 MB).');
      return;
    }
    const text = await file.text();
    const result = store.previewImport(text);
    if (!result.ok) setImportError(result.error);
    else setImporting({ state: result.state, preview: result.preview, adjustments: result.adjustments });
    if (fileRef.current) fileRef.current.value = '';
  };

  const confirmImport = async () => {
    if (!importing) return;
    const ok = await store.applyImport(importing.state);
    setImporting(null);
    setMessage(ok ? 'Backup importado e salvo. O progresso anterior ficou guardado como cópia de segurança no navegador.' : 'Backup carregado, mas não foi possível salvar neste navegador.');
  };

  const doDelete = async () => {
    const ok = await store.resetProgress();
    setConfirmDelete(false);
    setDeleteText('');
    if (ok) navigate('/');
    else setMessage('Não foi possível apagar os dados. Tente novamente.');
  };

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <span className="eyebrow accent">Painel de controle</span>
          <h1>Configurações</h1>
          <p className="lead">As mudanças valem na hora e ficam salvas neste navegador.</p>
        </div>
      </header>

      {message && (
        <div className="callout ok" role="status" style={{ marginBottom: 'var(--space-4)' }}>
          <Icon name="check" />
          <div style={{ flex: 1 }}>{message}</div>
          <button type="button" className="btn ghost small icon-only" onClick={() => setMessage(null)} aria-label="Fechar">
            <Icon name="x" size={16} />
          </button>
        </div>
      )}

      <div className="grid-2">
        <div className="stack" style={{ gap: 'var(--space-5)' }}>
          <section className="panel settings-section" aria-labelledby="s-audio">
            <h2 id="s-audio" style={{ fontSize: '1.1rem' }}>
              <Icon name="volume" /> Áudio
            </h2>
            <div className="setting-row">
              <div className="text">
                <strong>Efeitos sonoros</strong>
                <span>Sons curtos para acertos, erros e conquistas. Tudo também aparece na tela.</span>
              </div>
              <div className="control">
                <Toggle id="sound" checked={p.soundEnabled} onChange={(v) => setPref({ soundEnabled: v })} label="Efeitos sonoros" />
              </div>
            </div>
            <div className="setting-row">
              <div className="text">
                <label htmlFor="volume">
                  <strong>Volume</strong>
                </label>
                <span>{Math.round(p.volume * 100)}%</span>
              </div>
              <div className="control row" style={{ flexWrap: 'nowrap' }}>
                <input
                  id="volume"
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={p.volume}
                  disabled={!p.soundEnabled}
                  onChange={(e) => setPref({ volume: Number(e.target.value) })}
                  aria-valuetext={`${Math.round(p.volume * 100)}%`}
                />
                <button type="button" className="btn small" onClick={() => audio.play('correct')} disabled={!p.soundEnabled}>
                  Testar
                </button>
              </div>
            </div>
          </section>

          <section className="panel settings-section" aria-labelledby="s-a11y">
            <h2 id="s-a11y" style={{ fontSize: '1.1rem' }}>
              <Icon name="eye" /> Visual e acessibilidade
            </h2>
            <div className="setting-row">
              <div className="text">
                <strong>Tema</strong>
                <span>Alto contraste usa preto puro, bordas brancas e cores mais fortes.</span>
              </div>
              <div className="control">
                <Segmented
                  name="theme"
                  label="Tema"
                  value={p.theme}
                  onChange={(v) => setPref({ theme: v })}
                  options={[
                    { value: 'escuro', label: 'Escuro' },
                    { value: 'claro', label: 'Claro' },
                    { value: 'contraste', label: 'Alto contraste' },
                  ]}
                />
              </div>
            </div>
            <div className="setting-row">
              <div className="text">
                <strong>Animações</strong>
                <span>"Sistema" segue a preferência de movimento reduzido do seu dispositivo.</span>
              </div>
              <div className="control">
                <Segmented
                  name="motion"
                  label="Animações"
                  value={p.motion}
                  onChange={(v) => setPref({ motion: v })}
                  options={[
                    { value: 'sistema', label: 'Sistema' },
                    { value: 'reduzido', label: 'Reduzidas' },
                    { value: 'completo', label: 'Completas' },
                  ]}
                />
              </div>
            </div>
            <div className="setting-row">
              <div className="text">
                <strong>Tamanho do texto</strong>
                <span>Aumenta todo o texto do jogo.</span>
              </div>
              <div className="control">
                <Segmented
                  name="font"
                  label="Tamanho do texto"
                  value={p.fontScale}
                  onChange={(v) => setPref({ fontScale: v })}
                  options={[
                    { value: 1, label: '100%' },
                    { value: 1.15, label: '115%' },
                    { value: 1.3, label: '130%' },
                  ]}
                />
              </div>
            </div>
            <div className="setting-row">
              <div className="text">
                <strong>Atalhos de teclado de</strong>
                <span>Define se as missões mostram Ctrl (Windows/Linux) ou Cmd (macOS). Detectado: {detectPlatform() === 'mac' ? 'macOS' : 'Windows/Linux'}.</span>
              </div>
              <div className="control">
                <Segmented
                  name="platform"
                  label="Plataforma dos atalhos"
                  value={p.keyboardPlatform}
                  onChange={(v) => setPref({ keyboardPlatform: v })}
                  options={[
                    { value: 'auto', label: 'Automático' },
                    { value: 'windows', label: 'Windows' },
                    { value: 'mac', label: 'macOS' },
                  ]}
                />
              </div>
            </div>
            <div className="setting-row">
              <div className="text">
                <strong>Preferir teclado virtual</strong>
                <span>Para telas de toque ou quando o teclado físico não estiver disponível.</span>
              </div>
              <div className="control">
                <Toggle id="vkbd" checked={p.preferVirtualKeyboard} onChange={(v) => setPref({ preferVirtualKeyboard: v })} label="Preferir teclado virtual" />
              </div>
            </div>
          </section>

          <section className="panel settings-section" aria-labelledby="s-tut">
            <h2 id="s-tut" style={{ fontSize: '1.1rem' }}>
              <Icon name="compass" /> Tutorial
            </h2>
            <div className="setting-row">
              <div className="text">
                <strong>Refazer a configuração inicial</strong>
                <span>Escolha de novo seu nível e suas áreas e refaça a avaliação. Seu progresso é mantido.</span>
              </div>
              <div className="control">
                <button
                  type="button"
                  className="btn"
                  onClick={async () => {
                    await store.restartTutorial();
                    navigate('/inicio');
                  }}
                >
                  <Icon name="refresh" /> Refazer configuração
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="stack" style={{ gap: 'var(--space-5)' }}>
          <section className="panel settings-section" aria-labelledby="s-data">
            <h2 id="s-data" style={{ fontSize: '1.1rem' }}>
              <Icon name="archive" /> Seus dados
            </h2>
            <p className="muted" style={{ fontSize: '0.9rem' }}>
              Armazenamento: <strong>{storage ? STORAGE_LABEL[storage] : 'indisponível'}</strong>
              <br />
              {save.lastSavedAt ? `Último salvamento: ${formatDateTime(save.lastSavedAt)}` : 'Nenhum salvamento nesta sessão ainda.'}
              {save.status === 'error' && (
                <>
                  <br />
                  <span style={{ color: 'var(--danger)' }}>Falha ao salvar: {save.error}</span>
                </>
              )}
            </p>
            {!persistent && (
              <div className="callout warn">
                <Icon name="alert" />
                <span>Este navegador não está guardando o progresso. Exporte um backup antes de fechar a página.</span>
              </div>
            )}
            <div className="setting-row">
              <div className="text">
                <strong>Exportar backup</strong>
                <span>Baixa um arquivo .json com todo o seu progresso.</span>
              </div>
              <div className="control">
                <button type="button" className="btn" onClick={exportData}>
                  <Icon name="download" /> Exportar
                </button>
              </div>
            </div>
            <div className="setting-row">
              <div className="text">
                <strong>Importar backup</strong>
                <span>O arquivo é validado antes; você confirma antes de substituir o progresso atual.</span>
              </div>
              <div className="control">
                <input
                  ref={fileRef}
                  id="import-file"
                  type="file"
                  accept="application/json,.json"
                  className="visually-hidden"
                  onChange={(e) => void onFile(e.target.files?.[0])}
                />
                <button type="button" className="btn" onClick={() => fileRef.current?.click()}>
                  <Icon name="upload" /> Escolher arquivo
                </button>
              </div>
            </div>
            {importError && (
              <div className="callout error" role="alert">
                <Icon name="x" />
                <span>{importError}</span>
              </div>
            )}
            <div className="setting-row">
              <div className="text">
                <strong>Apagar progresso local</strong>
                <span>Remove XP, missões, conquistas, estatísticas e histórico deste navegador.</span>
              </div>
              <div className="control">
                <button type="button" className="btn danger" onClick={() => setConfirmDelete(true)}>
                  <Icon name="trash" /> Apagar…
                </button>
              </div>
            </div>
          </section>

          <section className="panel settings-section" aria-labelledby="s-sync">
            <h2 id="s-sync" style={{ fontSize: '1.1rem' }}>
              <Icon name="refresh" /> Sincronização entre dispositivos
            </h2>
            <div className="callout info">
              <Icon name="info" />
              <div>
                <div className="callout-title">{sync.state === 'desativada' ? 'Desativada' : 'Configurada'}</div>
                {sync.state === 'desativada' ? sync.reason : 'Sincronização disponível.'}
              </div>
            </div>
            <p className="faint" style={{ fontSize: '0.85rem' }}>
              Para levar seu progresso para outro computador, exporte um backup aqui e importe lá.
            </p>
          </section>

          <section className="panel settings-section" aria-labelledby="s-priv">
            <h2 id="s-priv" style={{ fontSize: '1.1rem' }}>
              <Icon name="lock" /> Privacidade
            </h2>
            <ul className="objectives" style={{ fontSize: '0.9rem' }}>
              <li>
                <Icon name="check" size={16} /> Sem conta, sem cadastro, sem rastreadores e sem anúncios.
              </li>
              <li>
                <Icon name="check" size={16} /> O jogo não envia seus dados para nenhum servidor: tudo fica no armazenamento deste navegador.
              </li>
              <li>
                <Icon name="check" size={16} /> O apelido é opcional e só aparece para você.
              </li>
              <li>
                <Icon name="alert" size={16} /> Limpar os dados do navegador ou usar janela anônima apaga o progresso. Faça backups.
              </li>
              <li>
                <Icon name="info" size={16} /> As simulações (arquivos, terminal, configurações) nunca mexem no seu computador de verdade.
              </li>
            </ul>
          </section>
        </div>
      </div>

      {importing && (
        <Dialog
          title="Importar este backup?"
          onClose={() => setImporting(null)}
          actions={
            <>
              <button type="button" className="btn" onClick={() => setImporting(null)}>
                Cancelar
              </button>
              <button type="button" className="btn primary" onClick={() => void confirmImport()}>
                Substituir progresso atual
              </button>
            </>
          }
        >
          <p className="muted">O progresso atual será substituído por este:</p>
          <ul className="objectives" style={{ margin: 'var(--space-3) 0' }}>
            <li>
              <Icon name="star" size={16} /> Nível {importing.preview.level} · {importing.preview.xp} XP
            </li>
            <li>
              <Icon name="check" size={16} /> {importing.preview.missionsCompleted} missões concluídas
            </li>
            <li>
              <Icon name="trophy" size={16} /> {importing.preview.achievements} conquistas
            </li>
            {importing.preview.savedAt && (
              <li>
                <Icon name="clock" size={16} /> Salvo em {formatDateTime(importing.preview.savedAt)}
              </li>
            )}
          </ul>
          {importing.adjustments.length > 0 && (
            <div className="callout warn">
              <Icon name="alert" />
              <div>
                <div className="callout-title">Ajustes feitos na validação</div>
                {importing.adjustments.map((a, i) => (
                  <div key={i}>{a}</div>
                ))}
              </div>
            </div>
          )}
        </Dialog>
      )}

      {confirmDelete && (
        <Dialog
          title="Apagar todo o progresso?"
          onClose={() => setConfirmDelete(false)}
          actions={
            <>
              <button type="button" className="btn" onClick={exportData}>
                <Icon name="download" /> Exportar antes
              </button>
              <button type="button" className="btn" onClick={() => setConfirmDelete(false)}>
                Cancelar
              </button>
              <button type="button" className="btn danger" disabled={deleteText.trim().toUpperCase() !== 'APAGAR'} onClick={() => void doDelete()}>
                <Icon name="trash" /> Apagar definitivamente
              </button>
            </>
          }
        >
          <p>Isto remove deste navegador:</p>
          <ul style={{ margin: 'var(--space-2) 0 var(--space-3)', paddingLeft: '1.2em' }} className="muted">
            <li>nível, XP e títulos;</li>
            <li>missões concluídas, tentativas e histórico;</li>
            <li>conquistas, estatísticas e domínio dos conceitos;</li>
            <li>configuração inicial e avaliação;</li>
            <li>cópias de segurança internas.</li>
          </ul>
          <p className="muted">Suas preferências visuais e de som são mantidas. Não é possível desfazer sem um backup exportado.</p>
          <div className="field" style={{ marginTop: 'var(--space-3)' }}>
            <label htmlFor="confirm-delete">Para confirmar, digite APAGAR</label>
            <input id="confirm-delete" className="input" value={deleteText} onChange={(e) => setDeleteText(e.target.value)} autoComplete="off" />
          </div>
        </Dialog>
      )}
    </div>
  );
}
