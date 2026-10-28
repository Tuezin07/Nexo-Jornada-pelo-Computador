# Sincronização entre dispositivos — proposta (NÃO implementada)

**Estado atual:** desativada. Nesta versão o progresso fica apenas no navegador. A tela
de Configurações informa isso ao jogador. Para levar o progresso a outro dispositivo,
use **Exportar backup** e **Importar backup**.

O código já tem o ponto de extensão `src/services/sync.ts`
(`RemoteProgressRepository` + `registerRemote`). Nenhuma implementação está registrada,
e a sincronização não deve ser anunciada como funcional antes de ser implementada e
testada contra um serviço real.

## Desenho sugerido com Supabase

O GitHub Pages não executa código de servidor; um serviço como o Supabase fornece
autenticação e banco com **Row Level Security** (RLS).

### Tabela

```sql
create table public.progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  schema_version int not null,
  state jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.progress enable row level security;

create policy "dono lê" on public.progress
  for select using (auth.uid() = user_id);
create policy "dono insere" on public.progress
  for insert with check (auth.uid() = user_id);
create policy "dono atualiza" on public.progress
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "dono apaga" on public.progress
  for delete using (auth.uid() = user_id);
```

### Cliente

- Variáveis públicas: `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`. A chave anônima é
  pública por definição; **a segurança vem das políticas RLS**, nunca da chave.
- Nunca colocar a chave `service_role` ou senhas administrativas no frontend.
- Todo dado vindo do servidor passa por `decodeSave` + `sanitizeState` antes de ser usado.

### Conflitos

Estratégia simples e previsível: o save com `updated_at` mais recente vence, **mas**
antes de sobrescrever o local guarde-o em `save:anterior` e mostre ao jogador qual
versão foi mantida, com opção de restaurar a outra.

### Falhas

O modo local continua sendo a fonte da verdade durante o jogo. A sincronização roda em
segundo plano; falhas de rede mudam o estado para `erro` e são tentadas de novo depois,
sem bloquear a interface.

### Limites honestos

Como o cálculo de XP roda no navegador, um cliente modificado ainda pode enviar valores
falsos para a própria conta. Para um ranking público seria preciso validar resultados
numa função de servidor (Edge Function) que recalcule o progresso a partir das
tentativas — fora do escopo desta versão.

### Testes necessários antes de ativar

- Usuário A não lê nem escreve o registro do usuário B (testes das políticas RLS).
- Conta desconectada: o jogo continua local.
- Conflito entre dois dispositivos resolve como documentado.
- Falha de rede não perde progresso local.
