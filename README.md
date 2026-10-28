# Nexo — Jornada pelo computador

Jogo de navegador para aprender informática **praticando**. Você começa dizendo seu
nível e suas dificuldades, faz uma avaliação curta e recebe missões sob medida:
atalhos de teclado de verdade, explorador de arquivos e terminal simulados, golpes
para desmascarar, problemas para diagnosticar e textos para digitar. Ganha XP, sobe de
nível, desbloqueia setores e conquistas e acompanha seu domínio de cada conceito.

Funciona inteiro no navegador, sem conta e sem servidor. O progresso fica salvo no
próprio navegador.

## Principais funcionalidades

- **Onboarding em jogo:** quatro níveis de partida (Iniciante, Casual, Veterano, Mestre),
  13 áreas de dificuldade (ou "Quero aprender tudo") e uma avaliação adaptativa de 6
  situações práticas. Tudo pode ser refeito; nada fica bloqueado pelo nível declarado.
- **Campanha em 5 setores** (Fundamentos, Domínio do sistema, Internet e segurança,
  Diagnóstico, Eficiência) com **38 missões** e desbloqueio por progresso.
- **10 formatos de desafio:** múltipla escolha, ordenação, classificação, atalhos
  (captura real ou teclado virtual), digitação, explorador de arquivos, terminal,
  painel de configurações, diagnóstico em fases e inspeção de phishing.
- **Motor de missões orientado a dados**, com avaliação feita pelas regras do jogo,
  pistas, solução após duas falhas e recompensa concedida uma única vez por execução.
- **Progressão:** XP com fórmula única e documentada, níveis com curva gradual,
  patentes, 25 conquistas, títulos cosméticos, revisão espaçada.
- **Recomendações explicáveis:** cada sugestão diz por que foi escolhida.
- **Treino** fora da campanha (digitação, circuito de atalhos, revisão por área,
  revisão inteligente) com teto diário de XP.
- **Codex** com 66 conceitos: explicação, exemplo, quando usar, erros comuns, atalhos e
  estado de domínio.
- **Estatísticas reais:** precisão por área (só com dados suficientes), tendências,
  taxa de conclusão, tempo, sequência de dias, domínio dos conceitos.
- **Configurações com efeito real:** som e volume, tema (escuro, claro, alto contraste),
  animações, tamanho do texto, plataforma dos atalhos, teclado virtual, backup,
  importação validada, exclusão com confirmação.
- **Acessível e responsivo:** navegação por teclado, foco visível, leitores de tela,
  nada comunicado só por cor, `prefers-reduced-motion`, desktop a celular.

## Tecnologias

React 19, TypeScript (estrito), Vite 7, CSS por componente com tokens de design,
IndexedDB, Vitest + Testing Library + fake-indexeddb, Playwright, ESLint, GitHub
Actions e GitHub Pages. Sons sintetizados com Web Audio (sem arquivos de áudio) e
fontes locais via Fontsource (licença OFL).

## Requisitos

- Node.js 20 ou mais novo (testado com Node 24) e npm.
- Para os testes E2E locais: Microsoft Edge instalado (padrão no Windows) ou
  `npx playwright install chromium` e `PW_CHANNEL=chromium`.

## Instalação e execução

```bash
npm install
```

```bash
npm run dev
```

