import type { MissionDefinition } from '../types';

export const DIAGNOSTICO_MISSIONS: MissionDefinition[] = [
  // -------------------------------------------------------------------------
  // d01 — Sem internet
  // -------------------------------------------------------------------------
  {
    id: 'd01-sem-internet',
    version: 1,
    sector: 'diagnostico',
    order: 1,
    title: 'Sem internet',
    summary: 'Usar um método de diagnóstico para localizar e resolver uma queda de conexão com segurança.',
    briefing:
      'Alerta no Nexo: o notebook de uma agente perdeu a conexão pouco antes de uma reunião importante. Sem pânico e sem sair apertando tudo, siga o método: observe, isole o problema e teste primeiro o que é simples e seguro.',
    category: 'diagnostico',
    subcategory: 'Conectividade',
    difficulty: 2,
    estimatedMinutes: 10,
    prerequisites: [],
    objectives: [
      'Aplicar um método de diagnóstico em vez de tentativa e erro',
      'Descobrir se a falha está no aparelho, no roteador ou no provedor',
      'Diferenciar reiniciar de resetar o roteador',
      'Escolher entre Wi-Fi e cabo conforme a situação',
    ],
    concepts: ['diagnostico-metodo', 'wifi-ethernet'],
    steps: [
      {
        id: 'metodo-01',
        kind: 'quiz',
        title: 'A primeira pergunta',
        context: 'O notebook mostra **"Sem internet"**. Você ainda não mexeu em nada.',
        prompt: 'Qual pergunta ajuda mais a descobrir onde está o problema?',
        hint: 'Uma boa pergunta de diagnóstico elimina metade das hipóteses de uma vez.',
        explanation:
          'Diagnosticar é **isolar**: comparar o que funciona com o que não funciona. Testar outro aparelho na mesma rede mostra se a falha está no dispositivo ou na conexão da casa, antes de qualquer ação invasiva.',
        concept: 'diagnostico-metodo',
        options: [
          {
            id: 'a',
            text: 'Outros aparelhos conectados à mesma rede conseguem acessar a internet?',
            correct: true,
            feedback:
              'Isso. A resposta divide o problema ao meio: se só o notebook falha, a causa está nele; se todos falham, está no roteador ou no provedor.',
          },
          {
            id: 'b',
            text: 'Qual é a marca do notebook?',
            feedback: 'A marca pode importar mais tarde, para achar drivers, mas não diz onde está a falha.',
          },
          {
            id: 'c',
            text: 'Quanto tempo falta para a reunião?',
            feedback: 'A pressa é real, mas não ajuda a localizar o problema. Seguir o método costuma ser o caminho mais rápido.',
          },
          {
            id: 'd',
            text: 'Qual antivírus está instalado?',
            feedback: 'Raramente o antivírus derruba a conexão inteira. Antes de suspeitar dele, isole o problema.',
          },
        ],
      },
      {
        id: 'diag-01',
        kind: 'diagnosis',
        title: 'Rastreando a falha',
        prompt: 'A cada momento, escolha a ação mais sensata para resolver o problema.',
        hint: 'Primeiro descubra se o problema é só do notebook. Depois, comece pelo que é simples, rápido e reversível.',
        explanation:
          'Você seguiu o método: isolou a falha (a rede da casa, não o notebook), aplicou a solução simples e reversível (reiniciar o roteador) e, por fim, reconectou o aparelho. Reset de fábrica, formatação e "drivers milagrosos" só teriam criado problemas novos.',
        concept: 'diagnostico-metodo',
        symptom: 'O notebook não abre nenhum site. O ícone de rede mostra "Sem internet".',
        startStage: 'inicio',
        stages: [
          {
            id: 'inicio',
            situation: 'O notebook está conectado ao Wi-Fi da casa, mas nenhum site abre. Ontem tudo funcionava.',
            evidence: ['Ícone de rede: conectado à rede "Casa", com o aviso "Sem internet"', 'Modo avião: desligado'],
            actions: [
              {
                id: 'testar-celular',
                label: 'Testar a internet no celular, conectado ao mesmo Wi-Fi',
                result:
                  'O celular também não abre nada pelo Wi-Fi, mas funciona nos dados móveis. O problema não é só do notebook: está na rede da casa ou no provedor.',
                quality: 'best',
                next: 'rede',
              },
              {
                id: 'reiniciar-notebook',
                label: 'Reiniciar o notebook',
                result:
                  'Leva alguns minutos e nada muda: continua "Sem internet". Antes de mexer no notebook, descubra se ele é mesmo o culpado.',
                quality: 'poor',
              },
              {
                id: 'formatar',
                label: 'Formatar o notebook para "zerar" as configurações de rede',
                result:
                  'Formatar apaga programas e, sem backup, também arquivos. É a ação mais invasiva possível, tomada sem saber se o problema é do notebook. E não era.',
                quality: 'harmful',
              },
              {
                id: 'firewall',
                label: 'Desativar o firewall para ver se ele está bloqueando a internet',
                result:
                  'O firewall não corta a internet inteira de uma hora para outra. Desligá-lo só deixa o computador exposto, e o problema continua.',
                quality: 'harmful',
              },
            ],
          },
          {
            id: 'rede',
            situation: 'Nenhum aparelho navega pelo Wi-Fi. Você vai até o roteador.',
            evidence: [
              'Luz de energia: acesa',
              'Luz do Wi-Fi: piscando normalmente',
              'Luz "Internet" (às vezes chamada WAN): vermelha',
              'Cabos: todos bem encaixados',
            ],
            actions: [
              {
                id: 'reiniciar-roteador',
                label: 'Reiniciar o roteador: tirar da tomada, esperar 30 segundos, religar e aguardar cerca de 2 minutos',
                result:
                  'As luzes acendem em sequência e, depois de dois minutos, a luz Internet fica verde. O celular volta a navegar. O notebook, porém, ainda mostra "Sem internet".',
                quality: 'best',
                next: 'notebook',
              },
              {
                id: 'ligar-provedor',
                label: 'Ligar para o provedor de internet',
                result:
                  'O atendente diz que não há falha na região e pede para você reiniciar o roteador. A luz Internet fica verde e o celular volta a navegar. Funcionou, mas o passo simples poderia ter vindo antes da ligação. O notebook ainda mostra "Sem internet".',
                quality: 'good',
                next: 'notebook',
              },
              {
                id: 'reset',
                label: 'Apertar o botão Reset do roteador com um clipe por 10 segundos',
                result:
                  'Reset não é reiniciar: ele apaga todas as configurações e volta ao padrão de fábrica. O nome e a senha do Wi-Fi mudam, e a conexão com o provedor pode precisar de um técnico para ser refeita.',
                quality: 'harmful',
              },
              {
                id: 'senha-wifi',
                label: 'Trocar a senha do Wi-Fi',
                result:
                  'A senha controla quem entra na rede da casa, não a ligação com o provedor. A luz Internet continua vermelha, e agora todos os aparelhos precisam da senha nova.',
                quality: 'poor',
              },
            ],
          },
          {
            id: 'notebook',
            situation: 'A internet voltou para o celular, mas o notebook continua "Sem internet".',
            evidence: ['Celular navegando normalmente no mesmo Wi-Fi', 'Notebook conectado à rede "Casa" desde antes da queda'],
            actions: [
              {
                id: 'reconectar',
                label: 'Desligar e religar o Wi-Fi do notebook (ou desconectar e conectar de novo à rede)',
                result:
                  'O notebook refaz a conexão, recebe as configurações atualizadas do roteador e volta a navegar. Problema resolvido em segundos.',
                quality: 'best',
                resolves: true,
              },
              {
                id: 'reiniciar-nb',
                label: 'Reiniciar o notebook',
                result: 'Funciona também: ao reiniciar, a conexão é refeita. Só demorou mais do que reconectar o Wi-Fi.',
                quality: 'good',
                resolves: true,
              },
              {
                id: 'driver-milagroso',
                label: 'Baixar pelo celular um "driver turbo de Wi-Fi" num site de downloads desconhecido',
                result:
                  'Drivers devem vir do Windows Update ou do site do fabricante; sites de "drivers milagrosos" são fonte comum de malware. E o driver nem era o problema: o Wi-Fi conectava normalmente.',
                quality: 'harmful',
              },
              {
                id: 'adaptador',
                label: 'Comprar um adaptador Wi-Fi USB novo',
                result: 'Gasto desnecessário: a placa de rede está funcionando, só precisa refazer a conexão.',
                quality: 'poor',
              },
            ],
          },
        ],
      },
      {
        id: 'wifi-01',
        kind: 'classify',
        title: 'Wi-Fi ou cabo?',
        prompt: 'Classifique cada característica: é do Wi-Fi ou da conexão por cabo (Ethernet)?',
        hint: 'Um oferece liberdade de movimento; o outro, estabilidade.',
        explanation:
          'O **Wi-Fi** troca estabilidade por mobilidade: o sinal enfraquece com paredes e distância. O **cabo de rede (Ethernet)** é mais estável e geralmente mais rápido. Para algo crítico perto do roteador, vale o cabo.',
        concept: 'wifi-ethernet',
        buckets: [
          { id: 'wifi', label: 'Wi-Fi' },
          { id: 'cabo', label: 'Cabo (Ethernet)' },
        ],
        items: [
          {
            id: 'mobilidade',
            text: 'Permite usar o notebook em qualquer cômodo',
            bucket: 'wifi',
            feedback: 'A mobilidade é a grande vantagem do Wi-Fi.',
          },
          {
            id: 'interferencia',
            text: 'Sofre com paredes, distância e interferência de outros aparelhos',
            bucket: 'wifi',
            feedback: 'O sinal de rádio perde força com obstáculos e disputa espaço com redes vizinhas e eletrodomésticos.',
          },
          {
            id: 'celulares',
            text: 'Conecta celulares e tablets sem nenhum acessório',
            bucket: 'wifi',
            feedback: 'Celulares e tablets dependem de conexão sem fio; não têm porta de rede.',
          },
          {
            id: 'estavel',
            text: 'Oferece a conexão mais estável para uma reunião importante ou um jogo on-line',
            bucket: 'cabo',
            feedback: 'O cabo não sofre com paredes nem interferências, por isso a conexão oscila muito menos.',
          },
          {
            id: 'porta',
            text: 'Precisa de uma porta RJ45 no computador ou de um adaptador USB',
            bucket: 'cabo',
            feedback: 'Muitos notebooks finos não têm a porta RJ45; um adaptador USB resolve.',
          },
          {
            id: 'sem-senha',
            text: 'Em casa, normalmente basta ligar no roteador, sem digitar senha de rede',
            bucket: 'cabo',
            feedback: 'Nos roteadores domésticos, as portas de cabo costumam não pedir senha: quem tem acesso físico ao aparelho já está dentro.',
          },
        ],
      },
      {
        id: 'wifi-02',
        kind: 'quiz',
        title: '2,4 GHz ou 5 GHz',
        context:
          'O roteador cria duas redes: **Casa** (2,4 GHz) e **Casa_5G** (5 GHz). Você vai trabalhar no quarto mais distante, com duas paredes no caminho.',
        prompt: 'Qual rede tende a funcionar melhor lá?',
        hint: 'Frequências mais baixas atravessam obstáculos com mais facilidade.',
        explanation:
          'Roteadores de banda dupla oferecem **2,4 GHz** (maior alcance, menor velocidade, mais interferência) e **5 GHz** (mais rápida, menor alcance). Perto do roteador, prefira 5 GHz; longe, 2,4 GHz. Muitos roteadores modernos juntam as duas num só nome e escolhem sozinhos.',
        concept: 'wifi-ethernet',
        options: [
          {
            id: 'a',
            text: 'Casa (2,4 GHz): alcança mais longe e atravessa melhor as paredes, embora seja mais lenta.',
            correct: true,
            feedback: 'Isso. Longe do roteador, o alcance importa mais do que a velocidade máxima.',
          },
          {
            id: 'b',
            text: 'Casa_5G (5 GHz), porque é sempre mais rápida, em qualquer lugar.',
            feedback:
              'A faixa de 5 GHz é mais rápida perto do roteador, mas perde força com distância e paredes. Longe, pode ficar instável ou nem conectar.',
          },
          {
            id: 'c',
            text: 'Tanto faz: as duas têm o mesmo alcance.',
            feedback: 'As frequências se comportam de forma diferente: 2,4 GHz alcança mais; 5 GHz é mais rápida, com alcance menor.',
          },
          {
            id: 'd',
            text: 'Casa_5G, porque usa a rede 5G da operadora de celular.',
            feedback: 'Confusão comum! O "5G" no nome da rede Wi-Fi se refere à frequência de 5 GHz, não à rede móvel 5G.',
          },
        ],
      },
    ],
    debrief:
      'Um bom diagnóstico isola antes de agir: testar outro aparelho mostrou que o problema era da rede, não do notebook. Depois vieram as ações simples e reversíveis: reiniciar o roteador (nunca resetar) e reconectar o Wi-Fi. Para conexões críticas, prefira o cabo; no Wi-Fi, escolha a faixa certa para a distância.',
    platformNote:
      'No Windows 11, o Wi-Fi fica nas Configurações rápidas ({{Win+A}}); no macOS, no ícone de Wi-Fi da barra de menus. As luzes e seus nomes variam entre roteadores: consulte a etiqueta ou o manual do aparelho.',
  },

  // -------------------------------------------------------------------------
  // d02 — Disco cheio
  // -------------------------------------------------------------------------
  {
    id: 'd02-disco-cheio',
    version: 1,
    sector: 'diagnostico',
    order: 2,
    title: 'Disco cheio',
    summary: 'Descobrir o que ocupa o disco e liberar espaço sem apagar nada importante.',
    briefing:
      'O disco do computador da recepção do Nexo está no limite, e o sistema já não consegue nem se atualizar. Descubra o que está ocupando espaço e libere o necessário sem apagar nada importante, e sem cair em promessas de "limpadores milagrosos".',
    category: 'diagnostico',
    subcategory: 'Armazenamento',
    difficulty: 2,
    estimatedMinutes: 10,
    prerequisites: [],
    objectives: [
      'Ver o que ocupa espaço no disco',
      'Liberar espaço com as ferramentas do próprio sistema',
      'Identificar arquivos grandes e desnecessários',
      'Esvaziar a Lixeira para recuperar o espaço de verdade',
    ],
    concepts: ['armazenamento-espaco'],
    steps: [
      {
        id: 'disco-01',
        kind: 'diagnosis',
        title: 'Disco no limite',
        prompt: 'Investigue o que ocupa o disco e libere espaço com segurança.',
        hint: 'Antes de apagar qualquer coisa, descubra o que está ocupando espaço. Comece pelo que o próprio sistema identifica como descartável.',
        explanation:
          'O caminho seguro foi **medir** (tela de Armazenamento), **limpar o descartável** (arquivos temporários) e **revisar o que é seu** (Downloads e Lixeira). Pastas do sistema, documentos e "limpadores milagrosos" ficam fora da lista.',
        concept: 'armazenamento-espaco',
        symptom: 'Aviso do Windows: "Espaço em disco insuficiente no Disco Local (C:)". As atualizações não são instaladas.',
        startStage: 'inicio',
        stages: [
          {
            id: 'inicio',
            situation: 'O disco C: tem 238 GB, e restam só 2 GB livres.',
            evidence: ['Windows Update: "Não há espaço suficiente para instalar a atualização"', 'O computador demora para salvar arquivos'],
            actions: [
              {
                id: 'ver-armazenamento',
                label: 'Abrir Configurações > Sistema > Armazenamento para ver o que ocupa espaço',
                result:
                  'O Windows mostra as categorias: Aplicativos 62 GB, Downloads 41 GB, Sistema e reservado 30 GB, Documentos 18 GB, Arquivos temporários 9 GB e Lixeira 7 GB, entre outras.',
                quality: 'best',
                next: 'analise',
              },
              {
                id: 'apagar-windows',
                label: 'Apagar arquivos grandes da pasta Windows, no disco C:',
                result:
                  'A pasta Windows guarda o próprio sistema. Apagar arquivos ali pode impedir o computador de ligar. Nunca mexa nela para liberar espaço.',
                quality: 'harmful',
              },
              {
                id: 'limpador',
                label: 'Instalar um "limpador milagroso" que promete liberar 100 GB com um clique',
                result:
                  'Programas "otimizadores" de origem duvidosa costumam trazer anúncios, coletar dados e apagar o que não devem. O Windows já tem ferramentas de limpeza seguras.',
                quality: 'harmful',
              },
              {
                id: 'hd-externo',
                label: 'Comprar um HD externo e mover tudo para ele',
                result:
                  'Pode ser útil um dia, mas você nem sabe ainda o que está ocupando espaço. Boa parte pode ser lixo descartável.',
                quality: 'poor',
              },
            ],
          },
          {
            id: 'analise',
            situation: 'Agora você sabe para onde o espaço foi.',
            evidence: [
              'Arquivos temporários: 9 GB (cache de atualizações, miniaturas, temporários)',
              'Downloads: 41 GB, com instaladores antigos e vídeos',
              'Lixeira: 7 GB',
              'Documentos: 18 GB (trabalhos e contratos)',
            ],
            actions: [
              {
                id: 'temporarios',
                label: 'Usar a limpeza de "Arquivos temporários" do próprio Windows',
                result:
                  'O Windows remove com segurança 9 GB de temporários e cache de atualizações. Agora são 11 GB livres. Melhorou, mas ainda é pouco.',
                quality: 'best',
                next: 'downloads',
              },
              {
                id: 'desinstalar',
                label: 'Desinstalar programas que você não usa há meses',
                result: 'Você remove dois jogos antigos e libera 8 GB. Ajudou, mas a maior categoria continua intocada.',
                quality: 'good',
                next: 'downloads',
              },
              {
                id: 'apagar-documentos',
                label: 'Apagar a pasta Documentos inteira, que ocupa 18 GB',
                result:
                  'Documentos guarda trabalhos e contratos. Apagar sem olhar é trocar um problema de espaço por uma perda que pode ser irreparável.',
                quality: 'harmful',
              },
              {
                id: 'desativar-update',
                label: 'Desativar o Windows Update para ele não ocupar mais espaço',
                result:
                  'As atualizações corrigem falhas de segurança. Desligá-las deixa o computador vulnerável e não resolve a falta de espaço.',
                quality: 'harmful',
              },
            ],
          },
          {
            id: 'downloads',
            situation: 'Ainda falta espaço. A pasta Downloads, com 41 GB, é a maior candidata.',
            evidence: [
              'Downloads ordenada por tamanho: instaladores .exe de programas já instalados, um vídeo duplicado e arquivos compactados antigos',
              'Lixeira: 7 GB de arquivos excluídos há meses',
            ],
            actions: [
              {
                id: 'revisar-downloads',
                label: 'Ordenar Downloads por tamanho, apagar instaladores antigos e cópias duplicadas e, depois de conferir o conteúdo, esvaziar a Lixeira',
                result: 'Mais 35 GB livres. O Windows Update volta a funcionar. Problema resolvido, sem tocar em nada importante.',
                quality: 'best',
                resolves: true,
              },
              {
                id: 'mover-externo',
                label: 'Mover vídeos e fotos pessoais para um HD externo ou para a nuvem, mantendo uma cópia de segurança',
                result:
                  'Também libera bastante espaço, mas os instaladores inúteis continuam lá. Combinada com a revisão dos Downloads, o resultado seria ainda melhor.',
                quality: 'good',
                resolves: true,
              },
              {
                id: 'esvaziar-sem-olhar',
                label: 'Esvaziar a Lixeira sem olhar o que tem nela',
                result:
                  'Libera 7 GB, mas, se houvesse algo importante lá, estaria perdido. E Downloads, a maior categoria, continua igual.',
                quality: 'poor',
              },
            ],
          },
        ],
      },
      {
        id: 'disco-02',
        kind: 'filesystem',
        title: 'Faxina nos Downloads',
        context: 'Hora de pôr a mão na massa na pasta Downloads. Observe a coluna **Tamanho**.',
        prompt:
          'Libere espaço: apague os dois instaladores antigos e a cópia duplicada do vídeo, mantenha o vídeo original e esvazie a Lixeira. Não apague documentos importantes.',
        hint: 'Instaladores (.exe) de programas já instalados podem ser baixados de novo do site oficial. Na dupla de vídeos, a cópia tem "(1)" no nome. E lembre: excluir manda para a Lixeira, que ainda ocupa espaço.',
        explanation:
          'Instaladores antigos e cópias duplicadas estão entre os maiores desperdícios de espaço. Excluir apenas move para a **Lixeira**, que continua ocupando o disco; o espaço só volta quando ela é esvaziada. Por isso, confira a Lixeira antes de esvaziar: depois disso, não há como restaurar.',
        concept: 'armazenamento-espaco',
        root: [
          { name: 'Área de Trabalho', type: 'folder', children: [] },
          {
            name: 'Documentos',
            type: 'folder',
            children: [{ name: 'orcamento-2026.xlsx', type: 'file', sizeKb: 48 }],
          },
          {
            name: 'Downloads',
            type: 'folder',
            children: [
              { name: 'setup-jogo-corrida-2021.exe', type: 'file', sizeKb: 4194304 },
              { name: 'instalador-editor-video-v2.exe', type: 'file', sizeKb: 1536000 },
              { name: 'video-aniversario.mp4', type: 'file', sizeKb: 2867200 },
              { name: 'video-aniversario (1).mp4', type: 'file', sizeKb: 2867200 },
              { name: 'contrato-aluguel.pdf', type: 'file', sizeKb: 420 },
              { name: 'curriculo-2026.docx', type: 'file', sizeKb: 64 },
              { name: 'cardapio-restaurante.pdf', type: 'file', sizeKb: 880 },
            ],
          },
          { name: 'Imagens', type: 'folder', children: [] },
          { name: 'Músicas', type: 'folder', children: [] },
          { name: 'Vídeos', type: 'folder', children: [] },
        ],
        trash: [
          { name: 'filme-gravado-tv.mp4', type: 'file', sizeKb: 5242880 },
          { name: 'planilha-rascunho.xlsx', type: 'file', sizeKb: 30 },
        ],
        startPath: '/Downloads',
        goals: [
          { type: 'notExists', path: '/Downloads/setup-jogo-corrida-2021.exe', label: 'Apague o instalador antigo do jogo (4 GB)' },
          { type: 'notExists', path: '/Downloads/instalador-editor-video-v2.exe', label: 'Apague o instalador antigo do editor de vídeo' },
          { type: 'notExists', path: '/Downloads/video-aniversario (1).mp4', label: 'Apague a cópia duplicada do vídeo (a que tem "(1)" no nome)' },
          { type: 'exists', path: '/Downloads/video-aniversario.mp4', nodeType: 'file', label: 'Mantenha o vídeo original' },
          { type: 'trashEmpty', label: 'Esvazie a Lixeira para liberar o espaço de verdade' },
        ],
        features: { delete: true, trash: true },
        protectedPaths: ['/Downloads/contrato-aluguel.pdf', '/Downloads/curriculo-2026.docx', '/Documentos/orcamento-2026.xlsx'],
      },
      {
        id: 'disco-03',
        kind: 'quiz',
        title: 'Para não lotar de novo',
        prompt: 'Qual medida ajuda a evitar que o disco lote outra vez?',
        hint: 'A melhor prevenção é automática e vem do próprio sistema.',
        explanation:
          'Mantenha pelo menos 10% a 15% do disco livre: o sistema precisa de espaço para atualizações, arquivos temporários e memória virtual. O **Sensor de Armazenamento** do Windows e as recomendações de Armazenamento do macOS automatizam boa parte dessa manutenção.',
        concept: 'armazenamento-espaco',
        options: [
          {
            id: 'a',
            text: 'Ativar o Sensor de Armazenamento, que apaga temporários e esvazia a Lixeira periodicamente, e revisar a pasta Downloads de tempos em tempos.',
            correct: true,
            feedback:
              'Isso. O Sensor de Armazenamento faz a limpeza segura por você, e a revisão periódica dos Downloads evita o acúmulo de arquivos grandes.',
          },
          {
            id: 'b',
            text: 'Deixar um "otimizador" de terceiros rodando o tempo todo.',
            feedback:
              'Além de consumir memória e processador, muitos desses programas exibem anúncios e alarmes exagerados. A ferramenta do sistema faz o mesmo com segurança.',
          },
          {
            id: 'c',
            text: 'Desativar as atualizações para não baixarem arquivos grandes.',
            feedback: 'Atualizações de segurança são essenciais. A solução é manter espaço livre para elas, não bloqueá-las.',
          },
          {
            id: 'd',
            text: 'Salvar tudo na Área de Trabalho para enxergar o que ocupa espaço.',
            feedback: 'A Área de Trabalho fica no mesmo disco e, lotada, só deixa tudo mais bagunçado. Organize em pastas e revise as maiores.',
          },
        ],
      },
    ],
    debrief:
      'Disco cheio se resolve com método: medir o que ocupa espaço, limpar primeiro o que o sistema garante ser descartável e depois revisar seus próprios arquivos maiores. A Lixeira só libera espaço quando é esvaziada, e apagar pastas do sistema ou instalar "limpadores milagrosos" cria problemas piores que a falta de espaço.',
    platformNote:
      'Windows 10 e 11: Configurações > Sistema > Armazenamento (onde fica o Sensor de Armazenamento). macOS: Ajustes do Sistema > Geral > Armazenamento, com a opção de esvaziar a Lixeira automaticamente após 30 dias. No celular: Configurações > Armazenamento (Android) ou Ajustes > Geral > Armazenamento do iPhone.',
  },

  // -------------------------------------------------------------------------
  // d03 — Programa travado
  // -------------------------------------------------------------------------
  {
    id: 'd03-programa-travado',
    version: 1,
    sector: 'diagnostico',
    order: 3,
    title: 'Programa travado',
    summary: 'Lidar com um programa que parou de responder sem perder trabalho nem derrubar o sistema.',
    briefing:
      'Uma planilha crucial do Nexo congelou no meio do trabalho, e o título da janela diz "Não está respondendo". O impulso é sair clicando ou apertar o botão de desligar. Um bom agente sabe esperar, observar e encerrar só o que travou.',
    category: 'diagnostico',
    subcategory: 'Travamentos',
    difficulty: 2,
    estimatedMinutes: 8,
    prerequisites: [],
    objectives: [
      'Reagir com calma a um programa que parou de responder',
      'Usar o Gerenciador de Tarefas para entender e encerrar só o que travou',
      'Isolar a causa de travamentos repetidos',
    ],
    concepts: ['gerenciador-tarefas', 'diagnostico-metodo'],
    steps: [
      {
        id: 'trava-01',
        kind: 'diagnosis',
        title: 'Planilha congelada',
        prompt: 'Resolva o travamento perdendo o mínimo possível de trabalho.',
        hint: 'Programas ocupados às vezes só precisam de tempo ou de recursos. Forçar o fechamento é o penúltimo recurso; desligar no botão é o último.',
        explanation:
          'A sequência segura é: **esperar** (o programa pode estar processando), **observar** no Gerenciador de Tarefas (memória quase cheia explica muito), **liberar recursos** fechando o que não é necessário e, se não bastar, **finalizar só a tarefa travada**. Desligar no botão é o último recurso.',
        concept: 'gerenciador-tarefas',
        symptom: 'A janela da planilha ficou branca e o título mostra "(Não está respondendo)". Os últimos 20 minutos de trabalho não foram salvos.',
        startStage: 'inicio',
        stages: [
          {
            id: 'inicio',
            situation: 'Você tinha acabado de colar 50 mil linhas e aplicar uma fórmula a todas elas.',
            evidence: [
              'Título: "Custos 2026.xlsx (Não está respondendo)"',
              'Cursor: círculo girando',
              'Outros programas, como o navegador, funcionam normalmente',
            ],
            actions: [
              {
                id: 'esperar',
                label: 'Esperar um ou dois minutos sem clicar na janela',
                result:
                  'Com tanto dado, o programa podia só estar ocupado. Depois de dois minutos, porém, continua sem responder. Pelo menos você deu a ele a chance de terminar sem perder nada.',
                quality: 'best',
                next: 'espera',
              },
              {
                id: 'gerenciador',
                label: 'Abrir na hora o Gerenciador de Tarefas (Ctrl+Shift+Esc) para observar',
                result:
                  'O Gerenciador abre e mostra o que está acontecendo. Teria valido esperar um pouco antes: programas ocupados às vezes se recuperam sozinhos.',
                quality: 'good',
                next: 'gerenciador',
              },
              {
                id: 'clicar',
                label: 'Clicar várias vezes na janela e apertar teclas para "acordar" o programa',
                result:
                  'Os cliques entram numa fila e podem ser executados quando o programa voltar, com efeitos inesperados. E o Windows passa a oferecer o fechamento do programa, que você não quer agora.',
                quality: 'poor',
              },
              {
                id: 'desligar',
                label: 'Segurar o botão de energia até o computador desligar',
                result:
                  'Desligar à força fecha todos os programas de uma vez, sem salvar nada, e pode corromper arquivos que estavam sendo gravados. É o último recurso, não o primeiro.',
                quality: 'harmful',
              },
            ],
          },
          {
            id: 'espera',
            situation: 'Dois minutos depois, a planilha continua congelada.',
            evidence: ['O título ainda mostra "(Não está respondendo)"'],
            actions: [
              {
                id: 'abrir-gt',
                label: 'Abrir o Gerenciador de Tarefas (Ctrl+Shift+Esc)',
                result: 'O Gerenciador de Tarefas abre na lista de processos, com o consumo de cada programa.',
                quality: 'best',
                next: 'gerenciador',
              },
              {
                id: 'reiniciar',
                label: 'Reiniciar o computador pelo menu Iniciar',
                result:
                  'O Windows tenta fechar todos os programas e fica esperando a planilha. Além disso, fecha também os programas que estavam funcionando. Há um jeito de agir só no que travou.',
                quality: 'poor',
              },
              {
                id: 'desinstalar',
                label: 'Desinstalar o programa de planilhas',
                result:
                  'Desinstalar não destrava a janela aberta, e depois você ainda teria de reinstalar tudo. O problema é um travamento momentâneo, não o programa em si.',
                quality: 'poor',
              },
            ],
          },
          {
            id: 'gerenciador',
            situation: 'O Gerenciador de Tarefas mostra os processos em execução.',
            evidence: [
              'Planilhas: "Não respondendo", CPU 25%, Memória 3.900 MB',
              'Navegador (28 abas): Memória 2.600 MB',
              'Memória total em uso: 96%',
            ],
            actions: [
              {
                id: 'liberar-memoria',
                label: 'Fechar o navegador para liberar memória e esperar mais um pouco',
                result:
                  'Com memória livre, a planilha termina o cálculo e volta a responder em 30 segundos, sem perder nada. Nem sempre funciona, mas vale tentar antes de forçar o fechamento de um programa com trabalho não salvo.',
                quality: 'best',
                resolves: true,
              },
              {
                id: 'finalizar',
                label: 'Selecionar a planilha e clicar em "Finalizar tarefa"',
                result:
                  'A planilha fecha. Ao reabri-la, o programa oferece a versão salva automaticamente e você perde só os últimos minutos. Resolveu, mas com a memória em 96%, liberar recursos poderia ter salvado tudo.',
                quality: 'good',
                resolves: true,
              },
              {
                id: 'finalizar-sistema',
                label: 'Finalizar processos do Windows que você não reconhece, como "Host de Serviço"',
                result:
                  'Processos do sistema mantêm o Windows funcionando. Finalizá-los pode causar erros, fazer a tela piscar ou reiniciar o computador, perdendo o trabalho de todos os programas.',
                quality: 'harmful',
              },
            ],
          },
        ],
      },
      {
        id: 'trava-02',
        kind: 'order',
        title: 'Protocolo antitravamento',
        prompt: 'Coloque em ordem o procedimento para lidar com um programa que parou de responder.',
        hint: 'Comece pelo que não tem risco nenhum e termine recuperando o trabalho.',
        explanation:
          'Do menos ao mais invasivo: esperar, fechar normalmente e só então forçar o fechamento pelo Gerenciador de Tarefas ({{Ctrl+Shift+Esc}}). Muitos programas de escritório salvam cópias automáticas, por isso vale reabrir e procurar a opção de recuperação.',
        concept: 'gerenciador-tarefas',
        items: [
          { id: 'esperar', text: 'Esperar um pouco: o programa pode estar só processando' },
          { id: 'fechar', text: 'Tentar fechar normalmente, pelo X ou com Alt+F4' },
          { id: 'abrir-gt', text: 'Abrir o Gerenciador de Tarefas com Ctrl+Shift+Esc' },
          { id: 'finalizar', text: 'Selecionar o programa marcado como "Não respondendo" e clicar em "Finalizar tarefa"' },
          { id: 'recuperar', text: 'Reabrir o programa e recuperar a versão salva automaticamente' },
        ],
      },
      {
        id: 'trava-03',
        kind: 'quiz',
        title: 'Trava sempre no mesmo lugar',
        context:
          'Nos últimos dias, o editor de textos trava **sempre** que você abre o arquivo `relatorio-final.docx`. Todos os outros documentos abrem normalmente.',
        prompt: 'O que esse padrão indica?',
        hint: 'Compare o que falha com o que funciona. O que o caso que falha tem de diferente?',
        explanation:
          'Diagnóstico é comparação: o mesmo programa funciona com outros arquivos e falha com um só, então a causa está no que é diferente, o arquivo. Isolar a variável evita ações caras e inúteis, como reinstalar ou formatar.',
        concept: 'diagnostico-metodo',
        options: [
          {
            id: 'a',
            text: 'O problema provavelmente está nesse arquivo (corrompido ou pesado demais), não no programa. Vale tentar abri-lo em outro programa ou recuperar uma versão anterior.',
            correct: true,
            feedback:
              'Isso. Se só um arquivo provoca o travamento, a causa foi isolada. Muitos editores têm a opção "Abrir e Reparar", e serviços de nuvem costumam guardar versões anteriores.',
          },
          {
            id: 'b',
            text: 'O computador está com vírus e precisa ser formatado.',
            feedback: 'Nada aponta para vírus: todos os outros arquivos funcionam. Formatar seria uma ação drástica baseada num palpite.',
          },
          {
            id: 'c',
            text: 'O editor de textos está com defeito e precisa ser reinstalado.',
            feedback: 'Se o programa estivesse com defeito, outros arquivos também falhariam. Reinstalar provavelmente não resolve.',
          },
          {
            id: 'd',
            text: 'O computador precisa de mais memória RAM.',
            feedback: 'Falta de memória afetaria vários arquivos e programas, não só um. O padrão aponta para o arquivo.',
          },
        ],
      },
    ],
    debrief:
      'Programa travado pede calma: espere, observe no Gerenciador de Tarefas e libere recursos antes de forçar qualquer coisa. Se precisar, finalize só a tarefa travada, nunca processos do sistema nem o computador inteiro no botão. Quando o travamento se repete, compare os casos para isolar a causa.',
    platformNote:
      'No macOS, o equivalente é Forçar Encerrar ({{Cmd+Option+Esc}}), e o Monitor de Atividade faz o papel do Gerenciador de Tarefas. No Windows 11, o Gerenciador de Tarefas também abre pelo clique direito no botão Iniciar.',
  },

  // -------------------------------------------------------------------------
  // d04 — O arquivo que não abre
  // -------------------------------------------------------------------------
  {
    id: 'd04-arquivo-nao-abre',
    version: 1,
    sector: 'diagnostico',
    order: 4,
    title: 'O arquivo que não abre',
    summary: 'Entender a relação entre extensão e programa padrão e corrigir arquivos que abrem errado.',
    briefing:
      'Um arquivo importante chegou ao Nexo, mas se recusa a abrir direito: ou abre no programa errado, ou o sistema pergunta com o que abrir. A causa quase sempre está na dupla extensão e programa padrão. Descubra qual dos dois falhou.',
    category: 'diagnostico',
    subcategory: 'Arquivos e programas',
    difficulty: 2,
    estimatedMinutes: 9,
    prerequisites: ['d03-programa-travado'],
    objectives: [
      'Entender por que o sistema não sabe abrir um arquivo',
      'Corrigir o programa padrão de um tipo de arquivo',
      'Usar "Abrir com" uma única vez ou como padrão',
      'Lidar com formatos pouco comuns sem renomear extensões',
    ],
    concepts: ['abrir-com', 'extensoes-arquivo'],
    steps: [
      {
        id: 'abrir-01',
        kind: 'quiz',
        title: 'Como deseja abrir?',
        context:
          'Num computador sem pacote de escritório, você dá duplo clique em `ata-reuniao.odt` e o Windows pergunta: **"Como você deseja abrir este arquivo?"**',
        prompt: 'Por que isso acontece?',
        hint: 'O que o sistema olha no nome do arquivo para decidir qual programa usar?',
        explanation:
          'A **extensão** (`.odt`, `.pdf`, `.jpg`) indica o formato do arquivo, e cada extensão tem um **programa padrão**. O `.odt` é o formato de texto do padrão OpenDocument, usado pelo LibreOffice e também aberto pelo Word. Basta instalar ou escolher um programa compatível.',
        concept: 'extensoes-arquivo',
        options: [
          {
            id: 'a',
            text: 'Nenhum programa instalado está registrado para abrir arquivos com a extensão `.odt`.',
            correct: true,
            feedback: 'Exato. O sistema usa a extensão para escolher o programa. Sem programa associado, ele pergunta a você.',
          },
          {
            id: 'b',
            text: 'O arquivo está com vírus.',
            feedback: 'A pergunta não tem relação com vírus: aparece sempre que o sistema não conhece um programa para aquela extensão.',
          },
          {
            id: 'c',
            text: 'O arquivo está corrompido.',
            feedback: 'Um arquivo corrompido costuma abrir com erro no programa certo. A pergunta indica que nem há programa escolhido.',
          },
          {
            id: 'd',
            text: 'A internet está desconectada.',
            feedback: 'Abrir um arquivo salvo no computador não depende de internet. A pergunta é sobre qual programa usar.',
          },
        ],
      },
      {
        id: 'abrir-02',
        kind: 'diagnosis',
        title: 'O PDF de símbolos',
        prompt: 'Descubra a causa e faça os PDFs voltarem a abrir corretamente.',
        hint: 'Antes de mexer no arquivo, descubra se o problema é só dele ou de todos os arquivos do mesmo tipo.',
        explanation:
          'Quando **todos** os arquivos de um tipo abrem no programa errado, o culpado é o **programa padrão**, muitas vezes alterado por algum instalador. "Abrir com" com a opção de usar sempre, ou a tela de Aplicativos padrão, resolve. O arquivo em si estava perfeito.',
        concept: 'abrir-com',
        symptom: 'Ao dar duplo clique em `planta-baixa.pdf`, o Bloco de Notas abre cheio de símbolos estranhos.',
        startStage: 'inicio',
        stages: [
          {
            id: 'inicio',
            situation: 'O arquivo chegou por e-mail de um cliente conhecido.',
            evidence: [
              'O Bloco de Notas mostra "%PDF-1.7" na primeira linha, seguido de símbolos',
              'Ontem você instalou um programa clicando em "Avançar" em todas as telas',
            ],
            actions: [
              {
                id: 'testar-outros',
                label: 'Abrir outros PDFs do computador para comparar',
                result:
                  'Todos os PDFs abrem no Bloco de Notas, até os antigos que sempre funcionaram. O problema não é este arquivo: é o programa padrão para .pdf.',
                quality: 'best',
                next: 'associacao',
              },
              {
                id: 'reenviar',
                label: 'Pedir ao cliente para reenviar o arquivo',
                result: 'O cliente reenvia e acontece a mesma coisa. Você ainda não tinha testado se o problema era mesmo do arquivo.',
                quality: 'poor',
              },
              {
                id: 'editar',
                label: 'Apagar os símbolos estranhos no Bloco de Notas e salvar',
                result: 'Esses "símbolos" são os dados do PDF. Apagar e salvar destrói o arquivo de vez.',
                quality: 'harmful',
              },
              {
                id: 'conversor',
                label: 'Baixar um "conversor de PDF grátis" num site cheio de anúncios',
                result:
                  'Instaladores de sites desconhecidos são porta de entrada para programas indesejados. E o computador já sabe ler PDF: só está usando o programa errado.',
                quality: 'harmful',
              },
            ],
          },
          {
            id: 'associacao',
            situation: 'Todos os arquivos .pdf estão associados ao Bloco de Notas, provavelmente por causa da instalação de ontem.',
            evidence: ['Clique direito num PDF > Propriedades: "Abre com: Bloco de Notas"'],
            actions: [
              {
                id: 'abrir-com-sempre',
                label: 'Clique direito no PDF > Abrir com > Escolher outro aplicativo > escolher o navegador ou o leitor de PDF > Sempre',
                result: 'Os PDFs voltam a abrir corretamente com duplo clique. Problema resolvido em poucos segundos.',
                quality: 'best',
                resolves: true,
              },
              {
                id: 'apps-padrao',
                label: 'Ir em Configurações > Aplicativos > Aplicativos padrão e definir o leitor de PDF para .pdf',
                result: 'Também resolve: é o mesmo ajuste por outro caminho, útil para corrigir vários tipos de arquivo de uma vez.',
                quality: 'good',
                resolves: true,
              },
              {
                id: 'renomear',
                label: 'Renomear o arquivo para planta-baixa.txt',
                result: 'Mudar a extensão não converte o arquivo: agora ele abre no Bloco de Notas "de propósito" e continua ilegível.',
                quality: 'poor',
              },
              {
                id: 'reinstalar-windows',
                label: 'Reinstalar o Windows',
                result:
                  'Uma associação de arquivo errada se corrige em segundos. Reinstalar o sistema leva horas e pode causar perda de dados.',
                quality: 'harmful',
              },
            ],
          },
        ],
      },
      {
        id: 'abrir-03',
        kind: 'quiz',
        title: 'Só desta vez',
        context: 'Suas fotos `.jpg` abrem no visualizador de fotos, e você gosta assim. Hoje, porém, quer editar **uma** foto no editor de imagens.',
        prompt: 'Qual é o jeito certo?',
        hint: 'Existe uma opção no clique direito que deixa você escolher o programa para um único arquivo.',
        explanation:
          '**Abrir com** permite escolher o programa caso a caso. Marcar a opção de **usar sempre** muda o padrão para todos os arquivos daquele tipo. Saber a diferença evita bagunçar as associações do sistema.',
        concept: 'abrir-com',
        options: [
          {
            id: 'a',
            text: 'Clicar com o botão direito na foto > Abrir com > escolher o editor, sem marcar a opção de usar sempre.',
            correct: true,
            feedback: 'Isso. Sem marcar "Sempre", a foto abre no editor só desta vez, e o padrão continua sendo o visualizador.',
          },
          {
            id: 'b',
            text: 'Mudar o programa padrão de .jpg para o editor e, depois, voltar para o visualizador.',
            feedback: 'Funciona, mas dá trabalho dobrado e é fácil esquecer de voltar. "Abrir com" resolve sem mudar o padrão.',
          },
          {
            id: 'c',
            text: 'Renomear a foto para `.psd`, para o editor reconhecê-la.',
            feedback:
              'Renomear a extensão não converte o formato e pode fazer o arquivo não abrir em lugar nenhum. A extensão deve corresponder ao conteúdo.',
          },
          {
            id: 'd',
            text: 'Copiar a foto para a pasta onde o editor está instalado.',
            feedback: 'A pasta do programa guarda os arquivos dele, não os seus. Copiar a foto para lá não muda com o que ela abre.',
          },
        ],
      },
      {
        id: 'abrir-04',
        kind: 'quiz',
        title: 'Fotos do iPhone',
        context:
          'Uma amiga passou fotos do iPhone para o seu PC com Windows. Os arquivos terminam em `.heic` e não abrem no visualizador.',
        prompt: 'Qual é a solução mais adequada?',
        hint: 'O problema não é a foto: é o sistema não conhecer o formato.',
        explanation:
          'Formatos novos ou típicos de uma plataforma precisam de um programa ou extensão que os entenda. A solução é **instalar o leitor certo**, de fonte oficial, ou **converter** com uma ferramenta confiável. Renomear a extensão nunca converte o conteúdo.',
        concept: 'extensoes-arquivo',
        options: [
          {
            id: 'a',
            text: 'Instalar a extensão oficial de imagens HEIF pela Microsoft Store, ou pedir que ela envie as fotos já convertidas para JPEG.',
            correct: true,
            feedback:
              'Isso. O HEIC é um formato eficiente usado pela Apple, e a extensão oficial ensina o Windows a lê-lo. No iPhone, Ajustes > Fotos > "Transferir para Mac ou PC: Automático" converte as fotos ao transferir.',
          },
          {
            id: 'b',
            text: 'Renomear todas de `.heic` para `.jpg`.',
            feedback:
              'O conteúdo continua sendo HEIC: renomear não converte. Alguns programas até abrem mesmo assim, mas outros vão acusar erro ou arquivo corrompido.',
          },
          {
            id: 'c',
            text: 'Baixar um "abridor universal de arquivos" do primeiro site que aparecer na pesquisa.',
            feedback:
              'Programas "abre-tudo" de sites desconhecidos são isca comum de adware. Use a extensão oficial da loja do sistema ou um conversor confiável.',
          },
          {
            id: 'd',
            text: 'Concluir que as fotos estão corrompidas e pedir que ela tire de novo.',
            feedback: 'As fotos estão perfeitas: o Windows só não tem o leitor desse formato instalado.',
          },
        ],
      },
    ],
    debrief:
      'Cada arquivo tem uma extensão, e cada extensão um programa padrão. Quando nada abre, falta um programa compatível; quando abre no programa errado, a associação foi trocada. "Abrir com" escolhe o programa uma vez ou para sempre, e renomear a extensão nunca converte o arquivo.',
    platformNote:
      'Windows 11: Configurações > Aplicativos > Aplicativos padrão. macOS: selecione o arquivo, pressione {{Cmd+I}} (Obter Informações) e use "Abrir com" > "Alterar Tudo...". Android: Configurações > Apps > Apps padrão.',
  },

  // -------------------------------------------------------------------------
  // d05 — Cadê o som?
  // -------------------------------------------------------------------------
  {
    id: 'd05-cade-o-som',
    version: 1,
    sector: 'diagnostico',
    order: 5,
    title: 'Cadê o som?',
    summary: 'Seguir o caminho do áudio para resolver falta de som e de microfone, e lidar com drivers com segurança.',
    briefing:
      'Silêncio total na central de comunicações do Nexo: o vídeo roda, mas nenhum som sai. Antes de culpar o hardware, confira o caminho que o som percorre, do aplicativo até o alto-falante. Quase sempre o problema está numa configuração no meio do caminho.',
    category: 'diagnostico',
    subcategory: 'Áudio',
    difficulty: 2,
    estimatedMinutes: 10,
    prerequisites: ['d01-sem-internet'],
    objectives: [
      'Conferir volume, dispositivo de saída e mixer',
      'Configurar som e microfone para uma chamada',
      'Saber onde obter drivers confiáveis',
      'Desfazer uma atualização de driver problemática',
    ],
    concepts: ['configuracoes-som', 'drivers'],
    steps: [
      {
        id: 'som-01',
        kind: 'diagnosis',
        title: 'O vídeo mudo',
        prompt: 'Descubra onde o som está se perdendo e resolva.',
        hint: 'Siga o caminho do som: aplicativo, volume do sistema, dispositivo de saída, alto-falante. E lembre do que mudou desde a última vez que funcionou.',
        explanation:
          'O som passa por várias etapas: volume do app, volume do sistema e **dispositivo de saída**. Depois de usar TV, monitor ou fone, o sistema às vezes continua mandando o som para lá. Perguntar "o que mudou desde que funcionava?" leva direto à causa.',
        concept: 'configuracoes-som',
        symptom: 'Um vídeo no navegador está rodando, mas não sai som nenhum do notebook.',
        startStage: 'inicio',
        stages: [
          {
            id: 'inicio',
            situation: 'Ontem à noite você ligou o notebook na TV da sala pelo cabo HDMI para ver um filme. Hoje o cabo já foi desconectado.',
            evidence: ['Ícone de volume na barra de tarefas: sem o símbolo de mudo', 'O vídeo está tocando: a barra de progresso anda'],
            actions: [
              {
                id: 'conferir-volume',
                label: 'Conferir o volume do sistema e o volume do próprio player do vídeo',
                result:
                  'O volume do sistema está em 60% e o player não está no mudo. Ao abrir o painel de som, você nota um detalhe: o dispositivo de saída selecionado é "TV Sala (HDMI)".',
                quality: 'best',
                next: 'saida',
              },
              {
                id: 'reiniciar',
                label: 'Reiniciar o notebook',
                result:
                  'Depois de reiniciar, continua sem som. Você gastou alguns minutos, mas descartou um travamento temporário. Ao abrir o painel de som, aparece o detalhe: a saída selecionada é "TV Sala (HDMI)".',
                quality: 'good',
                next: 'saida',
              },
              {
                id: 'driver-site',
                label: 'Baixar um "pacote de drivers de áudio" num site de downloads desconhecido',
                result:
                  'Antes de qualquer verificação, você instalaria software de origem duvidosa, com risco real de malware. E o problema nem é de driver.',
                quality: 'harmful',
              },
              {
                id: 'desinstalar-audio',
                label: 'Desinstalar o dispositivo de áudio no Gerenciador de Dispositivos',
                result:
                  'Ação invasiva cedo demais: o Windows reinstala o dispositivo ao reiniciar e nada muda. O problema está em outro ponto do caminho.',
                quality: 'poor',
              },
            ],
          },
          {
            id: 'saida',
            situation: 'O som está indo para a TV, que nem está mais conectada.',
            evidence: ['Saída atual: TV Sala (HDMI)', 'Outras opções: Alto-falantes do notebook; Fone Bluetooth (desconectado)'],
            actions: [
              {
                id: 'trocar-saida',
                label: 'Escolher "Alto-falantes do notebook" como dispositivo de saída',
                result: 'O som volta na hora. O sistema tinha mantido a TV como saída escolhida. Problema resolvido.',
                quality: 'best',
                resolves: true,
              },
              {
                id: 'solucao-problemas',
                label: 'Executar a ferramenta de solução de problemas de áudio do sistema',
                result:
                  'A ferramenta percebe que a saída escolhida não está disponível e sugere trocar para os alto-falantes. Resolveu, só demorou um pouco mais do que trocar direto.',
                quality: 'good',
                resolves: true,
              },
              {
                id: 'volume-max',
                label: 'Aumentar o volume do sistema para 100%',
                result:
                  'Mais volume para uma TV desconectada continua sendo silêncio no notebook. E, quando o som voltar, vai vir altíssimo.',
                quality: 'poor',
              },
            ],
          },
        ],
      },
      {
        id: 'som-02',
        kind: 'settings',
        title: 'Pronto para a reunião',
        context:
          'Em cinco minutos você entra numa reunião pelo navegador, com um **fone de ouvido com microfone** ligado no notebook. Ninguém pode ouvir a reunião pelos alto-falantes.',
        prompt: 'Ajuste as configurações para ouvir pelo fone e ser ouvido pelo microfone do fone.',
        hint: 'Confira quatro paradas: dispositivo de saída, dispositivo de entrada, volumes (inclusive o do navegador no mixer) e a permissão de microfone na privacidade.',
        explanation:
          'Numa chamada, o som depende de **saída** e **entrada** certas, de **volumes** acima de zero (o mixer tem um volume separado para cada app) e da **permissão de microfone**. Quando "ninguém me ouve", verifique a entrada e a privacidade antes de culpar o fone.',
        concept: 'configuracoes-som',
        panels: [
          {
            id: 'som',
            title: 'Som',
            groups: [
              {
                title: 'Saída',
                controls: [
                  {
                    id: 'saida',
                    type: 'select',
                    label: 'Escolha onde reproduzir o som',
                    options: [
                      { value: 'alto-falantes', label: 'Alto-falantes do notebook' },
                      { value: 'fone', label: 'Fone de ouvido' },
                      { value: 'hdmi', label: 'TV Sala (HDMI)' },
                    ],
                    initial: 'alto-falantes',
                  },
                  { id: 'volume', type: 'slider', label: 'Volume', min: 0, max: 100, step: 5, initial: 40, unit: '%' },
                ],
              },
              {
                title: 'Entrada',
                controls: [
                  {
                    id: 'entrada',
                    type: 'select',
                    label: 'Escolha um dispositivo para falar',
                    options: [
                      { value: 'mic-notebook', label: 'Microfone do notebook' },
                      { value: 'mic-fone', label: 'Microfone do fone de ouvido' },
                    ],
                    initial: 'mic-notebook',
                  },
                  { id: 'volume-mic', type: 'slider', label: 'Volume do microfone', min: 0, max: 100, step: 5, initial: 0, unit: '%' },
                ],
              },
            ],
          },
          {
            id: 'mixer',
            title: 'Mixer de volume',
            groups: [
              {
                title: 'Aplicativos',
                controls: [
                  { id: 'mixer-navegador', type: 'slider', label: 'Navegador', min: 0, max: 100, step: 5, initial: 0, unit: '%' },
                  { id: 'mixer-musica', type: 'slider', label: 'Player de música', min: 0, max: 100, step: 5, initial: 70, unit: '%' },
                ],
              },
            ],
          },
          {
            id: 'privacidade',
            title: 'Privacidade',
            groups: [
              {
                title: 'Microfone',
                controls: [
                  {
                    id: 'mic-apps',
                    type: 'toggle',
                    label: 'Permitir que aplicativos acessem o microfone',
                    description: 'Sem esta permissão, nenhum app consegue usar o microfone.',
                    initial: false,
                  },
                ],
              },
            ],
          },
        ],
        goals: [
          { control: 'saida', op: 'eq', value: 'fone', label: 'Som saindo pelo fone de ouvido' },
          { control: 'entrada', op: 'eq', value: 'mic-fone', label: 'Microfone do fone selecionado' },
          { control: 'volume-mic', op: 'gte', value: 50, label: 'Microfone com volume audível (50% ou mais)' },
          { control: 'mixer-navegador', op: 'gte', value: 50, label: 'Navegador com volume no mixer (50% ou mais)' },
          { control: 'mic-apps', op: 'eq', value: true, label: 'Aplicativos autorizados a usar o microfone' },
        ],
      },
      {
        id: 'som-03',
        kind: 'quiz',
        title: 'O triângulo amarelo',
        context:
          'Depois de uma grande atualização do sistema, nada resolve o som. No Gerenciador de Dispositivos, o item de áudio aparece com um **triângulo amarelo de alerta**.',
        prompt: 'De onde obter um driver de áudio confiável?',
        hint: 'Quem fabricou o hardware e quem mantém o sistema operacional são as fontes mais confiáveis.',
        explanation:
          'O **driver** é o programa que ensina o sistema a conversar com uma peça de hardware, como a placa de som. O triângulo amarelo indica que esse driver falhou ou está ausente. Busque drivers só no **Windows Update** ou no **site do fabricante**.',
        concept: 'drivers',
        options: [
          {
            id: 'a',
            text: 'Do Windows Update (inclusive das atualizações opcionais de driver) ou do site oficial do fabricante do notebook, na página do seu modelo.',
            correct: true,
            feedback:
              'Isso. São as duas fontes confiáveis: o Windows Update distribui drivers validados, e o fabricante publica os drivers certos para cada modelo.',
          },
          {
            id: 'b',
            text: 'De um programa "atualizador automático de drivers" anunciado num pop-up.',
            feedback: 'Muitos desses programas instalam drivers errados, exibem anúncios ou trazem malware. Não precisam ser instalados.',
          },
          {
            id: 'c',
            text: 'Do primeiro site que aparecer ao pesquisar "driver de som grátis".',
            feedback: 'Sites de drivers genéricos são uma fonte clássica de arquivos adulterados. O driver deve vir do fabricante ou do sistema.',
          },
          {
            id: 'd',
            text: 'De um pendrive com "drivers universais" que um amigo usou no computador dele.',
            feedback:
              'Drivers são específicos para cada hardware. Um driver de outro modelo pode não funcionar ou causar instabilidade, e a origem dele é desconhecida.',
          },
        ],
      },
      {
        id: 'som-04',
        kind: 'quiz',
        title: 'Parou depois de atualizar',
        context: 'O som funcionava perfeitamente até ontem, quando você instalou uma atualização do driver de áudio. Desde então, só chiado.',
        prompt: 'Qual é a ação mais direta?',
        hint: 'O que mudou entre "funcionava" e "não funciona"? Dá para desfazer só essa mudança?',
        explanation:
          'Quando um problema começa logo após uma mudança, desfazê-la é o teste mais lógico. **Reverter Driver** (Gerenciador de Dispositivos > dispositivo > Propriedades > guia Driver) volta à versão anterior. O botão só fica disponível quando existe uma versão anterior guardada.',
        concept: 'drivers',
        options: [
          {
            id: 'a',
            text: 'No Gerenciador de Dispositivos, abrir as propriedades do dispositivo de áudio e usar "Reverter Driver".',
            correct: true,
            feedback: 'Isso. Se o problema começou com o driver novo, voltar ao anterior é a correção mais direta e reversível.',
          },
          {
            id: 'b',
            text: 'Formatar o computador para começar do zero.',
            feedback: 'Ação desproporcional: a causa é conhecida (o driver novo) e existe um botão que desfaz exatamente essa mudança.',
          },
          {
            id: 'c',
            text: 'Comprar uma caixa de som nova.',
            feedback: 'O som funcionava até a atualização, então o alto-falante está bom. O problema é de software.',
          },
          {
            id: 'd',
            text: 'Desativar o antivírus, que pode estar bloqueando o som.',
            feedback: 'O antivírus não tem relação com o chiado, e desativá-lo deixa o computador desprotegido.',
          },
        ],
      },
    ],
    debrief:
      'Sem som? Siga o caminho do áudio: volume do app, volume do sistema, dispositivo de saída e permissões. A maioria dos casos se resolve aí. Se o problema for de driver, busque-o no Windows Update ou no site do fabricante, e lembre que Reverter Driver desfaz uma atualização problemática.',
    platformNote:
      'Windows 11: Configurações > Sistema > Som, com o Mixer de volume na mesma tela. Windows 10: Configurações > Sistema > Som > Opções avançadas de som. macOS: Ajustes do Sistema > Som; os drivers vêm com o próprio sistema, então o problema quase sempre é de configuração.',
  },

  // -------------------------------------------------------------------------
  // d06 — Computador lento
  // -------------------------------------------------------------------------
  {
    id: 'd06-computador-lento',
    version: 1,
    sector: 'diagnostico',
    order: 6,
    title: 'Computador lento',
    summary: 'Entender o papel de CPU, RAM e disco e tratar a lentidão a partir de números, não de palpites.',
    briefing:
      'O terminal mais antigo do Nexo leva minutos para ligar e se arrasta durante o uso. Para tratar lentidão, é preciso saber o papel de cada peça: processador, memória e armazenamento. Investigue os números antes de propor qualquer solução.',
    category: 'hardware',
    subcategory: 'Desempenho',
    difficulty: 3,
    estimatedMinutes: 12,
    prerequisites: ['d03-programa-travado'],
    objectives: [
      'Diferenciar CPU, RAM e armazenamento',
      'Entender a diferença de desempenho entre HD e SSD',
      'Reduzir os programas que abrem com o sistema',
      'Diagnosticar lentidão com o Gerenciador de Tarefas',
    ],
    concepts: ['cpu-ram-armazenamento', 'hdd-ssd', 'programas-inicializacao'],
    steps: [
      {
        id: 'peca-01',
        kind: 'classify',
        title: 'Cada peça no seu lugar',
        prompt: 'Classifique cada descrição: fala do processador (CPU), da memória RAM ou do armazenamento (SSD ou HD)?',
        hint: 'Pense numa cozinha: o cozinheiro (trabalha), a bancada (espaço para o que está em uso agora) e a despensa (guarda tudo, mesmo com a cozinha fechada).',
        explanation:
          'A **CPU** processa, a **RAM** guarda temporariamente o que está em uso e o **armazenamento** guarda tudo de forma permanente. Quando a RAM enche, o sistema passa a usar o armazenamento como memória extra, que é muito mais lento, e tudo se arrasta.',
        concept: 'cpu-ram-armazenamento',
        buckets: [
          { id: 'cpu', label: 'Processador (CPU)', description: 'Executa os cálculos' },
          { id: 'ram', label: 'Memória RAM', description: 'Espaço temporário do que está em uso' },
          { id: 'arm', label: 'Armazenamento (SSD/HD)', description: 'Guarda arquivos de forma permanente' },
        ],
        items: [
          {
            id: 'calculos',
            text: 'Faz os cálculos e executa as instruções dos programas',
            bucket: 'cpu',
            feedback: 'É o "cérebro" que executa as instruções. Velocidade em GHz e número de núcleos dão uma ideia da sua capacidade.',
          },
          {
            id: 'video',
            text: 'Fica perto de 100% de uso ao exportar um vídeo longo',
            bucket: 'cpu',
            feedback: 'Exportar vídeo exige muito cálculo, por isso o processador trabalha no limite.',
          },
          {
            id: 'aberto',
            text: 'Guarda o que está aberto agora e se apaga ao desligar o computador',
            bucket: 'ram',
            feedback: 'A RAM é rápida, mas volátil: perde o conteúdo sem energia. Por isso é preciso salvar os arquivos.',
          },
          {
            id: 'abas',
            text: 'Com 40 abas abertas, ela lota e o sistema começa a ficar lento',
            bucket: 'ram',
            feedback: 'Cada aba ocupa memória. Quando a RAM enche, o sistema recorre ao disco, que é bem mais lento.',
          },
          {
            id: 'tamanho-ram',
            text: 'Tamanhos comuns hoje: 8 GB, 16 GB ou 32 GB',
            bucket: 'ram',
            feedback: 'São os tamanhos típicos de memória RAM; 16 GB é confortável para uso geral atual.',
          },
          {
            id: 'permanente',
            text: 'Mantém fotos, documentos e programas mesmo com o computador desligado',
            bucket: 'arm',
            feedback: 'O armazenamento é permanente: é ali que ficam seus arquivos e o próprio sistema.',
          },
          {
            id: 'tamanho-arm',
            text: 'Tamanhos comuns hoje: 256 GB, 512 GB ou 1 TB',
            bucket: 'arm',
            feedback: 'São capacidades típicas de SSDs e HDs, bem maiores que as da RAM.',
          },
        ],
      },
      {
        id: 'peca-02',
        kind: 'quiz',
        title: 'O upgrade certo',
        context:
          'Um notebook de 2017 tem processador razoável, 8 GB de RAM (uso médio de 60%) e um **HD mecânico** de 1 TB. Ele leva 4 minutos para ligar e demora muito para abrir programas.',
        prompt: 'Qual mudança tende a trazer o maior ganho de velocidade?',
        hint: 'Ligar o computador e abrir programas dependem principalmente de qual peça ler dados depressa?',
        explanation:
          'O **HD** (disco rígido) tem discos que giram e uma cabeça de leitura que se move, por isso é lento para ler muitos arquivos pequenos. O **SSD** usa memória flash, sem partes móveis, e é muito mais rápido e resistente a impactos. Em computadores antigos, trocar HD por SSD costuma ser o upgrade de maior efeito. Em SSD não é preciso desfragmentar: o Windows já faz a otimização adequada.',
        concept: 'hdd-ssd',
        options: [
          {
            id: 'a',
            text: 'Trocar o HD por um SSD, copiando os dados ou reinstalando o sistema, com backup antes.',
            correct: true,
            feedback:
              'Isso. O SSD lê dados muitas vezes mais rápido que um HD. Ligar e abrir programas, que dependem do disco, ficam muito mais rápidos.',
          },
          {
            id: 'b',
            text: 'Dobrar a RAM para 16 GB.',
            feedback: 'Com uso médio de 60%, a RAM não é o gargalo agora. Mais memória ajuda quando ela vive cheia; aqui o ponto lento é o disco.',
          },
          {
            id: 'c',
            text: 'Trocar por um HD maior, de 2 TB.',
            feedback: 'Mais espaço não é mais velocidade. Um HD maior continua mecânico e lento.',
          },
          {
            id: 'd',
            text: 'Desfragmentar o disco todos os dias.',
            feedback: 'O Windows já otimiza HDs automaticamente toda semana. Desfragmentar mais vezes traz pouco ganho, nada perto de um SSD.',
          },
        ],
      },
      {
        id: 'lento-01',
        kind: 'diagnosis',
        title: 'Investigando a lentidão',
        prompt: 'Investigue a causa da lentidão e trate-a da forma mais segura.',
        hint: 'Olhe os números antes de agir: qual recurso está no limite? O que o consome logo depois de ligar?',
        explanation:
          'Lentidão tem causa mensurável. O Gerenciador de Tarefas mostrou memória e disco no limite, puxados por **programas de inicialização** desnecessários. Desabilitá-los, sem tocar na segurança, aliviou o sistema, e o tipo de disco (**HDD**) revelou o gargalo restante, resolvido com um **SSD**.',
        concept: 'programas-inicializacao',
        symptom: 'O computador leva 5 minutos para ficar utilizável depois de ligar e continua lento durante o uso.',
        startStage: 'inicio',
        stages: [
          {
            id: 'inicio',
            situation: 'Você ainda não olhou nenhum dado: só sabe que está lento.',
            evidence: ['Ligado há 2 minutos', 'Vários ícones surgindo perto do relógio, um depois do outro'],
            actions: [
              {
                id: 'abrir-gt',
                label: 'Abrir o Gerenciador de Tarefas e observar CPU, Memória e Disco',
                result:
                  'Os números aparecem: Memória em 92%, Disco em 100% e CPU em 20%. Na lista de aplicativos de inicialização, 14 programas estão configurados para abrir com o sistema.',
                quality: 'best',
                next: 'numeros',
              },
              {
                id: 'acelerador',
                label: 'Instalar um "acelerador de PC" anunciado num site',
                result:
                  'Esses programas costumam virar mais um item abrindo na inicialização, quando não trazem anúncios e malware. Você piora o que queria resolver.',
                quality: 'harmful',
              },
              {
                id: 'formatar',
                label: 'Formatar o computador',
                result:
                  'Formatar sem entender a causa é arriscado: pode apagar dados sem backup e, se o gargalo for o hardware, a lentidão volta. É o último recurso, não o primeiro.',
                quality: 'harmful',
              },
              {
                id: 'comprar',
                label: 'Comprar um computador novo',
                result: 'Talvez seja necessário um dia, mas você ainda não sabe o que está errado. Pode ser algo que se resolve em minutos e de graça.',
                quality: 'poor',
              },
            ],
          },
          {
            id: 'numeros',
            situation: 'Memória quase cheia e disco no limite logo depois de ligar. Hora de agir na causa.',
            evidence: [
              'Aplicativos de inicialização: 14 itens habilitados',
              'Impacto alto: atualizador de jogos, dois apps de chat, "Cupom Fácil" e um sincronizador de música',
              'Também na lista: Segurança do Windows (notificações)',
            ],
            actions: [
              {
                id: 'desabilitar-inicio',
                label: 'Desabilitar na inicialização os programas desnecessários de alto impacto, mantendo os de segurança',
                result:
                  'Na próxima vez que liga, o computador fica utilizável em 1 minuto e meio, com 55% de memória em uso. Bem melhor, mas abrir programas ainda demora e o disco volta a 100% com frequência.',
                quality: 'best',
                next: 'depois',
              },
              {
                id: 'desabilitar-tudo',
                label: 'Desabilitar todos os itens da lista, inclusive os de segurança',
                result:
                  'Itens de segurança precisam iniciar com o sistema; sem eles, avisos importantes de proteção deixam de aparecer. Seja seletivo.',
                quality: 'harmful',
              },
              {
                id: 'desinstalar-antivirus',
                label: 'Desinstalar o antivírus para liberar memória',
                result: 'O antivírus é uma proteção essencial e consome relativamente pouco. Removê-lo deixa o computador exposto em troca de quase nenhum ganho.',
                quality: 'harmful',
              },
              {
                id: 'finalizar-aleatorio',
                label: 'Finalizar no Gerenciador de Tarefas os processos com nomes que você não reconhece',
                result:
                  'Alguns são do próprio sistema e voltam sozinhos; outros causam erros ao serem fechados. E, na próxima vez que ligar, tudo se repete.',
                quality: 'poor',
              },
            ],
          },
          {
            id: 'depois',
            situation: 'A inicialização melhorou, mas o disco continua sendo o gargalo.',
            evidence: ['Gerenciador de Tarefas > Desempenho > Disco 0: tipo "HDD"', 'Disco em 100% ao abrir programas, com CPU e memória folgadas'],
            actions: [
              {
                id: 'ssd',
                label: 'Fazer backup e planejar a troca do HD por um SSD',
                result: 'Com o SSD, o sistema liga em menos de 30 segundos e os programas abrem quase na hora. O gargalo era o disco mecânico.',
                quality: 'best',
                resolves: true,
              },
              {
                id: 'desinstalar-cupom',
                label: 'Desinstalar o "Cupom Fácil", que você nem lembra de ter instalado, e outros programas sem uso',
                result:
                  'O computador fica um pouco mais leve e livre de um programa suspeito. Ajuda, mas o HD mecânico continua limitando a velocidade.',
                quality: 'good',
                resolves: true,
              },
              {
                id: 'mais-ram',
                label: 'Comprar mais memória RAM',
                result: 'Depois da limpeza da inicialização, a memória está com folga. Mais RAM não resolve um disco lento.',
                quality: 'poor',
              },
            ],
          },
        ],
      },
      {
        id: 'lento-02',
        kind: 'quiz',
        title: 'Desabilitar não é desinstalar',
        context: 'Você desabilitou o app de chat na lista de aplicativos de inicialização do Gerenciador de Tarefas.',
        prompt: 'O que acontece com ele?',
        hint: 'A lista se chama "inicialização". O que exatamente ela controla?',
        explanation:
          'Os **programas de inicialização** abrem sozinhos ao ligar o computador e ficam consumindo memória e processador mesmo sem uso. Desabilitar só impede a abertura automática: o programa continua instalado. É uma das formas mais seguras e eficazes de acelerar a inicialização.',
        concept: 'programas-inicializacao',
        options: [
          {
            id: 'a',
            text: 'Ele continua instalado e funcionando; só não abre sozinho quando o computador liga. Dá para abri-lo pelo menu Iniciar quando quiser.',
            correct: true,
            feedback: 'Isso. Você decide quando abri-lo, em vez de ele disputar recursos logo na inicialização.',
          },
          {
            id: 'b',
            text: 'Ele é desinstalado e suas conversas são apagadas.',
            feedback: 'Desabilitar na inicialização não remove nada. Para desinstalar, o caminho é outro: Configurações > Aplicativos.',
          },
          {
            id: 'c',
            text: 'Ele para de funcionar até você reativá-lo na inicialização.',
            feedback: 'O programa funciona normalmente quando aberto à mão. Só deixa de abrir sozinho.',
          },
          {
            id: 'd',
            text: 'Ele passa a ser bloqueado pelo antivírus.',
            feedback: 'O antivírus não tem relação com essa configuração. Ela é só a lista do que abre automaticamente ao ligar.',
          },
        ],
      },
    ],
    debrief:
      'CPU processa, RAM guarda o que está em uso e o armazenamento guarda tudo. Para tratar lentidão, meça antes no Gerenciador de Tarefas, enxugue os programas de inicialização sem mexer na segurança e, em máquinas com HD mecânico, considere um SSD. "Aceleradores" e formatação às cegas raramente são a resposta.',
    platformNote:
      'Windows 11: Gerenciador de Tarefas > Aplicativos de inicialização (também em Configurações > Aplicativos > Inicialização). Windows 10: Gerenciador de Tarefas > guia Inicializar. macOS: Ajustes do Sistema > Geral > Itens de Início; o Monitor de Atividade mostra CPU, memória e disco.',
  },

  // -------------------------------------------------------------------------
  // d07 — Redes por dentro
  // -------------------------------------------------------------------------
  {
    id: 'd07-redes-por-dentro',
    version: 1,
    sector: 'diagnostico',
    order: 7,
    title: 'Redes por dentro',
    summary: 'Entender modem, roteador, IP e DNS e usar ipconfig, ping e nslookup para diagnosticar a rede.',
    briefing:
      'Hora de abrir a caixa-preta da rede do Nexo. Pelo terminal você vai descobrir o endereço do seu computador, conversar com o roteador e ver como nomes de sites viram números. Depois, vai usar esse conhecimento para flagrar uma pane de DNS.',
    category: 'redes',
    subcategory: 'IP e DNS',
    difficulty: 3,
    estimatedMinutes: 12,
    prerequisites: ['d01-sem-internet'],
    objectives: [
      'Diferenciar modem e roteador',
      'Usar ipconfig, ping e nslookup',
      'Entender o papel do DNS e reconhecer uma falha de DNS',
      'Distinguir IP privado de IP público',
    ],
    concepts: ['ip-dns', 'roteador-modem'],
    steps: [
      {
        id: 'rede-01',
        kind: 'quiz',
        title: 'Modem e roteador',
        prompt: 'Qual frase descreve corretamente o modem e o roteador?',
        hint: 'Um aparelho "fala a língua" do provedor; o outro organiza a conversa entre os aparelhos da casa.',
        explanation:
          'O **modem** converte o sinal do provedor (fibra, cabo, rádio) em internet utilizável. O **roteador** cria a rede local: dá um endereço IP a cada aparelho, faz o Wi-Fi e encaminha o tráfego para fora. Por isso ele aparece como **gateway padrão** no seu computador.',
        concept: 'roteador-modem',
        options: [
          {
            id: 'a',
            text: 'O modem (na fibra, chamado de ONT) liga a casa ao provedor; o roteador cria a rede local, distribui endereços e faz o Wi-Fi. Muitas vezes um único aparelho faz as duas funções.',
            correct: true,
            feedback:
              'Isso. É comum o provedor instalar um aparelho só, que é modem e roteador ao mesmo tempo, mas as funções continuam diferentes.',
          },
          {
            id: 'b',
            text: 'São dois nomes para o mesmo aparelho, sem diferença de função.',
            feedback: 'Podem estar no mesmo aparelho, mas as funções são distintas: um fala com o provedor, o outro organiza a rede da casa.',
          },
          {
            id: 'c',
            text: 'O roteador conecta a casa ao provedor e o modem cria o Wi-Fi.',
            feedback: 'É o contrário: o modem traduz o sinal do provedor e o roteador distribui a conexão para os aparelhos da casa.',
          },
          {
            id: 'd',
            text: 'O roteador só serve para Wi-Fi; aparelhos ligados por cabo não passam por ele.',
            feedback: 'Aparelhos ligados por cabo nas portas do roteador também fazem parte da rede local e recebem endereço dele.',
          },
        ],
      },
      {
        id: 'rede-02',
        kind: 'terminal',
        title: 'Raio-X da conexão',
        context: 'Este terminal é simulado: nenhum comando afeta o seu computador de verdade.',
        prompt:
          'Use o terminal para: ver o IP do computador e o gateway com `ipconfig`; testar se o roteador responde com `ping 192.168.0.1`; e descobrir o IP de `exemplo.com` com `nslookup exemplo.com`.',
        hint: 'Comece com `ipconfig` e procure a linha do gateway: esse é o endereço do roteador. Depois use esse endereço no `ping`.',
        explanation:
          'O `ipconfig` mostra o **IP** do computador (192.168.0.23), a máscara e o **gateway** (192.168.0.1, o roteador). O `ping` envia pequenos pacotes e mede se, e em quanto tempo, o destino responde. O `nslookup` pergunta ao **DNS** qual IP corresponde a um nome.',
        concept: 'ip-dns',
        root: [
          {
            name: 'Documentos',
            type: 'folder',
            children: [{ name: 'anotacoes-rede.txt', type: 'file', sizeKb: 1 }],
          },
          { name: 'Downloads', type: 'folder', children: [] },
        ],
        startPath: '/',
        goals: [
          { type: 'ran', command: 'ipconfig', label: 'Veja o IP do computador e o gateway com ipconfig' },
          { type: 'ran', command: 'ping', argIncludes: '192.168.0.1', label: 'Teste se o roteador (gateway) responde com ping' },
          { type: 'ran', command: 'nslookup', argIncludes: 'exemplo.com', label: 'Descubra o IP de exemplo.com com nslookup' },
        ],
        suggestions: ['ipconfig', 'ping 192.168.0.1', 'nslookup exemplo.com', 'help'],
      },
      {
        id: 'rede-03',
        kind: 'terminal',
        title: 'Pane misteriosa',
        context:
          'Pane simulada: nenhum site abre pelo nome, mas o ícone de rede diz que está tudo conectado. Este terminal reproduz a situação.',
        prompt:
          'Investigue: primeiro tente `ping exemplo.com` e observe o resultado. Depois confirme que o roteador responde e teste a internet pingando um IP externo, `198.51.100.7`.',
        hint: 'Compare: o que muda entre pingar um nome e pingar um número? Quem transforma nomes em números?',
        explanation:
          'Se o ping por **IP** funciona e o ping por **nome** falha, a conexão está de pé: o que falhou foi a tradução de nomes, o **DNS**. O endereço 198.51.100.7 é reservado para exemplos; na vida real, técnicos pingam o IP de um servidor público conhecido para fazer esse teste.',
        concept: 'ip-dns',
        root: [
          {
            name: 'Documentos',
            type: 'folder',
            children: [{ name: 'anotacoes-rede.txt', type: 'file', sizeKb: 1 }],
          },
          { name: 'Downloads', type: 'folder', children: [] },
        ],
        startPath: '/',
        network: { dnsWorking: false },
        goals: [
          { type: 'ran', command: 'ping', argIncludes: '192.168.0.1', label: 'Confirme que o roteador responde' },
          { type: 'ran', command: 'ping', argIncludes: '198.51.100.7', label: 'Teste a internet pingando o IP externo 198.51.100.7' },
        ],
        suggestions: ['ping exemplo.com', 'ping 192.168.0.1', 'ping 198.51.100.7', 'ipconfig'],
      },
      {
        id: 'rede-04',
        kind: 'quiz',
        title: 'Conclusão da perícia',
        context:
          'Resultado: `ping exemplo.com` falhou (o nome não foi encontrado), mas `ping 198.51.100.7` e `ping 192.168.0.1` responderam normalmente.',
        prompt: 'Qual é o diagnóstico, e qual o próximo passo mais sensato?',
        hint: 'O que todos os testes que falharam têm em comum? E os que funcionaram?',
        explanation:
          'O **DNS** funciona como uma agenda de contatos: traduz `exemplo.com` no IP do servidor. Quando ele falha, a internet parece "fora do ar", embora a conexão esteja ativa. Separar o teste por nome do teste por IP é a forma clássica de flagrar o problema.',
        concept: 'ip-dns',
        options: [
          {
            id: 'a',
            text: 'A internet funciona, mas o DNS não está respondendo. Reiniciar o roteador (que repassa o DNS) costuma resolver; se persistir, configurar outro servidor DNS confiável ou acionar o provedor.',
            correct: true,
            feedback: 'Isso. Você provou que a conexão funciona por números e isolou a falha na tradução de nomes.',
          },
          {
            id: 'b',
            text: 'O cabo de rede está rompido.',
            feedback: 'Com o cabo rompido, nem o roteador nem o IP externo responderiam. A conexão física está funcionando.',
          },
          {
            id: 'c',
            text: 'O site exemplo.com saiu do ar.',
            feedback: 'Seria possível se só esse site falhasse, mas nenhum site abre pelo nome. O padrão aponta para a tradução de nomes, não para um site.',
          },
          {
            id: 'd',
            text: 'O computador está sem endereço IP.',
            feedback: 'Sem IP, nenhum ping funcionaria. O computador tem IP e alcança a internet por números.',
          },
        ],
      },
      {
        id: 'rede-05',
        kind: 'quiz',
        title: 'Dois endereços',
        context: 'O `ipconfig` mostra o IPv4 **192.168.0.23**. Mas um site de "qual é o meu IP" mostra **203.0.113.45**.',
        prompt: 'Por que os endereços são diferentes?',
        hint: 'Pense num prédio: cada apartamento tem um número interno, mas o endereço do prédio na rua é um só.',
        explanation:
          'Endereços como **192.168.x.x** e **10.x.x.x** são **privados**: se repetem em milhões de casas e só valem na rede local. Para a internet, todos os aparelhos da casa aparecem com o **IP público** do roteador. Por isso o roteador é o ponto de saída, e também de proteção, da rede.',
        concept: 'roteador-modem',
        options: [
          {
            id: 'a',
            text: '192.168.0.23 é o IP privado, válido só dentro da sua rede; 203.0.113.45 é o IP público que o provedor deu ao roteador, compartilhado por todos os aparelhos da casa.',
            correct: true,
            feedback: 'Isso. O roteador traduz os endereços privados para o público quando o tráfego sai para a internet (um recurso chamado NAT).',
          },
          {
            id: 'b',
            text: 'Um dos dois está errado: cada aparelho tem um único IP.',
            feedback: 'Os dois estão certos, em contextos diferentes: um vale dentro de casa, o outro na internet.',
          },
          {
            id: 'c',
            text: 'O site está mostrando o IP de um invasor conectado à sua rede.',
            feedback: 'Não há sinal de invasão: todo site enxerga o IP público do seu roteador, nunca o IP interno do computador.',
          },
          {
            id: 'd',
            text: '203.0.113.45 é o endereço do servidor DNS.',
            feedback: 'Segundo o ipconfig, o DNS da sua rede é 192.168.0.1, o roteador. O endereço mostrado pelo site é o seu IP público.',
          },
        ],
      },
    ],
    debrief:
      'O modem liga a casa ao provedor; o roteador cria a rede local, distribui IPs privados e sai para a internet com um IP público. Com `ipconfig`, `ping` e `nslookup` você enxerga essa estrutura e localiza falhas: se o ping por IP funciona e por nome não, o culpado é o DNS.',
    platformNote:
      'No macOS e no Linux, o equivalente ao `ipconfig` é `ifconfig` (ou `ip addr`, no Linux), e o `ping` continua rodando até você pressionar {{Ctrl+C}}. No Windows, o `ping` envia 4 pacotes e para sozinho. O `nslookup` existe nos três sistemas.',
  },
];
