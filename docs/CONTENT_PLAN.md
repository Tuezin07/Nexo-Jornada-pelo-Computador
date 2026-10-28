# Plano de conteúdo — Nexo

Mapa das missões da primeira versão. Os IDs são permanentes: o progresso salvo
referencia esses IDs. Tipos e regras de cada etapa estão em `src/content/types.ts`.

Formatos de etapa: `quiz`, `order`, `classify`, `shortcut`, `typing`, `filesystem`,
`terminal`, `settings`, `diagnosis`, `inspect`.

Regras gerais

- Português brasileiro natural, com acentuação correta. Termos técnicos explicados.
- Cada missão tem 3 a 5 etapas, com pelo menos 2 formatos diferentes quando fizer sentido.
- Cada alternativa errada tem `feedback` que ensina, não só "Errado".
- Nada de alternativas absurdas ou perigosas apresentadas como corretas.
- Procedimentos que mudam entre Windows/macOS/versões trazem `platformNote`.
- Pré-requisitos só podem apontar para missões do MESMO setor.
- Cada setor tem pelo menos uma missão sem pré-requisitos (porta de entrada).
- Nunca instruir a desativar proteções reais, executar arquivos suspeitos ou acessar sistemas de terceiros.

## Setor 1 — Fundamentos (`fundamentos.ts`)

| ID | Título | Categoria | Dif. | Pré-req. | Conceitos | Formatos sugeridos |
|---|---|---|---|---|---|---|
| f01-primeiro-contato | Primeiro contato | hardware | 1 | — | hardware-componentes, perifericos-entrada-saida | quiz, classify |
| f02-teclas-essenciais | Teclas essenciais | teclado | 1 | — | teclas-essenciais | quiz, shortcut (real: Esc, Tab, Shift+letra…) |
| f03-dedos-no-lugar | Dedos no lugar | teclado | 1 | f02 | digitacao-postura, digitacao-fileira-base | quiz, typing ×2 |
| f04-mouse-e-janelas | Mouse e janelas | sistema | 1 | f01 | mouse-acoes, janelas-controles | quiz, order, classify |
| f05-copiar-colar-desfazer | Copiar, colar, desfazer | teclado | 1 | f02 | area-transferencia, atalho-desfazer | shortcut (real) ×3, quiz |
| f06-arquivos-e-pastas | Arquivos e pastas | arquivos | 1 | f04 | arquivos-pastas, caminho-arquivo | quiz, filesystem (achar e abrir; criar pasta) |
| f07-extensoes | Extensões e formatos | arquivos | 2 | f06 | extensoes-arquivo | classify, quiz, filesystem (mostrar extensões) |
| f08-arrumando-a-casa | Arrumando a casa | arquivos | 2 | f06 | organizacao-pastas, lixeira | filesystem (organizar, lixeira, restaurar), quiz |

## Setor 2 — Domínio do sistema (`sistema.ts`)

| ID | Título | Categoria | Dif. | Pré-req. | Conceitos | Formatos sugeridos |
|---|---|---|---|---|---|---|
| s01-sistema-operacional | O sistema operacional | sistema | 1 | — | sistema-operacional | quiz, classify |
| s02-painel-de-configuracoes | Painel de configurações | configuracoes | 1 | — | configuracoes-tela, acessibilidade-sistema | settings ×2, quiz |
| s03-som-wifi-notificacoes | Som, Wi-Fi e notificações | configuracoes | 2 | s02 | configuracoes-som, notificacoes | settings, quiz |
| s04-instalar-e-remover | Instalar e remover programas | programas | 2 | s01 | instalacao-programas, desinstalacao | order, classify, settings (lista de apps) |
| s05-atalhos-do-sistema | Atalhos do sistema | teclado | 2 | s01 | atalhos-janelas, bloquear-tela, captura-tela | shortcut (virtual) ×3, quiz |
| s06-janelas-e-tarefas | Janelas e tarefas | sistema | 2 | s05 | gerenciador-tarefas, multitarefa-janelas | quiz, order, shortcut (virtual) |
| s07-contas-e-permissoes | Contas e permissões | sistema | 3 | s04 | contas-permissoes | quiz, classify, diagnosis curta |

## Setor 3 — Internet e segurança (`rede-segura.ts`)

