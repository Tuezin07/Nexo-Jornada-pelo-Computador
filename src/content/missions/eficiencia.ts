import type { MissionDefinition } from '../types';

/**
 * Setor 5 — Eficiência.
 * Atalhos de edição, digitação precisa, ferramentas de escritório, compactação,
 * terminal (navegação, arquivos e curingas) e backup.
 */
export const EFICIENCIA_MISSIONS: MissionDefinition[] = [
  // -------------------------------------------------------------------------
  // e01 — Edição relâmpago
  // -------------------------------------------------------------------------
  {
    id: 'e01-edicao-relampago',
    version: 1,
    sector: 'eficiencia',
    order: 1,
    title: 'Edição relâmpago',
    summary: 'Edite, localize e salve textos sem tirar as mãos do teclado, e cole itens antigos com o histórico da área de transferência.',
    briefing:
      'Os relatórios do Nexo chegam em fluxo contínuo e cada ida ao mouse custa segundos preciosos. Agente, sua missão é editar como um especialista: saltar palavras, localizar termos, formatar e salvar só com o teclado.',
    category: 'produtividade',
    subcategory: 'Atalhos de edição',
    difficulty: 2,
    estimatedMinutes: 6,
    prerequisites: [],
    objectives: [
      'Mover o cursor e selecionar texto palavra a palavra',
      'Localizar termos, formatar e salvar sem usar o mouse',
      'Usar o histórico da área de transferência para colar itens copiados antes',
    ],
    concepts: ['atalhos-texto', 'historico-transferencia'],
    steps: [
      {
        id: 'palavra-a-palavra',
        kind: 'shortcut',
        title: 'Palavra a palavra',
        context:
          'O título do relatório está quase certo, mas a segunda palavra precisa ser trocada. Arrastar o mouse com precisão é lento; o teclado resolve em dois toques.',
        prompt:
          'Com o cursor no início do texto, pule a primeira palavra com {{Ctrl+→}} e, em seguida, selecione a segunda com {{Ctrl+Shift+→}}.',
        hint: 'Segure {{Ctrl}} e toque a seta para a direita uma vez. Depois, segure {{Ctrl}} e {{Shift}} juntos e toque a seta de novo.',
        explanation:
          '{{Ctrl+→}} e {{Ctrl+←}} movem o cursor de palavra em palavra; acrescentar {{Shift}} transforma o movimento em seleção. Com {{Shift+→}} você seleciona letra a letra e, com {{Shift+End}}, até o fim da linha. No macOS, o salto por palavra usa {{Option}} no lugar de {{Ctrl}}.',
        concept: 'atalhos-texto',
        capture: 'real',
        combos: [
          { key: 'arrowright', ctrl: true },
          { key: 'arrowright', ctrl: true, shift: true },
        ],
        mac: [
          { key: 'arrowright', alt: true },
          { key: 'arrowright', alt: true, shift: true },
        ],
        practiceText:
          'Relatório preliminar de vendas da equipe regional, com metas, resultados e próximos passos para o trimestre.',
      },
      {
        id: 'localizar',
        kind: 'shortcut',
        title: 'Localizar no texto',
        context:
          'O cliente quer saber qual é o prazo de entrega, e o contrato tem várias páginas. Ler tudo até achar seria perda de tempo.',
        prompt: 'Abra a ferramenta de busca do editor para localizar a palavra **prazo**.',
        hint: 'É {{Ctrl}} com a inicial de "find", que significa localizar em inglês.',
        explanation:
          '{{Ctrl+F}} abre a busca em editores de texto, planilhas, leitores de PDF e no próprio navegador. Digite o termo e use {{Enter}} para ir à próxima ocorrência. Muitos editores também têm Localizar e substituir ({{Ctrl+H}} na maioria deles), que troca um termo por outro no documento inteiro.',
        concept: 'atalhos-texto',
        capture: 'real',
        combos: [{ key: 'f', ctrl: true }],
        mac: [{ key: 'f', meta: true }],
        practiceText:
          'Cláusula 4. O prazo de entrega dos equipamentos é de 30 dias corridos após a assinatura. Caso o prazo não seja cumprido, aplica-se multa diária de 2% sobre o valor do pedido.',
      },
      {
        id: 'tudo-negrito-salvar',
        kind: 'shortcut',
        title: 'Selecionar, destacar, salvar',
        context:
          'Este aviso vai para o mural da equipe e precisa aparecer inteiro em negrito. Depois, salve antes que algo dê errado.',
        prompt: 'Sem usar o mouse, selecione todo o texto, aplique negrito e salve o documento, nessa ordem.',
        hint: 'Os três atalhos usam {{Ctrl}}: A de "all" (tudo), B de "bold" (negrito) e S de "save" (salvar).',
        explanation:
          '{{Ctrl+A}} seleciona tudo, {{Ctrl+B}} aplica negrito ({{Ctrl+I}} itálico e {{Ctrl+U}} sublinhado) e {{Ctrl+S}} salva. Salvar com frequência pelo atalho vira reflexo e evita perder trabalho num travamento ou queda de energia.',
        concept: 'atalhos-texto',
        capture: 'real',
        combos: [
          { key: 'a', ctrl: true },
          { key: 'b', ctrl: true },
          { key: 's', ctrl: true },
        ],
        mac: [
          { key: 'a', meta: true },
          { key: 'b', meta: true },
          { key: 's', meta: true },
        ],
        platformNote:
          'No Microsoft Word em português, esses atalhos são traduzidos: selecionar tudo é {{Ctrl+T}}, negrito é {{Ctrl+N}} e salvar é {{Ctrl+B}} (lá, {{Ctrl+S}} aplica sublinhado). No macOS, use {{Cmd}} no lugar de {{Ctrl}}.',
        practiceText:
          'Aviso: o sistema de pedidos ficará fora do ar no sábado, das 8h às 12h, para manutenção programada. Salve seu trabalho antes desse horário.',
      },
      {
        id: 'historico-win-v',
        kind: 'shortcut',
        title: 'Histórico de cópias',
        context:
          'Você copiou, nesta ordem, o número de um pedido, o e-mail de um cliente e um endereço. Agora precisa colar o número do pedido, que já não é o último item copiado.',
        prompt: 'Abra o histórico da área de transferência do Windows para escolher qual item colar.',
        hint: 'É a tecla Windows combinada com a mesma letra do atalho de colar.',
        explanation:
          '{{Win+V}} abre o histórico da área de transferência: clique em qualquer item para colá-lo onde está o cursor. Na primeira vez, o Windows pede para ativar o recurso, e só os itens copiados depois disso aparecem na lista.',
        concept: 'historico-transferencia',
        capture: 'virtual',
        combos: [{ key: 'v', meta: true }],
        windowsOnly: true,
        platformNote:
          'O {{Win+V}} existe no Windows 10 (versão 1809 ou mais recente) e no Windows 11. No macOS não há atalho equivalente: até o macOS 15, o histórico depende de apps de terceiros; a partir do macOS 26, o Spotlight ({{Cmd+Espaço}}) ganhou uma seção de área de transferência ({{Cmd+4}}), que pode precisar ser ativada nos ajustes. No Linux, depende do ambiente: o KDE Plasma traz o Klipper, e no GNOME é preciso uma extensão.',
      },
      {
        id: 'itens-fixados',
        kind: 'quiz',
        title: 'Itens que ficam',
        context:
          'Você ativou o histórico ontem e copiou vários itens ao longo do dia. Hoje, depois de reiniciar o computador, abriu o {{Win+V}} e só um item continua lá.',
        prompt: 'Por que apenas esse item sobreviveu?',
        hint: 'Observe as opções de cada item no painel do {{Win+V}}: uma delas serve para manter o item guardado.',
        explanation:
          'O histórico guarda os itens copiados recentemente (até 25) enquanto o computador está ligado. Ao reiniciar, ele é limpo, exceto os itens **fixados** (ícone de alfinete). Fixe textos que você cola com frequência, como uma assinatura ou um endereço, e evite fixar dados sensíveis, como senhas.',
        concept: 'historico-transferencia',
        options: [
          {
            id: 'a',
            text: 'O histórico foi desativado sozinho durante a reinicialização',
            feedback:
              'A configuração continua ativa depois de reiniciar. O que é apagado são os itens não fixados.',
          },
          {
            id: 'b',
            text: 'Era o único item fixado: ao reiniciar, o Windows limpa o histórico, mas mantém os fixados',
            correct: true,
            feedback:
              'Isso. Fixar um item o protege da limpeza feita a cada reinicialização. Use para textos que você cola com frequência.',
          },
          {
            id: 'c',
            text: 'O histórico só consegue guardar um item por vez',
            feedback:
              'Ele guarda vários itens recentes (até 25). Os outros sumiram porque foram descartados na reinicialização.',
          },
          {
            id: 'd',
            text: 'Os outros itens foram enviados para a Lixeira',
            feedback:
              'Itens da área de transferência não vão para a Lixeira. Ao reiniciar, os que não estavam fixados são simplesmente descartados.',
          },
        ],
      },
    ],
    debrief:
      'Saltar palavras, selecionar com {{Shift}}, localizar e salvar pelo teclado elimina a ida e volta até o mouse. O histórico da área de transferência ({{Win+V}}) guarda vários itens copiados, para você colar o que precisar sem copiar de novo. Dica final: o atalho de cada comando costuma aparecer ao lado dele nos menus do programa.',
    platformNote:
      'Os atalhos de texto valem no Windows e no Linux; no macOS, troque {{Ctrl}} por {{Cmd}} e, para saltar palavras, use {{Option}}. No Microsoft Word em português, alguns atalhos são traduzidos (por exemplo, {{Ctrl+T}} seleciona tudo, {{Ctrl+N}} aplica negrito, {{Ctrl+B}} salva e {{Ctrl+L}} localiza). O {{Win+V}} é exclusivo do Windows 10 e 11.',
  },

  // -------------------------------------------------------------------------
  // e02 — Digitação veloz e precisa
  // -------------------------------------------------------------------------
  {
    id: 'e02-digitacao-precisa',
    version: 1,
    sector: 'eficiencia',
    order: 2,
    title: 'Digitação veloz e precisa',
    summary: 'Digite textos reais com acentos, números e pontuação mantendo alta precisão, e entenda por que a precisão vem antes da velocidade.',
    briefing:
      'O canal de transmissão do Nexo só aceita mensagens sem erros, agente. Cada tecla errada trava o envio até ser corrigida. Hora de provar que ritmo e precisão andam juntos.',
    category: 'teclado',
    subcategory: 'Digitação',
    difficulty: 3,
    estimatedMinutes: 8,
    prerequisites: [],
    objectives: [
      'Digitar textos com acentos, números e pontuação mantendo alta precisão',
      'Entender a relação entre precisão e velocidade (palavras por minuto)',
      'Escolher uma estratégia de treino que traga evolução real',
    ],
    concepts: ['digitacao-precisao'],
    steps: [
      {
        id: 'precisao-primeiro',
        kind: 'quiz',
        title: 'Precisão primeiro',
        context:
          'Um colega digita rápido olhando para o teclado, mas apaga e redigita tanto que demora para terminar cada e-mail.',
        prompt: 'Qual estratégia aumenta de verdade a velocidade dele ao longo das semanas?',
        hint: 'Pense no custo de cada erro: perceber, apagar e digitar de novo.',
        explanation:
          'Na digitação, velocidade sem precisão é ilusória. Treinar num ritmo em que você erra pouco, sem olhar para o teclado, cria automatismo; com a repetição, o ritmo aumenta sozinho. Um bom alvo é manter mais de 95% de acerto antes de tentar acelerar.',
        concept: 'digitacao-precisao',
        options: [
          {
            id: 'a',
            text: 'Forçar ainda mais a velocidade, para compensar o tempo gasto corrigindo',
            feedback:
              'Acelerar sem controle aumenta os erros, e cada erro custa notar, apagar e redigitar. A velocidade real cai.',
          },
          {
            id: 'b',
            text: 'Reduzir o ritmo até errar pouco, manter uma cadência constante e olhar para a tela, não para as teclas',
            correct: true,
            feedback:
              'Isso. Precisão e ritmo constante criam memória muscular; a velocidade cresce como consequência da prática sem erros.',
          },
          {
            id: 'c',
            text: 'Digitar sem se preocupar e deixar o corretor ortográfico arrumar tudo no final',
            feedback:
              'O corretor não pega tudo: "mas" no lugar de "mais", números e nomes errados passam despercebidos. E revisar depois também consome tempo.',
          },
          {
            id: 'd',
            text: 'Continuar usando só os dois dedos com que já está acostumado',
            feedback:
              'Dois dedos limitam a velocidade máxima e obrigam a olhar o teclado. Distribuir as teclas entre os dez dedos é o que permite evoluir.',
          },
        ],
      },
      {
        id: 'ritmo-constante',
        kind: 'typing',
        title: 'Ritmo constante',
        context:
          'Mensagem para a equipe. Neste modo, uma tecla errada não avança: corrija e siga em frente.',
        prompt:
          'Digite o texto exatamente como está, com acentos e pontuação. Busque um ritmo uniforme, sem pausas longas.',
        hint: 'Se uma letra acentuada travar, lembre que o acento vem antes da vogal: pressione a tecla do acento, solte e depois digite a vogal. Respire e mantenha o mesmo compasso.',
        explanation:
          'Ritmo uniforme rende mais que rajadas rápidas seguidas de pausas. Na contagem de palavras por minuto (ppm), cada 5 caracteres, incluindo espaços, valem uma palavra; por isso pontuação e espaços também contam.',
        concept: 'digitacao-precisao',
        text: 'Antes de enviar um relatório, revise os números e confira se cada arquivo tem um nome claro. Pequenos cuidados como esse evitam retrabalho e mostram profissionalismo para toda a equipe.',
        minAccuracy: 0.92,
        targetWpm: 35,
      },
      {
        id: 'pontuacao-numeros',
        kind: 'typing',
        title: 'Pontuação e números',
        context:
          'Comunicado oficial do setor. Agora há números, dois-pontos, ponto e vírgula, interrogação e exclamação.',
        prompt: 'Digite o comunicado com precisão. Atenção aos sinais que exigem {{Shift}}.',
        hint: 'Dois-pontos, interrogação e exclamação usam {{Shift}}. No teclado ABNT2, a crase de "às" é feita com {{Shift}} na tecla do acento agudo, seguida da letra a.',
        explanation:
          'Números e sinais de pontuação concentram a maioria dos erros, porque tiram os dedos da fileira base. Treiná-los em frases reais aproxima a prática do seu dia a dia. Se a precisão ficou abaixo da meta, repita num ritmo um pouco mais lento.',
        concept: 'digitacao-precisao',
        text: 'Na reunião de segunda, a equipe decidiu: o backup será feito toda sexta, às 18h; as senhas mudam a cada trimestre. Dúvidas? Fale com o suporte pelo ramal 2045 ou abra um chamado no portal da empresa!',
        minAccuracy: 0.95,
        targetWpm: 40,
      },
      {
        id: 'medir-desempenho',
        kind: 'quiz',
        title: 'Velocidade real',
        context:
          'Num teste de digitação, Ana fez 45 palavras por minuto com 88% de precisão. Bruno fez 36 palavras por minuto com 98% de precisão.',
        prompt: 'Para redigir um relatório que precisa sair sem erros, quem tende a terminar primeiro com o texto pronto?',
        hint: 'Some ao tempo de digitação o tempo gasto com cada correção.',
        explanation:
          'Testes de digitação costumam mostrar a velocidade bruta e a líquida, que desconta os erros. No trabalho, o que importa é o texto correto pronto. Melhore a precisão primeiro; a velocidade vem com a prática.',
        concept: 'digitacao-precisao',
        options: [
          {
            id: 'a',
            text: 'Ana, porque digita 9 palavras a mais por minuto',
            feedback:
              'A velocidade bruta engana: com 88% de precisão, cerca de 1 em cada 8 teclas sai errada, e cada erro custa tempo para corrigir.',
          },
          {
            id: 'b',
            text: 'Bruno, porque erra muito menos e quase não perde tempo corrigindo',
            correct: true,
            feedback:
              'Isso. Descontadas as correções, a velocidade líquida de Bruno tende a ser maior. Precisão alta é o que sustenta o ritmo.',
          },
          {
            id: 'c',
            text: 'Os dois terminam juntos, porque os erros se compensam',
            feedback:
              'Erros não se compensam: cada um exige notar, apagar e redigitar, e esse tempo se soma ao total.',
          },
          {
            id: 'd',
            text: 'Não dá para comparar, porque palavras por minuto só valem para textos em inglês',
            feedback:
              'A medida vale para qualquer idioma: cada 5 caracteres digitados contam como uma palavra.',
          },
        ],
      },
    ],
    debrief:
      'Digitar bem é manter um ritmo constante com poucos erros, sem olhar para o teclado. A velocidade é consequência: cresce com prática regular e curta, de 10 a 15 minutos por dia. Meça sempre as duas coisas, ppm e precisão, e só acelere quando a precisão estiver alta.',
    platformNote:
      'Os textos usam o teclado ABNT2 (padrão brasileiro), em que o acento é digitado antes da vogal. Em teclados americanos, ative o layout Estados Unidos-Internacional para digitar acentos da mesma forma.',
  },

  // -------------------------------------------------------------------------
  // e03 — Documentos e escritório
  // -------------------------------------------------------------------------
  {
    id: 'e03-documentos-e-escritorio',
    version: 1,
    sector: 'eficiencia',
    order: 3,
    title: 'Documentos e escritório',
    summary: 'Escolha a ferramenta de escritório certa para cada tarefa e use Salvar como para preservar originais e gerar PDFs.',
    briefing:
      'O arquivo central do Nexo está cheio de documentos no programa errado e de modelos sobrescritos por engano. Agente, escolha a ferramenta certa para cada tarefa e salve sem destruir o trabalho de ninguém.',
    category: 'produtividade',
    subcategory: 'Editores e planilhas',
    difficulty: 2,
    estimatedMinutes: 6,
    prerequisites: [],
    objectives: [
      'Escolher entre editor de texto, planilha e apresentação',
      'Usar Salvar como para preservar originais e gerar PDFs',
      'Criar um sumário automático a partir de estilos de título',
    ],
    concepts: ['ferramentas-escritorio', 'salvar-como'],
    steps: [
      {
        id: 'ferramenta-certa',
        kind: 'classify',
        title: 'Ferramenta certa',
        context:
          'Chegaram sete pedidos ao setor administrativo. Cada um combina melhor com um tipo de programa de escritório.',
        prompt: 'Classifique cada tarefa na ferramenta mais adequada.',
        hint: 'Pergunte-se: o centro da tarefa é texto corrido, cálculo com números ou exposição em telas para um público?',
        explanation:
          'Editores de texto servem para documentos com parágrafos e títulos; planilhas, para dados e cálculos que se atualizam sozinhos; programas de apresentação, para slides exibidos a um público. Usar a ferramenta certa evita improvisos, como somar valores à mão num documento de texto.',
        concept: 'ferramentas-escritorio',
        buckets: [
          { id: 'texto', label: 'Editor de texto', description: 'Documentos com parágrafos, títulos e formatação' },
          { id: 'planilha', label: 'Planilha', description: 'Tabelas com números, fórmulas e cálculos' },
          { id: 'apresentacao', label: 'Apresentação', description: 'Slides para expor ideias a um público' },
        ],
        items: [
          {
            id: 'contrato',
            text: 'Contrato de prestação de serviço com cláusulas numeradas',
            bucket: 'texto',
            feedback: 'Contrato é texto corrido com títulos e cláusulas: tarefa típica de editor de texto.',
          },
          {
            id: 'gastos',
            text: 'Controle de gastos do mês, com total que se atualiza sozinho',
            bucket: 'planilha',
            feedback: 'Valores que precisam ser somados e recalculados pedem uma planilha e suas fórmulas.',
          },
          {
            id: 'reuniao',
            text: 'Material para a reunião de resultados, com um tópico por tela',
            bucket: 'apresentacao',
            feedback: 'Conteúdo exibido em telas sucessivas para um público é trabalho para slides.',
          },
          {
            id: 'carta',
            text: 'Carta de apresentação para uma vaga de emprego',
            bucket: 'texto',
            feedback: 'É um texto formatado para ler e imprimir; o editor de texto é a escolha natural.',
          },
          {
            id: 'presenca',
            text: 'Lista de presença que calcula a porcentagem de faltas de cada aluno',
            bucket: 'planilha',
            feedback: 'O cálculo automático da porcentagem para cada linha é o ponto forte da planilha.',
          },
          {
            id: 'banca',
            text: 'Defesa de 5 minutos do projeto para uma banca, com gráficos grandes e pouco texto',
            bucket: 'apresentacao',
            feedback: 'Pouco texto, impacto visual e sequência de telas diante de uma banca: isso é uma apresentação.',
          },
          {
            id: 'orcamento',
            text: 'Orçamento de reforma com preço unitário multiplicado pela quantidade',
            bucket: 'planilha',
            feedback: 'Multiplicar e somar colunas de valores é exatamente o que fórmulas de planilha fazem.',
          },
        ],
      },
      {
        id: 'modelo-intacto',
        kind: 'quiz',
        title: 'Modelo intacto',
        context:
          'Você recebeu o modelo oficial de proposta comercial da empresa. Precisa adaptá-lo para um novo cliente, mas o modelo deve continuar intacto para os próximos usos.',
        prompt: 'Qual é a forma mais segura de trabalhar?',
        hint: 'Existe um comando que grava o documento aberto como um arquivo novo, com outro nome ou em outro lugar.',
        explanation:
          '**Salvar** grava as alterações no mesmo arquivo; **Salvar como** cria um arquivo novo, com outro nome, pasta ou formato, e deixa o original como estava. Faça isso logo no início, antes de editar. No Google Docs, o equivalente é Arquivo > Fazer uma cópia.',
        concept: 'salvar-como',
        options: [
          {
            id: 'a',
            text: 'Editar o modelo, salvar normalmente e depois apagar as mudanças para devolvê-lo ao original',
            feedback:
              'Salvar grava por cima do modelo. Desfazer as mudanças à mão é trabalhoso e quase sempre deixa algo para trás.',
          },
          {
            id: 'b',
            text: 'Logo ao abrir, usar Salvar como para criar uma cópia com novo nome (ex.: proposta-cliente-x) e editar a cópia',
            correct: true,
            feedback:
              'Isso. Salvar como cria um arquivo novo, e a partir dali tudo o que você salvar vai para a cópia. O modelo fica intacto.',
          },
          {
            id: 'c',
            text: 'Editar normalmente e, ao fechar, clicar em Não salvar',
            feedback: 'O modelo fica preservado, mas toda a proposta do novo cliente se perde junto.',
          },
          {
            id: 'd',
            text: 'Copiar todo o texto do modelo e colar num documento em branco',
            feedback:
              'Funciona em parte, mas costuma perder cabeçalhos, margens e estilos do modelo. Salvar como preserva tudo.',
          },
        ],
      },
      {
        id: 'exportar-pdf',
        kind: 'order',
        title: 'Gerar o PDF',
        context:
          'A proposta está pronta e será enviada ao cliente em PDF, mas você quer manter a versão editável para ajustes futuros.',
        prompt: 'Coloque os passos na ordem certa para gerar o PDF sem perder o arquivo editável.',
        hint: 'Primeiro garanta que o original está salvo; o último passo é revisar o resultado.',
        explanation:
          'Exportar ou usar Salvar como em PDF cria um arquivo novo e mantém o editável intacto. Conferir o PDF antes de enviar evita surpresas com quebras de página ou imagens fora do lugar. No LibreOffice, use Arquivo > Exportar como > Exportar como PDF; no Google Docs, Arquivo > Fazer download > Documento PDF.',
        concept: 'salvar-como',
        items: [
          { id: 'salvar', text: 'Salvar as últimas alterações no arquivo editável' },
          { id: 'menu', text: 'Abrir o menu Arquivo e escolher Salvar como (ou Exportar)' },
          { id: 'formato', text: 'Na janela que abrir, escolher o formato PDF, a pasta e o nome' },
          { id: 'confirmar', text: 'Confirmar em Salvar (ou Exportar)' },
          { id: 'conferir', text: 'Abrir o PDF gerado e conferir antes de enviar' },
        ],
      },
      {
        id: 'sumario-automatico',
        kind: 'quiz',
        title: 'Sumário automático',
        context:
          'Seu relatório tem 60 páginas e oito capítulos. O orientador pediu um sumário com as páginas corretas, e os capítulos ainda vão mudar de lugar até a entrega.',
        prompt: 'Qual é o jeito mais eficiente de fazer o sumário?',
        hint: 'O editor precisa saber, de forma estruturada, o que é título de capítulo.',
        explanation:
          'Estilos de título dão estrutura ao documento: com eles, o editor gera o sumário, cria a navegação lateral e mantém a formatação uniforme. Para inserir: no Word, Referências > Sumário; no LibreOffice, Inserir > Sumário e índice; no Google Docs, Inserir > Sumário. Depois de mudanças, use a opção de atualizar o sumário.',
        concept: 'ferramentas-escritorio',
        options: [
          {
            id: 'a',
            text: 'Digitar o sumário à mão, conferindo página por página',
            feedback:
              'Dá trabalho e fica desatualizado a cada mudança: se um capítulo crescer, todos os números de página seguintes ficam errados.',
          },
          {
            id: 'b',
            text: 'Deixar os títulos em negrito e com letra maior, para o editor reconhecê-los',
            feedback:
              'Negrito e tamanho grande mudam só a aparência. O sumário automático procura os estilos de título, não a formatação manual.',
          },
          {
            id: 'c',
            text: 'Aplicar estilos de título (Título 1, Título 2) aos capítulos e inserir um sumário automático',
            correct: true,
            feedback:
              'Isso. O editor monta o sumário a partir dos estilos de título, e basta atualizá-lo quando o texto mudar.',
          },
          {
            id: 'd',
            text: 'Montar o sumário numa planilha e colar no documento',
            feedback:
              'A planilha não sabe em que página cada capítulo está; os números teriam de ser corrigidos à mão a cada mudança.',
          },
        ],
      },
    ],
    debrief:
      'Cada ferramenta de escritório tem sua especialidade: texto, cálculo ou exposição. Salvar grava no mesmo arquivo; Salvar como e Exportar criam arquivos novos e protegem o original. Estilos de título deixam documentos longos organizados e com sumário sempre correto.',
    platformNote:
      'Os menus variam entre editores. No Google Docs não há botão Salvar (o salvamento é automático) e o Salvar como corresponde a Arquivo > Fazer uma cópia; no LibreOffice, o PDF sai por Arquivo > Exportar como. No Word em português, o atalho de salvar é {{Ctrl+B}}; na maioria dos outros programas, {{Ctrl+S}} ({{Cmd+S}} no macOS).',
  },

  // -------------------------------------------------------------------------
  // e04 — Compactar e enviar
  // -------------------------------------------------------------------------
  {
    id: 'e04-compactar-e-enviar',
    version: 1,
    sector: 'eficiencia',
    order: 4,
    title: 'Compactar e enviar',
    summary: 'Junte arquivos em um .zip, extraia pacotes recebidos do jeito certo e saiba quando a compactação não basta.',
    briefing:
      'Uma equipe aliada precisa receber o pacote do projeto, e o canal de envio aceita um único arquivo. Agente, junte e compacte o que importa e depois abra corretamente o material que chegar de volta.',
    category: 'produtividade',
    subcategory: 'Compactação',
    difficulty: 2,
    estimatedMinutes: 7,
    prerequisites: ['e03-documentos-e-escritorio'],
    objectives: [
      'Compactar vários arquivos em um .zip com nome claro',
      'Extrair um .zip antes de usar o conteúdo',
      'Saber quando compactar ajuda e quando usar um link da nuvem',
    ],
    concepts: ['arquivos-compactados'],
    steps: [
      {
        id: 'para-que-compactar',
        kind: 'quiz',
        title: 'Para que compactar',
        context: 'Você precisa enviar 40 fotos JPG de um evento para a equipe de comunicação, por e-mail.',
        prompt: 'O que é razoável esperar ao compactar essas fotos em um arquivo .zip?',
        hint: 'Pense no que acontece com arquivos que já foram comprimidos pelo próprio formato.',
        explanation:
          'Compactar junta vários arquivos em um só e reduz bastante o tamanho de arquivos com muita repetição, como textos simples (.txt, .csv) e imagens sem compressão (.bmp). Formatos já comprimidos, como JPG, MP3 e MP4, quase não diminuem. A compactação .zip é sem perdas: ao extrair, tudo volta exatamente igual.',
        concept: 'arquivos-compactados',
        options: [
          {
            id: 'a',
            text: 'As fotos vão ficar com metade do tamanho, sem perder qualidade',
            feedback:
              'JPG já é um formato comprimido; compactar de novo reduz muito pouco. A grande vantagem aqui é outra.',
          },
          {
            id: 'b',
            text: 'Um único arquivo para anexar, com todas as fotos juntas, mas com tamanho total parecido',
            correct: true,
            feedback:
              'Isso. O .zip junta tudo num pacote só, fácil de enviar e de baixar. Arquivos já comprimidos, como JPG e MP4, quase não diminuem.',
          },
          {
            id: 'c',
            text: 'As fotos vão perder qualidade, porque compactar reduz a resolução',
            feedback:
              'O .zip é uma compactação sem perdas: ao extrair, os arquivos voltam idênticos aos originais.',
          },
          {
            id: 'd',
            text: 'Basta renomear a pasta das fotos para fotos.zip que o efeito é o mesmo',
            feedback:
              'Renomear não compacta nada: a pasta continuaria sendo uma pasta, só com um nome enganoso. É preciso usar o comando de compactar.',
          },
        ],
      },
      {
        id: 'compactar-entrega',
        kind: 'filesystem',
        title: 'Montar o pacote',
        context:
          'A pasta Projeto Feira tem a versão final de três arquivos e um rascunho antigo, que não deve ir para o cliente.',
        prompt:
          'Selecione apenas os três arquivos finais, compacte-os e dê ao pacote o nome `entrega-projeto.zip`.',
        hint: 'Clique no primeiro arquivo e segure {{Ctrl}} enquanto clica nos outros dois. Depois use Compactar: o .zip é criado já em modo de renomear, então é só digitar o novo nome.',
        explanation:
          'Compactar cria um .zip com cópias dos itens selecionados; os originais continuam na pasta. Um nome descritivo, como entrega-projeto.zip, ajuda quem recebe a saber do que se trata. Selecionar só o necessário evita enviar rascunhos ou dados que não deveriam sair.',
        concept: 'arquivos-compactados',
        root: [
          { name: 'Área de Trabalho', type: 'folder', children: [] },
          {
            name: 'Documentos',
            type: 'folder',
            children: [
              {
                name: 'Projeto Feira',
                type: 'folder',
                children: [
                  { name: 'relatorio-final.pdf', type: 'file', sizeKb: 840 },
                  { name: 'apresentacao.pptx', type: 'file', sizeKb: 2350 },
                  { name: 'custos.xlsx', type: 'file', sizeKb: 96 },
                  { name: 'rascunho-antigo.docx', type: 'file', sizeKb: 120 },
                ],
              },
            ],
          },
          { name: 'Downloads', type: 'folder', children: [] },
          { name: 'Imagens', type: 'folder', children: [] },
        ],
        startPath: '/Documentos/Projeto Feira',
        goals: [
          {
            type: 'exists',
            path: '/Documentos/Projeto Feira/entrega-projeto.zip',
            nodeType: 'file',
            label: 'Crie entrega-projeto.zip com os três arquivos finais',
          },
        ],
        features: { compress: true, rename: true },
      },
      {
        id: 'extrair-material',
        kind: 'filesystem',
        title: 'Extrair antes de usar',
        context:
          'O curso enviou o material da semana em `material-curso.zip`, salvo em Downloads. Abrir arquivos direto de dentro do .zip pode abrir apenas uma cópia temporária: alterações se perdem e alguns programas nem conseguem salvar.',
        prompt: 'Extraia o conteúdo do .zip e abra o arquivo `cronograma.pdf` a partir da pasta extraída.',
        hint: 'Selecione material-curso.zip e use Extrair tudo. Uma pasta com o mesmo nome do .zip será criada; entre nela e abra o cronograma com duplo clique.',
        explanation:
          'Extrair copia o conteúdo do .zip para uma pasta comum, onde os arquivos funcionam normalmente. Depois disso, o .zip pode ser apagado se você não precisar mais dele. Antes de extrair algo recebido de fora, confira se a origem é confiável.',
        concept: 'arquivos-compactados',
        root: [
          { name: 'Área de Trabalho', type: 'folder', children: [] },
          { name: 'Documentos', type: 'folder', children: [] },
          {
            name: 'Downloads',
            type: 'folder',
            children: [
              {
                name: 'material-curso.zip',
                type: 'file',
                sizeKb: 2700,
                children: [
                  { name: 'aula-01.pdf', type: 'file', sizeKb: 1200 },
                  { name: 'aula-02.pdf', type: 'file', sizeKb: 1500 },
                  { name: 'exercicios.docx', type: 'file', sizeKb: 80 },
                  { name: 'cronograma.pdf', type: 'file', sizeKb: 150 },
                ],
              },
              { name: 'boleto-mensalidade.pdf', type: 'file', sizeKb: 90 },
            ],
          },
          { name: 'Imagens', type: 'folder', children: [] },
        ],
        startPath: '/Downloads',
        goals: [
          {
            type: 'exists',
            path: '/Downloads/material-curso',
            nodeType: 'folder',
            label: 'Extraia material-curso.zip para uma pasta',
          },
          {
            type: 'opened',
            path: '/Downloads/material-curso/cronograma.pdf',
            label: 'Abra cronograma.pdf a partir da pasta extraída',
          },
        ],
        features: { compress: true },
      },
      {
        id: 'anexo-grande',
        kind: 'quiz',
        title: 'Grande demais',
        context:
          'Você compactou os vídeos da apresentação e o .zip ficou com 180 MB. O seu serviço de e-mail aceita anexos de até 25 MB.',
        prompt: 'Qual é a melhor forma de fazer o material chegar ao destinatário?',
        hint: 'O limite é do e-mail. Existe outro caminho para entregar arquivos grandes.',
        explanation:
          'Compactar organiza e reduz alguns arquivos, mas não faz milagre com vídeos, que já são comprimidos. Para arquivos grandes, compartilhe um link da nuvem e escolha a permissão adequada (ver, comentar ou editar). Também é possível dividir o .zip em partes com programas como o 7-Zip, mas o link é mais simples para quem recebe.',
        concept: 'arquivos-compactados',
        options: [
          {
            id: 'a',
            text: 'Compactar o .zip de novo, para ele diminuir mais',
            feedback:
              'Compactar um arquivo já compactado praticamente não reduz o tamanho; às vezes até aumenta um pouco.',
          },
          {
            id: 'b',
            text: 'Mudar a extensão para .txt para escapar do limite',
            feedback:
              'O limite é de tamanho, não de tipo. E a extensão errada ainda atrapalha o destinatário na hora de abrir.',
          },
          {
            id: 'c',
            text: 'Apagar alguns vídeos até o .zip caber em 25 MB',
            feedback: 'Você enviaria um material incompleto. Existe um jeito de mandar tudo sem cortes.',
          },
          {
            id: 'd',
            text: 'Enviar o arquivo para um serviço de nuvem e compartilhar um link, só com permissão de visualização',
            correct: true,
            feedback:
              'Isso. A nuvem não tem o limite de anexo do e-mail, e você controla quem acessa. Alguns serviços de e-mail até fazem isso automaticamente com arquivos grandes.',
          },
        ],
      },
    ],
    debrief:
      'Arquivos .zip juntam vários itens num pacote só e economizam espaço em arquivos com muita repetição, mas quase não reduzem fotos e vídeos. Sempre extraia antes de trabalhar nos arquivos recebidos. Para pacotes grandes, prefira um link da nuvem a um anexo.',
    platformNote:
      'No Windows, clique com o botão direito e use a opção de compactar (Compactar para arquivo ZIP no Windows 11; Enviar para > Pasta compactada no Windows 10); para abrir, use Extrair Tudo. Desde a atualização 23H2, o Windows 11 também abre .rar e .7z sem programas extras; no Windows 10, use o 7-Zip baixado do site oficial. No macOS, use Comprimir no menu de contexto e dê duplo clique no .zip para extrair.',
  },

  // -------------------------------------------------------------------------
  // e05 — Primeiros comandos
  // -------------------------------------------------------------------------
  {
    id: 'e05-primeiros-comandos',
    version: 1,
    sector: 'eficiencia',
    order: 5,
    title: 'Primeiros comandos',
    summary: 'Entenda o que é o terminal, leia o prompt e navegue entre pastas com pwd, ls/dir e cd.',
    briefing:
      'Por trás das janelas do Nexo existe uma linha de comando, a forma mais direta de conversar com o sistema. Agente, aprenda a se localizar e a circular entre pastas só com o teclado. Tudo aqui é simulado: nenhum comando toca o seu computador.',
    category: 'comandos',
    subcategory: 'Terminal',
    difficulty: 3,
    estimatedMinutes: 8,
    prerequisites: [],
    objectives: [
      'Ler o prompt e saber em que pasta você está',
      'Listar e navegar entre pastas com ls/dir e cd',
      'Reconhecer as diferenças entre CMD, PowerShell e Linux/macOS',
    ],
    concepts: ['terminal-basico', 'navegacao-terminal'],
    steps: [
      {
        id: 'o-prompt',
        kind: 'quiz',
        title: 'O prompt',
        context:
          'Você abre o terminal pela primeira vez e vê uma linha como `C:\\Users\\ana>` no Windows, ou `ana@notebook ~ %` no macOS, com o cursor piscando ao lado.',
        prompt: 'O que essa linha está dizendo?',
        hint: 'Observe que a linha contém um nome de usuário e um caminho de pasta.',
        explanation:
          'O terminal é uma forma de usar o computador por comandos de texto, em vez de cliques. O **prompt** mostra onde você está e espera uma instrução; cada comando age na pasta atual, por isso saber onde você está é o primeiro passo. No Windows, os terminais são o Prompt de Comando (CMD) e o PowerShell, geralmente abertos pelo app Terminal; no macOS e no Linux, o app se chama Terminal.',
        concept: 'terminal-basico',
        options: [
          {
            id: 'a',
            text: 'É o prompt: mostra em qual pasta você está e indica que o terminal espera um comando',
            correct: true,
            feedback:
              'Isso. O prompt informa o usuário e a pasta atual (o ~ representa a sua pasta pessoal) e aguarda você digitar.',
          },
          {
            id: 'b',
            text: 'É uma mensagem de erro que precisa ser corrigida antes de usar o computador',
            feedback: 'Não há erro: essa linha aparece sempre que o terminal está pronto para receber um comando.',
          },
          {
            id: 'c',
            text: 'É o endereço de um site que o terminal está tentando abrir',
            feedback: 'Não é um endereço da web; é o caminho de uma pasta no próprio computador.',
          },
          {
            id: 'd',
            text: 'Indica que o computador entrou em modo de manutenção e não deve ser usado',
            feedback:
              'O terminal é uma ferramenta comum do sistema. Abri-lo não muda nada; só os comandos que você digitar fazem algo.',
          },
        ],
      },
      {
        id: 'onde-estou',
        kind: 'terminal',
        title: 'Onde estou?',
        context:
          'Este é o NexoShell, um terminal simulado. Ele aceita comandos do Linux/macOS e do Windows, e nada do que você digitar aqui afeta o seu computador.',
        prompt: 'Descubra em qual pasta você está e liste o que existe nela.',
        hint: 'Digite `pwd` e tecle {{Enter}} para ver a pasta atual. Depois, `ls` (ou `dir`) lista o conteúdo. Se ficar perdido, `help` mostra os comandos disponíveis.',
        explanation:
          '`pwd` (de "print working directory") mostra a pasta atual. `ls` lista o conteúdo no Linux, no macOS e também no PowerShell; no Prompt de Comando (CMD) do Windows, o comando é `dir`, e `cd` sozinho mostra a pasta atual. Saber onde você está antes de agir evita mexer na pasta errada.',
        concept: 'terminal-basico',
        root: [
          {
            name: 'Área de Trabalho',
            type: 'folder',
            children: [{ name: 'lembretes.txt', type: 'file', sizeKb: 1 }],
          },
          {
            name: 'Documentos',
            type: 'folder',
            children: [
              {
                name: 'Faculdade',
                type: 'folder',
                children: [
                  {
                    name: 'Semestre 1',
                    type: 'folder',
                    children: [{ name: 'notas-finais.txt', type: 'file', sizeKb: 2 }],
                  },
                  {
                    name: 'Semestre 2',
                    type: 'folder',
                    children: [
                      { name: 'cronograma.txt', type: 'file', sizeKb: 3 },
                      { name: 'trabalho-redes.docx', type: 'file', sizeKb: 210 },
                    ],
                  },
                ],
              },
              { name: 'curriculo.pdf', type: 'file', sizeKb: 180 },
            ],
          },
          {
            name: 'Downloads',
            type: 'folder',
            children: [
              { name: 'boleto-internet.pdf', type: 'file', sizeKb: 85 },
              { name: 'papel-de-parede.jpg', type: 'file', sizeKb: 1900 },
            ],
          },
          { name: 'Imagens', type: 'folder', children: [] },
        ],
        startPath: '/',
        goals: [
          { type: 'ran', command: 'pwd', label: 'Mostre a pasta atual com pwd' },
          { type: 'ran', command: 'ls', label: 'Liste o conteúdo da pasta (ls ou dir)' },
        ],
        suggestions: ['pwd', 'ls', 'dir', 'help'],
      },
      {
        id: 'entrar-em-pastas',
        kind: 'terminal',
        title: 'Entrar em pastas',
        context:
          'Você precisa consultar o cronograma do segundo semestre, guardado em Documentos > Faculdade > Semestre 2.',
        prompt: 'Navegue até a pasta `Semestre 2` e exiba o conteúdo de `cronograma.txt`.',
        hint: 'Entre uma pasta por vez com `cd`: primeiro `cd Documentos`, depois `cd Faculdade`. O nome Semestre 2 tem espaço, então use aspas: `cd "Semestre 2"`. Para ler o arquivo, `cat cronograma.txt` (no CMD, `type`).',
        explanation:
          '`cd` (de "change directory") muda a pasta atual. Nomes com espaço precisam de aspas; sem elas, o terminal entende duas palavras separadas. Nos terminais reais, a tecla {{Tab}} completa nomes de pastas e arquivos, o que poupa digitação e evita erros. `cat` (Linux, macOS e PowerShell) ou `type` (CMD) mostra o conteúdo de um arquivo de texto.',
        concept: 'navegacao-terminal',
        root: [
          { name: 'Área de Trabalho', type: 'folder', children: [] },
          {
            name: 'Documentos',
            type: 'folder',
            children: [
              {
                name: 'Faculdade',
                type: 'folder',
                children: [
                  {
                    name: 'Semestre 1',
                    type: 'folder',
                    children: [{ name: 'notas-finais.txt', type: 'file', sizeKb: 2 }],
                  },
                  {
                    name: 'Semestre 2',
                    type: 'folder',
                    children: [
                      { name: 'cronograma.txt', type: 'file', sizeKb: 3 },
                      { name: 'trabalho-redes.docx', type: 'file', sizeKb: 210 },
                    ],
                  },
                ],
              },
              { name: 'curriculo.pdf', type: 'file', sizeKb: 180 },
            ],
          },
          { name: 'Downloads', type: 'folder', children: [] },
          { name: 'Imagens', type: 'folder', children: [] },
        ],
        startPath: '/',
        goals: [
          { type: 'cwd', path: '/Documentos/Faculdade/Semestre 2', label: 'Chegue à pasta Semestre 2' },
          { type: 'ran', command: 'cat', argIncludes: 'cronograma', label: 'Mostre o conteúdo de cronograma.txt' },
        ],
        suggestions: ['ls', 'cd Documentos', 'cd "Semestre 2"', 'cat cronograma.txt'],
      },
      {
        id: 'voltar-e-mudar',
        kind: 'terminal',
        title: 'Subir e mudar de rumo',
        context:
          'Agora você precisa conferir um boleto que baixou. Você está em Semestre 2, três níveis abaixo da pasta principal.',
        prompt: 'Saia da pasta atual subindo níveis com `cd ..` e termine dentro da pasta `Downloads`.',
        hint: '`cd ..` sobe um nível, para a pasta que contém a atual. Repita até chegar à raiz, confira com `pwd` ou `ls` e então entre em Downloads. `cd /` leva direto à raiz.',
        explanation:
          'Os dois pontos (..) representam a pasta acima da atual, e a barra (/) representa a raiz. Combinando `cd ..`, `cd /` e `cd nome`, você chega a qualquer lugar. No Windows real, os caminhos usam barra invertida, como em `C:\\Users\\ana\\Downloads`, mas `cd ..` funciona do mesmo jeito.',
        concept: 'navegacao-terminal',
        root: [
          { name: 'Área de Trabalho', type: 'folder', children: [] },
          {
            name: 'Documentos',
            type: 'folder',
            children: [
              {
                name: 'Faculdade',
                type: 'folder',
                children: [
                  { name: 'Semestre 1', type: 'folder', children: [] },
                  {
                    name: 'Semestre 2',
                    type: 'folder',
                    children: [{ name: 'cronograma.txt', type: 'file', sizeKb: 3 }],
                  },
                ],
              },
            ],
          },
          {
            name: 'Downloads',
            type: 'folder',
            children: [
              { name: 'boleto-internet.pdf', type: 'file', sizeKb: 85 },
              { name: 'papel-de-parede.jpg', type: 'file', sizeKb: 1900 },
            ],
          },
          { name: 'Imagens', type: 'folder', children: [] },
        ],
        startPath: '/Documentos/Faculdade/Semestre 2',
        goals: [
          { type: 'ran', command: 'cd', argIncludes: '..', label: 'Suba pelo menos um nível com cd ..' },
          { type: 'cwd', path: '/Downloads', label: 'Termine dentro da pasta Downloads' },
        ],
        suggestions: ['cd ..', 'pwd', 'cd /', 'cd Downloads'],
      },
      {
        id: 'cmd-ou-powershell',
        kind: 'quiz',
        title: 'Cada terminal, sua língua',
        context:
          'Seguindo um tutorial, você abre o Prompt de Comando (CMD) do Windows, digita `ls` e recebe a mensagem: "ls" não é reconhecido como um comando interno ou externo.',
        prompt: 'O que aconteceu?',
        hint: 'Pense nos diferentes terminais: CMD, PowerShell e o terminal do Linux/macOS não falam exatamente a mesma língua.',
        explanation:
          'Cada terminal tem seu vocabulário. O CMD usa `dir`, `copy`, `move`, `del` e `type`; o PowerShell tem comandos próprios, mas aceita apelidos como `ls`, `cp`, `mv`, `rm` e `cat`; Linux e macOS usam `ls`, `cp`, `mv`, `rm` e `cat`. Antes de seguir um tutorial, confira para qual terminal ele foi escrito, e nunca execute um comando que você não entende.',
        concept: 'terminal-basico',
        options: [
          {
            id: 'a',
            text: 'O computador está com defeito e precisa de manutenção',
            feedback:
              'Não há defeito: cada terminal tem seu próprio conjunto de comandos, e o CMD simplesmente não conhece o ls.',
          },
          {
            id: 'b',
            text: 'É preciso abrir o CMD como administrador para o ls funcionar',
            feedback:
              'Ser administrador não acrescenta comandos. E rodar como administrador sem necessidade só aumenta o risco de estragos.',
          },
          {
            id: 'c',
            text: 'O tutorial foi feito para outro terminal: no CMD, o comando para listar é `dir`; o PowerShell, o Linux e o macOS aceitam `ls`',
            correct: true,
            feedback:
              'Isso. Use `dir` no CMD, ou abra o PowerShell, que entende `ls` como apelido do seu próprio comando de listar.',
          },
          {
            id: 'd',
            text: 'Faltou digitar o comando em letras maiúsculas: LS',
            feedback:
              'O problema não são as maiúsculas: o CMD não tem um comando ls, escrito de nenhuma forma.',
          },
        ],
      },
    ],
    debrief:
      'O terminal executa comandos na pasta atual, mostrada no prompt. `pwd` diz onde você está, `ls` (ou `dir`) mostra o que há ali e `cd` leva você a outras pastas, com `..` para subir e aspas para nomes com espaço. Cada terminal tem seu vocabulário: confira se o comando é de CMD, PowerShell ou Linux/macOS.',
    platformNote:
      'No Windows, abra o app Terminal (ou procure "cmd" ou "PowerShell" no menu Iniciar); no macOS, Aplicativos > Utilitários > Terminal; em muitas distribuições Linux, {{Ctrl+Alt+T}}. O NexoShell aceita tanto os nomes de comandos do Linux/macOS quanto os do Windows.',
  },

  // -------------------------------------------------------------------------
  // e06 — Automação com comandos
  // -------------------------------------------------------------------------
  {
    id: 'e06-automacao-com-comandos',
    version: 1,
    sector: 'eficiencia',
    order: 6,
    title: 'Automação com comandos',
    summary: 'Crie, copie, mova e apague arquivos pelo terminal, usando curingas para agir em lote com segurança.',
    briefing:
      'Com o terminal sob controle, é hora de fazer o sistema trabalhar em lote. Agente, crie, copie, mova e apague arquivos com precisão, usando curingas para resolver num comando o que levaria dezenas de cliques. Lembre: aqui não existe Lixeira.',
    category: 'comandos',
    subcategory: 'Automação',
    difficulty: 4,
    estimatedMinutes: 10,
    prerequisites: ['e05-primeiros-comandos'],
    objectives: [
      'Criar pastas, copiar arquivos e gerar arquivos de texto pelo terminal',
      'Mover vários arquivos de uma vez com curingas',
      'Apagar com segurança, conferindo o alvo antes',
      'Planejar uma automação simples e segura',
    ],
    concepts: ['terminal-arquivos', 'automacao-basica'],
    steps: [
      {
        id: 'criar-e-copiar',
        kind: 'terminal',
        title: 'Criar e copiar',
        context: 'Você vai revisar o relatório de abril e quer guardar uma cópia intacta antes de mexer nele.',
        prompt:
          'Crie a pasta `copias`, copie `relatorio-abril.txt` para dentro dela e crie um arquivo `leia-me.txt` com uma frase explicando o que há em copias.',
        hint: '`mkdir copias` cria a pasta. `cp relatorio-abril.txt copias` copia o arquivo para dentro dela (no CMD, `copy`). Para o leia-me, use `echo`, o texto e o sinal `>`: `echo Copia feita antes da revisao > leia-me.txt`.',
        explanation:
          '`mkdir` cria pastas e `cp` (ou `copy`) duplica arquivos, mantendo o original. O sinal `>` envia o resultado de um comando para um arquivo: com `echo`, você cria um arquivo de texto em uma linha. Atenção: `>` substitui o conteúdo se o arquivo já existir; para acrescentar no final, os terminais reais usam `>>`.',
        concept: 'terminal-arquivos',
        root: [
          { name: 'Área de Trabalho', type: 'folder', children: [] },
          {
            name: 'Documentos',
            type: 'folder',
            children: [
              {
                name: 'Relatorios',
                type: 'folder',
                children: [
                  { name: 'relatorio-marco.txt', type: 'file', sizeKb: 14 },
                  { name: 'relatorio-abril.txt', type: 'file', sizeKb: 16 },
                  { name: 'notas-reuniao.txt', type: 'file', sizeKb: 3 },
                ],
              },
            ],
          },
          { name: 'Downloads', type: 'folder', children: [] },
        ],
        startPath: '/Documentos/Relatorios',
        goals: [
          { type: 'exists', path: '/Documentos/Relatorios/copias', nodeType: 'folder', label: 'Crie a pasta copias' },
          {
            type: 'exists',
            path: '/Documentos/Relatorios/copias/relatorio-abril.txt',
            nodeType: 'file',
            label: 'Copie relatorio-abril.txt para dentro de copias',
          },
          {
            type: 'exists',
            path: '/Documentos/Relatorios/relatorio-abril.txt',
            nodeType: 'file',
            label: 'Mantenha o original em Relatorios (copiar, não mover)',
          },
          {
            type: 'exists',
            path: '/Documentos/Relatorios/leia-me.txt',
            nodeType: 'file',
            label: 'Crie leia-me.txt com echo',
          },
        ],
        suggestions: ['ls', 'mkdir copias', 'cp relatorio-abril.txt copias', 'cat leia-me.txt'],
      },
      {
        id: 'faxina-em-lote',
        kind: 'terminal',
        title: 'Faxina em lote',
        context:
          'A pasta Downloads acumulou boletos, contratos e fotos misturados. Mover um por um seria lento; com curingas, um único comando move todos os arquivos de um tipo.',
        prompt:
          'Crie as pastas `PDFs` e `Fotos` dentro de Downloads e use curingas para mover todos os .pdf para PDFs e todos os .jpg para Fotos.',
        hint: 'Crie as pastas com `mkdir`. O curinga `*` significa "qualquer nome": `mv *.pdf PDFs` move todos os PDFs de uma vez (no CMD, `move`). Rode `ls *.jpg` antes para ver quais arquivos serão afetados.',
        explanation:
          'O asterisco (*) combina com qualquer sequência de caracteres, então `*.pdf` representa todos os arquivos terminados em .pdf. Essa é a base da automação: um comando faz o trabalho de dezenas de cliques. No Linux, os nomes diferenciam maiúsculas de minúsculas, então `*.pdf` não pega um arquivo terminado em .PDF; no Windows, tanto faz.',
        concept: 'automacao-basica',
        root: [
          { name: 'Área de Trabalho', type: 'folder', children: [] },
          { name: 'Documentos', type: 'folder', children: [] },
          {
            name: 'Downloads',
            type: 'folder',
            children: [
              { name: 'boleto-janeiro.pdf', type: 'file', sizeKb: 88 },
              { name: 'boleto-fevereiro.pdf', type: 'file', sizeKb: 91 },
              { name: 'contrato-aluguel.pdf', type: 'file', sizeKb: 420 },
              { name: 'manual-impressora.pdf', type: 'file', sizeKb: 3600 },
              { name: 'certificado-curso.pdf', type: 'file', sizeKb: 260 },
              { name: 'foto-praia-01.jpg', type: 'file', sizeKb: 2400 },
              { name: 'foto-praia-02.jpg', type: 'file', sizeKb: 2550 },
              { name: 'foto-aniversario.jpg', type: 'file', sizeKb: 3100 },
              { name: 'cartaz-evento.jpg', type: 'file', sizeKb: 980 },
              { name: 'planilha-gastos.xlsx', type: 'file', sizeKb: 45 },
              { name: 'lista-compras.txt', type: 'file', sizeKb: 1 },
            ],
          },
          { name: 'Imagens', type: 'folder', children: [] },
        ],
        startPath: '/Downloads',
        goals: [
          {
            type: 'countInFolder',
            path: '/Downloads/PDFs',
            extension: 'pdf',
            count: 5,
            label: 'Leve os 5 arquivos .pdf para a pasta PDFs',
          },
          {
            type: 'countInFolder',
            path: '/Downloads/Fotos',
            extension: 'jpg',
            count: 4,
            label: 'Leve os 4 arquivos .jpg para a pasta Fotos',
          },
          {
            type: 'ran',
            command: 'mv',
            argIncludes: '*',
            label: 'Use um curinga (*) para mover vários arquivos com um só comando',
          },
        ],
        suggestions: ['ls', 'ls *.pdf', 'mkdir PDFs', 'mkdir Fotos'],
      },
      {
        id: 'apagar-com-cuidado',
        kind: 'terminal',
        title: 'Apagar com cuidado',
        context:
          'A pasta Evento tem arquivos temporários (.tmp) deixados por um programa. Eles podem sair, mas a apresentação final e a lista de convidados não. Lembre: `rm` (e `del` no CMD) apaga direto, sem passar pela Lixeira.',
        prompt:
          'Confira primeiro quais arquivos o curinga `*.tmp` atinge e, depois, apague todos os .tmp com um único comando.',
        hint: '`ls *.tmp` mostra exatamente o que seria apagado. Se a lista estiver certa, troque `ls` por `rm`: `rm *.tmp` (no CMD, `del *.tmp`).',
        explanation:
          'Listar antes de apagar é o hábito mais importante no terminal: `ls *.tmp` mostra o que o mesmo curinga vai atingir no `rm`. Como `rm` não usa a Lixeira, um curinga errado, como `rm *`, apagaria tudo de uma vez, sem volta. Na dúvida, confira a pasta com `pwd` e mantenha backups em dia.',
        concept: 'terminal-arquivos',
        root: [
          { name: 'Área de Trabalho', type: 'folder', children: [] },
          {
            name: 'Documentos',
            type: 'folder',
            children: [
              {
                name: 'Evento',
                type: 'folder',
                children: [
                  { name: 'apresentacao-final.pptx', type: 'file', sizeKb: 5200 },
                  { name: 'lista-convidados.xlsx', type: 'file', sizeKb: 38 },
                  { name: 'cache-01.tmp', type: 'file', sizeKb: 640 },
                  { name: 'cache-02.tmp', type: 'file', sizeKb: 512 },
                  { name: 'cache-03.tmp', type: 'file', sizeKb: 770 },
                  { name: 'autosave.tmp', type: 'file', sizeKb: 5100 },
                ],
              },
            ],
          },
          { name: 'Downloads', type: 'folder', children: [] },
        ],
        startPath: '/Documentos/Evento',
        goals: [
          { type: 'ran', command: 'ls', argIncludes: '*.tmp', label: 'Antes de apagar, liste os alvos com ls *.tmp' },
          {
            type: 'countInFolder',
            path: '/Documentos/Evento',
            extension: 'tmp',
            count: 0,
            label: 'Apague todos os arquivos .tmp',
          },
          {
            type: 'exists',
            path: '/Documentos/Evento/apresentacao-final.pptx',
            nodeType: 'file',
            label: 'Mantenha apresentacao-final.pptx',
          },
          {
            type: 'exists',
            path: '/Documentos/Evento/lista-convidados.xlsx',
            nodeType: 'file',
            label: 'Mantenha lista-convidados.xlsx',
          },
        ],
        suggestions: ['pwd', 'ls', 'ls *.tmp'],
      },
      {
        id: 'rotina-automatica',
        kind: 'quiz',
        title: 'Rotina automática',
        context:
          'Toda sexta-feira, você organiza os relatórios da semana: cria uma pasta com a data, move os PDFs para ela e apaga os temporários. São 20 minutos de cliques.',
        prompt: 'Qual é o caminho mais seguro para automatizar essa rotina?',
        hint: 'Pense em automatizar algo que você já entende e em testar antes de confiar.',
        explanation:
          'Automatizar é transformar passos repetitivos em comandos que rodam sozinhos. Um **script** é um arquivo de texto com uma sequência de comandos (.bat ou .ps1 no Windows, .sh no Linux e no macOS). Comece pequeno, teste numa cópia, revise os curingas e só então agende a execução.',
        concept: 'automacao-basica',
        options: [
          {
            id: 'a',
            text: 'Copiar um script pronto de um fórum e executá-lo direto como administrador',
            feedback:
              'Executar código que você não entende, ainda mais com privilégios de administrador, pode apagar arquivos ou instalar algo malicioso.',
          },
          {
            id: 'b',
            text: 'Começar o script com um comando que apaga tudo da pasta, para garantir que ela fique limpa',
            feedback:
              'Um apagar-tudo no início destrói arquivos que não deveriam sair e, como o terminal não usa a Lixeira, não há volta.',
          },
          {
            id: 'c',
            text: 'Continuar fazendo à mão, porque automação é só para programadores',
            feedback:
              'Rotinas repetitivas e previsíveis são justamente as que mais valem a pena automatizar, e poucos comandos simples já resolvem.',
          },
          {
            id: 'd',
            text: 'Gravar os comandos que você já usa num script, testá-lo numa cópia da pasta e, quando estiver confiável, agendá-lo',
            correct: true,
            feedback:
              'Isso. Você automatiza o que já entende, valida sem risco e só depois deixa rodar sozinho, com o Agendador de Tarefas (Windows) ou o cron (Linux).',
          },
        ],
      },
    ],
    debrief:
      'Com `mkdir`, `cp`, `mv` e `rm`, você manipula arquivos sem abrir janela nenhuma, e com curingas faz isso em lote. A regra de ouro é conferir antes: `pwd` para a pasta, `ls` com o mesmo curinga para ver o alvo. Automatizar é juntar esses comandos num script testado, lembrando sempre que o terminal não tem Lixeira.',
    platformNote:
      'Equivalências no CMD do Windows: `cp` = `copy`, `mv` = `move`, `rm` = `del`. O PowerShell aceita `cp`, `mv` e `rm` como apelidos de Copy-Item, Move-Item e Remove-Item. Em nenhum desses terminais a exclusão passa pela Lixeira. Para apagar pastas inteiras, os terminais reais têm opções como `rm -r`, que exigem cuidado redobrado.',
  },

  // -------------------------------------------------------------------------
  // e07 — Backup e nuvem
  // -------------------------------------------------------------------------
  {
    id: 'e07-backup-e-nuvem',
    version: 1,
    sector: 'eficiencia',
    order: 7,
    title: 'Backup e nuvem',
    summary: 'Diferencie sincronização de backup, recupere arquivos pela lixeira da nuvem e monte uma rotina de backup confiável.',
    briefing:
      'Um disco do Nexo falhou e levou consigo meses de relatórios sem cópia. Agente, sua missão é garantir que isso não se repita: separar sincronização de backup e montar uma rotina que funcione de verdade.',
    category: 'produtividade',
    subcategory: 'Backup',
    difficulty: 3,
    estimatedMinutes: 6,
    prerequisites: ['e03-documentos-e-escritorio'],
    objectives: [
      'Diferenciar sincronização de backup',
      'Recuperar arquivos apagados pela lixeira da nuvem',
      'Montar uma rotina de backup automática seguindo a regra 3-2-1',
    ],
    concepts: ['backup', 'nuvem-sincronizacao'],
    steps: [
      {
        id: 'sincronizar-ou-backup',
        kind: 'classify',
        title: 'Sincronizar ou guardar?',
        context:
          'A equipe de suporte vive confundindo sincronização com backup. Cada situação abaixo descreve o comportamento típico de um deles.',
        prompt: 'Classifique cada situação como sincronização ou backup.',
        hint: 'Sincronizar espelha o estado atual em todos os lugares; backup guarda cópias para voltar no tempo ou recuperar após um desastre.',
        explanation:
          'Serviços de sincronização, como OneDrive, Google Drive, iCloud e Dropbox, são ótimos para ter os mesmos arquivos em todos os aparelhos, mas replicam também erros, exclusões e arquivos corrompidos. Backup é uma cópia independente, de preferência com várias versões, feita justamente para recuperar o que se perdeu.',
        concept: 'nuvem-sincronizacao',
        buckets: [
          {
            id: 'sincronizacao',
            label: 'Sincronização',
            description: 'Mantém o mesmo conteúdo em vários lugares, inclusive as exclusões',
          },
          { id: 'backup', label: 'Backup', description: 'Guarda cópias independentes para recuperar depois' },
        ],
        items: [
          {
            id: 'planilha-celular',
            text: 'Você edita uma planilha no notebook e, segundos depois, vê a mudança no celular',
            bucket: 'sincronizacao',
            feedback: 'A mudança foi espelhada nos outros aparelhos: isso é sincronização.',
          },
          {
            id: 'versao-antiga',
            text: 'Você recupera a versão de três semanas atrás de um relatório que foi estragado',
            bucket: 'backup',
            feedback:
              'Voltar a uma versão antiga depende de cópias guardadas ao longo do tempo, que é a função do backup. Alguns serviços de nuvem também oferecem histórico de versões por esse motivo.',
          },
          {
            id: 'foto-sumiu',
            text: 'Você apaga uma foto no computador e ela some também do celular',
            bucket: 'sincronizacao',
            feedback:
              'Exclusões também são sincronizadas. Por isso, sincronizar sozinho não protege contra apagar por engano.',
          },
          {
            id: 'hd-externo',
            text: 'Um HD externo recebe uma cópia dos documentos toda semana e fica guardado desconectado',
            bucket: 'backup',
            feedback:
              'Cópia independente e desconectada: se o computador falhar ou for atacado, ela continua intacta.',
          },
          {
            id: 'pasta-equipe',
            text: 'A pasta compartilhada da equipe mostra sempre a versão mais recente para todos',
            bucket: 'sincronizacao',
            feedback: 'Todos veem o mesmo conteúdo atualizado ao mesmo tempo: é sincronização.',
          },
          {
            id: 'ssd-trocado',
            text: 'Depois de trocar o SSD com defeito, você restaura todos os arquivos do computador',
            bucket: 'backup',
            feedback: 'Restaurar tudo depois de uma falha de hardware só é possível com um backup.',
          },
        ],
      },
      {
        id: 'pasta-sumiu',
        kind: 'quiz',
        title: 'Sumiu de todo lugar',
        context:
          'Você apagou no notebook uma pasta que achava estar repetida. Minutos depois, percebe que ela sumiu também do celular e do site do serviço de nuvem.',
        prompt: 'O que aconteceu e o que fazer?',
        hint: 'Lembre o que a sincronização faz com tudo o que muda, inclusive exclusões.',
        explanation:
          'Na sincronização, apagar num aparelho apaga em todos. A rede de segurança é a lixeira (do computador e do serviço) e, em muitos casos, o histórico de versões. Para proteção de verdade, mantenha também um backup independente.',
        concept: 'nuvem-sincronizacao',
        options: [
          {
            id: 'a',
            text: 'Sua conta foi invadida; troque a senha e dê a pasta como perdida',
            feedback:
              'Não houve invasão: a sincronização apenas repetiu nos outros aparelhos a exclusão que você fez.',
          },
          {
            id: 'b',
            text: 'Desinstalar o aplicativo de sincronização faz a pasta voltar',
            feedback:
              'Desinstalar não desfaz uma exclusão já sincronizada e ainda interrompe a sincronização dos outros arquivos.',
          },
          {
            id: 'c',
            text: 'A sincronização replicou a exclusão; recupere a pasta pela Lixeira do computador ou pela lixeira do serviço, no site',
            correct: true,
            feedback:
              'Isso. Os serviços de nuvem guardam itens apagados por um período, geralmente 30 dias, que varia conforme o serviço e o plano.',
          },
          {
            id: 'd',
            text: 'A pasta está perdida para sempre, porque a nuvem não guarda nada que foi apagado',
            feedback:
              'Os principais serviços têm lixeira própria, acessível pelo site ou pelo app. Aja rápido, antes que o prazo expire.',
          },
        ],
      },
      {
        id: 'rotina-de-backup',
        kind: 'order',
        title: 'Rotina de backup',
        context: 'Você vai montar do zero a rotina de backup do computador da equipe.',
        prompt: 'Coloque as etapas na ordem certa.',
        hint: 'Primeiro defina o que proteger e onde guardar; por último, prove que dá para recuperar.',
        explanation:
          'Um backup só vale se for automático, para não depender da memória de ninguém, e se a restauração for testada. Muita gente descobre que o backup não funcionava justamente no dia em que precisa dele. Repita o teste de restauração de tempos em tempos.',
        concept: 'backup',
        items: [
          { id: 'o-que', text: 'Listar o que é insubstituível: documentos, fotos e projetos' },
          { id: 'onde', text: 'Escolher onde guardar as cópias, como um HD externo e um serviço de nuvem' },
          { id: 'configurar', text: 'Configurar a ferramenta de backup para copiar automaticamente, com frequência definida' },
          { id: 'primeiro', text: 'Executar o primeiro backup completo e esperar terminar' },
          { id: 'testar', text: 'Restaurar um arquivo de teste para confirmar que a cópia funciona' },
        ],
      },
      {
        id: 'regra-3-2-1',
        kind: 'quiz',
        title: 'Regra 3-2-1',
        context:
          'Seu TCC está no notebook e numa cópia em pendrive, que anda na mesma mochila que o notebook.',
        prompt: 'Qual plano segue a regra 3-2-1 de backup?',
        hint: '3 cópias, em 2 tipos de mídia diferentes, com 1 delas fora do local.',
        explanation:
          'A regra 3-2-1 diz: tenha 3 cópias dos dados, em 2 tipos de armazenamento diferentes, com pelo menos 1 fora de casa ou do escritório. Assim, nenhum problema isolado, seja defeito, roubo, incêndio ou ransomware, destrói todas as cópias ao mesmo tempo.',
        concept: 'backup',
        options: [
          {
            id: 'a',
            text: 'Fazer mais duas cópias no mesmo pendrive, em pastas diferentes',
            feedback:
              'Continuam todas no mesmo dispositivo: se o pendrive estragar ou a mochila for roubada, tudo se perde junto.',
          },
          {
            id: 'b',
            text: 'Salvar uma segunda cópia em outra pasta do notebook',
            feedback: 'Outra pasta no mesmo disco não protege contra defeito, roubo ou ransomware no notebook.',
          },
          {
            id: 'c',
            text: 'Manter o notebook e o pendrive e acrescentar uma cópia num serviço de nuvem com histórico de versões',
            correct: true,
            feedback:
              'Isso: três cópias (notebook, pendrive e nuvem), em mais de um tipo de mídia, e uma delas fora do local. Um roubo ou uma pane não leva tudo.',
          },
          {
            id: 'd',
            text: 'Enviar o arquivo para si mesmo por e-mail uma única vez, no fim do semestre',
            feedback:
              'Uma cópia feita uma vez só fica desatualizada logo. Backup precisa ser frequente, de preferência automático.',
          },
        ],
      },
    ],
    debrief:
      'Sincronização mantém tudo igual em todos os aparelhos, inclusive os erros; backup guarda cópias independentes para recuperar o que se perdeu. Uma boa rotina é automática, segue a regra 3-2-1 e tem a restauração testada. O melhor backup é aquele que você já provou que funciona.',
    platformNote:
      'No Windows 11, o app Backup do Windows salva pastas e configurações no OneDrive, e o Histórico de Arquivos (no Painel de Controle) copia para um HD externo; no Windows 10, o Histórico de Arquivos fica em Configurações > Atualização e Segurança > Backup. No macOS, use a Time Machine com um disco externo. No Linux, muitas distribuições trazem o app Backups (Déjà Dup).',
  },
];
