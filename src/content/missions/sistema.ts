import type { MissionDefinition } from '../types';

export const SISTEMA_MISSIONS: MissionDefinition[] = [
  // -------------------------------------------------------------------------
  // s01 — O sistema operacional
  // -------------------------------------------------------------------------
  {
    id: 's01-sistema-operacional',
    version: 1,
    sector: 'sistema',
    order: 1,
    title: 'O sistema operacional',
    summary: 'Entenda o papel do sistema operacional e a diferença entre ele e os aplicativos.',
    briefing:
      'Por trás de cada clique existe um gerente invisível que coordena tudo. Agente, antes de assumir o controle do Nexo, você precisa saber quem manda na máquina e como ele trabalha.',
    category: 'sistema',
    subcategory: 'Conceitos do sistema',
    difficulty: 1,
    estimatedMinutes: 5,
    prerequisites: [],
    objectives: [
      'Explicar o que o sistema operacional faz',
      'Diferenciar sistemas operacionais de aplicativos',
      'Entender por que programas dependem do sistema',
      'Descobrir a versão do sistema instalada',
    ],
    concepts: ['sistema-operacional'],
    platformNote:
      'No Windows 10 e 11, a versão aparece em **Configurações > Sistema > Sobre** (ou digitando `winver` na busca do menu Iniciar). No macOS, use o **menu Apple > Sobre Este Mac**.',
    steps: [
      {
        id: 'papel',
        kind: 'quiz',
        title: 'O gerente da máquina',
        context:
          'Você liga o computador e, antes de abrir qualquer programa, já consegue ver suas pastas, conectar ao Wi-Fi e ouvir o som de uma notificação.',
        prompt: 'Quem coordena tudo isso?',
        hint: 'Procure o software que já está trabalhando antes de você abrir qualquer aplicativo.',
        explanation:
          'O sistema operacional é o primeiro software a carregar quando o computador liga. Ele gerencia os recursos de hardware (processador, memória, disco, rede) e oferece a base sobre a qual os aplicativos funcionam: janelas, arquivos, impressão e notificações.',
        concept: 'sistema-operacional',
        options: [
          {
            id: 'so',
            text: 'O sistema operacional, que gerencia o hardware e oferece a base para os programas',
            correct: true,
            feedback:
              'Isso. O sistema operacional (Windows, macOS, Linux) controla memória, arquivos, rede, som e tela, e serve de ponte entre os programas e o hardware.',
          },
          {
            id: 'navegador',
            text: 'O navegador de internet',
            feedback:
              'O navegador é um aplicativo que roda sobre o sistema. Ele usa a conexão de rede, mas não é quem a gerencia.',
          },
          {
            id: 'cpu',
            text: 'O processador, sozinho',
            feedback:
              'O processador executa instruções, mas precisa de um software dizendo o que fazer. Esse software de base é o sistema operacional.',
          },
          {
            id: 'antivirus',
            text: 'O antivírus',
            feedback: 'O antivírus protege contra ameaças, mas não é ele que gerencia pastas, som ou rede.',
          },
        ],
      },
      {
        id: 'so-ou-app',
        kind: 'classify',
        title: 'Sistema ou aplicativo?',
        prompt: 'Classifique cada software: é um sistema operacional ou um aplicativo que roda sobre um sistema?',
        hint: 'Um sistema operacional comanda o aparelho inteiro; um aplicativo é instalado dentro dele para uma tarefa específica.',
        explanation:
          'Sistemas operacionais (Windows, macOS, Linux, Android, iOS) controlam o aparelho inteiro. Aplicativos (navegador, editor de texto, mensageiro) são programas que dependem do sistema para funcionar. Um mesmo aplicativo pode ter versões para vários sistemas.',
        concept: 'sistema-operacional',
        buckets: [
          { id: 'so', label: 'Sistema operacional' },
          { id: 'app', label: 'Aplicativo' },
        ],
        items: [
          {
            id: 'windows',
            text: 'Windows 11',
            bucket: 'so',
            feedback: 'É o sistema operacional da Microsoft, usado na maioria dos computadores pessoais.',
          },
          {
            id: 'macos',
            text: 'macOS',
            bucket: 'so',
            feedback: 'É o sistema operacional da Apple para computadores Mac.',
          },
          {
            id: 'ubuntu',
            text: 'Ubuntu (Linux)',
            bucket: 'so',
            feedback: 'O Ubuntu é uma distribuição Linux, um sistema operacional livre e gratuito.',
          },
          {
            id: 'android',
            text: 'Android',
            bucket: 'so',
            feedback: 'O Android é o sistema operacional da maioria dos celulares.',
          },
          {
            id: 'ios',
            text: 'iOS',
            bucket: 'so',
            feedback: 'O iOS é o sistema operacional do iPhone.',
          },
          {
            id: 'chrome',
            text: 'Google Chrome',
            bucket: 'app',
            feedback: 'O Chrome é um navegador: um aplicativo que roda sobre Windows, macOS, Linux e outros sistemas.',
          },
          {
            id: 'word',
            text: 'Microsoft Word',
            bucket: 'app',
            feedback: 'O Word é um editor de textos, ou seja, um aplicativo.',
          },
          {
            id: 'whatsapp',
            text: 'WhatsApp',
            bucket: 'app',
            feedback: 'O WhatsApp é um aplicativo de mensagens, com versões para vários sistemas.',
          },
          {
            id: 'spotify',
            text: 'Spotify',
            bucket: 'app',
            feedback: 'O Spotify é um aplicativo de música.',
          },
        ],
      },
      {
        id: 'compatibilidade',
        kind: 'quiz',
        title: 'Programa incompatível',
        context:
          'Você baixou do site oficial um programa chamado `editorfotos_setup.exe` e tentou abri-lo em um MacBook. O Mac avisa que o arquivo não pode ser aberto.',
        prompt: 'Por que isso acontece?',
        hint: 'Repare na extensão do arquivo e no sistema do computador.',
        explanation:
          'Os aplicativos conversam com o sistema operacional, e cada sistema tem seu próprio formato de programa. Por isso, um programa precisa de uma versão para Windows, outra para macOS, outra para Android. Antes de baixar, confira os requisitos: sistema e versão mínima.',
        concept: 'sistema-operacional',
        options: [
          {
            id: 'feito-para',
            text: 'Programas são feitos para um sistema específico, e arquivos .exe são programas para Windows',
            correct: true,
            feedback:
              'Exato. No Mac, procure a versão para macOS no site oficial do desenvolvedor ou na App Store.',
          },
          {
            id: 'ram',
            text: 'O MacBook não tem memória RAM suficiente',
            feedback:
              'Pouca memória deixaria um programa lento, mas não impediria o sistema de reconhecer o arquivo. O problema é o formato.',
          },
          {
            id: 'corrompido',
            text: 'O arquivo com certeza está corrompido e precisa ser baixado de novo',
            feedback:
              'Baixar de novo traria o mesmo programa para Windows. O problema não é um defeito no arquivo, e sim a incompatibilidade com o sistema.',
          },
          {
            id: 'internet',
            text: 'O Mac precisa estar conectado à internet para abrir programas',
            feedback:
              'A maioria dos programas instalados funciona sem internet. O que falta aqui é compatibilidade com o sistema.',
          },
        ],
      },
      {
        id: 'versao',
        kind: 'quiz',
        title: 'Qual é a minha versão?',
        context: 'Um programa informa nos requisitos: "Requer Windows 10 ou superior". Você não sabe qual versão está instalada.',
        prompt: 'Onde conferir essa informação no Windows?',
        hint: 'O sistema tem uma página que descreve o próprio dispositivo.',
        explanation:
          'Saber qual sistema e qual versão estão instalados é o primeiro passo para conferir se um programa é compatível e se o computador ainda recebe atualizações de segurança.',
        concept: 'sistema-operacional',
        options: [
          {
            id: 'sobre',
            text: 'Em Configurações > Sistema > Sobre, na seção de especificações do Windows',
            correct: true,
            feedback:
              'Isso. Ali aparecem a edição (como Windows 11 Home) e a versão. Também dá para digitar `winver` na busca do menu Iniciar.',
          },
          {
            id: 'relogio',
            text: 'No canto da barra de tarefas, ao lado do relógio',
            feedback: 'Ali ficam data, hora e ícones de rede e som, não a versão do sistema.',
          },
          {
            id: 'gerenciador',
            text: 'No Gerenciador de Tarefas, na lista de processos',
            feedback:
              'O Gerenciador de Tarefas mostra programas em execução e uso de recursos, não a versão do Windows.',
          },
          {
            id: 'etiqueta',
            text: 'Na etiqueta colada embaixo do notebook',
            feedback:
              'A etiqueta pode mostrar o sistema com que o aparelho foi vendido, mas ele pode ter sido atualizado desde então. A informação confiável está no próprio sistema.',
          },
        ],
      },
    ],
    debrief:
      'O sistema operacional é a camada que comanda o hardware e sustenta os aplicativos: Windows, macOS e Linux nos computadores, Android e iOS nos celulares. Programas são feitos para um sistema específico, então conferir sistema e versão antes de instalar evita frustração.',
  },

  // -------------------------------------------------------------------------
  // s02 — Painel de configurações
  // -------------------------------------------------------------------------
  {
    id: 's02-painel-de-configuracoes',
    version: 1,
    sector: 'sistema',
    order: 2,
    title: 'Painel de configurações',
    summary: 'Ajuste a tela com nitidez e use os recursos de acessibilidade certos para cada necessidade.',
    briefing:
      'Um sistema bem configurado trabalha a favor dos seus olhos, não contra eles. Agente, abra o painel de controle do Nexo e ajuste a tela para quem vai usá-la.',
    category: 'configuracoes',
    subcategory: 'Tela e acessibilidade',
    difficulty: 1,
    estimatedMinutes: 6,
    prerequisites: [],
    objectives: [
      'Aumentar o tamanho dos itens pela escala, sem perder nitidez',
      'Ativar a luz noturna',
      'Aumentar texto e ponteiro pelos recursos de acessibilidade',
      'Escolher o recurso de acessibilidade adequado a cada necessidade',
    ],
    concepts: ['configuracoes-tela', 'acessibilidade-sistema'],
    platformNote:
      'Os nomes seguem o Windows 11: **Configurações > Sistema > Tela** e **Configurações > Acessibilidade**. No Windows 10, a acessibilidade fica em **Facilidade de Acesso**. No macOS, procure em **Ajustes do Sistema > Telas** e **Ajustes do Sistema > Acessibilidade**; lá, a luz noturna se chama **Night Shift** e a Lupa se chama **Zoom**.',
    steps: [
      {
        id: 'escala',
        kind: 'settings',
        title: 'Texto pequeno demais',
        context:
          'Num notebook de 15 polegadas com tela Full HD, tudo parece minúsculo. Além disso, você costuma trabalhar à noite e sente os olhos cansados.',
        prompt: 'Aumente a escala para **125%** sem trocar a resolução recomendada e ative a **Luz noturna**.',
        hint: 'Para deixar tudo maior com nitidez, mexa na escala, e não na resolução. A luz noturna fica junto do brilho.',
        explanation:
          'A **escala** aumenta textos, ícones e botões mantendo a nitidez. Reduzir a **resolução** também deixa tudo maior, mas a imagem fica borrada, porque a tela passa a exibir menos pontos do que tem. A **luz noturna** reduz a luz azul, deixando a tela mais amarelada e confortável à noite.',
        concept: 'configuracoes-tela',
        panels: [
          {
            id: 'tela',
            title: 'Sistema > Tela',
            groups: [
              {
                title: 'Brilho e cor',
                controls: [
                  {
                    id: 'brilho',
                    type: 'slider',
                    label: 'Brilho',
                    min: 0,
                    max: 100,
                    step: 5,
                    initial: 70,
                    unit: '%',
                  },
                  {
                    id: 'luz-noturna',
                    type: 'toggle',
                    label: 'Luz noturna',
                    description: 'Usa cores mais quentes para reduzir a luz azul',
                    initial: false,
                  },
                ],
              },
              {
                title: 'Escala e layout',
                controls: [
                  {
                    id: 'escala',
                    type: 'select',
                    label: 'Escala',
                    description: 'Altera o tamanho de textos, aplicativos e outros itens',
                    options: [
                      { value: '100', label: '100%' },
                      { value: '125', label: '125% (Recomendável)' },
                      { value: '150', label: '150%' },
                      { value: '175', label: '175%' },
                    ],
                    initial: '100',
                  },
                  {
                    id: 'resolucao',
                    type: 'select',
                    label: 'Resolução da tela',
                    description: 'Ajuste a resolução para combinar com a tela conectada',
                    options: [
                      { value: '1920x1080', label: '1920 × 1080 (Recomendável)' },
                      { value: '1600x900', label: '1600 × 900' },
                      { value: '1366x768', label: '1366 × 768' },
                      { value: '1280x720', label: '1280 × 720' },
                    ],
                    initial: '1920x1080',
                  },
                ],
              },
            ],
          },
        ],
        goals: [
          { control: 'escala', op: 'eq', value: '125', label: 'Defina a escala em 125%' },
          { control: 'luz-noturna', op: 'eq', value: true, label: 'Ative a Luz noturna' },
        ],
        forbidden: [
          {
            control: 'resolucao',
            op: 'eq',
            value: '1600x900',
            reason: 'Reduzir a resolução deixa a imagem borrada. Para aumentar o tamanho dos itens, use a escala.',
          },
          {
            control: 'resolucao',
            op: 'eq',
            value: '1366x768',
            reason: 'Reduzir a resolução deixa a imagem borrada. Para aumentar o tamanho dos itens, use a escala.',
          },
          {
            control: 'resolucao',
            op: 'eq',
            value: '1280x720',
            reason: 'Reduzir a resolução deixa a imagem borrada. Para aumentar o tamanho dos itens, use a escala.',
          },
        ],
      },
      {
        id: 'acessibilidade',
        kind: 'settings',
        title: 'Ajustes para a avó',
        context:
          'Sua avó vai usar o computador para videochamadas. Ela tem dificuldade para ler os menus e perde o ponteiro do mouse de vista.',
        prompt:
          'Nas configurações de acessibilidade, aumente o **tamanho do texto** para pelo menos 150% e o **tamanho do ponteiro do mouse** para pelo menos 3.',
        hint: 'Os dois ajustes ficam no grupo Visão: um muda só as letras, o outro só o ponteiro.',
        explanation:
          'O **tamanho do texto** aumenta só as letras de menus e janelas, sem mudar o resto da interface. Um **ponteiro** maior, de preferência com cor de destaque, é mais fácil de acompanhar. Recursos de acessibilidade ajudam qualquer pessoa, não apenas quem tem alguma deficiência.',
        concept: 'acessibilidade-sistema',
        panels: [
          {
            id: 'acessibilidade',
            title: 'Acessibilidade',
            groups: [
              {
                title: 'Visão: Tamanho do texto',
                controls: [
                  {
                    id: 'tamanho-texto',
                    type: 'slider',
                    label: 'Tamanho do texto',
                    min: 100,
                    max: 225,
                    step: 5,
                    initial: 100,
                    unit: '%',
                  },
                ],
              },
              {
                title: 'Visão: Ponteiro do mouse e toque',
                controls: [
                  {
                    id: 'estilo-ponteiro',
                    type: 'select',
                    label: 'Estilo do ponteiro do mouse',
                    options: [
                      { value: 'branco', label: 'Branco' },
                      { value: 'preto', label: 'Preto' },
                      { value: 'invertido', label: 'Invertido' },
                      { value: 'personalizado', label: 'Personalizado (cor de destaque)' },
                    ],
                    initial: 'branco',
                  },
                  {
                    id: 'tamanho-ponteiro',
                    type: 'slider',
                    label: 'Tamanho do ponteiro',
                    min: 1,
                    max: 15,
                    step: 1,
                    initial: 1,
                  },
                ],
              },
              {
                title: 'Visão: Outros recursos',
                controls: [
                  {
                    id: 'lupa',
                    type: 'toggle',
                    label: 'Lupa',
                    description: 'Amplia partes da tela',
                    initial: false,
                  },
                  {
                    id: 'temas-contraste',
                    type: 'select',
                    label: 'Temas de contraste',
                    options: [
                      { value: 'nenhum', label: 'Nenhum' },
                      { value: 'aquatico', label: 'Aquático' },
                      { value: 'deserto', label: 'Deserto' },
                      { value: 'crepusculo', label: 'Crepúsculo' },
                      { value: 'ceu-noturno', label: 'Céu noturno' },
                    ],
                    initial: 'nenhum',
                  },
                  {
                    id: 'narrador',
                    type: 'toggle',
                    label: 'Narrador',
                    description: 'Lê em voz alta o que está na tela',
                    initial: false,
                  },
                ],
              },
            ],
          },
        ],
        goals: [
          { control: 'tamanho-texto', op: 'gte', value: 150, label: 'Aumente o tamanho do texto para 150% ou mais' },
          { control: 'tamanho-ponteiro', op: 'gte', value: 3, label: 'Aumente o ponteiro do mouse para 3 ou mais' },
        ],
      },
      {
        id: 'recurso-certo',
        kind: 'quiz',
        title: 'O recurso certo',
        context:
          'Um colega com baixa visão usa o computador normalmente, mas às vezes precisa ampliar um trecho pequeno, como os números de uma planilha.',
        prompt: 'Qual recurso atende melhor a essa necessidade?',
        hint: 'Ele precisa ampliar só de vez em quando e só uma parte da tela.',
        explanation:
          'Cada recurso atende uma necessidade: tamanho do texto e escala para leitura constante, Lupa para ampliar sob demanda, temas de contraste para quem precisa de cores mais marcadas, Narrador para quem não enxerga a tela e legendas para quem não ouve bem.',
        concept: 'acessibilidade-sistema',
        options: [
          {
            id: 'lupa',
            text: 'A Lupa, que amplia uma área da tela quando necessário',
            correct: true,
            feedback:
              'Isso. A Lupa amplia só quando ele precisar e pode acompanhar o ponteiro. No Windows, ela liga com a tecla Windows e o sinal de mais.',
          },
          {
            id: 'resolucao',
            text: 'Baixar a resolução da tela para 800 × 600',
            feedback:
              'Tudo ficaria maior o tempo todo, porém borrado, e muitas janelas não caberiam na tela. A ampliação sob demanda é mais adequada.',
          },
          {
            id: 'narrador',
            text: 'O Narrador, que lê a tela em voz alta',
            feedback:
              'O Narrador é um leitor de tela, essencial para quem não enxerga a tela. Seu colega enxerga e só precisa ampliar trechos.',
          },
          {
            id: 'luz-noturna',
            text: 'A Luz noturna',
            feedback: 'A luz noturna muda a temperatura das cores para reduzir o cansaço à noite. Ela não amplia nada.',
          },
        ],
      },
    ],
    debrief:
      'Configurações de tela e acessibilidade adaptam o computador a quem usa, e não o contrário. Para aumentar tudo com nitidez, use a escala e mantenha a resolução recomendada; para necessidades específicas, há tamanho do texto, ponteiro maior, Lupa e Narrador. A luz noturna deixa o uso à noite mais confortável.',
  },

  // -------------------------------------------------------------------------
  // s03 — Som, Wi-Fi e notificações
  // -------------------------------------------------------------------------
  {
    id: 's03-som-wifi-notificacoes',
    version: 1,
    sector: 'sistema',
    order: 3,
    title: 'Som, Wi-Fi e notificações',
    summary: 'Coloque o áudio no dispositivo certo, reconecte-se e silencie distrações sem perder o que é urgente.',
    briefing:
      'Agente, você acaba de pousar e tem uma videochamada em poucos minutos. Reconecte o notebook, coloque o áudio no lugar certo e silencie o que pode atrapalhar.',
    category: 'configuracoes',
    subcategory: 'Som, conexões e foco',
    difficulty: 2,
    estimatedMinutes: 7,
    prerequisites: ['s02-painel-de-configuracoes'],
    objectives: [
      'Escolher os dispositivos de saída e de entrada de áudio',
      'Ajustar o volume de cada aplicativo separadamente',
      'Usar o Não incomodar com regras automáticas e exceções',
      'Proteger a privacidade das notificações',
    ],
    concepts: ['configuracoes-som', 'notificacoes'],
    platformNote:
      'No Windows 11, as **Configurações rápidas** (Wi-Fi, Bluetooth, Modo avião, volume) abrem com {{Win+A}}; o som fica em **Configurações > Sistema > Som** e as notificações em **Configurações > Sistema > Notificações**. No Windows 10, o equivalente é a **Central de Ações**, e o modo de foco se chama **Assistente de foco**. No macOS, use a **Central de Controle** e o recurso **Foco**, que inclui o Não Perturbe.',
    steps: [
      {
        id: 'audio-chamada',
        kind: 'settings',
        title: 'Pronto para a chamada',
        context:
          'O notebook ainda está em Modo avião desde o voo. Seu fone Bluetooth com microfone já foi pareado antes, mas o som está saindo pelos alto-falantes, no volume máximo.',
        prompt:
          'Desative o Modo avião, ligue o Wi-Fi e o Bluetooth, envie o som para o fone, use o microfone do fone e deixe o volume entre 30 e 70.',
        hint: 'Comece pelas conexões: sem Bluetooth, o fone não funciona. Depois, em Som, escolha a saída e a entrada.',
        explanation:
          'O sistema separa a **saída** (onde o som toca: alto-falantes, fone, TV) da **entrada** (qual microfone capta sua voz). Em chamadas, usar a saída e a entrada do mesmo fone evita eco e ruído. Um volume moderado protege a audição, especialmente com fones.',
        concept: 'configuracoes-som',
        panels: [
          {
            id: 'rapidas',
            title: 'Configurações rápidas',
            groups: [
              {
                title: 'Conexões',
                controls: [
                  {
                    id: 'modo-aviao',
                    type: 'toggle',
                    label: 'Modo avião',
                    description: 'Desliga todas as conexões sem fio',
                    initial: true,
                  },
                  { id: 'wifi', type: 'toggle', label: 'Wi-Fi', initial: false },
                  { id: 'bluetooth', type: 'toggle', label: 'Bluetooth', initial: false },
                ],
              },
            ],
          },
          {
            id: 'som',
            title: 'Sistema > Som',
            groups: [
              {
                title: 'Saída',
                controls: [
                  {
                    id: 'saida',
                    type: 'select',
                    label: 'Escolha onde reproduzir o som',
                    options: [
                      { value: 'alto-falantes', label: 'Alto-falantes (áudio do notebook)' },
                      { value: 'fone-bt', label: 'Fone de ouvido (Bluetooth)' },
                      { value: 'hdmi', label: 'Monitor externo (HDMI)' },
                    ],
                    initial: 'alto-falantes',
                  },
                  { id: 'volume', type: 'slider', label: 'Volume', min: 0, max: 100, step: 1, initial: 100 },
                ],
              },
              {
                title: 'Entrada',
                controls: [
                  {
                    id: 'entrada',
                    type: 'select',
                    label: 'Escolha um dispositivo para falar ou gravar',
                    options: [
                      { value: 'mic-notebook', label: 'Microfone (embutido no notebook)' },
                      { value: 'mic-fone', label: 'Microfone do fone de ouvido (Bluetooth)' },
                    ],
                    initial: 'mic-notebook',
                  },
                  {
                    id: 'volume-entrada',
                    type: 'slider',
                    label: 'Volume de entrada',
                    min: 0,
                    max: 100,
                    step: 1,
                    initial: 80,
                  },
                ],
              },
            ],
          },
        ],
        goals: [
          { control: 'modo-aviao', op: 'eq', value: false, label: 'Desative o Modo avião' },
          { control: 'wifi', op: 'eq', value: true, label: 'Ligue o Wi-Fi' },
          { control: 'bluetooth', op: 'eq', value: true, label: 'Ligue o Bluetooth' },
          { control: 'saida', op: 'eq', value: 'fone-bt', label: 'Envie o som para o fone Bluetooth' },
          { control: 'entrada', op: 'eq', value: 'mic-fone', label: 'Use o microfone do fone' },
          { control: 'volume', op: 'gte', value: 30, label: 'Deixe o volume em 30 ou mais' },
          { control: 'volume', op: 'lte', value: 70, label: 'Deixe o volume em 70 ou menos' },
        ],
        forbidden: [
          {
            control: 'volume-entrada',
            op: 'eq',
            value: 0,
            reason: 'Com o volume de entrada em 0, ninguém vai ouvir você na chamada.',
          },
        ],
      },
      {
        id: 'foco-apresentacao',
        kind: 'settings',
        title: 'Sem interrupções',
        context:
          'Logo depois da chamada, você vai compartilhar a tela com clientes. Ontem, uma mensagem pessoal apareceu no meio de uma apresentação.',
        prompt:
          'Ative o **Não incomodar**, faça ele ligar sozinho sempre que você duplicar a tela e ative a opção que oculta o conteúdo das notificações na tela de bloqueio. Mantenha os alertas de segurança ativos.',
        hint: 'As regras automáticas ficam num grupo próprio. Alertas de segurança são importantes demais para silenciar de vez.',
        explanation:
          'O **Não incomodar** guarda as notificações na central sem exibi-las na tela; você as lê depois. Regras automáticas, como ativar ao duplicar a tela, evitam depender da memória. Ocultar o conteúdo na tela de bloqueio impede que alguém leia suas mensagens com o computador bloqueado.',
        concept: 'notificacoes',
        panels: [
          {
            id: 'notificacoes',
            title: 'Sistema > Notificações',
            groups: [
              {
                title: 'Geral',
                controls: [
                  {
                    id: 'nao-incomodar',
                    type: 'toggle',
                    label: 'Não incomodar',
                    description: 'As notificações vão direto para a central de notificações',
                    initial: false,
                  },
                  {
                    id: 'tela-bloqueio',
                    type: 'toggle',
                    label: 'Mostrar notificações na tela de bloqueio',
                    initial: true,
                  },
                  {
                    id: 'ocultar-conteudo',
                    type: 'toggle',
                    label: 'Ocultar o conteúdo das notificações na tela de bloqueio',
                    initial: false,
                  },
                ],
              },
              {
                title: 'Ativar o Não incomodar automaticamente',
                controls: [
                  { id: 'auto-duplicar', type: 'toggle', label: 'Ao duplicar a tela', initial: false },
                  { id: 'auto-jogo', type: 'toggle', label: 'Ao jogar um jogo', initial: false },
                  {
                    id: 'auto-horario',
                    type: 'toggle',
                    label: 'Durante estes horários (22:00 às 07:00)',
                    initial: false,
                  },
                ],
              },
              {
                title: 'Notificações de aplicativos',
                controls: [
                  { id: 'app-whatsapp', type: 'toggle', label: 'WhatsApp', initial: true },
                  { id: 'app-email', type: 'toggle', label: 'E-mail', initial: true },
                  {
                    id: 'app-seguranca',
                    type: 'toggle',
                    label: 'Segurança do Windows',
                    description: 'Alertas sobre vírus, firewall e proteção da conta',
                    initial: true,
                  },
                ],
              },
            ],
          },
        ],
        goals: [
          { control: 'nao-incomodar', op: 'eq', value: true, label: 'Ative o Não incomodar' },
          {
            control: 'auto-duplicar',
            op: 'eq',
            value: true,
            label: 'Faça o Não incomodar ligar sozinho ao duplicar a tela',
          },
          {
            control: 'ocultar-conteudo',
            op: 'eq',
            value: true,
            label: 'Oculte o conteúdo das notificações na tela de bloqueio',
          },
        ],
        forbidden: [
          {
            control: 'app-seguranca',
            op: 'eq',
            value: false,
            reason:
              'Os alertas da Segurança do Windows avisam sobre ameaças. Silencie os aplicativos que distraem, não os que protegem você.',
          },
        ],
      },
      {
        id: 'mixer',
        kind: 'quiz',
        title: 'Volume por aplicativo',
        context:
          'Durante uma aula on-line no navegador, a voz do professor está baixa, mas a música que toca ao fundo em outro aplicativo está alta demais.',
        prompt: 'Como ajustar os dois sem mexer no volume geral?',
        hint: 'O Windows permite controlar o volume de cada programa, e não só o geral.',
        explanation:
          'Além do volume geral, o Windows mantém um volume para cada aplicativo no **Mixer de volume**. É útil para equilibrar chamada e música, ou silenciar só um site barulhento. No macOS não há um mixer por aplicativo nativo: o ajuste é feito dentro de cada programa.',
        concept: 'configuracoes-som',
        options: [
          {
            id: 'mixer',
            text: 'Abrir o Mixer de volume e ajustar cada aplicativo separadamente',
            correct: true,
            feedback:
              'Isso. O Mixer de volume (em Configurações > Sistema > Som, ou clicando com o botão direito no ícone de som) tem um controle para cada aplicativo que está tocando.',
          },
          {
            id: 'geral',
            text: 'Aumentar o volume geral ao máximo',
            feedback:
              'Isso aumentaria o professor, mas também a música, que já está alta. O problema é o equilíbrio entre os aplicativos.',
          },
          {
            id: 'saida',
            text: 'Trocar o dispositivo de saída para o monitor',
            feedback: 'Mudar a saída leva todo o som para outro aparelho, sem resolver a diferença entre os dois aplicativos.',
          },
          {
            id: 'desinstalar',
            text: 'Desinstalar o aplicativo de música',
            feedback: 'Bastava abaixar a música. Desinstalar é uma solução drástica para um ajuste simples.',
          },
        ],
      },
      {
        id: 'excecoes',
        kind: 'quiz',
        title: 'Exceções ao silêncio',
        context:
          'Você quer ativar o Não incomodar no computador durante uma tarde de trabalho concentrado, mas não pode perder os lembretes de reunião do calendário.',
        prompt: 'Qual é a melhor configuração?',
        hint: 'O modo de foco pode ter uma lista de exceções que furam o bloqueio.',
        explanation:
          'Os modos de foco (Não incomodar no Windows, Foco no macOS, iPhone e Android) silenciam por padrão, mas aceitam exceções: lembretes, chamadas, pessoas e aplicativos prioritários. Bem configurado, o foco corta distrações sem esconder o que é urgente.',
        concept: 'notificacoes',
        options: [
          {
            id: 'prioridade',
            text: 'Manter o Não incomodar e incluir os lembretes do calendário nas notificações prioritárias',
            correct: true,
            feedback:
              'Isso. No Windows 11, isso fica em Notificações > Definir notificações prioritárias, onde você escolhe lembretes, chamadas e aplicativos que podem aparecer mesmo com o Não incomodar ativo.',
          },
          {
            id: 'desligar',
            text: 'Desligar o Não incomodar e aguentar as interrupções',
            feedback: 'Funciona, mas você perde o benefício do silêncio. As exceções existem justamente para esse caso.',
          },
          {
            id: 'todos',
            text: 'Desativar de vez as notificações de todos os aplicativos',
            feedback: 'Assim você perderia também os lembretes de reunião e os alertas importantes do sistema.',
          },
          {
            id: 'volume',
            text: 'Deixar o volume no máximo para ouvir os lembretes mesmo com o Não incomodar',
            feedback:
              'Com o Não incomodar ativo, as notificações comuns não aparecem nem tocam som; o volume não muda isso.',
          },
        ],
      },
    ],
    debrief:
      'O som tem dois lados: a saída (onde toca) e a entrada (o que capta sua voz), e cada aplicativo pode ter seu próprio volume no mixer. Conexões como Wi-Fi e Bluetooth ficam a um clique nas configurações rápidas. E o Não incomodar, com regras automáticas e exceções bem escolhidas, protege sua concentração e sua privacidade sem esconder o que é urgente.',
  },

  // -------------------------------------------------------------------------
  // s04 — Instalar e remover programas
  // -------------------------------------------------------------------------
  {
    id: 's04-instalar-e-remover',
    version: 1,
    sector: 'sistema',
    order: 4,
    title: 'Instalar e remover programas',
    summary: 'Instale programas por um roteiro seguro e remova o que não serve do jeito certo.',
    briefing:
      'Todo programa instalado ganha um pedaço do Nexo: espaço, memória e, às vezes, permissões amplas. Agente, deixe entrar só o que é confiável e despeje quem não paga o aluguel.',
    category: 'programas',
    subcategory: 'Instalação e desinstalação',
    difficulty: 2,
    estimatedMinutes: 7,
    prerequisites: ['s01-sistema-operacional'],
    objectives: [
      'Seguir um roteiro seguro de instalação',
      'Interpretar o pedido de permissão do sistema',
      'Desinstalar do jeito certo, sem deixar restos',
      'Reconhecer componentes que não devem ser removidos',
    ],
    concepts: ['instalacao-programas', 'desinstalacao'],
    platformNote:
      'No Windows 11, os programas ficam em **Configurações > Aplicativos > Aplicativos instalados** (no Windows 10: **Aplicativos e recursos**), e a janela de permissão se chama **Controle de Conta de Usuário**. No macOS, a maioria dos apps é instalada pela App Store ou arrastada para a pasta **Aplicativos**, e removida arrastando-a para o Lixo; alguns trazem desinstalador próprio.',
    steps: [
      {
        id: 'roteiro-instalacao',
        kind: 'order',
        title: 'Roteiro seguro',
        prompt: 'Coloque em ordem os passos de uma instalação segura no Windows.',
        hint: 'Tudo começa antes do download: de onde vem o programa? E as ofertas extras aparecem durante a instalação.',
        explanation:
          'A segurança de uma instalação se decide em cada etapa: origem oficial, arquivo coerente, editor verificado na janela de permissão e atenção às telas do instalador, onde muitos programas tentam incluir barras de ferramentas, "otimizadores" e outros extras.',
        concept: 'instalacao-programas',
        items: [
          {
            id: 'origem',
            text: 'Procure o programa no site oficial do desenvolvedor ou na loja do sistema (Microsoft Store)',
          },
          { id: 'baixar', text: 'Baixe o instalador e confira se o nome do arquivo corresponde ao programa' },
          {
            id: 'permissao',
            text: 'Abra o instalador e, na janela de permissão, confira se o editor é o esperado antes de clicar em Sim',
          },
          { id: 'telas', text: 'Leia cada tela do instalador e desmarque ofertas de programas extras' },
          { id: 'testar', text: 'Conclua a instalação e abra o programa para conferir se funciona' },
        ],
      },
      {
        id: 'uac',
        kind: 'quiz',
        title: 'Pedido de permissão',
        context:
          'Você abriu um instalador baixado de um site de downloads desconhecido. O Windows escurece a tela e pergunta se deseja permitir que o aplicativo faça alterações no dispositivo. No campo Editor, aparece: **Desconhecido**.',
        prompt: 'Qual é a atitude mais segura?',
        hint: 'Repare no campo Editor e na origem do arquivo.',
        explanation:
          'A janela do **Controle de Conta de Usuário** aparece quando um programa quer fazer alterações no sistema, como instalar algo. Ela mostra o **editor**: programas legítimos costumam exibir o nome verificado da empresa. Editor desconhecido somado a uma origem duvidosa é sinal para cancelar.',
        concept: 'instalacao-programas',
        options: [
          {
            id: 'nao',
            text: 'Clicar em Não e procurar o programa no site oficial do desenvolvedor',
            correct: true,
            feedback:
              'Isso. Editor desconhecido significa que o arquivo não tem uma assinatura digital verificada. Sem saber a origem, não dê permissão: busque a fonte oficial.',
          },
          {
            id: 'sim',
            text: 'Clicar em Sim, porque o Windows sempre faz essa pergunta',
            feedback:
              'O Windows pede permissão para qualquer alteração importante, mas o detalhe que importa é o editor. "Desconhecido", vindo de um site estranho, é motivo para parar.',
          },
          {
            id: 'desativar',
            text: 'Desativar esse aviso nas configurações para não ser incomodado de novo',
            feedback:
              'Desligar o Controle de Conta de Usuário remove uma proteção importante: programas maliciosos passariam a fazer alterações sem você perceber.',
          },
          {
            id: 'depois',
            text: 'Clicar em Sim e passar o antivírus depois da instalação',
            feedback:
              'Depois que o programa recebe permissão de administrador, o estrago pode já estar feito. A decisão segura vem antes, não depois.',
          },
        ],
      },
      {
        id: 'remover-certo',
        kind: 'classify',
        title: 'Jeito certo de remover',
        prompt: 'Classifique cada ação: ela remove o programa de verdade ou não resolve (e pode até causar problemas)?',
        hint: 'Ícones e atalhos são só portas de entrada. Remover de verdade passa por um desinstalador.',
        explanation:
          'Desinstalar é diferente de apagar arquivos: o desinstalador remove o programa, seus registros, serviços e atalhos de forma coordenada. Apagar pastas ou atalhos manualmente deixa restos e pode causar erros.',
        concept: 'desinstalacao',
        buckets: [
          { id: 'remove', label: 'Remove o programa corretamente' },
          { id: 'nao-remove', label: 'Não remove ou causa problemas' },
        ],
        items: [
          {
            id: 'configuracoes',
            text: 'Desinstalar em Configurações > Aplicativos > Aplicativos instalados',
            bucket: 'remove',
            feedback: 'É o caminho oficial: o Windows chama o desinstalador do programa, que apaga arquivos e registros.',
          },
          {
            id: 'desinstalador',
            text: 'Usar o desinstalador que veio com o próprio programa',
            bucket: 'remove',
            feedback: 'O desinstalador oficial do programa faz a remoção completa.',
          },
          {
            id: 'mac-lixo',
            text: 'No macOS, arrastar o app da pasta Aplicativos para o Lixo e esvaziar o Lixo',
            bucket: 'remove',
            feedback: 'No Mac, a maioria dos apps é removida assim. Quando o app traz desinstalador próprio, prefira usá-lo.',
          },
          {
            id: 'atalho',
            text: 'Apagar o atalho da Área de Trabalho',
            bucket: 'nao-remove',
            feedback: 'O atalho é só um apontador. O programa continua instalado, ocupando espaço.',
          },
          {
            id: 'pasta',
            text: 'Excluir a pasta do programa em Arquivos de Programas',
            bucket: 'nao-remove',
            feedback:
              'Apagar a pasta na mão deixa registros e serviços para trás, e o sistema continua achando que o programa existe, o que pode gerar erros.',
          },
          {
            id: 'desafixar',
            text: 'Desafixar o ícone da barra de tarefas',
            bucket: 'nao-remove',
            feedback: 'Desafixar só tira o ícone da barra; o programa continua no computador.',
          },
        ],
      },
      {
        id: 'faxina-apps',
        kind: 'settings',
        title: 'Faxina de programas',
        context:
          'O notebook está lotado de programas. Um "otimizador" que você não lembra de ter instalado exibe alertas assustadores, e uma barra de pesquisa veio de carona com outro instalador.',
        prompt:
          'Desinstale o **PC Turbo Otimizador Pro** e a **Barra de Pesquisa ZapSearch**. Não remova componentes de que o sistema e outros programas dependem.',
        hint: 'Desconfie do que ninguém instalou de propósito. Drivers e pacotes de bibliotecas, por outro lado, sustentam outras partes do sistema.',
        explanation:
          'Programas que chegam de carona em outros instaladores, ou que exibem alertas alarmantes para vender uma versão paga, são candidatos naturais à remoção. Já **drivers** (que fazem o hardware funcionar) e **pacotes redistribuíveis** (bibliotecas usadas por vários programas) devem ficar: removê-los pode deixar o computador sem som ou impedir outros programas de abrir.',
        concept: 'desinstalacao',
        panels: [
          {
            id: 'apps',
            title: 'Aplicativos > Aplicativos instalados',
            groups: [
              {
                title: 'Aplicativos',
                controls: [
                  {
                    id: 'pc-turbo',
                    type: 'app',
                    label: 'PC Turbo Otimizador Pro',
                    description: 'Instalado junto com outro programa',
                    publisher: 'TurboSoft Ltd.',
                    sizeMb: 212,
                    initial: 'installed',
                  },
                  {
                    id: 'zapsearch',
                    type: 'app',
                    label: 'Barra de Pesquisa ZapSearch',
                    description: 'Instalado junto com outro programa',
                    publisher: 'ZapSearch Inc.',
                    sizeMb: 38,
                    initial: 'installed',
                  },
                  {
                    id: 'realtek',
                    type: 'app',
                    label: 'Driver de Áudio Realtek',
                    publisher: 'Realtek Semiconductor Corp.',
                    sizeMb: 340,
                    initial: 'installed',
                  },
                  {
                    id: 'vcredist',
                    type: 'app',
                    label: 'Microsoft Visual C++ 2015-2022 Redistributable (x64)',
                    publisher: 'Microsoft Corporation',
                    sizeMb: 20,
                    initial: 'installed',
                  },
                  {
                    id: 'chrome',
                    type: 'app',
                    label: 'Google Chrome',
                    publisher: 'Google LLC',
                    sizeMb: 420,
                    initial: 'installed',
                  },
                  {
                    id: 'libreoffice',
                    type: 'app',
                    label: 'LibreOffice',
                    publisher: 'The Document Foundation',
                    sizeMb: 780,
                    initial: 'installed',
                  },
                ],
              },
            ],
          },
        ],
        goals: [
          { control: 'pc-turbo', op: 'eq', value: 'removed', label: 'Desinstale o PC Turbo Otimizador Pro' },
          { control: 'zapsearch', op: 'eq', value: 'removed', label: 'Desinstale a Barra de Pesquisa ZapSearch' },
        ],
        forbidden: [
          {
            control: 'realtek',
            op: 'eq',
            value: 'removed',
            reason: 'Esse é o driver de áudio: sem ele, o computador pode ficar sem som.',
          },
          {
            control: 'vcredist',
            op: 'eq',
            value: 'removed',
            reason:
              'Os pacotes redistribuíveis do Visual C++ são usados por vários programas; removê-los pode impedir que eles abram.',
          },
        ],
      },
    ],
    debrief:
      'Instalar com segurança é escolher a origem oficial, conferir o editor na janela de permissão e ler as telas do instalador. Remover é usar o desinstalador, pelas Configurações ou pelo próprio programa, e não apagar pastas ou atalhos. E nem tudo que parece estranho na lista é dispensável: drivers e bibliotecas sustentam o resto do sistema.',
  },

  // -------------------------------------------------------------------------
  // s05 — Atalhos do sistema
  // -------------------------------------------------------------------------
  {
    id: 's05-atalhos-do-sistema',
    version: 1,
    sector: 'sistema',
    order: 5,
    title: 'Atalhos do sistema',
    summary: 'Troque de janela, mostre a Área de Trabalho, bloqueie a tela e capture trechos sem tirar as mãos do teclado.',
    briefing:
      'Agentes experientes quase não tiram as mãos do teclado. No teclado virtual do Nexo, você vai treinar os atalhos que o sistema reserva para si: trocar de janela, sumir com elas, trancar a máquina e registrar a tela.',
    category: 'teclado',
    subcategory: 'Atalhos do sistema',
    difficulty: 2,
    estimatedMinutes: 6,
    prerequisites: ['s01-sistema-operacional'],
    objectives: [
      'Alternar entre janelas sem o mouse',
      'Mostrar a Área de Trabalho num instante',
      'Bloquear o computador ao se afastar',
      'Capturar um trecho da tela e colá-lo',
    ],
    concepts: ['atalhos-janelas', 'bloquear-tela', 'captura-tela'],
    platformNote:
      'Os atalhos com a tecla Windows ({{Win}}) são exclusivos do Windows. No macOS, os equivalentes usam {{Cmd}}: {{Cmd+Tab}} alterna aplicativos, {{Ctrl+Cmd+Q}} bloqueia a tela e {{Cmd+Shift+4}} captura uma área ({{Cmd+Shift+5}} abre a barra com todas as opções de captura).',
    steps: [
      {
        id: 'alt-tab',
        kind: 'shortcut',
        title: 'Trocar de janela',
        capture: 'virtual',
        context:
          'Você está copiando dados de uma planilha para um e-mail e precisa ir e voltar entre as duas janelas várias vezes.',
        prompt: 'Monte no teclado virtual o atalho que alterna entre as janelas abertas.',
        hint: 'Segure a tecla imediatamente à esquerda da barra de espaço e toque na tecla que fica à esquerda do Q.',
        explanation:
          '{{Alt+Tab}} mostra as janelas abertas; mantendo {{Alt}} pressionado e tocando {{Tab}} várias vezes, você escolhe qual trazer para a frente. Um toque rápido alterna entre as duas últimas janelas, ideal para copiar de um lado e colar no outro.',
        concept: 'atalhos-janelas',
        combos: [{ key: 'tab', alt: true }],
        mac: [{ key: 'tab', meta: true }],
        platformNote: 'No macOS, {{Cmd+Tab}} alterna entre aplicativos, e não entre janelas do mesmo aplicativo.',
      },
      {
        id: 'win-d',
        kind: 'shortcut',
        title: 'Mostrar a Área de Trabalho',
        capture: 'virtual',
        context: 'Há oito janelas abertas e você precisa abrir um arquivo que está na Área de Trabalho.',
        prompt: 'Monte o atalho que esconde todas as janelas e mostra a Área de Trabalho de uma vez.',
        hint: 'Use a tecla com o logotipo do Windows junto com a inicial de "desktop", em inglês.',
        explanation:
          '{{Win+D}} esconde todas as janelas e mostra a Área de Trabalho; pressionar de novo traz tudo de volta como estava. É bem mais rápido do que minimizar janela por janela.',
        concept: 'atalhos-janelas',
        combos: [{ key: 'd', meta: true }],
        mac: [{ key: 'f3', meta: true }],
        platformNote:
          'No macOS, {{Cmd+F3}} (a tecla Mission Control) mostra a mesa; em alguns teclados, {{F11}} faz o mesmo. No trackpad, afaste o polegar de outros três dedos.',
      },
      {
        id: 'win-l',
        kind: 'shortcut',
        title: 'Trancar a máquina',
        capture: 'virtual',
        context: 'Você vai buscar um café e deixar o computador do escritório sozinho por alguns minutos, com o e-mail aberto.',
        prompt: 'Monte o atalho que bloqueia a tela imediatamente.',
        hint: 'Tecla Windows mais a inicial de "lock" (trancar, em inglês).',
        explanation:
          '{{Win+L}} bloqueia a sessão na hora: os programas continuam abertos, mas só quem tem a senha, o PIN ou a biometria volta à área de trabalho. Bloquear ao se afastar, mesmo por pouco tempo, impede que alguém leia, envie ou apague algo em seu nome.',
        concept: 'bloquear-tela',
        combos: [{ key: 'l', meta: true }],
        mac: [{ key: 'q', ctrl: true, meta: true }],
        platformNote: 'No macOS: {{Ctrl+Cmd+Q}}.',
      },
      {
        id: 'captura',
        kind: 'shortcut',
        title: 'Capturar um trecho',
        capture: 'virtual',
        context: 'Uma mensagem de erro apareceu, e o suporte pediu uma imagem só daquela janela, não da tela inteira.',
        prompt: 'Monte o atalho que abre a captura de uma área da tela.',
        hint: 'São três teclas: a tecla Windows, a tecla de maiúsculas e a inicial de "screenshot".',
        explanation:
          '{{Win+Shift+S}} escurece a tela e deixa você escolher entre recorte retangular, de janela, de tela inteira ou à mão livre. A imagem vai para a área de transferência, pronta para colar.',
        concept: 'captura-tela',
        combos: [{ key: 's', meta: true, shift: true }],
        mac: [{ key: '4', meta: true, shift: true }],
        platformNote:
          'No Windows 11, a tecla {{PrintScreen}} também abre a Ferramenta de Captura; no Windows 10, ela copia a tela inteira. No macOS, {{Cmd+Shift+4}} captura uma área e {{Cmd+Shift+5}} abre a barra com todas as opções.',
      },
      {
        id: 'colar-captura',
        kind: 'quiz',
        title: 'Para onde foi a captura?',
        context:
          'Você usou {{Win+Shift+S}} e selecionou a janela do erro. Uma notificação apareceu no canto da tela e sumiu. Agora você quer enviar a imagem ao suporte pelo chat da empresa.',
        prompt: 'Qual é o próximo passo mais rápido?',
        hint: 'Lembre onde ficam as coisas que você copia.',
        explanation:
          'Capturas feitas com {{Win+Shift+S}} vão para a área de transferência e podem ser coladas direto em e-mails, chats e documentos. Nas versões recentes do Windows 11, a Ferramenta de Captura também salva uma cópia em **Imagens > Capturas de Tela**.',
        concept: 'captura-tela',
        options: [
          {
            id: 'colar',
            text: 'Clicar na caixa de mensagem do chat e pressionar Ctrl+V',
            correct: true,
            feedback:
              'Isso. A captura foi copiada para a área de transferência; basta colar onde quiser. Se precisar editar ou salvar, clique na notificação da Ferramenta de Captura.',
          },
          {
            id: 'repetir',
            text: 'Fazer a captura de novo, porque a primeira falhou',
            feedback: 'A captura funcionou: ela só não fica visível na tela. Repetir daria o mesmo resultado.',
          },
          {
            id: 'celular',
            text: 'Tirar uma foto da tela com o celular',
            feedback:
              'Funciona em último caso, mas a imagem sai torta e com reflexo. A captura já feita tem qualidade perfeita e está pronta para colar.',
          },
          {
            id: 'lixeira',
            text: 'Procurar a imagem na Lixeira',
            feedback: 'A Lixeira guarda itens excluídos. A captura acabou de ser feita e está na área de transferência.',
          },
        ],
      },
    ],
    debrief:
      '{{Alt+Tab}} e {{Win+D}} controlam as janelas sem o mouse, {{Win+L}} tranca o computador ao se afastar e {{Win+Shift+S}} captura qualquer trecho da tela direto para a área de transferência. São atalhos que o sistema reserva para si e funcionam com qualquer programa aberto.',
  },

  // -------------------------------------------------------------------------
  // s06 — Janelas e tarefas
  // -------------------------------------------------------------------------
  {
    id: 's06-janelas-e-tarefas',
    version: 1,
    sector: 'sistema',
    order: 6,
    title: 'Janelas e tarefas',
    summary: 'Use o Gerenciador de Tarefas e organize janelas lado a lado e em áreas de trabalho virtuais.',
    briefing:
      'Dez janelas abertas, um programa pesando e prazo apertado. Agente, aprenda a ver o que está rodando no Nexo e a organizar seu espaço de trabalho como uma central de comando.',
    category: 'sistema',
    subcategory: 'Multitarefa',
    difficulty: 2,
    estimatedMinutes: 7,
    prerequisites: ['s05-atalhos-do-sistema'],
    objectives: [
      'Saber o que o Gerenciador de Tarefas faz e como abri-lo',
      'Encaixar janelas lado a lado',
      'Separar contextos com áreas de trabalho virtuais',
    ],
    concepts: ['gerenciador-tarefas', 'multitarefa-janelas'],
    platformNote:
      'No macOS, o equivalente ao Gerenciador de Tarefas é o **Monitor de Atividade**, e {{Cmd+Option+Esc}} abre a janela para forçar o encerramento de apps. As áreas de trabalho virtuais se chamam **Spaces** e ficam no **Mission Control**. Desde o macOS Sequoia, dá para encaixar janelas lado a lado pelo menu **Janela > Mover e Redimensionar** ou arrastando-as até a borda da tela.',
    steps: [
      {
        id: 'gt-funcoes',
        kind: 'quiz',
        title: 'O que ele faz',
        prompt: 'Qual destas tarefas **não** é feita pelo Gerenciador de Tarefas do Windows?',
        hint: 'Uma das ações muda o que está instalado; as outras lidam com o que está rodando.',
        explanation:
          'O Gerenciador de Tarefas mostra tudo o que está em execução e quanto cada item consome. Com ele, você encerra programas travados, acompanha o desempenho e controla o que abre junto com o Windows. Instalar e desinstalar fica nas Configurações.',
        concept: 'gerenciador-tarefas',
        options: [
          {
            id: 'desinstalar',
            text: 'Desinstalar um programa',
            correct: true,
            feedback:
              'Certo. O Gerenciador de Tarefas encerra processos, mas não remove programas. Para desinstalar, use Configurações > Aplicativos.',
          },
          {
            id: 'encerrar',
            text: 'Encerrar um programa que parou de responder',
            feedback: 'Ele faz isso, sim: na página Processos, selecione o programa e clique em Finalizar tarefa.',
          },
          {
            id: 'recursos',
            text: 'Mostrar quanto de processador e memória cada programa usa',
            feedback:
              'Ele faz isso, sim: as colunas CPU e Memória mostram o consumo de cada processo, e a página Desempenho mostra o total.',
          },
          {
            id: 'inicializacao',
            text: 'Impedir que um programa abra sozinho quando o Windows inicia',
            feedback: 'Ele faz isso, sim, na página Aplicativos de inicialização.',
          },
        ],
      },
      {
        id: 'abrir-gt',
        kind: 'shortcut',
        title: 'Abrir o Gerenciador',
        capture: 'virtual',
        context: 'Um programa congelou e a tela está demorando para responder aos cliques.',
        prompt: 'Monte o atalho que abre o Gerenciador de Tarefas diretamente.',
        hint: 'São três teclas: Ctrl, a tecla de maiúsculas e a tecla que cancela as coisas.',
        explanation:
          '{{Ctrl+Shift+Esc}} abre o Gerenciador de Tarefas direto, sem passar por menus, o que é útil justamente quando a tela está lenta e cada clique conta. Outra opção é {{Ctrl+Alt+Delete}}, que abre uma tela com o Gerenciador entre as opções.',
        concept: 'gerenciador-tarefas',
        combos: [{ key: 'escape', ctrl: true, shift: true }],
        mac: [{ key: 'escape', meta: true, alt: true }],
        platformNote:
          'No macOS, {{Cmd+Option+Esc}} abre a janela Forçar Encerrar Aplicativos; o Monitor de Atividade fica em Aplicativos > Utilitários.',
      },
      {
        id: 'snap',
        kind: 'order',
        title: 'Lado a lado',
        context: 'Você precisa ler um artigo no navegador enquanto escreve um resumo no editor de texto.',
        prompt: 'Coloque em ordem os passos para deixar as duas janelas lado a lado com o recurso de encaixe (Snap) do Windows.',
        hint: 'Primeiro escolha qual janela vai encaixar; depois, o Windows sugere o que colocar no espaço que sobra.',
        explanation:
          'O Snap divide a tela sem que você precise redimensionar janelas à mão. Depois de encaixar uma janela, o Assistente de Snap oferece as outras para completar o espaço. No Windows 11, passar o mouse sobre o botão maximizar mostra layouts prontos com duas, três ou quatro janelas.',
        concept: 'multitarefa-janelas',
        items: [
          { id: 'ativar', text: 'Clique na janela do navegador para deixá-la em primeiro plano' },
          { id: 'atalho', text: 'Pressione a tecla Windows junto com a seta para a esquerda' },
          {
            id: 'encaixa',
            text: 'O navegador ocupa a metade esquerda, e o Windows mostra miniaturas das outras janelas no lado direito',
          },
          { id: 'escolher', text: 'Clique na miniatura do editor de texto para que ele preencha a metade direita' },
        ],
      },
      {
        id: 'win-seta',
        kind: 'shortcut',
        title: 'Encaixar pelo teclado',
        capture: 'virtual',
        windowsOnly: true,
        context: 'O editor de texto está em primeiro plano e você quer colocá-lo na metade esquerda da tela.',
        prompt: 'Monte o atalho que encaixa a janela ativa na metade esquerda da tela.',
        hint: 'Tecla Windows junto com uma das setas: qual delas aponta para o lado desejado?',
        explanation:
          '{{Win+←}} e {{Win+→}} encaixam a janela em cada metade da tela; {{Win+↑}} maximiza e {{Win+↓}} restaura ou minimiza. Combinados, eles organizam a tela em segundos.',
        concept: 'multitarefa-janelas',
        combos: [{ key: 'arrowleft', meta: true }],
        platformNote:
          'Atalho exclusivo do Windows. No macOS Sequoia ou posterior, use o menu **Janela > Mover e Redimensionar** ou arraste a janela até a borda da tela; em versões anteriores, mantenha o ponteiro sobre o botão verde da janela para ver as opções.',
      },
      {
        id: 'areas-virtuais',
        kind: 'quiz',
        title: 'Dois mundos, uma tela',
        context:
          'No mesmo notebook, você tem janelas do trabalho (planilhas, e-mail corporativo) e pessoais (música, compras). Quer alternar entre os dois conjuntos inteiros sem fechar nada.',
        prompt: 'Qual recurso do sistema serve para isso?',
        hint: 'O sistema permite ter mais de uma mesa de trabalho, cada uma com suas próprias janelas.',
        explanation:
          'Áreas de trabalho virtuais funcionam como mesas separadas no mesmo computador: cada uma guarda suas janelas, e você alterna entre elas com um atalho. São ótimas para separar trabalho e lazer, ou projetos diferentes, sem fechar nada.',
        concept: 'multitarefa-janelas',
        options: [
          {
            id: 'virtuais',
            text: 'Áreas de trabalho virtuais, criadas na Visão de Tarefas',
            correct: true,
            feedback:
              'Isso. Cada área de trabalho virtual tem seu próprio conjunto de janelas. No Windows, {{Win+Tab}} abre a Visão de Tarefas, {{Win+Ctrl+D}} cria uma nova área e {{Win+Ctrl+→}} alterna entre elas.',
          },
          {
            id: 'conta',
            text: 'Criar uma segunda conta de usuário só para o trabalho',
            feedback:
              'Contas separadas isolam arquivos e configurações, mas trocar de conta é lento e exige sair ou alternar a sessão. Para separar janelas, existe um recurso mais leve.',
          },
          {
            id: 'minimizar',
            text: 'Minimizar as janelas pessoais sempre que for trabalhar',
            feedback:
              'Funciona, mas é manual, e as janelas continuam misturadas na barra de tarefas e no {{Alt+Tab}}.',
          },
          {
            id: 'monitor',
            text: 'Comprar um segundo monitor',
            feedback:
              'Um segundo monitor amplia o espaço, mas não separa contextos. Além disso, há uma solução gratuita no próprio sistema.',
          },
        ],
      },
    ],
    debrief:
      'O Gerenciador de Tarefas ({{Ctrl+Shift+Esc}}) mostra o que está rodando, quanto consome e encerra o que travou. Para organizar o espaço, o Snap ({{Win+←}} e {{Win+→}}) divide a tela e as áreas de trabalho virtuais separam contextos inteiros. Menos tempo procurando janelas, mais tempo trabalhando.',
  },

  // -------------------------------------------------------------------------
  // s07 — Contas e permissões
  // -------------------------------------------------------------------------
  {
    id: 's07-contas-e-permissoes',
    version: 1,
    sector: 'sistema',
    order: 7,
    title: 'Contas e permissões',
    summary: 'Entenda a diferença entre administrador e conta padrão e lide com bloqueios de permissão sem abrir brechas.',
    briefing:
      'Nem todo usuário do Nexo deve ter as chaves de todas as portas. Agente, descubra quem pode fazer o quê no sistema e como resolver um bloqueio de permissão sem criar uma brecha de segurança.',
    category: 'sistema',
    subcategory: 'Contas de usuário',
    difficulty: 3,
    estimatedMinutes: 8,
    prerequisites: ['s04-instalar-e-remover'],
    objectives: [
      'Diferenciar conta de administrador e conta padrão',
      'Saber quais ações exigem privilégios de administrador',
      'Compartilhar o computador com segurança',
      'Resolver um bloqueio de permissão do jeito certo',
    ],
    concepts: ['contas-permissoes'],
    platformNote:
      'No Windows 11, as contas ficam em **Configurações > Contas > Outros usuários** (ou **Família**, para contas de crianças com controle parental), e não existe mais a conta Convidado. No macOS, use **Ajustes do Sistema > Usuários e Grupos**, onde ainda há a opção de usuário convidado.',
    steps: [
      {
        id: 'conta-padrao',
        kind: 'quiz',
        title: 'Administrador no dia a dia?',
        context:
          'Você é o dono do computador e tem uma única conta, de administrador. Um amigo da área de TI sugere criar uma conta padrão para o uso diário e guardar a de administrador só para instalações e ajustes.',
        prompt: 'Qual é a principal vantagem dessa sugestão?',
        hint: 'Pense no que um programa consegue fazer quando roda com todos os privilégios.',
        explanation:
          'Contas de **administrador** podem instalar programas, alterar configurações do sistema e mexer em arquivos de outros usuários. Contas **padrão** usam o computador normalmente, mas pedem a senha de um administrador para mudanças importantes. Usar a conta padrão no dia a dia limita o estrago de erros e de programas maliciosos.',
        concept: 'contas-permissoes',
        options: [
          {
            id: 'limita',
            text: 'Um programa malicioso aberto por engano tem menos poder sobre o sistema, e mudanças importantes passam a exigir a senha de administrador',
            correct: true,
            feedback:
              'Isso. Na conta padrão, alterações no sistema exigem as credenciais de um administrador, o que cria uma barreira extra contra erros e ameaças.',
          },
          {
            id: 'rapido',
            text: 'O computador fica mais rápido',
            feedback: 'O tipo de conta não muda o desempenho. A vantagem é de segurança.',
          },
          {
            id: 'antivirus',
            text: 'Dispensa o uso de antivírus',
            feedback: 'A conta padrão reduz riscos, mas não substitui o antivírus. As proteções se somam.',
          },
          {
            id: 'rastreio',
            text: 'Impede que sites rastreiem sua navegação',
            feedback:
              'O tipo de conta não influencia o rastreamento na web. Ele controla o que você pode alterar no sistema.',
          },
        ],
      },
      {
        id: 'quem-pode',
        kind: 'classify',
        title: 'Quem pode fazer?',
        prompt: 'Classifique cada ação: uma conta padrão consegue fazer sozinha ou é preciso um administrador?',
        hint: 'O que afeta só você costuma ser liberado; o que afeta o computador inteiro ou outras pessoas, não.',
        explanation:
          'A regra geral: mudanças que afetam só a sua conta são livres; mudanças que afetam o sistema ou outros usuários exigem administrador. Essa separação protege cada pessoa e o próprio computador.',
        concept: 'contas-permissoes',
        buckets: [
          { id: 'padrao', label: 'Conta padrão consegue' },
          { id: 'admin', label: 'Exige administrador' },
        ],
        items: [
          {
            id: 'papel-parede',
            text: 'Trocar o papel de parede da própria conta',
            bucket: 'padrao',
            feedback: 'Personalizações da própria conta não afetam outros usuários, então a conta padrão pode fazê-las.',
          },
          {
            id: 'salvar',
            text: 'Salvar arquivos na própria pasta Documentos',
            bucket: 'padrao',
            feedback: 'Cada usuário tem controle total sobre as próprias pastas.',
          },
          {
            id: 'senha',
            text: 'Alterar a própria senha',
            bucket: 'padrao',
            feedback: 'Cada usuário pode trocar a própria senha, sabendo a senha atual.',
          },
          {
            id: 'nova-conta',
            text: 'Criar uma nova conta de usuário',
            bucket: 'admin',
            feedback: 'Gerenciar contas afeta o computador inteiro, por isso exige administrador.',
          },
          {
            id: 'instalar-todos',
            text: 'Instalar um programa para todos os usuários',
            bucket: 'admin',
            feedback:
              'Instalações para todo o sistema gravam em pastas protegidas e pedem as credenciais de um administrador.',
          },
          {
            id: 'pasta-outro',
            text: 'Abrir os arquivos da pasta pessoal de outro usuário',
            bucket: 'admin',
            feedback:
              'As pastas de cada usuário são protegidas. Só um administrador consegue acessar as de outra pessoa, e o sistema pede confirmação.',
          },
          {
            id: 'firewall',
            text: 'Alterar as configurações do Firewall do Windows',
            bucket: 'admin',
            feedback: 'Configurações de segurança do sistema afetam todos os usuários e exigem administrador.',
          },
        ],
      },
      {
        id: 'compartilhar',
        kind: 'quiz',
        title: 'Visita no notebook',
        context:
          'Seu sobrinho de 15 anos vai passar uma semana na sua casa e precisa usar seu notebook para os trabalhos da escola.',
        prompt: 'Qual é a melhor forma de compartilhar o computador?',
        hint: 'Cada pessoa deveria ter o próprio espaço, com o mínimo de privilégios necessário.',
        explanation:
          'O princípio do **menor privilégio** diz que cada pessoa recebe só as permissões de que precisa. Contas separadas mantêm isolados os arquivos, as senhas salvas e o histórico de cada um, e a conta padrão impede alterações no sistema.',
        concept: 'contas-permissoes',
        options: [
          {
            id: 'conta-propria',
            text: 'Criar uma conta padrão separada para ele, com senha própria',
            correct: true,
            feedback:
              'Isso. Ele terá área de trabalho, arquivos e navegador próprios, sem acesso aos seus e sem poder alterar o sistema. Para crianças, as contas de Família ainda permitem controles parentais.',
          },
          {
            id: 'sua-senha',
            text: 'Passar a sua senha para ele usar a sua conta',
            feedback:
              'Na sua conta, ele teria acesso aos seus e-mails, senhas salvas e arquivos, e qualquer ação ficaria em seu nome.',
          },
          {
            id: 'admin',
            text: 'Criar uma conta de administrador para ele',
            feedback:
              'Ele não precisa instalar programas nem mudar o sistema. Dar mais privilégios do que o necessário só aumenta o risco.',
          },
          {
            id: 'ocultar',
            text: 'Usar a sua conta, mas ocultar suas pastas pessoais',
            feedback:
              'Pastas ocultas são fáceis de exibir e não protegem seus e-mails, seu histórico e as senhas salvas no navegador.',
          },
        ],
      },
      {
        id: 'bloqueio-impressora',
        kind: 'diagnosis',
        title: 'Bloqueio de permissão',
        prompt: 'Resolva a situação de forma segura, escolhendo uma ação por vez.',
        hint: 'Verifique antes de agir e lembre quem é o responsável pelos computadores da empresa.',
        explanation:
          'Pedidos de credenciais de administrador são uma proteção, não um defeito. Em computadores gerenciados por uma empresa, o caminho certo é verificar o que já existe e acionar quem administra a máquina, nunca contornar o bloqueio ou compartilhar senhas.',
        concept: 'contas-permissoes',
        symptom:
          'No computador do escritório, você tenta instalar o programa da nova impressora e o Windows pede um nome de usuário e uma senha de administrador que você não tem.',
        startStage: 'inicio',
        stages: [
          {
            id: 'inicio',
            situation: 'A janela de permissão está aberta, pedindo as credenciais de um administrador.',
            evidence: [
              'Sua conta: usuário padrão',
              'Computador gerenciado pela equipe de TI da empresa',
              'Mensagem: "Para continuar, digite um nome de usuário e uma senha de administrador."',
            ],
            actions: [
              {
                id: 'verificar',
                label:
                  'Cancelar e conferir em Configurações > Bluetooth e dispositivos > Impressoras e scanners se a impressora já está disponível',
                result:
                  'Você cancela a janela e confere a lista: a impressora nova não aparece. Agora você sabe que ela realmente precisa ser instalada.',
                quality: 'best',
                next: 'nao-instalada',
              },
              {
                id: 'reiniciar',
                label: 'Reiniciar o computador e tentar de novo',
                result: 'Depois de reiniciar, o mesmo pedido aparece. Reiniciar não muda o tipo da sua conta.',
                quality: 'poor',
              },
              {
                id: 'ferramenta',
                label: 'Baixar uma ferramenta da internet que promete remover a senha de administrador',
                result:
                  'Ferramentas desse tipo violam as regras da empresa, costumam trazer programas maliciosos e expõem toda a rede. É o tipo de atalho que vira incidente de segurança.',
                quality: 'harmful',
              },
              {
                id: 'chutar',
                label: 'Tentar senhas comuns, como "admin123"',
                result:
                  'Tentativas repetidas podem bloquear contas e disparar alertas de segurança. Além disso, tentar entrar numa conta que não é sua é uma violação séria.',
                quality: 'harmful',
              },
            ],
          },
          {
            id: 'nao-instalada',
            situation: 'A impressora não está instalada, e sua conta não tem permissão para instalá-la.',
            evidence: [
              'Modelo da impressora: anotado na etiqueta do aparelho',
              'Lista de impressoras do computador: a nova não aparece',
            ],
            actions: [
              {
                id: 'chamado',
                label: 'Abrir um chamado com a TI informando o modelo da impressora e a mensagem exibida',
                result:
                  'A TI instala o driver remotamente, com uma conta de administrador. Em minutos, a impressora aparece na lista e você imprime normalmente.',
                quality: 'best',
                resolves: true,
              },
              {
                id: 'gestor',
                label: 'Avisar seu gestor e pedir que ele solicite a instalação à TI',
                result:
                  'Funciona, mas demora mais, porque o pedido passa por uma pessoa a mais. Abrir o chamado direto, com os detalhes, costuma ser mais rápido.',
                quality: 'good',
                resolves: true,
              },
              {
                id: 'colega',
                label: 'Pedir emprestada a senha de administrador de um colega',
                result:
                  'Compartilhar credenciais quebra a política de segurança: tudo o que for feito com aquela senha fica registrado em nome do colega, e a senha passa a circular.',
                quality: 'harmful',
              },
              {
                id: 'pendrive',
                label: 'Copiar os arquivos para um pendrive pessoal e imprimir em casa',
                result:
                  'Resolve hoje, mas levar arquivos da empresa num pendrive pessoal pode violar regras de proteção de dados, e o problema continua amanhã.',
                quality: 'poor',
              },
            ],
          },
        ],
      },
    ],
    debrief:
      'Contas separam pessoas e privilégios: administradores mudam o sistema, contas padrão usam o computador com segurança. Use a conta padrão no dia a dia, crie contas próprias para quem compartilha o computador e, diante de um bloqueio de permissão, verifique e acione o responsável, nunca contorne a proteção.',
  },
];