| ID | Título | Categoria | Dif. | Pré-req. | Conceitos | Formatos sugeridos |
|---|---|---|---|---|---|---|
| r01-navegador-e-enderecos | Navegador e endereços | internet | 1 | — | navegador-basico, url-anatomia | quiz, classify, inspect (site) |
| r02-abas-e-atalhos | Abas e atalhos do navegador | navegadores | 2 | r01 | abas-navegador, atalhos-navegador | shortcut (virtual: Ctrl+T, Ctrl+W, Ctrl+Shift+T; real: Ctrl+F, Ctrl+L), quiz |
| r03-pesquisa-eficiente | Pesquisa eficiente | internet | 2 | r01 | pesquisa-eficiente, avaliar-fontes | quiz, classify |
| r04-downloads-sem-susto | Downloads sem susto | navegadores | 2 | r01 | downloads, fontes-confiaveis | quiz, classify, filesystem (achar download) |
| r05-senhas-fortes | Senhas fortes | seguranca | 1 | — | senhas-fortes, gerenciador-senhas | classify, quiz |
| r06-dupla-verificacao | Dupla verificação | seguranca | 2 | r05 | autenticacao-multifator | order, quiz, inspect (sms) |
| r07-caca-ao-phishing | Caça ao phishing | seguranca | 2 | r05 | phishing | inspect (email), inspect (sms), quiz |
| r08-privacidade-e-permissoes | Privacidade e permissões | seguranca | 3 | r07 | permissoes-apps, wifi-publico, dados-pessoais | settings (permissões), quiz, classify |
| r09-extensoes-e-atualizacoes | Extensões e atualizações | navegadores | 3 | r04 | extensoes-navegador, atualizacoes | inspect (site de extensão), quiz, classify |

## Setor 4 — Diagnóstico (`diagnostico.ts`)

| ID | Título | Categoria | Dif. | Pré-req. | Conceitos | Formatos sugeridos |
|---|---|---|---|---|---|---|
| d01-sem-internet | Sem internet | diagnostico | 2 | — | diagnostico-metodo, wifi-ethernet | diagnosis, quiz |
| d02-disco-cheio | Disco cheio | diagnostico | 2 | — | armazenamento-espaco | diagnosis, filesystem (liberar espaço, esvaziar lixeira) |
| d03-programa-travado | Programa travado | diagnostico | 2 | — | gerenciador-tarefas, diagnostico-metodo | diagnosis, order |
| d04-arquivo-nao-abre | O arquivo que não abre | diagnostico | 2 | d03 | abrir-com, extensoes-arquivo | diagnosis, quiz |
| d05-cade-o-som | Cadê o som? | diagnostico | 2 | d01 | configuracoes-som, drivers | diagnosis, settings |
| d06-computador-lento | Computador lento | hardware | 3 | d03 | cpu-ram-armazenamento, hdd-ssd, programas-inicializacao | classify, diagnosis, quiz |
| d07-redes-por-dentro | Redes por dentro | redes | 3 | d01 | ip-dns, roteador-modem | quiz, terminal (ping, ipconfig, nslookup) |

## Setor 5 — Eficiência (`eficiencia.ts`)

| ID | Título | Categoria | Dif. | Pré-req. | Conceitos | Formatos sugeridos |
|---|---|---|---|---|---|---|
| e01-edicao-relampago | Edição relâmpago | produtividade | 2 | — | atalhos-texto, historico-transferencia | shortcut (real: Ctrl+A, Ctrl+S, Ctrl+F, Ctrl+Shift+seta), shortcut (virtual: Win+V), quiz |
| e02-digitacao-precisa | Digitação veloz e precisa | teclado | 3 | — | digitacao-precisao | typing ×2 (com targetWpm), quiz |
| e03-documentos-e-escritorio | Documentos e escritório | produtividade | 2 | — | ferramentas-escritorio, salvar-como | classify, quiz, order |
| e04-compactar-e-enviar | Compactar e enviar | produtividade | 2 | e03 | arquivos-compactados | quiz, filesystem (compactar e extrair) |
| e05-primeiros-comandos | Primeiros comandos | comandos | 3 | — | terminal-basico, navegacao-terminal | quiz, terminal ×2 |
| e06-automacao-com-comandos | Automação com comandos | comandos | 4 | e05 | terminal-arquivos, automacao-basica | terminal ×2 (curingas), quiz |
| e07-backup-e-nuvem | Backup e nuvem | produtividade | 3 | e03 | backup, nuvem-sincronizacao | order, quiz, classify |

Total: 38 missões.

## Codex (`codex.ts`)

Uma entrada `CodexEntry` para cada ID em `src/content/concepts.ts`.

## Avaliação inicial (`assessment.ts`)

Banco de 18 perguntas práticas (`AssessmentQuestion`), escolha única, cobrindo todas as
13 categorias, com dificuldades 1 a 3. O jogo sorteia 6 de forma determinística,
priorizando as áreas que o jogador marcou como difíceis.
