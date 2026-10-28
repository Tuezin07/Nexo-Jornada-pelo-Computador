/**
 * Textos extras para o treino livre de digitação. Os textos das missões também
 * entram no sorteio. Acentos são digitados normalmente (teclas mortas funcionam);
 * sem aspas tipográficas, travessões ou reticências unicode.
 */
export interface TrainingText {
  id: string;
  size: 'curto' | 'medio' | 'longo';
  text: string;
}

export const TRAINING_TEXTS: TrainingText[] = [
  { id: 'tt-01', size: 'curto', text: 'Salvar com frequência evita perder horas de trabalho.' },
  { id: 'tt-02', size: 'curto', text: 'Antes de clicar em um link, confira o endereço com calma.' },
  { id: 'tt-03', size: 'curto', text: 'Uma pasta bem nomeada vale mais que mil buscas.' },
  {
    id: 'tt-04',
    size: 'medio',
    text: 'O teclado tem uma fileira base onde os dedos descansam. Voltar para ela depois de cada tecla deixa a digitação mais precisa.',
  },
  {
    id: 'tt-05',
    size: 'medio',
    text: 'Senhas longas e diferentes para cada site, guardadas em um gerenciador, protegem mais do que qualquer truque de memória.',
  },
  {
    id: 'tt-06',
    size: 'medio',
    text: 'Quando algo para de funcionar, observe primeiro, teste a hipótese mais simples e só depois parta para soluções mais drásticas.',
  },
  {
    id: 'tt-07',
    size: 'longo',
    text: 'Fazer backup não é desconfiar do computador; é respeitar o próprio trabalho. Guarde uma cópia em outro dispositivo e outra fora de casa, e teste de vez em quando se os arquivos abrem de verdade.',
  },
  {
    id: 'tt-08',
    size: 'longo',
    text: 'Atalhos de teclado parecem difíceis no primeiro dia e indispensáveis no décimo. Escolha dois por semana, use de propósito até virar hábito e depois acrescente os próximos.',
  },
  {
    id: 'tt-09',
    size: 'longo',
    text: 'Precisão vem antes da velocidade. Quem digita devagar e sem erros ganha ritmo com a prática; quem corre e erra precisa apagar, corrigir e acaba chegando mais tarde.',
  },
];