Abra o endereço mostrado no terminal (por padrão http://localhost:5173).

## Testes e verificações

```bash
npm run typecheck
```

```bash
npm run lint
```

```bash
npm test
```

```bash
npm run test:e2e
```

`npm run check` roda tipos, lint, testes e build em sequência. Os testes E2E geram o
build e o servem num subcaminho (`/nexo-teste/`), simulando o GitHub Pages.

## Build de produção

```bash
npm run build
```

O resultado fica em `dist/`. Para publicar num subcaminho, defina `BASE_PATH`:

```bash
BASE_PATH=/nome-do-repositorio/ npm run build
```

Para conferir localmente: `npx vite preview`.

## Estrutura de pastas

```
src/
  content/      missões, Codex, avaliação, categorias, setores (dados tipados)
  domain/       regras: motor, avaliadores, XP, níveis, domínio, conquistas,
                recomendações, estatísticas, desbloqueios, simulações (sim/)
  persistence/  repositórios, validação, migrações, backup
  services/     áudio, plataforma, interface de sincronização
  state/        GameStore e contexto React
  ui/           telas, componentes e desafios
  app/          roteador por hash e casca do app
tests/          unitários, integração e interface (Vitest)
e2e/            fluxos ponta a ponta (Playwright)
docs/           arquitetura, como adicionar missões, sincronização, plano de conteúdo
```

Leia `docs/ARCHITECTURE.md` para as decisões de arquitetura e
`docs/ADDING_MISSIONS.md` para criar conteúdo sem duplicar lógica.

## Persistência

- Progresso, preferências, tentativas, conquistas e histórico ficam num único documento
  versionado no **IndexedDB** (com fallback para `localStorage` e, em último caso, só
  memória, com aviso na tela).
- Cada gravação substitui o documento inteiro de uma vez: XP, missões e conquistas nunca
  ficam inconsistentes entre si.
- Dados corrompidos são reparados campo a campo; uma cópia do original é guardada antes.
- Migrações de esquema versionadas; save de versão mais nova não é sobrescrito.
- Backup exportável e importação validada (limite de 2 MB, valores implausíveis
  ajustados, conquistas reavaliadas).

### Limitações do modo local

- O progresso depende **deste navegador neste dispositivo**. Limpar dados do site,
  usar janela anônima ou trocar de navegador perde o progresso — exporte backups.
- Como tudo roda no cliente, quem souber editar os dados do próprio navegador consegue
  alterar o progresso. Não há promessa de antifraude.

## Sincronização entre dispositivos

**Não implementada nesta versão** (e o jogo diz isso nas Configurações). A interface
de extensão existe em `src/services/sync.ts` e o desenho proposto com Supabase + RLS
está em `docs/SYNC.md`. Nenhuma variável de ambiente é necessária hoje.

## Publicação no GitHub Pages

O workflow `.github/workflows/deploy.yml` roda em todo push para `main`/`master`:

1. instala dependências com `npm ci`;
2. verifica tipos, lint e testes;
3. obtém o caminho-base real com `actions/configure-pages`;
4. gera o build com esse caminho;
5. roda os testes E2E contra o build;
6. publica o artefato com `actions/deploy-pages`.

Qualquer etapa que falhar interrompe a publicação. Pull requests rodam as verificações
sem publicar.

### Como ativar

1. Crie um repositório no GitHub e envie este projeto para a branch `main`.
2. No repositório: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Faça um push (ou rode o workflow manualmente em **Actions → Verificar e publicar no
   GitHub Pages → Run workflow**).
4. Acompanhe em **Actions**. Ao terminar, a URL aparece no job "Publicar" e em
   **Settings → Pages** — normalmente `https://<usuario>.github.io/<repositorio>/`.

Repositórios de usuário (`<usuario>.github.io`) também funcionam: o `configure-pages`
devolve o caminho-base `/` e o build se ajusta.

As rotas usam hash (`#/missoes`), então recarregar qualquer tela ou abrir um link direto
funciona sem configuração no servidor. Um `404.html` igual ao `index.html` cobre links
antigos sem `#`.

## Segurança e privacidade

- Sem contas, sem rastreadores, sem anúncios, sem envio de dados.
- Nenhum segredo ou chave no código.
- Conteúdo renderizado sem `innerHTML`: a marcação mínima (`**negrito**`, `` `código` ``,
  `{{Ctrl+C}}`) vira elementos React.
- Backups importados são tratados como não confiáveis (tamanho, formato, tipos, faixas).
- As simulações nunca executam nada no seu computador.
- `npm audit` pode ser usado para verificar vulnerabilidades das dependências.

## Solução de problemas

| Sintoma | O que fazer |
|---|---|
| Aviso "Sem salvamento" | O navegador bloqueia armazenamento (modo privado ou configuração). Exporte backups ou use uma janela normal. |
| "Falha ao salvar" | Espaço do navegador cheio ou bloqueado. Clique para tentar de novo; exporte um backup. |
| Página em branco no GitHub Pages | Confira se a fonte do Pages é "GitHub Actions" e se o workflow terminou sem erros. |
| Arquivos 404 no Pages | O build foi gerado sem `BASE_PATH`. Use o workflow ou defina `BASE_PATH=/repositorio/`. |
| Atalho não reage | Clique na área de prática antes. Atalhos do sistema (Alt+Tab, Win+…) usam o teclado virtual de propósito. |
| `npm run test:e2e` não acha o Edge | Instale o Chromium do Playwright e rode com `PW_CHANNEL=chromium`. |
