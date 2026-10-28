import type { SectorDefinition, SectorId } from './types';

export const SECTORS: SectorDefinition[] = [
  {
    id: 'fundamentos',
    order: 1,
    name: 'Fundamentos',
    tagline: 'O primeiro contato com a máquina',
    description:
      'Peças do computador, teclado, mouse, janelas e a lógica de arquivos e pastas. A base de tudo que vem depois.',
    objectives: [
      'Reconhecer as partes do computador',
      'Usar teclado e mouse com confiança',
      'Encontrar e organizar arquivos',
    ],
    unlock: [{ type: 'always' }],
    unlockHint: 'Sempre disponível.',
  },
  {
    id: 'sistema',
    order: 2,
    name: 'Domínio do sistema',
    tagline: 'Faça o sistema trabalhar para você',
    description:
      'Configurações, programas, contas e atalhos do sistema operacional. Aqui você deixa de seguir o computador e passa a comandá-lo.',
    objectives: [
      'Ajustar configurações de tela, som e acessibilidade',
      'Instalar e remover programas com segurança',
      'Alternar e organizar janelas por atalhos',
    ],
    unlock: [
      { type: 'completedInSector', sector: 'fundamentos', count: 3 },
      { type: 'startingLevel', min: 'casual' },
      { type: 'assessmentScore', min: 0.6 },
    ],
    unlockHint: 'Conclua 3 missões de Fundamentos para abrir este setor.',
  },
  {
    id: 'rede-segura',
    order: 3,
    name: 'Internet e segurança',
    tagline: 'Navegue sem cair em armadilhas',
    description:
      'Endereços, pesquisa, downloads, senhas, golpes e privacidade. O setor que protege você e seus dados.',
    objectives: [
      'Ler endereços e reconhecer sites falsos',
      'Criar senhas fortes e ativar a verificação em duas etapas',
      'Identificar phishing e controlar permissões',
    ],
    unlock: [
      { type: 'completedInSector', sector: 'sistema', count: 3 },
      { type: 'completedInSector', sector: 'fundamentos', count: 6 },
      { type: 'startingLevel', min: 'veterano' },
      { type: 'assessmentScore', min: 0.75 },
    ],
    unlockHint: 'Conclua 3 missões de Domínio do sistema (ou 6 de Fundamentos).',
  },
  {
    id: 'diagnostico',
    order: 4,
    name: 'Diagnóstico',
    tagline: 'Investigue antes de mexer',
    description:
      'Sem internet, sem som, sem espaço, programa travado. Aprenda a observar sintomas, testar hipóteses e escolher soluções seguras.',
    objectives: [
      'Seguir um método de diagnóstico',
      'Resolver problemas comuns sem riscos',
      'Entender CPU, memória, disco e rede',
    ],
    unlock: [
      { type: 'completedInSector', sector: 'rede-segura', count: 3 },
      { type: 'completedInSector', sector: 'sistema', count: 5 },
      { type: 'startingLevel', min: 'mestre' },
    ],
    unlockHint: 'Conclua 3 missões de Internet e segurança (ou 5 de Domínio do sistema).',
  },
  {
    id: 'eficiencia',
    order: 5,
    name: 'Eficiência',
    tagline: 'Menos cliques, mais resultado',
    description:
      'Atalhos avançados, documentos, compactação, backup e os primeiros comandos de terminal para automatizar tarefas.',
    objectives: [
      'Editar textos e documentos com rapidez',
      'Proteger seu trabalho com backup',
      'Usar o terminal com segurança',
    ],
    unlock: [
      { type: 'completedInSector', sector: 'diagnostico', count: 2 },
      { type: 'completedInSector', sector: 'rede-segura', count: 5 },
      { type: 'startingLevel', min: 'mestre' },
    ],
    unlockHint: 'Conclua 2 missões de Diagnóstico (ou 5 de Internet e segurança).',
  },
];

const BY_ID = new Map(SECTORS.map((s) => [s.id, s]));

export function getSector(id: SectorId): SectorDefinition {
  const sector = BY_ID.get(id);
  if (!sector) throw new Error(`Setor desconhecido: ${id}`);
  return sector;
}
