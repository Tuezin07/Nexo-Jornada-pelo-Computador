# Arquitetura do Nexo

Aplicação estática (React 19 + TypeScript estrito + Vite) pensada desde o início para o
GitHub Pages: nenhum servidor, nenhuma rota que dependa de processamento no servidor e
nenhum serviço externo obrigatório.

## Camadas

```
src/
  content/       Conteúdo educativo: dados puros e tipados (missões, Codex, avaliação)
  domain/        Regras do jogo: funções puras, sem React e sem armazenamento
    sim/         Simulações: sistema de arquivos virtual, NexoShell, teclas
  persistence/   Salvar, carregar, validar, migrar, backup (IndexedDB → localStorage → memória)
  services/      Áudio sintetizado, plataforma, interface de sincronização (não conectada)
  state/         GameStore: liga interface ↔ domínio ↔ persistência
  ui/            Telas, componentes e desafios
    challenges/  Um componente por formato de etapa + registro
    screens/     Telas (carregadas sob demanda)
  app/           Roteador por hash e casca do aplicativo
```

Regra de dependência: `content` não depende de nada; `domain` depende só de `content`;
`persistence` depende de `domain`; `state` junta `domain` e `persistence`; `ui` usa todos,
mas nunca altera progresso sem passar pelo `GameStore`.

## Fluxo de uma missão

1. `domain/engine.ts` cria uma execução (`startRun`) com um `runId` único.
2. Cada componente de desafio envia a resposta do jogador por `submit(answer)`.
   `submitAnswer` chama o avaliador do formato (`domain/evaluators.ts`) e registra
   tentativas, falhas, pista e pontuação. A interface nunca decide se está certo.
3. Ao fim, `summarizeRun` gera o resumo, que só existe se todas as etapas foram
   concluídas pelo motor (acerto ou solução revelada).
4. `GameStore.finishMission` aplica `applyMissionResult` (`domain/progress.ts`):
   XP, registros da missão, evidências de domínio, estatísticas, tentativas, histórico,
   níveis, setores e conquistas — tudo num novo estado imutável.
5. O estado inteiro é gravado numa única operação. A tela de resultado só diz
   "Progresso salvo" quando a gravação foi confirmada.

## Integridade da progressão

- **Idempotência:** cada `runId` (e cada `sessionId` de treino) é processado uma vez
  (`progress.processedRuns`). Reenviar o mesmo resultado não soma XP.
- **XP centralizado:** `domain/xp.ts` é a única fonte da fórmula (primeira conclusão,
  recorde, revisão espaçada a cada 20 h, teto diário do treino).
- **Repetição sem farm:** repetir uma missão concluída dentro do intervalo rende 0 XP;
  a prática ainda alimenta domínio e estatísticas.
- **Conquistas:** condições puras sobre o estado; registradas com data uma única vez.
- **Modo local:** quem domina o navegador pode editar os próprios dados. Não prometemos
  antifraude; a importação de backup apenas limita valores implausíveis (XP acima do
  teto compatível com o progresso, conquistas sem a condição cumprida).

## Persistido × derivado

| Persistido (`GameState`) | Derivado (nunca salvo) |
|---|---|
| perfil, preferências, avaliação | nível, patente, título padrão |
| XP total | setores abertos, missões disponíveis |
| registro por missão (tentativas, recorde, datas) | recomendações e suas razões |
| evidências por conceito | estado de domínio de cada conceito |
| conquistas (id → data) | progresso das conquistas |
| contadores agregados, tentativas (400), histórico (200) | estatísticas e tendências |

## Persistência

- `persistence/repository.ts`: interface `ProgressRepository` e implementações por
  chave-valor (IndexedDB, localStorage, memória). A escolha é automática.
- `persistence/codec.ts`: envelope `{ app: 'nexo', schemaVersion, savedAt, data }`.
- `persistence/migrations.ts`: migrações N → N+1. Ao mudar `GameState`, incremente
  `SCHEMA_VERSION` e adicione a migração; uma cópia do formato antigo é guardada.
- `persistence/sanitize.ts`: valida campo a campo e repara; nunca lança exceção por
  dado ruim. Dados ilegíveis são copiados para `save:corrompido:<data>` antes de qualquer
  recuperação. Save de versão mais nova coloca o jogo em modo somente leitura.
- `persistence/backup.ts`: exportação e importação validada (limite de 2 MB).

## Recomendações e domínio

`domain/recommend.ts` é determinístico e explicável: cada ponto somado gera uma razão
legível (área marcada no onboarding, dificuldade adequada ao desempenho, continuidade,
reforço de erros recentes, revisão espaçada). `domain/mastery.ts` define os estados
*não estudado → em aprendizado → praticado → dominado*; dominar exige acertos
consistentes, inclusive numa revisão separada por pelo menos 20 horas. Tempo nunca é
critério de domínio.

## Roteamento e GitHub Pages

Rotas por hash (`#/missoes`, `#/missao/<id>/jogar`...). Recarregar ou abrir um link
direto nunca pede um caminho profundo ao servidor. O build copia `index.html` para
`404.html`, e `redirectPathToHash` converte acessos sem `#` em rotas válidas. O caminho-
base do Vite vem da variável `BASE_PATH` (definida no workflow a partir do
`actions/configure-pages`).

## Desempenho

Telas carregadas sob demanda (`React.lazy`); o Codex fica num pedaço separado; fontes
locais (só o subconjunto latino); sons sintetizados (sem arquivos); animações curtas,
desativadas por `prefers-reduced-motion` ou pela preferência do jogador.
