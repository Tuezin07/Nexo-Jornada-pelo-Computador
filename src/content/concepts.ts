/**
 * Lista canônica de conceitos do Codex. Missões, etapas e entradas do Codex
 * referenciam estes IDs; o TypeScript impede referências inexistentes e um teste
 * garante que cada conceito tenha uma entrada completa no Codex.
 *
 * Os títulos ficam aqui (carregados sempre); o conteúdo completo fica em
 * `codex.ts`, carregado sob demanda pela tela do Codex.
 */
export const CONCEPTS = {
  // Fundamentos
  'hardware-componentes': 'Componentes do computador',
  'perifericos-entrada-saida': 'Dispositivos de entrada e saída',
  'teclas-essenciais': 'Teclas essenciais',
  'digitacao-postura': 'Postura e posição das mãos',
  'digitacao-fileira-base': 'Fileira base do teclado',
  'mouse-acoes': 'Ações do mouse',
  'janelas-controles': 'Controles de janela',
  'area-transferencia': 'Área de transferência',
  'atalho-desfazer': 'Desfazer e refazer',
  'arquivos-pastas': 'Arquivos e pastas',
  'caminho-arquivo': 'Caminho de um arquivo',
  'extensoes-arquivo': 'Extensões de arquivo',
  'organizacao-pastas': 'Organização de pastas',
  lixeira: 'Lixeira',
  // Domínio do sistema
  'sistema-operacional': 'Sistema operacional',
  'configuracoes-tela': 'Configurações de tela',
  'acessibilidade-sistema': 'Recursos de acessibilidade',
  'configuracoes-som': 'Configurações de som',
  notificacoes: 'Notificações e modo foco',
  'instalacao-programas': 'Instalação de programas',
  desinstalacao: 'Desinstalação de programas',
  'atalhos-janelas': 'Atalhos de janelas',
  'bloquear-tela': 'Bloqueio de tela',
  'captura-tela': 'Captura de tela',
  'gerenciador-tarefas': 'Gerenciador de Tarefas',
  'multitarefa-janelas': 'Organização de janelas',
  'contas-permissoes': 'Contas e permissões',
  // Internet e segurança
  'navegador-basico': 'Navegador, buscador e site',
  'url-anatomia': 'Anatomia de um endereço (URL)',
  'abas-navegador': 'Abas do navegador',
  'atalhos-navegador': 'Atalhos do navegador',
  'pesquisa-eficiente': 'Pesquisa eficiente',
  'avaliar-fontes': 'Avaliação de fontes',
  downloads: 'Downloads',
  'fontes-confiaveis': 'Fontes confiáveis de programas',
  'senhas-fortes': 'Senhas fortes',
  'gerenciador-senhas': 'Gerenciador de senhas',
  'autenticacao-multifator': 'Autenticação em dois fatores',
  phishing: 'Phishing',
  'permissoes-apps': 'Permissões de aplicativos',
  'wifi-publico': 'Redes Wi-Fi públicas',
  'dados-pessoais': 'Proteção de dados pessoais',
  'extensoes-navegador': 'Extensões do navegador',
  atualizacoes: 'Atualizações de software',
  // Diagnóstico
  'diagnostico-metodo': 'Método de diagnóstico',
  'wifi-ethernet': 'Wi-Fi e Ethernet',
  'armazenamento-espaco': 'Espaço de armazenamento',
  'abrir-com': 'Programa padrão e "Abrir com"',
  drivers: 'Drivers',
  'cpu-ram-armazenamento': 'CPU, RAM e armazenamento',
  'hdd-ssd': 'HDD e SSD',
  'programas-inicializacao': 'Programas de inicialização',
  'ip-dns': 'Endereço IP e DNS',
  'roteador-modem': 'Roteador e modem',
  // Eficiência
  'historico-transferencia': 'Histórico da área de transferência',
  'atalhos-texto': 'Atalhos de edição de texto',
  'digitacao-precisao': 'Precisão e ritmo na digitação',
  'ferramentas-escritorio': 'Ferramentas de escritório',
  'salvar-como': 'Salvar e Salvar como',
  'arquivos-compactados': 'Arquivos compactados',
  'terminal-basico': 'O que é um terminal',
  'navegacao-terminal': 'Navegação no terminal',
  'terminal-arquivos': 'Arquivos pelo terminal',
  'automacao-basica': 'Automação básica',
  backup: 'Backup',
  'nuvem-sincronizacao': 'Nuvem e sincronização',
} as const;

export type ConceptId = keyof typeof CONCEPTS;

export const CONCEPT_IDS = Object.keys(CONCEPTS) as ConceptId[];

export function isConceptId(value: string): value is ConceptId {
  return Object.prototype.hasOwnProperty.call(CONCEPTS, value);
}
