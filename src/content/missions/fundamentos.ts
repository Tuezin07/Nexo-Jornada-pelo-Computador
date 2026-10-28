import type { MissionDefinition } from '../types';

export const FUNDAMENTOS_MISSIONS: MissionDefinition[] = [
  // -------------------------------------------------------------------------
  // f01 — Primeiro contato
  // -------------------------------------------------------------------------
  {
    id: 'f01-primeiro-contato',
    version: 1,
    sector: 'fundamentos',
    order: 1,
    title: 'Primeiro contato',
    summary: 'Reconheça as peças principais do computador e os dispositivos que enviam e recebem informações.',
    briefing:
      'Agente, sua primeira tarefa no Nexo é reconhecer o terreno. Toda máquina tem peças que executam, peças que lembram e peças que conversam com você. Identifique cada uma antes de seguir em frente.',
    category: 'hardware',
    subcategory: 'Componentes e periféricos',
    difficulty: 1,
    estimatedMinutes: 5,
    prerequisites: [],
    objectives: [
      'Diferenciar hardware de software',
      'Entender o papel do processador, da memória RAM e do armazenamento',
      'Classificar periféricos como de entrada, de saída ou ambos',
    ],
    concepts: ['hardware-componentes', 'perifericos-entrada-saida'],
    steps: [
      {
        id: 'hw-sw',
        kind: 'classify',
        title: 'Peça ou programa?',
        prompt:
          'Separe o que é **hardware** (parte física, que dá para tocar) do que é **software** (programas e instruções).',
        hint: 'Pergunte-se: dá para segurar isso na mão ou é algo que você instala e abre na tela?',
        explanation:
          'Hardware é tudo o que é físico: peças internas e aparelhos conectados. Software são os programas que dizem ao hardware o que fazer, do sistema operacional ao navegador. Um não funciona sem o outro.',
        concept: 'hardware-componentes',
        buckets: [
          { id: 'hardware', label: 'Hardware', description: 'Parte física' },
          { id: 'software', label: 'Software', description: 'Programas e instruções' },
        ],
        items: [
          {
            id: 'ram',
            text: 'Memória RAM',
            bucket: 'hardware',
            feedback: 'A RAM é um módulo de memória encaixado na placa-mãe: uma peça física.',
          },
          {
            id: 'ssd',
            text: 'SSD',
            bucket: 'hardware',
            feedback: 'O SSD é a unidade física onde os arquivos ficam guardados.',
          },
          {
            id: 'placa-video',
            text: 'Placa de vídeo',
            bucket: 'hardware',
            feedback: 'É uma placa (ou um chip) que gera as imagens enviadas ao monitor.',
          },
          {
            id: 'teclado',
            text: 'Teclado',
            bucket: 'hardware',
            feedback: 'O teclado é um aparelho físico conectado ao computador.',
          },
          {
            id: 'navegador',
            text: 'Navegador de internet',
            bucket: 'software',
            feedback: 'O navegador é um programa: você instala, abre e atualiza.',
          },
          {
            id: 'windows',
            text: 'Windows',
            bucket: 'software',
            feedback: 'O Windows é o sistema operacional, um software que controla o hardware.',
          },
          {
            id: 'planilhas',
            text: 'Editor de planilhas',
            bucket: 'software',
            feedback: 'Programas como Excel ou Planilhas Google são software.',
          },
        ],
      },
      {
        id: 'processador',
        kind: 'quiz',
        title: 'Quem executa',
        context: 'Na loja, o vendedor compara dois notebooks: "Este aqui tem um processador mais rápido."',
        prompt: 'Qual é a função do processador (CPU)?',
        hint: 'Pense em quem faz o trabalho, não em quem guarda ou transmite os dados.',
        explanation:
          'O processador (CPU) executa as instruções dos programas, bilhões de vezes por segundo. Ele trabalha junto com a RAM, que guarda o que está em uso, e com o armazenamento, que guarda tudo de forma permanente.',
        concept: 'hardware-componentes',
        options: [
          {
            id: 'executar',
            text: 'Executar as instruções dos programas, fazendo os cálculos de que o computador precisa',
            correct: true,
            feedback:
              'Isso. A CPU executa as instruções: quanto mais rápida, mais depressa os programas respondem.',
          },
          {
            id: 'guardar',
            text: 'Guardar os arquivos mesmo quando o computador está desligado',
            feedback: 'Esse é o papel do armazenamento (SSD ou HD). O processador não guarda arquivos.',
          },
          {
            id: 'abertos',
            text: 'Manter os programas abertos enquanto você os usa',
            feedback:
              'Quem guarda temporariamente os programas abertos é a memória RAM. A CPU trabalha com esses dados, mas não é onde eles ficam.',
          },
          {
            id: 'internet',
            text: 'Conectar o computador à internet',
            feedback:
              'Quem faz isso é o adaptador de rede (Wi-Fi ou cabo). O processador apenas processa os dados que chegam por ele.',
          },
        ],
      },
      {
        id: 'ram',
        kind: 'quiz',
        title: 'Memória que esquece',
        context:
          'O anúncio do notebook diz: "8 GB de RAM e 256 GB de SSD". Você está escrevendo um texto que ainda não salvou quando a energia acaba.',
        prompt: 'O que acontece com o texto que estava apenas na memória RAM?',
        hint: 'Lembre a diferença entre a memória de trabalho e o lugar onde os arquivos ficam guardados.',
        explanation:
          'A RAM é a memória de trabalho: rápida, mas temporária. O SSD ou HD é o armazenamento permanente, onde ficam os arquivos salvos. Mais RAM ajuda a manter vários programas abertos; mais armazenamento permite guardar mais arquivos.',
        concept: 'hardware-componentes',
        options: [
          {
            id: 'perde',
            text: 'Ele se perde, porque a RAM só guarda dados enquanto o computador está ligado',
            correct: true,
            feedback:
              'Exato. A RAM é volátil: sem energia, o conteúdo dela some. Por isso salvar com frequência é tão importante.',
          },
          {
            id: 'ssd',
            text: 'Ele é gravado automaticamente no SSD no instante em que a energia cai',
            feedback:
              'Não há tempo para isso quando a energia cai. Alguns programas fazem salvamento automático de tempos em tempos, mas o que estava só na RAM se perde.',
          },
          {
            id: 'fica',
            text: 'Ele continua na RAM até o computador ser ligado de novo',
            feedback:
              'A RAM não retém dados sem energia. O que permanece depois de desligar é o que foi salvo no armazenamento.',
          },
          {
            id: 'lixeira',
            text: 'Ele vai para a Lixeira',
            feedback:
              'A Lixeira guarda arquivos excluídos que já estavam salvos. Um texto nunca salvo nem chega a virar arquivo.',
          },
        ],
      },
      {
        id: 'perifericos',
        kind: 'classify',
        title: 'Entrada e saída',
        prompt:
          'Classifique cada dispositivo: ele envia informações para o computador (entrada), recebe informações dele (saída) ou faz as duas coisas?',
        hint: 'Pense na direção da informação: do mundo para o computador, do computador para você, ou nos dois sentidos.',
        explanation:
          'Periféricos de entrada levam informações para o computador; os de saída trazem o resultado até você. Alguns aparelhos combinam as duas funções, como telas sensíveis ao toque, headsets e impressoras multifuncionais com scanner.',
        concept: 'perifericos-entrada-saida',
        buckets: [
          { id: 'entrada', label: 'Entrada', description: 'Envia dados ao computador' },
          { id: 'saida', label: 'Saída', description: 'Mostra ou entrega o resultado' },
          { id: 'ambos', label: 'Entrada e saída', description: 'Faz as duas coisas' },
        ],
        items: [
          {
            id: 'teclado',
            text: 'Teclado',
            bucket: 'entrada',
            feedback: 'O teclado envia ao computador as teclas que você pressiona.',
          },
          {
            id: 'mouse',
            text: 'Mouse',
            bucket: 'entrada',
            feedback: 'O mouse envia movimentos e cliques ao computador.',
          },
          {
            id: 'microfone',
            text: 'Microfone',
            bucket: 'entrada',
            feedback: 'O microfone capta sua voz e a envia ao computador.',
          },
          {
            id: 'webcam',
            text: 'Webcam',
            bucket: 'entrada',
            feedback: 'A webcam captura imagens e as envia ao computador.',
          },
          {
            id: 'monitor',
            text: 'Monitor comum',
            bucket: 'saida',
            feedback: 'O monitor exibe o que o computador produz; ele não envia dados de volta.',
          },
          {
            id: 'impressora',
            text: 'Impressora simples (sem scanner)',
            bucket: 'saida',
            feedback: 'A impressora recebe o documento do computador e o coloca no papel.',
          },
          {
            id: 'caixa-som',
            text: 'Caixa de som',
            bucket: 'saida',
            feedback: 'A caixa de som reproduz o áudio que vem do computador.',
          },
          {
            id: 'touch',
            text: 'Tela sensível ao toque',
            bucket: 'ambos',
            feedback: 'A tela touch mostra a imagem (saída) e capta seus toques (entrada).',
          },
          {
            id: 'headset',
            text: 'Headset com microfone',
            bucket: 'ambos',
            feedback: 'O fone toca o som (saída) e o microfone embutido capta sua voz (entrada).',
          },
        ],
      },
    ],
    debrief:
      'O computador combina hardware (as peças) e software (os programas). A CPU executa, a RAM guarda temporariamente o que está em uso e o armazenamento guarda seus arquivos de forma permanente. Os periféricos fazem a ponte entre você e a máquina, levando ou trazendo informações.',
  },

  // -------------------------------------------------------------------------
  // f02 — Teclas essenciais
  // -------------------------------------------------------------------------
  {
    id: 'f02-teclas-essenciais',
    version: 1,
    sector: 'fundamentos',
    order: 2,
    title: 'Teclas essenciais',
    summary: 'Use as teclas que apagam, cancelam, avançam entre campos e criam letras maiúsculas.',
    briefing:
      'O teclado é o painel de comando do Nexo, e algumas teclas aparecem em praticamente toda tarefa. Agente, sua missão é dominá-las até que seus dedos as encontrem sem hesitar.',
    category: 'teclado',
    subcategory: 'Teclas básicas',
    difficulty: 1,
    estimatedMinutes: 5,
    prerequisites: [],
    objectives: [
      'Diferenciar Backspace de Delete',
      'Cancelar com Esc e avançar entre campos com Tab',
      'Usar Shift e reconhecer o Caps Lock ativado',
    ],
    concepts: ['teclas-essenciais'],
    platformNote:
      'Em teclados de Mac, a tecla chamada **delete** funciona como o Backspace do Windows (apaga à esquerda). Para apagar à direita, use {{Fn+Delete}}. Esc, Tab e Shift funcionam igual nos dois sistemas.',
    steps: [
      {
        id: 'backspace-delete',
        kind: 'quiz',
        title: 'Apagar para que lado?',
        context: 'Você digitou uma palavra com uma letra a mais no final. O cursor de texto (a barrinha que pisca) está logo depois da letra errada.',
        prompt: 'Qual tecla apaga o caractere que está à **esquerda** do cursor?',
        hint: 'Uma das teclas apaga "para trás" e outra apaga "para a frente".',
        explanation:
          'Backspace apaga à esquerda do cursor; Delete apaga à direita. Com um arquivo ou ícone selecionado, Delete também serve para excluí-lo. Conhecer as duas evita ficar movendo o cursor à toa.',
        concept: 'teclas-essenciais',
        options: [
          {
            id: 'backspace',
            text: 'Backspace (a tecla com uma seta para a esquerda, acima do Enter)',
            correct: true,
            feedback: 'Isso. O Backspace apaga o que está antes do cursor, ou seja, à esquerda.',
          },
          {
            id: 'delete',
            text: 'Delete (Del)',
            feedback:
              'O Delete apaga o caractere à direita do cursor, o que vem depois dele. É útil quando o cursor está antes do erro.',
          },
          {
            id: 'esc',
            text: 'Esc',
            feedback: 'O Esc cancela ou fecha algo, como um menu ou uma caixa de diálogo. Ele não apaga texto.',
          },
          {
            id: 'home',
            text: 'Home',
            feedback: 'O Home leva o cursor para o início da linha, sem apagar nada.',
          },
        ],
      },
      {
        id: 'esc',
        kind: 'shortcut',
        title: 'Cancelar',
        capture: 'real',
        context: 'Um menu se abriu por engano e está cobrindo a área onde você trabalhava.',
        prompt: 'Pressione a tecla que cancela e fecha menus e caixas de diálogo sem confirmar nada.',
        hint: 'Ela fica no canto superior esquerdo do teclado, e o nome vem de "escape" (escapar).',
        explanation:
          '{{Esc}} é a tecla do "deixa pra lá": fecha menus, cancela caixas de diálogo e sai da tela cheia em vídeos e apresentações. Diante de uma janela que você não entendeu, ela é mais segura do que clicar num botão qualquer, porque não confirma nada.',
        concept: 'teclas-essenciais',
        combos: [{ key: 'escape' }],
        practiceText: 'Menu aberto por engano: Copiar | Colar | Excluir | Propriedades',
      },
      {
        id: 'tab',
        kind: 'shortcut',
        title: 'Próximo campo',
        capture: 'real',
        context: 'Você está preenchendo um cadastro: já digitou o nome e agora precisa ir para o campo de e-mail.',
        prompt: 'Pressione a tecla que leva o cursor para o próximo campo do formulário.',
        hint: 'Ela fica à esquerda da letra Q e costuma ter duas setinhas desenhadas.',
        explanation:
          '{{Tab}} avança para o próximo campo, botão ou link; {{Shift+Tab}} volta para o anterior. Em editores de texto, Tab também cria um recuo no início do parágrafo.',
        concept: 'teclas-essenciais',
        combos: [{ key: 'tab' }],
        practiceText: 'Nome: Ana Souza | E-mail: ____ | Telefone: ____',
      },
      {
        id: 'shift',
        kind: 'shortcut',
        title: 'Uma maiúscula',
        capture: 'real',
        context: 'Você vai digitar o nome "Ana" e quer que só a primeira letra seja maiúscula.',
        prompt: 'Segure {{Shift}} e pressione a letra **A** para digitar um A maiúsculo.',
        hint: 'O Shift tem uma seta grossa apontando para cima, e há um de cada lado do teclado. Segure-o e, sem soltar, toque na letra.',
        explanation:
          'O Shift vale enquanto você o segura: digite a letra e solte. Ele também dá acesso aos símbolos da parte de cima das teclas, como {{Shift+1}}, que gera o ponto de exclamação. Já o Caps Lock trava as maiúsculas até ser desligado.',
        concept: 'teclas-essenciais',
        combos: [{ key: 'a', shift: true }],
        practiceText: 'Digite a inicial maiúscula do nome: _na',
      },
      {
        id: 'caps-lock',
        kind: 'quiz',
        title: 'Senha recusada',
        context:
          'Você digita sua senha com cuidado, mas o site diz que ela está incorreta. Ao digitar seu e-mail no campo ao lado, ele aparece todo em MAIÚSCULAS.',
        prompt: 'Qual é a causa mais provável?',
        hint: 'Repare na pista do campo de e-mail: algo está alterando todas as letras.',
        explanation:
          'Senhas diferenciam maiúsculas de minúsculas: "casa" e "CASA" são senhas diferentes. O Caps Lock trava as maiúsculas e costuma ser ligado sem querer, porque fica logo acima do Shift esquerdo. Muitos teclados têm uma luz que indica quando ele está ativo.',
        concept: 'teclas-essenciais',
        options: [
          {
            id: 'caps',
            text: 'A tecla Caps Lock está ativada',
            correct: true,
            feedback:
              'Isso. Com o Caps Lock ligado, tudo sai em maiúsculas, inclusive a senha. Desative-o e digite de novo.',
          },
          {
            id: 'shift',
            text: 'A tecla Shift está quebrada',
            feedback:
              'Um Shift travado poderia causar isso, mas é bem mais raro. Comece pelo Caps Lock, que é acionado sem querer com frequência.',
          },
          {
            id: 'invadida',
            text: 'A conta foi invadida e a senha foi trocada',
            feedback:
              'Antes de pensar no pior, observe a pista: o texto inteiro está em maiúsculas. Isso aponta para o teclado, não para a conta.',
          },
          {
            id: 'numlock',
            text: 'O Num Lock está desativado',
            feedback: 'O Num Lock controla o teclado numérico, à direita. Ele não transforma letras em maiúsculas.',
          },
        ],
      },
    ],
    debrief:
      'Backspace apaga à esquerda e Delete à direita. Esc cancela sem confirmar nada, Tab avança entre campos e Shift cria maiúsculas e símbolos. Quando tudo sai em maiúsculas sem você pedir, confira o Caps Lock antes de qualquer outra coisa.',
  },

  // -------------------------------------------------------------------------
  // f03 — Dedos no lugar
  // -------------------------------------------------------------------------
  {
    id: 'f03-dedos-no-lugar',
    version: 1,
    sector: 'fundamentos',
    order: 3,
    title: 'Dedos no lugar',
    summary: 'Adote uma postura confortável e posicione os dedos na fileira base para digitar sem olhar.',
    briefing:
      'Velocidade vem depois; primeiro vem a base. Agente, o Nexo vai calibrar sua posição de digitação: corpo confortável, dedos no lugar certo e olhos na tela.',
    category: 'teclado',
    subcategory: 'Digitação',
    difficulty: 1,
    estimatedMinutes: 7,
    prerequisites: ['f02-teclas-essenciais'],
    objectives: [
      'Adotar uma postura confortável para digitar',
      'Posicionar os dedos na fileira base usando as marcas do F e do J',
      'Digitar sequências da fileira base sem olhar para o teclado',
    ],
    concepts: ['digitacao-postura', 'digitacao-fileira-base'],
    platformNote:
      'Os exercícios seguem o teclado ABNT2, padrão no Brasil, em que o Ç fica na fileira base, à direita do L. Em teclados no padrão americano, essa posição é ocupada pelo ponto e vírgula.',
    steps: [
      {
        id: 'postura',
        kind: 'quiz',
        multiple: true,
        title: 'Posição de trabalho',
        prompt: 'Marque **todas** as práticas que ajudam a digitar por mais tempo sem desconforto.',
        hint: 'Pense no que mantém o corpo em posição neutra, sem tensão nos pulsos, no pescoço e nos ombros.',
        explanation:
          'Uma boa postura evita dores que aparecem depois de semanas de uso: pulsos retos, ombros relaxados, tela na altura dos olhos e pés apoiados. Pausas curtas fazem parte da técnica, não são perda de tempo.',
        concept: 'digitacao-postura',
        options: [
          {
            id: 'pulsos',
            text: 'Manter os pulsos retos, sem dobrá-los para cima nem pressioná-los contra a borda da mesa',
            correct: true,
            feedback: 'Certo. Pulsos dobrados ou apoiados com força na borda da mesa sobrecarregam os tendões.',
          },
          {
            id: 'tela',
            text: 'Deixar o topo da tela mais ou menos na altura dos olhos, a cerca de um braço de distância',
            correct: true,
            feedback: 'Certo. Assim você não precisa inclinar o pescoço para baixo ou para cima o tempo todo.',
          },
          {
            id: 'ombros',
            text: 'Manter os ombros relaxados e os cotovelos junto ao corpo, dobrados em cerca de 90 graus',
            correct: true,
            feedback: 'Certo. Ombros tensos e braços esticados cansam rápido.',
          },
          {
            id: 'olhar',
            text: 'Olhar para o teclado a cada tecla para não errar',
            feedback:
              'Olhar para as teclas o tempo todo força o pescoço e atrasa a digitação. O objetivo é sentir a posição das teclas e manter os olhos na tela.',
          },
          {
            id: 'sem-pausa',
            text: 'Evitar pausas para não perder o ritmo',
            feedback:
              'Pausas curtas a cada hora, alongando as mãos e olhando para longe, previnem dores e cansaço visual.',
          },
        ],
      },
      {
        id: 'marcas',
        kind: 'quiz',
        title: 'As marcas do F e do J',
        prompt: 'Na posição base, onde ficam os dedos indicadores e como encontrá-los sem olhar?',
        hint: 'Passe o dedo na fileira do meio do teclado: duas teclas são diferentes ao toque.',
        explanation:
          'A fileira base é A S D F (mão esquerda) e J K L Ç (mão direita). Os indicadores ficam no F e no J, os polegares no espaço, e cada dedo sai dessa base para alcançar as teclas vizinhas e depois volta para ela.',
        concept: 'digitacao-fileira-base',
        options: [
          {
            id: 'fj',
            text: 'Sobre o F e o J, que têm um pequeno relevo para serem encontrados pelo tato',
            correct: true,
            feedback:
              'Exato. Os relevos no F e no J permitem voltar à posição base sem tirar os olhos da tela.',
          },
          {
            id: 'gh',
            text: 'Sobre o G e o H, as teclas do centro do teclado',
            feedback:
              'G e H também são alcançadas pelos indicadores, mas com um pequeno movimento para o lado. A posição de descanso é no F e no J.',
          },
          {
            id: 'a-c',
            text: 'Sobre o A e o Ç, nas pontas da fileira',
            feedback: 'A e Ç ficam com os dedos mínimos. Os indicadores repousam mais ao centro.',
          },
          {
            id: 'dk',
            text: 'Sobre o D e o K',
            feedback: 'D e K ficam com os dedos médios. Procure o relevo nas teclas vizinhas, mais ao centro.',
          },
        ],
      },
      {
        id: 'base-sequencia',
        kind: 'typing',
        title: 'Fileira base',
        prompt:
          'Com os dedos na fileira base, digite a sequência abaixo sem olhar para o teclado. Se errar, a tecla não avança: corrija e siga em frente.',
        hint: 'Mão esquerda: A S D F (mínimo, anelar, médio e indicador). Mão direita: J K L Ç (indicador, médio, anelar e mínimo). O espaço fica com o polegar.',
        explanation:
          'Cada dedo cuida de uma tecla da fileira base. Repetir sequências curtas cria memória muscular: aos poucos você para de procurar as letras e passa a senti-las.',
        concept: 'digitacao-fileira-base',
        text: 'asdf jklç asdf jklç fdsa çlkj',
        minAccuracy: 0.85,
      },
      {
        id: 'base-palavras',
        kind: 'typing',
        title: 'Palavras na base',
        prompt:
          'Agora, palavras formadas só com letras da fileira base. Use os indicadores para alcançar o G e o H, um pouco mais ao centro.',
        hint: 'O G é alcançado pelo indicador esquerdo e o H pelo indicador direito. Depois de cada um, volte o dedo para o F ou o J.',
        explanation:
          'Os indicadores trabalham em dobro: além do F e do J, cobrem o G e o H. Voltar sempre à posição base depois de cada tecla é o que permite digitar sem olhar.',
        concept: 'digitacao-fileira-base',
        text: 'sala fala gala falha salsa saga fada',
        minAccuracy: 0.85,
      },
    ],
    debrief:
      'Digitar bem começa pela postura e pela posição base: indicadores no F e no J, guiados pelos relevos, e cada dedo responsável pelas teclas vizinhas. Com prática curta e frequente, a velocidade aparece naturalmente; a precisão vem primeiro.',
  },

  // -------------------------------------------------------------------------
  // f04 — Mouse e janelas
  // -------------------------------------------------------------------------
  {
    id: 'f04-mouse-e-janelas',
    version: 1,
    sector: 'fundamentos',
    order: 4,
    title: 'Mouse e janelas',
    summary: 'Escolha a ação de mouse certa para cada situação e controle as janelas com segurança.',
    briefing:
      'Janelas abrem, se sobrepõem e somem atrás umas das outras. Agente, sua missão é controlar o mouse com precisão e domar as janelas do Nexo.',
    category: 'sistema',
    subcategory: 'Mouse e janelas',
    difficulty: 1,
    estimatedMinutes: 6,
    prerequisites: ['f01-primeiro-contato'],
    objectives: [
      'Escolher entre clique, duplo clique, botão direito e arrastar',
      'Usar os botões de minimizar, maximizar e fechar',
      'Mover uma janela pela barra de título',
      'Fechar programas sem perder trabalho',
    ],
    concepts: ['mouse-acoes', 'janelas-controles'],
    platformNote:
      'No Windows, os botões de minimizar, maximizar e fechar ficam no canto superior **direito** da janela. No macOS, ficam no canto superior **esquerdo**, como três círculos: vermelho fecha a janela, amarelo minimiza e verde ativa a tela cheia. No Mac, o clique com o botão direito pode ser feito com {{Ctrl}} + clique ou com dois dedos no trackpad.',
    steps: [
      {
        id: 'acoes-mouse',
        kind: 'classify',
        title: 'Qual clique?',
        prompt: 'Para cada situação, escolha a ação de mouse adequada.',
        hint: 'Abrir itens no Explorador costuma pedir dois cliques; na internet, um basta. Opções extras ficam num menu escondido.',
        explanation:
          'Clique simples seleciona e aciona botões; duplo clique abre arquivos e pastas (e seleciona palavras); o botão direito mostra o menu de contexto; arrastar move itens. Usar o clique errado é a causa de muitas "coisas que não funcionam".',
        concept: 'mouse-acoes',
        buckets: [
          { id: 'clique', label: 'Clique simples' },
          { id: 'duplo', label: 'Duplo clique' },
          { id: 'direito', label: 'Botão direito' },
          { id: 'arrastar', label: 'Arrastar e soltar' },
        ],
        items: [
          {
            id: 'selecionar',
            text: 'Selecionar um arquivo sem abri-lo',
            bucket: 'clique',
            feedback: 'Um clique seleciona o item, que fica destacado, sem abri-lo.',
          },
          {
            id: 'abrir-pasta',
            text: 'Abrir uma pasta no Explorador de Arquivos',
            bucket: 'duplo',
            feedback: 'No Explorador e na Área de Trabalho, pastas e arquivos abrem com duplo clique.',
          },
          {
            id: 'link',
            text: 'Abrir um link em um site',
            bucket: 'clique',
            feedback:
              'Na web, links e botões funcionam com um clique só. O duplo clique pode abrir algo duas vezes ou enviar um formulário em dobro.',
          },
          {
            id: 'menu',
            text: 'Ver opções como Renomear e Propriedades de um arquivo',
            bucket: 'direito',
            feedback: 'O botão direito abre o menu de contexto, com as ações disponíveis para aquele item.',
          },
          {
            id: 'mover',
            text: 'Levar um arquivo de uma pasta para outra',
            bucket: 'arrastar',
            feedback: 'Arrastar e soltar move (ou copia) o item para o lugar onde você soltar.',
          },
          {
            id: 'ok',
            text: 'Confirmar no botão "OK" de uma caixa de diálogo',
            bucket: 'clique',
            feedback: 'Botões funcionam com um clique simples.',
          },
          {
            id: 'palavra',
            text: 'Selecionar uma palavra inteira em um texto',
            bucket: 'duplo',
            feedback:
              'Em textos, o duplo clique seleciona a palavra inteira; o clique triplo costuma selecionar o parágrafo.',
          },
        ],
      },
      {
        id: 'minimizar',
        kind: 'quiz',
        title: 'Sair da frente',
        context:
          'Você está com um documento ocupando a tela inteira e precisa ver um arquivo na Área de Trabalho por um instante, sem fechar o documento.',
        prompt: 'Qual botão do canto da janela é o mais adequado?',
        hint: 'Você quer esconder a janela temporariamente, não encerrá-la.',
        explanation:
          'Os três botões do canto têm funções distintas: minimizar esconde a janela na barra de tarefas, maximizar faz a janela ocupar a tela toda (e restaurar volta ao tamanho anterior) e fechar encerra. A janela minimizada continua aberta, com tudo como estava.',
        concept: 'janelas-controles',
        options: [
          {
            id: 'minimizar',
            text: 'Minimizar (o tracinho)',
            correct: true,
            feedback:
              'Isso. Minimizar esconde a janela na barra de tarefas sem fechá-la. Um clique no ícone dela na barra de tarefas traz tudo de volta.',
          },
          {
            id: 'restaurar',
            text: 'Maximizar/Restaurar (o quadrado)',
            feedback:
              'Esse botão alterna entre ocupar a tela toda e um tamanho menor. A janela continua na frente, cobrindo parte da tela.',
          },
          {
            id: 'fechar',
            text: 'Fechar (o X)',
            feedback:
              'Fechar encerra a janela. Se houver algo não salvo, o programa vai perguntar o que fazer. Para só tirar a janela da frente, fechar é exagero.',
          },
          {
            id: 'arrastar',
            text: 'Arrastar a janela para fora da tela',
            feedback:
              'Dá trabalho, e a janela pode ficar difícil de recuperar. Existe um botão feito exatamente para isso.',
          },
        ],
      },
      {
        id: 'mover-janela',
        kind: 'order',
        title: 'Mover uma janela',
        prompt: 'Coloque em ordem os passos para mover uma janela que está ocupando a tela inteira para outro lugar.',
        hint: 'Uma janela que ocupa a tela toda não tem para onde ir. E o ponto de "pegar" a janela fica no topo dela.',
        explanation:
          'A barra de título é a alça da janela: clique, segure, arraste e solte. No Windows, levar a janela até a borda da tela faz ela se encaixar em metade da tela, e arrastar uma janela maximizada pela barra de título também a restaura automaticamente.',
        concept: 'janelas-controles',
        items: [
          { id: 'restaurar', text: 'Clique em Restaurar para a janela ficar menor que a tela' },
          { id: 'apontar', text: 'Posicione o ponteiro na barra de título, a faixa no topo da janela' },
          { id: 'segurar', text: 'Pressione e mantenha pressionado o botão esquerdo do mouse' },
          { id: 'arrastar', text: 'Arraste a janela até a posição desejada' },
          { id: 'soltar', text: 'Solte o botão do mouse' },
        ],
      },
      {
        id: 'fechar-sem-salvar',
        kind: 'quiz',
        title: 'Fechar com cuidado',
        context:
          'Você escreveu duas páginas em um editor de texto e clicou no X. Aparece a pergunta: "Deseja salvar as alterações?", com os botões Salvar, Não salvar e Cancelar.',
        prompt: 'O que acontece se você clicar em **Não salvar**?',
        hint: 'Leia cada botão ao pé da letra. Qual deles serve para desistir de fechar?',
        explanation:
          'Ao fechar com alterações pendentes, a maioria dos programas oferece três caminhos: Salvar (guarda e fecha), Não salvar (descarta e fecha) e Cancelar (volta ao documento). Na dúvida, Cancelar é sempre a opção segura.',
        concept: 'janelas-controles',
        options: [
          {
            id: 'descarta',
            text: 'O programa fecha e descarta as alterações feitas desde o último salvamento',
            correct: true,
            feedback:
              'Exato. "Não salvar" fecha e joga fora o que não foi salvo. Só escolha essa opção quando tiver certeza de que não precisa das mudanças.',
          },
          {
            id: 'rascunho',
            text: 'O programa fecha e guarda o texto automaticamente como rascunho',
            feedback:
              'Alguns programas até recuperam rascunhos, mas não conte com isso. "Não salvar" significa descartar as alterações.',
          },
          {
            id: 'volta',
            text: 'A janela volta para o texto, sem fechar',
            feedback: 'Esse é o papel do botão Cancelar: desistir de fechar e voltar ao documento.',
          },
          {
            id: 'lixeira',
            text: 'O texto vai para a Lixeira, de onde pode ser restaurado',
            feedback:
              'A Lixeira guarda arquivos excluídos. Alterações descartadas sem salvar não viram arquivo e não vão para lá.',
          },
        ],
      },
    ],
    debrief:
      'O mouse tem quatro ações principais, e cada situação pede a sua: clique, duplo clique, botão direito e arrastar. As janelas se controlam pelos botões do canto e pela barra de título. E, ao fechar algo com alterações, ler as opções com calma evita perder trabalho.',
  },

  // -------------------------------------------------------------------------
  // f05 — Copiar, colar, desfazer
  // -------------------------------------------------------------------------
  {
    id: 'f05-copiar-colar-desfazer',
    version: 1,
    sector: 'fundamentos',
    order: 5,
    title: 'Copiar, colar, desfazer',
    summary: 'Copie, recorte, cole e desfaça com o teclado, entendendo o que a área de transferência guarda.',
    briefing:
      'Retrabalho é o inimigo número um de qualquer agente. Quatro atalhos vão fazer você mover textos em segundos e desfazer erros sem pânico. Hora de treiná-los de verdade, no seu teclado.',
    category: 'teclado',
    subcategory: 'Atalhos de edição',
    difficulty: 1,
    estimatedMinutes: 6,
    prerequisites: ['f02-teclas-essenciais'],
    objectives: [
      'Copiar, recortar e colar com o teclado',
      'Desfazer e refazer ações',
      'Entender o que a área de transferência guarda',
    ],
    concepts: ['area-transferencia', 'atalho-desfazer'],
    platformNote:
      'No macOS, troque {{Ctrl}} por {{Cmd}}: {{Cmd+C}}, {{Cmd+X}}, {{Cmd+V}} e {{Cmd+Z}}; para refazer, use {{Cmd+Shift+Z}}. No Windows, refazer é {{Ctrl+Y}} na maioria dos programas, e alguns também aceitam {{Ctrl+Shift+Z}}.',
    steps: [
      {
        id: 'copiar',
        kind: 'shortcut',
        title: 'Copiar',
        capture: 'real',
        context: 'Você precisa enviar a um colega o endereço da reunião que está no texto abaixo.',
        prompt: 'Selecione o endereço na área de prática e pressione o atalho de **copiar**.',
        hint: 'É o Ctrl junto com a inicial de "copiar" (que também é a inicial de "copy", em inglês).',
        explanation:
          '{{Ctrl+C}} copia a seleção para a área de transferência, uma memória temporária do sistema. O original continua no lugar e nada muda na tela, mas a cópia fica pronta para ser colada.',
        concept: 'area-transferencia',
        combos: [{ key: 'c', ctrl: true }],
        mac: [{ key: 'c', meta: true }],
        platformNote: 'No macOS: {{Cmd+C}}.',
        practiceText: 'Reunião de planejamento: Rua das Acácias, 120, sala 4. Chegue 10 minutos antes.',
      },
      {
        id: 'colar',
        kind: 'shortcut',
        title: 'Colar',
        capture: 'real',
        context: 'O endereço já está na área de transferência. Clique no fim da mensagem abaixo, onde ele deve entrar.',
        prompt: 'Pressione o atalho de **colar**.',
        hint: 'Fica bem ao lado do C, na fileira de baixo do teclado.',
        explanation:
          '{{Ctrl+V}} insere o conteúdo da área de transferência onde está o cursor. Você pode colar a mesma cópia quantas vezes quiser, até copiar outra coisa.',
        concept: 'area-transferencia',
        combos: [{ key: 'v', ctrl: true }],
        mac: [{ key: 'v', meta: true }],
        platformNote: 'No macOS: {{Cmd+V}}.',
        practiceText: 'Mensagem para a equipe: o endereço da reunião é ',
      },
      {
        id: 'recortar',
        kind: 'shortcut',
        title: 'Recortar',
        capture: 'real',
        context: 'Na lista abaixo, o item "Comprar café" está fora de ordem. Você quer tirá-lo dali para colocá-lo em outro lugar.',
        prompt: 'Selecione a linha e pressione o atalho de **recortar**.',
        hint: 'A letra lembra uma tesoura aberta e fica à esquerda do C.',
        explanation:
          '{{Ctrl+X}} recorta: tira a seleção do lugar e a coloca na área de transferência. Depois, {{Ctrl+V}} cola no destino. É o jeito de **mover** um texto, em vez de duplicá-lo.',
        concept: 'area-transferencia',
        combos: [{ key: 'x', ctrl: true }],
        mac: [{ key: 'x', meta: true }],
        platformNote:
          'No macOS: {{Cmd+X}}. No Finder, recortar não funciona com arquivos: para movê-los, copie com {{Cmd+C}} e cole com {{Cmd+Option+V}}.',
        practiceText: 'Pendências:\n1. Enviar relatório\n2. Comprar café\n3. Ligar para o fornecedor',
      },
      {
        id: 'desfazer',
        kind: 'shortcut',
        title: 'Desfazer',
        capture: 'real',
        context: 'Você apagou sem querer a frase final do texto abaixo.',
        prompt: 'Pressione o atalho que **desfaz** a última ação.',
        hint: 'Fica na fileira de baixo do teclado, à esquerda do X.',
        explanation:
          '{{Ctrl+Z}} desfaz a última ação; pressionar de novo desfaz a anterior, e assim por diante. Se voltar demais, {{Ctrl+Y}} refaz. Funciona em textos, planilhas, editores de imagem e até no Explorador de Arquivos, para desfazer uma exclusão ou uma movimentação.',
        concept: 'atalho-desfazer',
        combos: [{ key: 'z', ctrl: true }],
        mac: [{ key: 'z', meta: true }],
        platformNote: 'No macOS: {{Cmd+Z}} desfaz e {{Cmd+Shift+Z}} refaz.',
        practiceText: 'Proposta comercial revisada.',
      },
      {
        id: 'recorte-perdido',
        kind: 'quiz',
        title: 'Recorte perdido',
        context:
          'Você recortou ({{Ctrl+X}}) um parágrafo importante para mudá-lo de lugar. Antes de colar, copiou ({{Ctrl+C}}) um link de um site. O parágrafo sumiu do documento.',
        prompt: 'Qual é a forma mais garantida de recuperar o parágrafo?',
        hint: 'Pense no recurso que registra as ações feitas no documento, e não no conteúdo copiado.',
        explanation:
          'A área de transferência comum guarda um item por vez: cada nova cópia substitui a anterior. Já o desfazer registra as ações feitas no documento. Por isso, ao recortar algo importante, cole logo em seguida; se algo sumir, {{Ctrl+Z}} costuma ser o caminho de volta.',
        concept: 'atalho-desfazer',
        options: [
          {
            id: 'desfazer',
            text: 'Voltar ao documento e pressionar Ctrl+Z até o parágrafo reaparecer',
            correct: true,
            feedback:
              'Isso. O recorte foi uma ação no documento e entrou no histórico de desfazer. Com {{Ctrl+Z}}, o parágrafo volta ao lugar original, desde que o documento continue aberto.',
          },
          {
            id: 'colar',
            text: 'Pressionar Ctrl+V, porque o parágrafo ainda está na área de transferência',
            feedback:
              'A área de transferência comum guarda só o último item. Ao copiar o link, o parágrafo foi substituído, e {{Ctrl+V}} colaria o link. O histórico da área de transferência ({{Win+V}}) guardaria os dois, mas precisa estar ativado.',
          },
          {
            id: 'lixeira',
            text: 'Procurar o parágrafo na Lixeira',
            feedback: 'A Lixeira guarda arquivos excluídos, não trechos de texto recortados.',
          },
          {
            id: 'perdido',
            text: 'Nada: um trecho recortado e substituído está perdido para sempre',
            feedback:
              'Não precisa entrar em pânico. Enquanto o documento estiver aberto, o desfazer consegue voltar várias ações.',
          },
        ],
      },
    ],
    debrief:
      'Copiar ({{Ctrl+C}}) duplica, recortar ({{Ctrl+X}}) move e colar ({{Ctrl+V}}) insere o que está na área de transferência, que guarda um item por vez. {{Ctrl+Z}} desfaz e {{Ctrl+Y}} refaz. Esses atalhos funcionam em quase todos os programas e economizam horas ao longo do tempo.',
  },

  // -------------------------------------------------------------------------
  // f06 — Arquivos e pastas
  // -------------------------------------------------------------------------
  {
    id: 'f06-arquivos-e-pastas',
    version: 1,
    sector: 'fundamentos',
    order: 6,
    title: 'Arquivos e pastas',
    summary: 'Leia caminhos, navegue entre pastas para achar o arquivo certo e crie sua própria estrutura.',
    briefing:
      'Todo arquivo do Nexo mora em algum lugar, e o endereço dele é o caminho. Agente, você vai aprender a ler esses endereços, chegar ao arquivo certo e criar suas próprias pastas.',
    category: 'arquivos',
    subcategory: 'Navegação e estrutura',
    difficulty: 1,
    estimatedMinutes: 7,
    prerequisites: ['f04-mouse-e-janelas'],
    objectives: [
      'Ler o caminho de um arquivo',
      'Navegar entre pastas para encontrar e abrir um arquivo',
      'Criar pastas e subpastas',
      'Escolher nomes de arquivo válidos',
    ],
    concepts: ['arquivos-pastas', 'caminho-arquivo'],
    platformNote:
      'No Windows, quem mostra arquivos e pastas é o **Explorador de Arquivos** ({{Win+E}}), e os caminhos usam barra invertida, como `C:\\Users\\Ana\\Documents`. No macOS, é o **Finder**, e os caminhos usam barra normal, como `/Users/ana/Documents`. No Nexo, usamos sempre a barra normal.',
    steps: [
      {
        id: 'ler-caminho',
        kind: 'quiz',
        title: 'Ler um caminho',
        context: 'Um colega avisa: "A planilha está em `/Documentos/Trabalho/2026/orcamento.xlsx`."',
        prompt: 'O que esse caminho informa?',
        hint: 'Leia da esquerda para a direita: cada barra é como abrir mais uma pasta.',
        explanation:
          'O caminho é o endereço completo de um arquivo: a sequência de pastas, da mais externa à mais interna, terminando no nome do arquivo. Saber ler um caminho permite encontrar qualquer arquivo, mesmo que exista outro com o mesmo nome em outra pasta.',
        concept: 'caminho-arquivo',
        options: [
          {
            id: 'certo',
            text: 'O arquivo orcamento.xlsx está na pasta 2026, que fica dentro de Trabalho, que fica dentro de Documentos',
            correct: true,
            feedback:
              'Isso. Cada barra separa um nível: da pasta mais externa, à esquerda, até o arquivo, no fim.',
          },
          {
            id: 'invertido',
            text: 'A pasta Documentos está dentro da pasta 2026',
            feedback:
              'O caminho se lê da esquerda para a direita, de fora para dentro. Documentos é a pasta mais externa.',
          },
          {
            id: 'quatro',
            text: 'Existem quatro arquivos: Documentos, Trabalho, 2026 e orcamento.xlsx',
            feedback:
              'Só o último item é um arquivo (repare na extensão `.xlsx`). Os anteriores são pastas, uma dentro da outra.',
          },
          {
            id: 'site',
            text: 'É o endereço de um site que deve ser aberto no navegador',
            feedback:
              'Endereços de sites começam com algo como `https://`. Esse é o caminho de um arquivo no computador.',
          },
        ],
      },
      {
        id: 'abrir-curriculo',
        kind: 'filesystem',
        title: 'O arquivo certo',
        context: 'Você precisa enviar seu currículo atualizado. Existe uma versão antiga, com o mesmo nome, na pasta Downloads.',
        prompt:
          'Abra o arquivo que está no caminho `/Documentos/Pessoal/curriculo.docx`. Use as pastas e a trilha de navegação para chegar até ele.',
        hint: 'Você começa em Downloads. Suba um nível para ver as pastas principais, entre em Documentos e depois em Pessoal.',
        explanation:
          'Dois arquivos podem ter o mesmo nome se estiverem em pastas diferentes; o que os diferencia é o caminho. Por isso, ao procurar um arquivo, conferir a pasta onde ele está é tão importante quanto conferir o nome.',
        concept: 'caminho-arquivo',
        startPath: '/Downloads',
        features: {},
        root: [
          {
            name: 'Área de Trabalho',
            type: 'folder',
            children: [{ name: 'lista_tarefas.txt', type: 'file', sizeKb: 2 }],
          },
          {
            name: 'Documentos',
            type: 'folder',
            children: [
              {
                name: 'Trabalho',
                type: 'folder',
                children: [
                  { name: 'relatorio_vendas.xlsx', type: 'file', sizeKb: 48 },
                  { name: 'apresentacao_cliente.pptx', type: 'file', sizeKb: 2300 },
                  { name: 'modelo_curriculo.docx', type: 'file', sizeKb: 35 },
                ],
              },
              {
                name: 'Pessoal',
                type: 'folder',
                children: [
                  { name: 'curriculo.docx', type: 'file', sizeKb: 42 },
                  { name: 'receitas_da_vo.docx', type: 'file', sizeKb: 18 },
                  { name: 'certidao_casamento.pdf', type: 'file', sizeKb: 310 },
                ],
              },
              {
                name: 'Escola',
                type: 'folder',
                children: [{ name: 'trabalho_historia.docx', type: 'file', sizeKb: 64 }],
              },
            ],
          },
          {
            name: 'Downloads',
            type: 'folder',
            children: [
              { name: 'curriculo.docx', type: 'file', sizeKb: 39 },
              { name: 'boleto_internet.pdf', type: 'file', sizeKb: 120 },
              { name: 'foto_perfil.jpg', type: 'file', sizeKb: 850 },
            ],
          },
          { name: 'Imagens', type: 'folder', children: [] },
          { name: 'Músicas', type: 'folder', children: [] },
          { name: 'Vídeos', type: 'folder', children: [] },
        ],
        goals: [
          {
            type: 'opened',
            path: '/Documentos/Pessoal/curriculo.docx',
            label: 'Abra o curriculo.docx da pasta Documentos > Pessoal',
          },
        ],
      },
      {
        id: 'criar-pastas',
        kind: 'filesystem',
        title: 'Pastas novas',
        context: 'Você quer guardar as faturas da casa em um lugar próprio, separadas por ano.',
        prompt: 'Crie a pasta `Faturas` dentro de Documentos e, dentro dela, a pasta `2026`.',
        hint: 'Use o botão "Nova pasta" e digite o nome logo em seguida. Para criar a subpasta, primeiro entre em Faturas.',
        explanation:
          'Pastas dentro de pastas (subpastas) criam uma estrutura em níveis, como gavetas dentro de um armário. O caminho da nova pasta será `/Documentos/Faturas/2026`.',
        concept: 'arquivos-pastas',
        startPath: '/Documentos',
        features: { createFolder: true, rename: true },
        root: [
          { name: 'Área de Trabalho', type: 'folder', children: [] },
          {
            name: 'Documentos',
            type: 'folder',
            children: [
              {
                name: 'Trabalho',
                type: 'folder',
                children: [{ name: 'relatorio_vendas.xlsx', type: 'file', sizeKb: 48 }],
              },
              {
                name: 'Pessoal',
                type: 'folder',
                children: [{ name: 'curriculo.docx', type: 'file', sizeKb: 42 }],
              },
              { name: 'lista_mercado.txt', type: 'file', sizeKb: 1 },
            ],
          },
          { name: 'Downloads', type: 'folder', children: [] },
          { name: 'Imagens', type: 'folder', children: [] },
          { name: 'Músicas', type: 'folder', children: [] },
          { name: 'Vídeos', type: 'folder', children: [] },
        ],
        goals: [
          {
            type: 'exists',
            path: '/Documentos/Faturas',
            nodeType: 'folder',
            label: 'Crie a pasta Faturas dentro de Documentos',
          },
          {
            type: 'exists',
            path: '/Documentos/Faturas/2026',
            nodeType: 'folder',
            label: 'Crie a pasta 2026 dentro de Faturas',
          },
        ],
      },
      {
        id: 'nome-invalido',
        kind: 'quiz',
        title: 'Nomes permitidos',
        prompt: 'Qual destes nomes o Windows **não** aceita para um arquivo?',
        hint: 'Alguns sinais de pontuação têm função especial em caminhos e comandos.',
        explanation:
          'Nomes de arquivo podem ter letras, números, espaços, acentos, hifens e parênteses. No Windows, os caracteres `\\ / : * ? " < > |` são proibidos. No macOS, o Finder recusa principalmente os dois-pontos. Nomes claros, com assunto e data, facilitam a busca depois.',
        concept: 'arquivos-pastas',
        options: [
          {
            id: 'interrogacao',
            text: '`relatorio final?.docx`',
            correct: true,
            feedback:
              'Certo. O Windows recusa os caracteres `\\ / : * ? " < > |` em nomes de arquivo, porque eles têm funções especiais no sistema, como separar pastas em um caminho.',
          },
          {
            id: 'acento',
            text: '`relatório final.docx`',
            feedback:
              'Esse nome é válido: espaços e acentos são permitidos. Há quem prefira evitá-los para facilitar o envio a sistemas antigos, mas o Windows aceita.',
          },
          {
            id: 'data',
            text: '`relatorio_2026-03-15.docx`',
            feedback: 'Nome válido e bem organizado: sublinhados, hifens e números são permitidos.',
          },
          {
            id: 'parenteses',
            text: '`Relatório (2).docx`',
            feedback:
              'Nome válido. Parênteses são permitidos; os navegadores, por exemplo, usam esse formato quando você baixa o mesmo arquivo duas vezes.',
          },
        ],
      },
    ],
    debrief:
      'Arquivos guardam conteúdo; pastas organizam arquivos e outras pastas. O caminho é o endereço completo, lido de fora para dentro, e é ele que diferencia dois arquivos com o mesmo nome. Criar uma estrutura de pastas clara desde o início poupa tempo em todas as buscas futuras.',
  },

  // -------------------------------------------------------------------------
  // f07 — Extensões e formatos
  // -------------------------------------------------------------------------
  {
    id: 'f07-extensoes',
    version: 1,
    sector: 'fundamentos',
    order: 7,
    title: 'Extensões e formatos',
    summary: 'Reconheça formatos pela extensão, converta do jeito certo e desmascare arquivos disfarçados.',
    briefing:
      'O final do nome de um arquivo revela o que ele realmente é, e há quem se aproveite de quem não olha. Agente, aprenda a ler extensões e a desmascarar um arquivo disfarçado antes que alguém o abra.',
    category: 'arquivos',
    subcategory: 'Tipos de arquivo',
    difficulty: 2,
    estimatedMinutes: 6,
    prerequisites: ['f06-arquivos-e-pastas'],
    objectives: [
      'Reconhecer o tipo de arquivo pela extensão',
      'Converter formatos do jeito certo, sem apenas renomear',
      'Mostrar as extensões para identificar arquivos disfarçados',
    ],
    concepts: ['extensoes-arquivo'],
    platformNote:
      'No Windows 11, mostre as extensões no Explorador em **Exibir > Mostrar > Extensões de nomes de arquivos** (no Windows 10: guia **Exibir**, caixa **Extensões de nomes de arquivos**). No macOS, use **Finder > Ajustes > Avançado > Mostrar todas as extensões de nomes de arquivos**.',
    steps: [
      {
        id: 'tipos',
        kind: 'classify',
        title: 'Cada formato no seu lugar',
        prompt: 'Classifique cada arquivo pelo tipo de conteúdo, olhando a extensão (o que vem depois do último ponto).',
        hint: 'Foque nas letras depois do último ponto: elas indicam que tipo de programa abre o arquivo.',
        explanation:
          'A extensão indica o formato do arquivo e qual programa o sistema usa para abri-lo. Documentos (pdf, docx, txt), planilhas (xlsx, csv), imagens (jpg, png), mídia (mp3, mp4) e executáveis (exe) são as famílias mais comuns no dia a dia.',
        concept: 'extensoes-arquivo',
        buckets: [
          { id: 'documento', label: 'Documento' },
          { id: 'planilha', label: 'Planilha' },
          { id: 'imagem', label: 'Imagem' },
          { id: 'midia', label: 'Áudio ou vídeo' },
          { id: 'programa', label: 'Programa (executável)' },
        ],
        items: [
          {
            id: 'pdf',
            text: 'contrato.pdf',
            bucket: 'documento',
            feedback: 'PDF é um documento pronto para leitura e impressão, que mantém o mesmo visual em qualquer computador.',
          },
          {
            id: 'docx',
            text: 'carta.docx',
            bucket: 'documento',
            feedback: 'DOCX é o formato do Word (e de editores compatíveis) para documentos de texto editáveis.',
          },
          {
            id: 'txt',
            text: 'anotacoes.txt',
            bucket: 'documento',
            feedback: 'TXT é texto puro, sem formatação: abre em qualquer editor simples, como o Bloco de Notas.',
          },
          {
            id: 'xlsx',
            text: 'gastos.xlsx',
            bucket: 'planilha',
            feedback: 'XLSX é o formato de planilhas do Excel e de programas compatíveis.',
          },
          {
            id: 'csv',
            text: 'clientes.csv',
            bucket: 'planilha',
            feedback:
              'CSV guarda dados em tabela, com colunas separadas por vírgula ou ponto e vírgula. Costuma abrir em programas de planilha.',
          },
          {
            id: 'jpg',
            text: 'ferias.jpg',
            bucket: 'imagem',
            feedback: 'JPG é o formato mais comum para fotos.',
          },
          {
            id: 'png',
            text: 'logo.png',
            bucket: 'imagem',
            feedback: 'PNG é um formato de imagem que aceita fundo transparente, muito usado em logotipos e capturas de tela.',
          },
          {
            id: 'mp3',
            text: 'podcast.mp3',
            bucket: 'midia',
            feedback: 'MP3 é um formato de áudio.',
          },
          {
            id: 'mp4',
            text: 'aula.mp4',
            bucket: 'midia',
            feedback: 'MP4 é um formato de vídeo.',
          },
          {
            id: 'exe',
            text: 'instalador.exe',
            bucket: 'programa',
            feedback:
              'EXE é um programa executável do Windows: ao ser aberto, ele roda instruções no computador. Só execute se souber de onde veio.',
          },
        ],
      },
      {
        id: 'converter',
        kind: 'quiz',
        title: 'Virar PDF',
        context: 'Um site de inscrição só aceita arquivos em PDF. Você tem o documento `curriculo.docx`.',
        prompt: 'Qual é o jeito correto de obter a versão em PDF?',
        hint: 'O conteúdo precisa ser convertido por um programa que entenda os dois formatos.',
        explanation:
          'A extensão acompanha o formato real do conteúdo. Para mudar de formato é preciso converter, normalmente com **Salvar como** ou **Exportar** no próprio programa. Trocar a extensão no nome não converte nada e pode deixar o arquivo impossível de abrir.',
        concept: 'extensoes-arquivo',
        options: [
          {
            id: 'exportar',
            text: 'Abrir o documento no editor e usar Salvar como (ou Exportar), escolhendo o formato PDF',
            correct: true,
            feedback:
              'Isso. O editor converte o conteúdo de verdade para PDF e cria um novo arquivo, mantendo o original em DOCX.',
          },
          {
            id: 'renomear',
            text: 'Renomear o arquivo para curriculo.pdf',
            feedback:
              'Renomear só troca o rótulo, não o conteúdo. Por dentro, o arquivo continua sendo DOCX e vai dar erro ao ser aberto como PDF.',
          },
          {
            id: 'zip',
            text: 'Compactar o arquivo em .zip',
            feedback:
              'Compactar cria um pacote com o arquivo dentro, mas o currículo continua em DOCX. O site espera um PDF.',
          },
          {
            id: 'print',
            text: 'Tirar uma captura de tela do documento e enviar a imagem',
            feedback:
              'Uma captura gera uma imagem (PNG ou JPG), não um PDF. Além disso, o texto perderia qualidade e não poderia ser selecionado.',
          },
        ],
      },
      {
        id: 'disfarcado',
        kind: 'filesystem',
        title: 'O arquivo disfarçado',
        context:
          'Chegou um e-mail inesperado com um "comprovante de Pix", e o anexo foi baixado. Em Downloads também há arquivos legítimos. As extensões estão ocultas, como no padrão do Windows.',
        prompt:
          'Ative **Mostrar extensões**, identifique o arquivo que finge ser um PDF mas é um programa e exclua-o, sem abrir nada.',
        hint: 'Com as extensões ocultas, observe a coluna Tipo. Depois de mostrar as extensões, procure um nome com duas extensões seguidas.',
        explanation:
          'Golpistas usam nomes como `comprovante_pix.pdf.exe`: com as extensões ocultas, o Windows mostra só `comprovante_pix.pdf`, que parece um documento. A extensão que vale é a última. Manter as extensões visíveis e desconfiar de executáveis recebidos por e-mail evita muitos ataques. Se um arquivo assim já tiver sido aberto, faça uma verificação completa com o antivírus.',
        concept: 'extensoes-arquivo',
        startPath: '/Downloads',
        features: { extensions: true, delete: true, trash: true },
        root: [
          { name: 'Área de Trabalho', type: 'folder', children: [] },
          { name: 'Documentos', type: 'folder', children: [] },
          {
            name: 'Downloads',
            type: 'folder',
            children: [
              { name: 'fatura_luz_marco.pdf', type: 'file', sizeKb: 180 },
              { name: 'comprovante_pix.pdf.exe', type: 'file', sizeKb: 1450 },
              { name: 'cardapio_restaurante.pdf', type: 'file', sizeKb: 640 },
              { name: 'foto_documento.jpg', type: 'file', sizeKb: 920 },
            ],
          },
          { name: 'Imagens', type: 'folder', children: [] },
          { name: 'Músicas', type: 'folder', children: [] },
          { name: 'Vídeos', type: 'folder', children: [] },
        ],
        protectedPaths: [
          '/Downloads/fatura_luz_marco.pdf',
          '/Downloads/cardapio_restaurante.pdf',
          '/Downloads/foto_documento.jpg',
        ],
        goals: [
          {
            type: 'inTrash',
            name: 'comprovante_pix.pdf.exe',
            label: 'Exclua o executável disfarçado de PDF',
          },
        ],
      },
    ],
    debrief:
      'A extensão revela o formato real do arquivo e define o programa que vai abri-lo. Converter exige um programa (Salvar como ou Exportar), nunca só renomear. E, como o Windows esconde as extensões por padrão, ativá-las ajuda a desmascarar executáveis disfarçados de documentos.',
  },

  // -------------------------------------------------------------------------
  // f08 — Arrumando a casa
  // -------------------------------------------------------------------------
  {
    id: 'f08-arrumando-a-casa',
    version: 1,
    sector: 'fundamentos',
    order: 8,
    title: 'Arrumando a casa',
    summary: 'Organize arquivos em pastas, dê nomes que se ordenam sozinhos e use a Lixeira como rede de segurança.',
    briefing:
      'A pasta Downloads virou um depósito, e alguém apagou um contrato importante. Agente, sua missão é pôr ordem na casa e provar que a Lixeira é uma rede de segurança, não um buraco sem volta.',
    category: 'arquivos',
    subcategory: 'Organização e Lixeira',
    difficulty: 2,
    estimatedMinutes: 8,
    prerequisites: ['f06-arquivos-e-pastas'],
    objectives: [
      'Organizar arquivos em pastas por assunto',
      'Dar nomes que facilitam ordenar e buscar',
      'Excluir e restaurar itens pela Lixeira',
      'Saber quando uma exclusão é definitiva',
    ],
    concepts: ['organizacao-pastas', 'lixeira'],
    platformNote:
      'No macOS, a Lixeira se chama **Lixo** e fica no Dock: {{Cmd+Delete}} move um item para lá e, diferente do Windows, arquivos apagados de pendrives também passam pelo Lixo. No Windows, {{Shift+Delete}} exclui sem passar pela Lixeira.',
    steps: [
      {
        id: 'organizar',
        kind: 'filesystem',
        title: 'Faxina nos Downloads',
        context: 'As contas do mês e as fotos da viagem estão todas misturadas em Downloads.',
        prompt:
          'Crie a pasta `Contas` dentro de Documentos e mova para ela as três contas em PDF. Depois, mova as duas fotos da praia para a pasta Imagens.',
        hint: 'Primeiro crie a pasta de destino. Depois, selecione os arquivos (dá para selecionar vários de uma vez) e use "Mover para…" escolhendo a pasta certa.',
        explanation:
          'Uma regra simples resolve a maior parte da bagunça: cada assunto na sua pasta, e Downloads apenas como lugar de passagem. Mover os arquivos assim que chegam evita que eles se percam entre dezenas de downloads antigos.',
        concept: 'organizacao-pastas',
        startPath: '/Downloads',
        features: { createFolder: true, rename: true, move: true },
        root: [
          { name: 'Área de Trabalho', type: 'folder', children: [] },
          {
            name: 'Documentos',
            type: 'folder',
            children: [
              {
                name: 'Trabalho',
                type: 'folder',
                children: [{ name: 'planilha_horas.xlsx', type: 'file', sizeKb: 30 }],
              },
            ],
          },
          {
            name: 'Downloads',
            type: 'folder',
            children: [
              { name: 'conta_luz_2026-03.pdf', type: 'file', sizeKb: 210 },
              { name: 'conta_agua_2026-03.pdf', type: 'file', sizeKb: 190 },
              { name: 'conta_internet_2026-03.pdf', type: 'file', sizeKb: 160 },
              { name: 'praia_01.jpg', type: 'file', sizeKb: 2400 },
              { name: 'praia_02.jpg', type: 'file', sizeKb: 2650 },
            ],
          },
          {
            name: 'Imagens',
            type: 'folder',
            children: [
              {
                name: 'Família',
                type: 'folder',
                children: [{ name: 'aniversario_mae.jpg', type: 'file', sizeKb: 1800 }],
              },
            ],
          },
          { name: 'Músicas', type: 'folder', children: [] },
          { name: 'Vídeos', type: 'folder', children: [] },
        ],
        goals: [
          {
            type: 'exists',
            path: '/Documentos/Contas',
            nodeType: 'folder',
            label: 'Crie a pasta Contas dentro de Documentos',
          },
          {
            type: 'countInFolder',
            path: '/Documentos/Contas',
            extension: 'pdf',
            count: 3,
            label: 'Mova as 3 contas em PDF para Documentos > Contas',
          },
          {
            type: 'countInFolder',
            path: '/Imagens',
            extension: 'jpg',
            count: 2,
            label: 'Mova as 2 fotos da praia para Imagens',
          },
        ],
      },
      {
        id: 'nomes-ordenaveis',
        kind: 'quiz',
        title: 'Nomes que se organizam',
        context:
          'Você vai guardar uma fatura por mês, durante vários anos, na mesma pasta, e quer que a lista fique em ordem cronológica ao ordenar por nome.',
        prompt: 'Qual padrão de nome funciona melhor?',
        hint: 'Pense em como a ordem alfabética trata números e palavras.',
        explanation:
          'Datas no formato ano-mês-dia (como 2026-03-15) ficam em ordem cronológica em qualquer sistema. Combinadas com um nome descritivo, elas tornam a pasta autoexplicativa: dá para achar o arquivo pelo nome, sem precisar abri-lo.',
        concept: 'organizacao-pastas',
        options: [
          {
            id: 'ano-mes',
            text: 'fatura_2026-03.pdf (ano, depois o mês com dois dígitos)',
            correct: true,
            feedback:
              'Isso. Com o ano primeiro e o mês com dois dígitos, a ordem alfabética coincide com a ordem das datas: 2025-12 vem antes de 2026-01.',
          },
          {
            id: 'mes-ano',
            text: 'fatura_03-2026.pdf (mês, depois o ano)',
            feedback:
              'Ao ordenar por nome, meses de anos diferentes se misturam: 03-2025 e 03-2026 ficam lado a lado, antes de 04-2025.',
          },
          {
            id: 'extenso',
            text: 'fatura março 2026.pdf',
            feedback: 'Meses por extenso são ordenados alfabeticamente: abril viria antes de janeiro.',
          },
          {
            id: 'numerado',
            text: 'fatura1.pdf, fatura2.pdf, fatura3.pdf',
            feedback:
              'Números soltos não dizem a que mês a fatura se refere, e em vários programas fatura10 aparece antes de fatura2.',
          },
        ],
      },
      {
        id: 'resgate-lixeira',
        kind: 'filesystem',
        title: 'Resgate na Lixeira',
        context:
          'Ontem alguém excluiu por engano o arquivo `contrato_aluguel.pdf`. Hoje, você também precisa se livrar de uma lista antiga que está em Documentos.',
        prompt:
          'Exclua `lista_compras_2019.txt`, abra a Lixeira e restaure `contrato_aluguel.pdf`. Não esvazie a Lixeira: os outros itens ainda podem ser úteis para alguém.',
        hint: 'Arquivos excluídos vão para a Lixeira. Lá dentro, selecione o contrato e use "Restaurar".',
        explanation:
          'A Lixeira guarda os itens excluídos até ser esvaziada, e "Restaurar" devolve cada um ao local de onde saiu. Esvaziar a Lixeira apaga de vez, por isso confira o conteúdo antes.',
        concept: 'lixeira',
        startPath: '/Documentos',
        features: { delete: true, trash: true },
        root: [
          { name: 'Área de Trabalho', type: 'folder', children: [] },
          {
            name: 'Documentos',
            type: 'folder',
            children: [
              { name: 'lista_compras_2019.txt', type: 'file', sizeKb: 3 },
              { name: 'orcamento_reforma.xlsx', type: 'file', sizeKb: 56 },
              {
                name: 'Contas',
                type: 'folder',
                children: [{ name: 'conta_luz_2026-03.pdf', type: 'file', sizeKb: 210 }],
              },
            ],
          },
          { name: 'Downloads', type: 'folder', children: [] },
          { name: 'Imagens', type: 'folder', children: [] },
          { name: 'Músicas', type: 'folder', children: [] },
          { name: 'Vídeos', type: 'folder', children: [] },
        ],
        trash: [
          { name: 'contrato_aluguel.pdf', type: 'file', sizeKb: 380 },
          { name: 'foto_borrada.jpg', type: 'file', sizeKb: 1900 },
          { name: 'rascunho_convite.docx', type: 'file', sizeKb: 22 },
        ],
        protectedPaths: ['/Documentos/orcamento_reforma.xlsx'],
        goals: [
          {
            type: 'inTrash',
            name: 'lista_compras_2019.txt',
            label: 'Exclua lista_compras_2019.txt',
          },
          {
            type: 'notInTrash',
            name: 'contrato_aluguel.pdf',
            label: 'Restaure contrato_aluguel.pdf da Lixeira',
          },
          {
            type: 'inTrash',
            name: 'foto_borrada.jpg',
            label: 'Mantenha os outros itens na Lixeira (não esvazie)',
          },
        ],
      },
      {
        id: 'sem-lixeira',
        kind: 'quiz',
        title: 'Quando não tem volta',
        prompt: 'Em qual destas situações, no Windows, o arquivo excluído **não** vai para a Lixeira?',
        hint: 'A Lixeira cuida dos discos do próprio computador. Pense em algo que fica conectado só de vez em quando.',
        explanation:
          'A Lixeira protege contra exclusões acidentais nos discos do computador, mas há exceções: {{Shift+Delete}} pula a Lixeira, arquivos grandes demais para ela são apagados direto (o Windows avisa antes) e pendrives e cartões de memória normalmente não têm Lixeira. Nesses casos, a exclusão é definitiva.',
        concept: 'lixeira',
        options: [
          {
            id: 'pendrive',
            text: 'Ao excluir um arquivo que está em um pendrive',
            correct: true,
            feedback:
              'Exato. Em pendrives e cartões de memória, o Windows normalmente exclui de forma definitiva, sem passar pela Lixeira. Por isso, confira duas vezes antes de apagar algo ali.',
          },
          {
            id: 'delete',
            text: 'Ao selecionar um arquivo em Documentos e pressionar Delete',
            feedback: 'Esse é o caminho comum: o arquivo vai para a Lixeira e pode ser restaurado.',
          },
          {
            id: 'menu',
            text: 'Ao clicar com o botão direito em um arquivo da Área de Trabalho e escolher Excluir',
            feedback: 'Também vai para a Lixeira. Excluir pelo menu de contexto equivale a usar a tecla Delete.',
          },
          {
            id: 'arrastar',
            text: 'Ao arrastar um arquivo de Downloads até o ícone da Lixeira',
            feedback: 'Arrastar até a Lixeira é só outra forma de excluir normalmente: o arquivo pode ser restaurado.',
          },
        ],
      },
    ],
    debrief:
      'Organização é hábito: pastas por assunto, nomes descritivos com datas no formato ano-mês e Downloads como área de passagem. A Lixeira é uma rede de segurança: o que vai para ela pode ser restaurado até que seja esvaziada. Mas ela tem limites, como pendrives e o {{Shift+Delete}}, que apagam de forma definitiva.',
  },
];
