# Como adicionar missões

Missões são dados. Para criar uma nova, não é preciso tocar em componentes nem em
regras de jogo.

## 1. Escolha o lugar

Cada setor tem um arquivo em `src/content/missions/` (`fundamentos.ts`, `sistema.ts`,
`rede-segura.ts`, `diagnostico.ts`, `eficiencia.ts`). Acrescente a missão ao array.

## 2. Preencha a definição

```ts
{
  id: 'f09-meu-novo-tema',      // permanente: o progresso salvo usa este id
  version: 1,                   // aumente quando mudar o conteúdo de forma relevante
  sector: 'fundamentos',
  order: 9,
  title: 'Título curto',
  summary: 'Uma frase sobre o que se aprende.',
  briefing: 'Introdução com tom de jogo (2–3 frases).',
  category: 'arquivos',
  subcategory: 'Atalhos do Explorador',
  difficulty: 2,                // 1 Básico · 2 Intermediário · 3 Avançado · 4 Especialista
  estimatedMinutes: 4,
  prerequisites: ['f06-arquivos-e-pastas'], // só missões do MESMO setor
  objectives: ['O que a pessoa saberá fazer'],
  concepts: ['arquivos-pastas'],            // ids de src/content/concepts.ts
  steps: [ /* 2 a 5 etapas */ ],
  debrief: 'Explicação final que consolida o aprendizado.',
}
```

O XP é calculado automaticamente a partir da dificuldade e do número de etapas
(`src/domain/xp.ts`). Não há campo de XP na missão de propósito.

## 3. Escolha os formatos das etapas

Todos estão documentados em `src/content/types.ts`:

| `kind` | Para quê |
|---|---|
| `quiz` | Situação prática com alternativas (única ou múltipla). Toda alternativa tem `feedback`. |
| `order` | Colocar passos na ordem certa (`items` já na ordem correta; a interface embaralha). |
| `classify` | Distribuir itens em grupos. |
| `shortcut` | Atalho de teclado; `capture: 'real'` só para combinações que o navegador entrega à página. |
| `typing` | Digitação no modo "para no erro". |
| `filesystem` | Explorador de arquivos simulado com objetivos verificáveis. |
| `terminal` | NexoShell simulado (comandos seguros, rede simulada). |
| `settings` | Painel de configurações simulado (toggle, select, slider, app). |
| `diagnosis` | Investigação em fases com ações boas, ruins e arriscadas. |
| `inspect` | Marcar sinais suspeitos (e-mail, SMS, site, download) e dar um veredito. |

Toda etapa tem `hint` (pista sem entregar a resposta), `explanation` (o porquê) e
`concept` (que precisa estar em `mission.concepts`).

## 4. Conceito novo?

Adicione o id e o título em `src/content/concepts.ts` e a entrada completa em
`src/content/codex.ts`. O TypeScript e os testes apontam o que faltar.

## 5. Valide

```bash
npm test
```

`tests/content.test.ts` usa `src/content/validate.ts` para recusar ids repetidos,
pré-requisitos inexistentes ou de outro setor, ciclos, alternativas sem feedback,
escolha única sem exatamente uma correta, diagnósticos sem saída, objetivos apontando
para controles inexistentes e mais.

## Novo formato de desafio

1. Tipo da etapa em `src/content/types.ts` (inclua na união `ChallengeStep`).
2. Resposta em `StepAnswer` e avaliador puro em `src/domain/evaluators.ts`
   (registre em `EVALUATORS`).
3. Componente em `src/ui/challenges/` seguindo `ChallengeProps` e registro em
   `src/ui/challenges/registry.tsx`.
4. Texto de solução em `src/ui/challenges/solution.ts`.

Os tipos mapeados (`{ [K in StepKind]: ... }`) fazem o compilador apontar cada lugar
que ainda falta cobrir.
