import type { CategoryDefinition, CategoryId } from './types';

export const CATEGORIES: CategoryDefinition[] = [
  {
    id: 'teclado',
    name: 'Teclado, digitação e atalhos',
    short: 'Teclado',
    description: 'Teclas importantes, digitação com precisão e atalhos que poupam tempo.',
  },
  {
    id: 'sistema',
    name: 'Windows e sistema operacional',
    short: 'Sistema',
    description: 'Janelas, contas, tarefas e o funcionamento do sistema operacional.',
  },
  {
    id: 'arquivos',
    name: 'Arquivos, pastas e organização',
    short: 'Arquivos',
    description: 'Encontrar, organizar, renomear e proteger seus arquivos.',
  },
  {
    id: 'internet',
    name: 'Internet e navegação',
    short: 'Internet',
    description: 'Endereços, pesquisa eficiente e avaliação de fontes.',
  },
  {
    id: 'navegadores',
    name: 'Navegadores, downloads e extensões',
    short: 'Navegadores',
    description: 'Abas, downloads, extensões e atalhos do navegador.',
  },
  {
    id: 'programas',
    name: 'Instalação e remoção de programas',
    short: 'Programas',
    description: 'Instalar com segurança e remover o que não serve mais.',
  },
  {
    id: 'configuracoes',
    name: 'Configurações do computador',
    short: 'Configurações',
    description: 'Tela, som, notificações e acessibilidade.',
  },
  {
    id: 'seguranca',
    name: 'Segurança digital e privacidade',
    short: 'Segurança',
    description: 'Senhas, golpes, permissões e proteção de dados.',
  },
  {
    id: 'diagnostico',
    name: 'Resolução de problemas',
    short: 'Diagnóstico',
    description: 'Investigar sintomas, testar hipóteses e resolver com segurança.',
  },
  {
    id: 'produtividade',
    name: 'Produtividade e ferramentas de escritório',
    short: 'Produtividade',
    description: 'Documentos, área de transferência, compactação e rotinas de trabalho.',
  },
  {
    id: 'hardware',
    name: 'Conceitos básicos de hardware',
    short: 'Hardware',
    description: 'CPU, memória, armazenamento e periféricos.',
  },
  {
    id: 'redes',
    name: 'Noções de redes e conectividade',
    short: 'Redes',
    description: 'Wi-Fi, cabo, roteador, IP e DNS.',
  },
  {
    id: 'comandos',
    name: 'Comandos e automação básica',
    short: 'Comandos',
    description: 'Terminal, comandos seguros e pequenas automações.',
  },
];

const BY_ID = new Map(CATEGORIES.map((c) => [c.id, c]));

export function getCategory(id: CategoryId): CategoryDefinition {
  const category = BY_ID.get(id);
  if (!category) throw new Error(`Categoria desconhecida: ${id}`);
  return category;
}

export const CATEGORY_IDS = CATEGORIES.map((c) => c.id);
