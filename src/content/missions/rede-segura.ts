import type { MissionDefinition } from '../types';

export const REDE_SEGURA_MISSIONS: MissionDefinition[] = [
  // -------------------------------------------------------------------------
  // r01 — Navegador e endereços
  // -------------------------------------------------------------------------
  {
    id: 'r01-navegador-e-enderecos',
    version: 1,
    sector: 'rede-segura',
    order: 1,
    title: 'Navegador e endereços',
    summary: 'Diferenciar navegador, buscador e site, e ler um endereço para descobrir quem é o verdadeiro dono da página.',
    briefing:
      'Agente, o setor de rede do Nexo está cheio de portas falsas que imitam as verdadeiras. Antes de sair navegando, você precisa saber qual ferramenta está usando e ler um endereço como um investigador. Um único detalhe no domínio separa a loja de verdade da armadilha.',
    category: 'internet',
    subcategory: 'Navegação básica',
    difficulty: 1,
    estimatedMinutes: 10,
    prerequisites: [],
    objectives: [
      'Distinguir navegador, buscador e site',
      'Identificar o domínio em um endereço (URL)',
      'Reconhecer endereços que imitam sites verdadeiros',
    ],
    concepts: ['navegador-basico', 'url-anatomia'],
    steps: [
      {
        id: 'nav-01',
        kind: 'classify',
        title: 'Quem é quem',
        prompt:
          'Classifique cada item: é um **navegador** (o programa que abre páginas), um **buscador** (o serviço que procura páginas) ou um **site** (um endereço com conteúdo)?',
        hint: 'Pergunte-se: é algo que eu instalo e abro, algo que uso para procurar, ou um lugar que eu visito?',
        explanation:
          'O **navegador** (Chrome, Edge, Firefox, Safari) é o programa. O **buscador** (Google, Bing) é um site especial que procura outros sites. Um **site** é qualquer endereço com conteúdo. Dá para usar qualquer buscador em qualquer navegador.',
        concept: 'navegador-basico',
        buckets: [
          { id: 'navegador', label: 'Navegador', description: 'Programa que abre páginas da web' },
          { id: 'buscador', label: 'Buscador', description: 'Serviço que pesquisa páginas' },
          { id: 'site', label: 'Site', description: 'Conjunto de páginas em um endereço' },
        ],
        items: [
          {
            id: 'chrome',
            text: 'Google Chrome',
            bucket: 'navegador',
            feedback:
              'O Chrome é o programa que exibe as páginas. O "Google" no nome confunde, mas o buscador do Google é outro produto, que você acessa dentro de qualquer navegador.',
          },
          {
            id: 'edge',
            text: 'Microsoft Edge',
            bucket: 'navegador',
            feedback: 'O Edge é o navegador que já vem instalado no Windows.',
          },
          {
            id: 'safari',
            text: 'Safari',
            bucket: 'navegador',
            feedback: 'O Safari é o navegador da Apple, padrão no iPhone, no iPad e no Mac.',
          },
          {
            id: 'bing',
            text: 'Bing',
            bucket: 'buscador',
            feedback: 'O Bing é o buscador da Microsoft. Você o acessa por um navegador, como qualquer outro site.',
          },
          {
            id: 'google-pesquisa',
            text: 'Google Pesquisa (google.com)',
            bucket: 'buscador',
            feedback: 'A página google.com é um buscador: ela procura outros sites para você. Funciona no Chrome, no Edge, no Firefox...',
          },
          {
            id: 'loja',
            text: '`loja-vertice.com.br`',
            bucket: 'site',
            feedback: 'É o endereço de um site: um lugar com conteúdo que você visita usando o navegador.',
          },
          {
            id: 'receitas',
            text: '`exemplo.com/receitas`',
            bucket: 'site',
            feedback: 'Também é um site (aqui, uma página específica dentro dele, indicada por /receitas).',
          },
        ],
      },
      {
        id: 'nav-02',
        kind: 'quiz',
        title: 'Barra de endereço',
        context: 'Você sabe de cor o endereço da loja onde costuma comprar: `loja-vertice.com.br`.',
        prompt: 'Qual é o caminho mais direto e seguro para chegar ao site?',
        hint: 'Qual opção não depende de ninguém escolher o link por você?',
        explanation:
          'A **barra de endereço** fica no topo do navegador. Quando você já sabe o endereço, digitá-lo ali é o caminho mais curto e evita anúncios e links falsos. Nos navegadores atuais, essa barra também aceita pesquisas: se você digitar palavras soltas, ela usa o buscador padrão.',
        concept: 'navegador-basico',
        options: [
          {
            id: 'a',
            text: 'Digitar `loja-vertice.com.br` na barra de endereço do navegador e pressionar Enter.',
            correct: true,
            feedback: 'Isso mesmo. Digitar o endereço conhecido leva direto ao site, sem passar por anúncios ou links de terceiros.',
          },
          {
            id: 'b',
            text: 'Pesquisar "loja vertice" no buscador e clicar no primeiro resultado, seja qual for.',
            feedback:
              'Muitas vezes funciona, mas o primeiro resultado pode ser um anúncio patrocinado, e golpistas compram anúncios com endereços parecidos. Se pesquisar, confira o domínio antes de clicar.',
          },
          {
            id: 'c',
            text: 'Clicar no link de promoção que chegou por mensagem de um número desconhecido.',
            feedback:
              'Links enviados por desconhecidos são a forma mais comum de levar alguém a um site falso. Quando você conhece o endereço, digite-o.',
          },
          {
            id: 'd',
            text: 'Digitar o endereço na caixa de pesquisa que aparece no meio da página do Google.',
            feedback:
              'Ali o endereço vira uma pesquisa, e você ainda precisa escolher um resultado. A barra de endereço, no topo do navegador, vai direto ao site.',
          },
        ],
      },
      {
        id: 'url-01',
        kind: 'quiz',
        title: 'Anatomia do endereço',
        context: 'Endereço completo: `https://www.banco-horizonte.com.br/conta/extrato?mes=10`',
        prompt: 'Qual parte identifica **quem é o dono** do site?',
        hint: 'Procure o trecho entre `://` e a primeira barra `/` que vem depois.',
        explanation:
          'Um endereço (URL) tem partes: **protocolo** (`https://`), **domínio** (`www.banco-horizonte.com.br`), **caminho** (`/conta/extrato`) e **parâmetros** (`?mes=10`). O dono é definido pelo final do domínio, logo antes da primeira barra: `banco-horizonte.com.br`. O `www.` é um subdomínio.',
        concept: 'url-anatomia',
        options: [
          {
            id: 'a',
            text: '`banco-horizonte.com.br`, o domínio',
            correct: true,
            feedback: 'Exato. O domínio é o "nome registrado" do site. É ele que você confere para saber onde está.',
          },
          {
            id: 'b',
            text: '`https://`, o protocolo',
            feedback: 'O `https` indica que a conexão é criptografada, não quem é o dono. Sites falsos também usam `https`.',
          },
          {
            id: 'c',
            text: '`/conta/extrato`, o caminho',
            feedback:
              'O caminho mostra em qual página do site você está. Qualquer pessoa pode criar no próprio site um caminho chamado "/banco-horizonte".',
          },
          {
            id: 'd',
            text: '`?mes=10`, os parâmetros',
            feedback: 'Parâmetros são informações extras que a página recebe (aqui, o mês do extrato). Não dizem nada sobre o dono.',
          },
        ],
      },
      {
        id: 'url-02',
        kind: 'classify',
        title: 'Do banco ou não?',
        context:
          'O domínio oficial do Banco Horizonte é `banco-horizonte.com.br`. Só pertence ao banco o que termina exatamente nele, logo antes da primeira `/`.',
        prompt: 'Classifique cada endereço: pertence ao Banco Horizonte ou a outro dono?',
        hint: 'Ache a primeira `/` depois de `https://` e leia o que vem imediatamente antes dela, da direita para a esquerda.',
        explanation:
          'O truque mais comum é colocar o nome verdadeiro no **começo** do endereço ou no **caminho**. O que vale é o final do domínio, logo antes da primeira barra. Leia da direita para a esquerda: `.com.br`, depois `banco-horizonte`. Se não bater exatamente, não é o banco.',
        concept: 'url-anatomia',
        buckets: [
          { id: 'banco', label: 'Do Banco Horizonte' },
          { id: 'outro', label: 'De outro dono' },
        ],
        items: [
          {
            id: 'www',
            text: '`https://www.banco-horizonte.com.br/login`',
            bucket: 'banco',
            feedback: 'O domínio termina em `banco-horizonte.com.br` logo antes da primeira barra. O `www` é só um subdomínio do próprio banco.',
          },
          {
            id: 'app',
            text: '`https://app.banco-horizonte.com.br/pix`',
            bucket: 'banco',
            feedback: '`app.` é um subdomínio. Só quem controla `banco-horizonte.com.br` pode criar subdomínios dele.',
          },
          {
            id: 'acesso-seguro',
            text: '`https://banco-horizonte.com.br.acesso-seguro.net/login`',
            bucket: 'outro',
            feedback:
              'Leia o final, antes da primeira barra: `acesso-seguro.net`. O começo "banco-horizonte.com.br" é só um subdomínio criado pelo dono de acesso-seguro.net.',
          },
          {
            id: 'atualizacao',
            text: '`https://bancohorizonte-atualizacao.com/cadastro`',
            bucket: 'outro',
            feedback: 'Sem o hífen original e terminado em "-atualizacao.com", é outro domínio. Golpistas registram nomes parecidos com o verdadeiro.',
          },
          {
            id: 'zero',
            text: '`https://www.banco-h0rizonte.com.br`',
            bucket: 'outro',
            feedback: 'Olhe com atenção: há um zero no lugar do "o". Um único caractere trocado já é outro domínio, de outro dono.',
          },
          {
            id: 'caminho',
            text: '`https://exemplo.com/banco-horizonte.com.br/login`',
            bucket: 'outro',
            feedback: 'O domínio é `exemplo.com`. O que vem depois da barra é apenas o caminho, que qualquer um pode inventar.',
          },
        ],
      },
      {
        id: 'url-03',
        kind: 'inspect',
        title: 'Oferta boa demais',
        context:
          'Um anúncio numa rede social levou você a esta página, com a marca da Loja Vértice. A loja verdadeira fica em `loja-vertice.com.br`.',
        prompt: 'Inspecione a página. Marque as partes suspeitas e decida se é seguro comprar.',
        hint: 'Comece pelo endereço: leia o domínio de trás para frente. Depois pense no que o site quer que você faça com pressa.',
        explanation:
          'Sites falsos copiam o visual e até exibem cadeado. Os sinais que os denunciam estão no **domínio** e no **comportamento**: preço impossível, pressa e pagamento só por Pix. Na dúvida, acesse a loja digitando o endereço oficial.',
        concept: 'url-anatomia',
        artifact: 'site',
        parts: [
          {
            id: 'endereco',
            field: 'Endereço',
            text: 'https://loja-vertice.ofertas-relampago.shop/tv-55',
            suspicious: true,
            explanation:
              'O domínio real é `ofertas-relampago.shop`. "loja-vertice" aparece só como subdomínio, criado pelo dono do site falso.',
          },
          {
            id: 'cadeado',
            field: 'Conexão',
            text: 'Cadeado exibido: conexão segura (HTTPS)',
            suspicious: false,
            explanation:
              'O cadeado só garante que a conversa entre você e o site é criptografada; não diz quem é o dono. Golpistas obtêm certificados gratuitos em minutos. Não é o sinal do golpe, mas também não é prova de confiança.',
          },
          {
            id: 'visual',
            field: 'Conteúdo',
            text: 'Logotipo, cores e menu idênticos aos da Loja Vértice',
            suspicious: false,
            explanation:
              'Copiar o visual de uma loja é fácil, por isso a aparência não prova nada, nem para um lado nem para o outro. O que denuncia o golpe é o endereço.',
          },
          {
            id: 'preco',
            field: 'Conteúdo',
            text: 'Smart TV 55 polegadas de R$ 3.499 por R$ 349. Restam só 2 unidades!',
            suspicious: true,
            explanation: 'Desconto de 90% e escassez artificial são iscas clássicas: criam pressa para você não parar para verificar.',
          },
          {
            id: 'botao',
            field: 'Botão',
            text: 'Pague só no Pix para garantir o preço (cartão indisponível)',
            suspicious: true,
            explanation:
              'Aceitar apenas Pix é um sinal forte. O Pix é instantâneo e difícil de reaver; já a compra no cartão de crédito pode ser contestada.',
          },
        ],
        minFlags: 2,
        verdict: {
          question: 'E então, você compra?',
          options: [
            {
              id: 'nao',
              text: 'Não. O domínio não é o da loja: fecho a página e, se quiser conferir a oferta, digito `loja-vertice.com.br` na barra de endereço.',
              correct: true,
              feedback: 'Perfeito. Ir pelo endereço oficial tira a dúvida: se a promoção existisse, estaria lá.',
            },
            {
              id: 'cadeado',
              text: 'Sim. Tem cadeado, então o site é seguro.',
              feedback: 'O cadeado indica conexão criptografada, não honestidade. Um site falso pode ter cadeado e mesmo assim ficar com seu dinheiro.',
            },
            {
              id: 'pix',
              text: 'Sim, mas pago rápido no Pix antes que as unidades acabem.',
              feedback: 'A pressa é exatamente o que o golpista quer. E um Pix enviado a golpistas é muito difícil de recuperar.',
            },
            {
              id: 'cadastro',
              text: 'Talvez. Faço o cadastro com meu CPF para ver se o pedido aparece.',
              feedback: 'Cadastrar dados num site falso entrega CPF, endereço e telefone ao golpista, que pode usá-los em outros golpes.',
            },
          ],
        },
      },
    ],
    debrief:
      'Navegador é o programa; buscador é o serviço de pesquisa; site é o lugar que você visita. Para saber onde está de verdade, leia o domínio logo antes da primeira barra, da direita para a esquerda. Cadeado e logotipo não provam identidade: o domínio prova.',
    platformNote:
      'Chrome e Edge escondem o `https://` (e às vezes o `www`) na barra de endereço; clique nela para ver o endereço completo. No celular, toque na barra para conferir o domínio inteiro.',
  },

  // -------------------------------------------------------------------------
  // r02 — Abas e atalhos do navegador
  // -------------------------------------------------------------------------
  {
    id: 'r02-abas-e-atalhos',
    version: 1,
    sector: 'rede-segura',
    order: 2,
    title: 'Abas e atalhos do navegador',
    summary: 'Controlar abas e navegar pelo teclado com os atalhos mais úteis do navegador.',
    briefing:
      'O terminal de pesquisa do Nexo funciona à base de abas, e um agente que depende do mouse para tudo perde segundos preciosos. Nesta missão você vai abrir, fechar e ressuscitar abas, achar palavras numa página longa e saltar para a barra de endereço sem tirar as mãos do teclado.',
    category: 'navegadores',
    subcategory: 'Abas e atalhos',
    difficulty: 2,
    estimatedMinutes: 7,
    prerequisites: ['r01-navegador-e-enderecos'],
    objectives: [
      'Abrir, fechar e reabrir abas pelo teclado',
      'Encontrar palavras numa página com a busca',
      'Ir direto para a barra de endereço',
      'Abrir links em nova aba sem perder a página atual',
    ],
    concepts: ['abas-navegador', 'atalhos-navegador'],
    steps: [
      {
        id: 'abas-01',
        kind: 'shortcut',
        title: 'Nova aba',
        context: 'Você precisa consultar outra página sem fechar a que está lendo.',
        prompt: 'Monte no teclado virtual o atalho que **abre uma nova aba**.',
        hint: 'A letra lembra "tab", que é "aba" em inglês.',
        explanation:
          '{{Ctrl+T}} abre uma nova aba ({{Cmd+T}} no Mac). Para alternar entre abas, use {{Ctrl+Tab}} (próxima) e {{Ctrl+Shift+Tab}} (anterior). Como esse atalho é reservado ao navegador, você o pratica no teclado virtual.',
        concept: 'abas-navegador',
        capture: 'virtual',
        combos: [{ key: 't', ctrl: true }],
        mac: [{ key: 't', meta: true }],
        platformNote: 'No Mac, use {{Cmd+T}}.',
      },
      {
        id: 'abas-02',
        kind: 'shortcut',
        title: 'Fechou sem querer',
        context: 'Você está na aba de um formulário de inscrição.',
        prompt:
          'Feche a aba atual pelo teclado e, em seguida, **reabra a aba que acabou de fechar**. Monte as duas combinações, na ordem.',
        hint: 'Fechar usa a letra W. Para desfazer o fechamento, use o atalho de nova aba com uma tecla a mais.',
        explanation:
          '{{Ctrl+W}} fecha a aba atual e {{Ctrl+Shift+T}} reabre a última aba fechada, com o histórico dela. Repetindo {{Ctrl+Shift+T}}, você recupera abas fechadas antes, da mais recente para a mais antiga. Atenção: o que estava digitado num formulário nem sempre volta.',
        concept: 'abas-navegador',
        capture: 'virtual',
        combos: [
          { key: 'w', ctrl: true },
          { key: 't', ctrl: true, shift: true },
        ],
        mac: [
          { key: 'w', meta: true },
          { key: 't', meta: true, shift: true },
        ],
        platformNote: 'No Mac: {{Cmd+W}} e depois {{Cmd+Shift+T}}.',
      },
      {
        id: 'atalhos-01',
        kind: 'shortcut',
        title: 'Achar na página',
        context: 'O regulamento do concurso é enorme, e você só quer saber o **prazo** de inscrição.',
        prompt: 'Pressione o atalho que abre a **busca na página**.',
        hint: 'F de "find", que significa "encontrar" em inglês.',
        explanation:
          '{{Ctrl+F}} abre a caixa de busca da página ({{Cmd+F}} no Mac). Digite a palavra e pressione {{Enter}} para pular para a próxima ocorrência. Funciona também em PDFs, documentos e na maioria dos programas.',
        concept: 'atalhos-navegador',
        capture: 'real',
        combos: [{ key: 'f', ctrl: true }],
        mac: [{ key: 'f', meta: true }],
        practiceText:
          'Regulamento do Concurso Cultural Nexo. 1. Podem participar maiores de 16 anos residentes no Brasil. 2. Cada participante pode enviar um único trabalho. 3. O prazo de inscrição termina em 30 de novembro, às 23h59. 4. Os trabalhos serão avaliados por uma comissão independente. 5. O resultado será publicado no site oficial em até 15 dias após o fim do prazo.',
      },
      {
        id: 'atalhos-02',
        kind: 'shortcut',
        title: 'Direto ao endereço',
        prompt: 'Você quer digitar um novo endereço sem pegar o mouse. Pressione o atalho que **seleciona a barra de endereço**.',
        hint: 'Pense em "link" ou "local": a letra é L.',
        explanation:
          '{{Ctrl+L}} seleciona todo o endereço atual: basta digitar o novo e pressionar {{Enter}}. Também é ótimo para copiar o endereço da página: {{Ctrl+L}} e depois {{Ctrl+C}}.',
        concept: 'atalhos-navegador',
        capture: 'real',
        combos: [{ key: 'l', ctrl: true }],
        mac: [{ key: 'l', meta: true }],
        platformNote: 'No Windows, {{Alt+D}} e {{F6}} fazem o mesmo. No Mac, use {{Cmd+L}}.',
      },
      {
        id: 'abas-03',
        kind: 'quiz',
        title: 'Abrir sem perder',
        context: 'Você está lendo uma notícia e quer abrir um link citado no texto, mas sem sair da página atual.',
        prompt: 'Qual é a forma mais prática?',
        hint: 'Existe uma tecla modificadora que transforma o clique em "abrir em segundo plano".',
        explanation:
          '{{Ctrl}} + clique (ou clique com o botão do meio, a rodinha do mouse) abre o link numa nova aba sem tirar você da página. Clicar com o botão do meio sobre uma aba a fecha. E lembre: abas demais consomem memória, então feche o que não usa.',
        concept: 'abas-navegador',
        options: [
          {
            id: 'a',
            text: 'Segurar Ctrl e clicar no link (ou clicar com o botão do meio do mouse).',
            correct: true,
            feedback: 'Isso. O link abre numa nova aba em segundo plano e você continua lendo. No Mac, é Command + clique.',
          },
          {
            id: 'b',
            text: 'Clicar duas vezes rapidamente no link.',
            feedback: 'Na web, links funcionam com um clique só. O duplo clique apenas abre o link na mesma aba, saindo da página atual.',
          },
          {
            id: 'c',
            text: 'Segurar Shift e clicar no link.',
            feedback: 'No Chrome, no Edge e no Firefox, Shift + clique abre o link numa nova janela, não numa aba. Funciona, mas espalha janelas pela tela.',
          },
          {
            id: 'd',
            text: 'Copiar o texto do link, abrir uma nova aba e colar na barra de endereço.',
            feedback: 'Dá muito mais trabalho, e o texto visível do link nem sempre é o endereço real para onde ele aponta.',
          },
        ],
      },
    ],
    debrief:
      'Com {{Ctrl+T}}, {{Ctrl+W}} e {{Ctrl+Shift+T}} você controla abas sem medo de perder nada. {{Ctrl+F}} acha qualquer palavra na página, {{Ctrl+L}} leva direto à barra de endereço e {{Ctrl}} + clique abre links em segundo plano.',
    platformNote:
      'Os atalhos valem para Chrome, Edge e Firefox no Windows e no Linux. No macOS, use a tecla Command (⌘) no lugar de Ctrl.',
  },

  // -------------------------------------------------------------------------
  // r03 — Pesquisa eficiente
  // -------------------------------------------------------------------------
  {
    id: 'r03-pesquisa-eficiente',
    version: 1,
    sector: 'rede-segura',
    order: 3,
    title: 'Pesquisa eficiente',
    summary: 'Pesquisar com precisão usando operadores e avaliar se a fonte encontrada merece confiança.',
    briefing:
      'O arquivo central do Nexo guarda bilhões de páginas, e a maioria não vai te ajudar. Agentes experientes não pesquisam mais: pesquisam melhor, com as palavras certas e operadores precisos. Depois, separam a fonte sólida do boato antes de agir.',
    category: 'internet',
    subcategory: 'Pesquisa na web',
    difficulty: 2,
    estimatedMinutes: 9,
    prerequisites: ['r01-navegador-e-enderecos'],
    objectives: [
      'Usar aspas, site:, filetype: e o sinal de menos',
      'Pesquisar mensagens de erro com eficiência',
      'Avaliar autoria, data e origem de uma fonte',
      'Checar uma informação em outras fontes antes de compartilhar',
    ],
    concepts: ['pesquisa-eficiente', 'avaliar-fontes'],
    steps: [
      {
        id: 'busca-01',
        kind: 'quiz',
        title: 'Mensagem de erro',
        context: 'Ao conectar um pendrive no Windows 11, aparece a mensagem: **O dispositivo USB não foi reconhecido**.',
        prompt: 'Qual pesquisa tende a trazer as soluções mais certeiras?',
        hint: 'Mensagens de erro são textos exatos. Existe um recurso que busca uma frase inteira, na ordem.',
        explanation:
          'Colocar a mensagem de erro entre **aspas** e acrescentar o sistema ou programa (`windows 11`, `android`, o nome do app) é uma das pesquisas mais eficientes que existem: alguém já teve o mesmo erro e escreveu sobre ele.',
        concept: 'pesquisa-eficiente',
        options: [
          {
            id: 'a',
            text: '`"dispositivo USB não foi reconhecido" windows 11`',
            correct: true,
            feedback: 'Isso. As aspas buscam a frase exata da mensagem e "windows 11" direciona para o seu sistema.',
          },
          {
            id: 'b',
            text: '`meu computador não está lendo o negócio que eu coloquei o que eu faço`',
            feedback:
              'Os buscadores entendem perguntas, mas palavras vagas como "negócio" atrapalham. A mensagem de erro exata é muito mais precisa.',
          },
          {
            id: 'c',
            text: '`usb`',
            feedback: 'Genérico demais: traz definições, lojas e notícias sobre USB, não a solução do seu erro.',
          },
          {
            id: 'd',
            text: '`"dispositivo" "USB" "não" "foi" "reconhecido"`',
            feedback:
              'Aspas em cada palavra exigem que todas apareçam, mas em qualquer ordem e posição. As aspas funcionam melhor em volta da frase inteira.',
          },
        ],
      },
      {
        id: 'busca-02',
        kind: 'classify',
        title: 'O operador certo',
        prompt: 'Para cada situação, qual recurso de pesquisa resolve melhor?',
        hint: 'Pense no que você quer: frase exata, restringir o lugar, tirar algo do resultado ou mudar o tipo de arquivo.',
        explanation:
          'Operadores refinam a pesquisa: **"aspas"** para frase exata, `site:` para um site ou domínio, **-palavra** para excluir e `filetype:pdf` para tipo de arquivo. Dá para combiná-los: `"segunda via" site:gov.br`.',
        concept: 'pesquisa-eficiente',
        buckets: [
          { id: 'aspas', label: '"Aspas"', description: 'Busca a frase exata' },
          { id: 'site', label: 'site:', description: 'Limita a um site ou domínio' },
          { id: 'menos', label: 'Sinal de menos (-)', description: 'Exclui uma palavra' },
          { id: 'filetype', label: 'filetype:', description: 'Procura um tipo de arquivo' },
        ],
        items: [
          {
            id: 'musica',
            text: 'Achar uma música lembrando só um trecho da letra',
            bucket: 'aspas',
            feedback: 'Com o trecho entre aspas, o buscador procura exatamente aquela sequência de palavras.',
          },
          {
            id: 'governo',
            text: 'Ver informações sobre emissão de documentos apenas em sites do governo',
            bucket: 'site',
            feedback: 'Com `site:gov.br`, os resultados ficam restritos aos sites do governo brasileiro.',
          },
          {
            id: 'loja',
            text: 'Procurar fones de ouvido só dentro do site `loja-vertice.com.br`',
            bucket: 'site',
            feedback: '`fone de ouvido site:loja-vertice.com.br` mostra apenas páginas daquele site.',
          },
          {
            id: 'bolo',
            text: 'Procurar receitas de bolo de cenoura sem as versões com chocolate',
            bucket: 'menos',
            feedback: '`bolo de cenoura -chocolate` remove os resultados que contêm "chocolate".',
          },
          {
            id: 'jaguar',
            text: 'Pesquisar sobre o jaguar, o animal, sem resultados sobre carros',
            bucket: 'menos',
            feedback: '`jaguar -carro` tira do caminho as páginas sobre o automóvel de mesmo nome.',
          },
          {
            id: 'manual',
            text: 'Encontrar o manual da sua impressora em PDF',
            bucket: 'filetype',
            feedback: '`manual impressora modelo filetype:pdf` traz apenas arquivos PDF, onde os manuais costumam estar.',
          },
        ],
      },
      {
        id: 'fontes-01',
        kind: 'classify',
        title: 'Confiar ou checar',
        context: 'Você está pesquisando se um remédio caseiro realmente funciona contra a gripe.',
        prompt: 'Classifique cada fonte: serve como boa base ou é melhor desconfiar e checar em outro lugar?',
        hint: 'Pergunte: quem escreveu? Quando? De onde tirou a informação? Ganha algo com isso?',
        explanation:
          'Uma fonte confiável mostra **quem** escreveu, **quando**, **de onde** vem a informação e não tem interesse escondido. Nenhuma fonte é infalível, mas essas perguntas eliminam a maior parte dos boatos.',
        concept: 'avaliar-fontes',
        buckets: [
          { id: 'base', label: 'Boa base', description: 'Autoria identificada, data e evidências' },
          { id: 'checar', label: 'Desconfie e cheque', description: 'Sem fonte, sem autor ou com interesse escondido' },
        ],
        items: [
          {
            id: 'ministerio',
            text: 'Página do Ministério da Saúde (gov.br/saude), com data de atualização recente',
            bucket: 'base',
            feedback: 'Órgão oficial, responsável identificado e data de atualização: ótimos sinais.',
          },
          {
            id: 'jornal',
            text: 'Reportagem assinada de um jornal conhecido, que cita estudos e entrevista médicos',
            bucket: 'base',
            feedback: 'Autor identificado, estudos citados e especialistas ouvidos permitem conferir a informação.',
          },
          {
            id: 'universidade',
            text: 'Página de uma universidade com o resumo de uma pesquisa e o link para o estudo completo',
            bucket: 'base',
            feedback: 'A pesquisa original está disponível para conferência, e a instituição responde pelo conteúdo.',
          },
          {
            id: 'corrente',
            text: 'Corrente: "Médico revela a cura que a indústria esconde. Compartilhe antes que apaguem!"',
            bucket: 'checar',
            feedback: 'Sem nome, sem fonte e com apelo para compartilhar depressa: características típicas de desinformação.',
          },
          {
            id: 'vendedor',
            text: 'Vídeo de um perfil que vende o próprio "chá milagroso" no link da descrição',
            bucket: 'checar',
            feedback: 'Há conflito de interesse: quem lucra com o produto não é uma fonte imparcial sobre ele.',
          },
          {
            id: 'sem-autor',
            text: 'Artigo sem data e sem autor, num site cheio de anúncios piscando',
            bucket: 'checar',
            feedback: 'Sem data e sem autor, não dá para saber se a informação está atualizada nem quem responde por ela.',
          },
        ],
      },
      {
        id: 'fontes-02',
        kind: 'quiz',
        title: 'Antes de compartilhar',
        context:
          'Chega no grupo da família o print de uma suposta notícia: "A partir de segunda, todo Pix terá taxa de R$ 5". Não há link, só a imagem.',
        prompt: 'Qual é o melhor primeiro passo?',
        hint: 'Em vez de analisar só a imagem, olhe para fora dela.',
        explanation:
          'Checadores profissionais fazem **leitura lateral**: abrem outras abas e verificam quem mais está noticiando, se há comunicado oficial e se a data é atual. Prints sem link merecem desconfiança extra, porque não dá para conferir a origem.',
        concept: 'avaliar-fontes',
        options: [
          {
            id: 'a',
            text: 'Pesquisar o assunto em outros veículos e em agências de checagem, e procurar um comunicado oficial.',
            correct: true,
            feedback:
              'Isso é leitura lateral: em vez de confiar na peça, você vê o que fontes independentes dizem. Se fosse verdade, estaria em vários veículos e nos canais oficiais.',
          },
          {
            id: 'b',
            text: 'Compartilhar perguntando "alguém sabe se é verdade?".',
            feedback: 'Mesmo com a pergunta, você espalha o boato para mais gente, e muitos vão ler só o print.',
          },
          {
            id: 'c',
            text: 'Confiar, porque o print tem o logotipo de um jornal.',
            feedback: 'Prints são facílimos de montar ou editar. Um logotipo numa imagem não prova que a notícia saiu naquele jornal.',
          },
          {
            id: 'd',
            text: 'Avaliar pela quantidade de pessoas que já compartilharam.',
            feedback: 'Popularidade não é prova. Boatos costumam se espalhar mais rápido justamente por causarem susto.',
          },
        ],
      },
    ],
    debrief:
      'Pesquisa eficiente é escolher bem as palavras e usar operadores: aspas, `site:`, sinal de menos e `filetype:`. Encontrar não basta: confira autor, data, origem e interesses de cada fonte, e cheque informações chocantes em outros lugares antes de agir ou compartilhar.',
    platformNote:
      'Os operadores funcionam no Google e no Bing; o DuckDuckGo aceita a maioria deles. Às vezes os buscadores flexibilizam a pesquisa e mostram resultados aproximados mesmo com operadores.',
  },

  // -------------------------------------------------------------------------
  // r04 — Downloads sem susto
  // -------------------------------------------------------------------------
  {
    id: 'r04-downloads-sem-susto',
    version: 1,
    sector: 'rede-segura',
    order: 4,
    title: 'Downloads sem susto',
    summary: 'Baixar de fontes confiáveis, encontrar os downloads e desmascarar arquivos disfarçados.',
    briefing:
      'Todo arquivo que entra no sistema do Nexo passa pela pasta Downloads, e é lá que muitos invasores se escondem com nomes inocentes. Sua missão: escolher de onde baixar, achar o que chegou e desmascarar um arquivo que finge ser outra coisa.',
    category: 'navegadores',
    subcategory: 'Downloads',
    difficulty: 2,
    estimatedMinutes: 9,
    prerequisites: ['r01-navegador-e-enderecos'],
    objectives: [
      'Escolher fontes confiáveis para baixar programas',
      'Abrir a lista de downloads do navegador',
      'Reconhecer extensões perigosas disfarçadas',
      'Agir corretamente diante de alertas de download',
    ],
    concepts: ['downloads', 'fontes-confiaveis'],
    steps: [
      {
        id: 'origem-01',
        kind: 'classify',
        title: 'De onde baixar?',
        context: 'Você quer instalar o **NexoDraw**, um editor de imagens gratuito.',
        prompt: 'Classifique cada origem: pode baixar dela ou é melhor evitar?',
        hint: 'Quanto mais perto do criador do programa, mais seguro. Quanto mais intermediários e "atalhos", maior o risco.',
        explanation:
          'Baixe programas do **site oficial** do desenvolvedor ou da **loja oficial** do sistema. Anúncios com domínios parecidos, versões piratas e arquivos repassados por terceiros são as rotas preferidas de quem espalha programas maliciosos.',
        concept: 'fontes-confiaveis',
        buckets: [
          { id: 'confiavel', label: 'Pode baixar' },
          { id: 'evitar', label: 'Evite' },
        ],
        items: [
          {
            id: 'oficial',
            text: 'Site oficial do desenvolvedor, digitado na barra de endereço (`nexodraw.exemplo.com`)',
            bucket: 'confiavel',
            feedback: 'O site oficial é a origem mais direta: você recebe a versão original e atualizada.',
          },
          {
            id: 'loja',
            text: 'Loja oficial do sistema (Microsoft Store, App Store, Google Play)',
            bucket: 'confiavel',
            feedback: 'As lojas oficiais revisam os apps e facilitam as atualizações. Não são perfeitas, mas são bem mais seguras que sites aleatórios.',
          },
          {
            id: 'anuncio',
            text: 'Anúncio patrocinado no topo da pesquisa, com o endereço `nexodraw-download.top`',
            bucket: 'evitar',
            feedback: 'Golpistas compram anúncios com nomes parecidos para distribuir instaladores com vírus. O domínio não é o oficial.',
          },
          {
            id: 'crack',
            text: 'Versão "Premium liberada" (pirata) postada num fórum',
            bucket: 'evitar',
            feedback: 'Programas piratas são um dos principais meios de espalhar malware: quem "libera" o programa pode embutir o que quiser no instalador.',
          },
          {
            id: 'grupo',
            text: 'Arquivo `NexoDraw_Setup.exe` enviado por um desconhecido num grupo de mensagens',
            bucket: 'evitar',
            feedback: 'Você não sabe quem mexeu nesse arquivo. Instaladores devem vir da fonte, não de terceiros.',
          },
          {
            id: 'botoes',
            text: 'Site de downloads cheio de botões "BAIXAR" piscando, sem deixar claro qual é o certo',
            bucket: 'evitar',
            feedback: 'Botões falsos de download são anúncios que levam a outros programas. Se o site confunde de propósito, saia dele.',
          },
        ],
      },
      {
        id: 'downloads-01',
        kind: 'shortcut',
        title: 'Lista de downloads',
        context: 'Você clicou para baixar um comprovante, mas não viu para onde ele foi.',
        prompt: 'Monte o atalho que abre a **lista de downloads** do navegador.',
        hint: 'É a tecla da fileira base que fica entre H e K.',
        explanation:
          '{{Ctrl+J}} abre os downloads no Chrome e no Edge, com o nome do arquivo, a origem e a opção de mostrá-lo na pasta. Por padrão, tudo vai para a pasta **Downloads**.',
        concept: 'downloads',
        capture: 'virtual',
        combos: [{ key: 'j', ctrl: true }],
        mac: [{ key: 'j', meta: true, shift: true }],
        platformNote:
          '{{Ctrl+J}} vale para Chrome e Edge no Windows. No Chrome para Mac, o atalho é {{Cmd+Shift+J}}; no Safari, {{Cmd+Option+L}}. Em qualquer navegador, os downloads também ficam no ícone de seta para baixo da barra de ferramentas.',
      },
      {
        id: 'downloads-02',
        kind: 'filesystem',
        title: 'O comprovante e o impostor',
        context:
          'Na pasta Downloads há dois arquivos chamados **comprovante-matricula**. Um você baixou do site da escola; o outro veio de um link de e-mail suspeito. Com as extensões escondidas, os dois parecem PDFs.',
        prompt:
          'Ative a exibição de extensões, abra o comprovante verdadeiro e envie o arquivo falso para a Lixeira, sem abri-lo.',
        hint: 'Com as extensões ocultas, o Windows esconde só a ÚLTIMA extensão do nome. Ative "Mostrar extensões" e compare também os tamanhos.',
        explanation:
          '`comprovante-matricula.pdf.exe` é um **programa** disfarçado: com as extensões ocultas, aparece só como `comprovante-matricula.pdf`. O tamanho diferente também denuncia. Deixar as extensões visíveis é uma das proteções mais simples que existem.',
        concept: 'downloads',
        root: [
          { name: 'Área de Trabalho', type: 'folder', children: [] },
          {
            name: 'Documentos',
            type: 'folder',
            children: [
              {
                name: 'Escola',
                type: 'folder',
                children: [{ name: 'boletim-2026.pdf', type: 'file', sizeKb: 210 }],
              },
            ],
          },
          {
            name: 'Downloads',
            type: 'folder',
            children: [
              { name: 'comprovante-matricula.pdf', type: 'file', sizeKb: 184 },
              { name: 'comprovante-matricula.pdf.exe', type: 'file', sizeKb: 2348 },
              { name: 'foto-3x4.jpg', type: 'file', sizeKb: 420 },
              { name: 'lista-material.docx', type: 'file', sizeKb: 36 },
            ],
          },
          { name: 'Imagens', type: 'folder', children: [] },
          { name: 'Músicas', type: 'folder', children: [] },
          { name: 'Vídeos', type: 'folder', children: [] },
        ],
        startPath: '/Downloads',
        goals: [
          { type: 'opened', path: '/Downloads/comprovante-matricula.pdf', label: 'Abra o comprovante verdadeiro (o PDF)' },
          { type: 'inTrash', name: 'comprovante-matricula.pdf.exe', label: 'Envie o arquivo disfarçado para a Lixeira, sem abri-lo' },
        ],
        features: { extensions: true, delete: true, trash: true },
        protectedPaths: ['/Downloads/comprovante-matricula.pdf'],
      },
      {
        id: 'downloads-03',
        kind: 'quiz',
        title: 'Alerta do navegador',
        context:
          'Ao baixar um "visualizador de boletos" indicado num site desconhecido, o navegador avisa: **"Este arquivo não é baixado com frequência e pode ser perigoso."**',
        prompt: 'O que fazer?',
        hint: 'O aviso é uma proteção funcionando. A pergunta é: você realmente precisa desse arquivo?',
        explanation:
          'Navegadores comparam os downloads com listas de arquivos conhecidos e perigosos (no Edge, o **SmartScreen**; no Chrome, a **Navegação segura**). Quando avisam, a escolha segura é descartar e buscar a fonte oficial. Boletos, comprovantes e notas fiscais são PDFs: nunca exigem instalar programa.',
        concept: 'downloads',
        options: [
          {
            id: 'a',
            text: 'Descartar o download e, se precisar de algo, procurar numa fonte oficial.',
            correct: true,
            feedback:
              'Correto. Para ver um boleto, o próprio navegador ou um leitor de PDF comum bastam; ninguém precisa de um "visualizador" especial.',
          },
          {
            id: 'b',
            text: 'Clicar em "Manter mesmo assim", porque o antivírus avisa se houver algo errado.',
            feedback:
              'O antivírus não pega tudo, especialmente ameaças novas. Ignorar o alerta e confiar só nele é dispensar uma das duas camadas de proteção.',
          },
          {
            id: 'c',
            text: 'Desativar a proteção do navegador para o aviso parar de aparecer.',
            feedback: 'Desligar a proteção deixa você sem aviso nos próximos downloads perigosos. O aviso é o sistema funcionando.',
          },
          {
            id: 'd',
            text: 'Baixar de novo por outro navegador, que talvez não mostre o aviso.',
            feedback: 'Trocar de navegador não torna o arquivo seguro; só remove o alerta que estava protegendo você.',
          },
        ],
      },
    ],
    debrief:
      'Baixe do site oficial ou da loja oficial, encontre seus arquivos com {{Ctrl+J}} e mantenha as extensões visíveis para flagrar disfarces como `.pdf.exe`. Quando o navegador alertar sobre um download, leve o alerta a sério.',
    platformNote:
      'Windows 11: Explorador de Arquivos > Exibir > Mostrar > Extensões de nomes de arquivos. Windows 10: guia Exibir > marque "Extensões de nomes de arquivos". macOS: Finder > Ajustes > Avançado > "Mostrar todas as extensões de nome de arquivo".',
  },

  // -------------------------------------------------------------------------
  // r05 — Senhas fortes
  // -------------------------------------------------------------------------
  {
    id: 'r05-senhas-fortes',
    version: 1,
    sector: 'rede-segura',
    order: 5,
    title: 'Senhas fortes',
    summary: 'Criar senhas fortes e únicas e guardá-las com um gerenciador de senhas.',
    briefing:
      'As portas do Nexo se abrem com senhas, e os invasores testam milhões de combinações por segundo. Nesta missão você vai separar senhas de papel de senhas blindadas e montar um sistema para guardar dezenas delas decorando só uma.',
    category: 'seguranca',
    subcategory: 'Senhas',
    difficulty: 1,
    estimatedMinutes: 8,
    prerequisites: [],
    objectives: [
      'Reconhecer senhas fortes e fracas',
      'Entender por que não repetir senhas',
      'Usar um gerenciador de senhas com segurança',
    ],
    concepts: ['senhas-fortes', 'gerenciador-senhas'],
    steps: [
      {
        id: 'senha-01',
        kind: 'classify',
        title: 'Forte ou fraca',
        prompt: 'Classifique cada senha como forte ou fraca.',
        hint: 'Desconfie de tudo que tem relação com você (nomes, datas) ou segue um padrão famoso. O comprimento pesa mais do que os símbolos.',
        explanation:
          'Uma senha forte é **longa** (12 caracteres ou mais; de preferência 16 ou mais), **imprevisível** e **única**. Frases com quatro ou cinco palavras aleatórias são fortes e fáceis de lembrar. Trocar letras por símbolos e pôr o ano no final engana pessoas, não programas.',
        concept: 'senhas-fortes',
        buckets: [
          { id: 'forte', label: 'Forte' },
          { id: 'fraca', label: 'Fraca' },
        ],
        items: [
          {
            id: 's123456',
            text: '`123456`',
            bucket: 'fraca',
            feedback: 'Está entre as senhas mais usadas do mundo. Programas de ataque testam essa lista primeiro.',
          },
          {
            id: 'qwerty',
            text: '`qwerty123`',
            bucket: 'fraca',
            feedback: 'Sequência de teclas vizinhas mais números em ordem: um dos primeiros padrões testados.',
          },
          {
            id: 'nome-ano',
            text: '`Maria1985`',
            bucket: 'fraca',
            feedback: 'Nome com ano de nascimento é a primeira coisa que alguém tenta, ainda mais com dados das suas redes sociais.',
          },
          {
            id: 'senha-ano',
            text: '`Senha@2025`',
            bucket: 'fraca',
            feedback: 'Parece complexa, mas segue um padrão previsível (palavra comum + símbolo + ano) que os ataques já testam.',
          },
          {
            id: 'troca',
            text: '`P4ssw0rd!`',
            bucket: 'fraca',
            feedback: 'Trocar letras por números parecidos (a por 4, o por 0) é um truque conhecido; os programas de ataque fazem essas trocas automaticamente.',
          },
          {
            id: 'frase',
            text: '`girafa-trovao-lapis-marmita-82`',
            bucket: 'forte',
            feedback:
              'Uma frase-senha com palavras aleatórias é longa (30 caracteres) e fácil de lembrar. Só não use este exemplo: invente a sua.',
          },
          {
            id: 'aleatoria',
            text: '`vG8#qL2!pZ9@xR4m`',
            bucket: 'forte',
            feedback: 'Aleatória e com 16 caracteres: ideal para ser gerada e guardada por um gerenciador de senhas.',
          },
        ],
      },
      {
        id: 'senha-02',
        kind: 'quiz',
        title: 'Vazamento',
        context:
          'Você recebe o aviso de que o **Fórum de Receitas**, onde tem cadastro, teve as senhas vazadas. Você usa a mesma senha nele, no seu e-mail e numa loja on-line.',
        prompt: 'Qual é a prioridade?',
        hint: 'Pense no que um criminoso faria com uma senha vazada: tentaria usá-la só naquele site?',
        explanation:
          'Repetir senhas transforma um vazamento pequeno numa invasão em cadeia. Senhas **únicas** isolam o problema: se um site vaza, só aquele site é afetado. Comece pelo e-mail principal, que é a chave para redefinir todas as outras senhas.',
        concept: 'senhas-fortes',
        options: [
          {
            id: 'a',
            text: 'Trocar já a senha do e-mail e da loja, criando uma senha diferente para cada um, e ativar a verificação em duas etapas.',
            correct: true,
            feedback:
              'Exato. Com uma senha vazada, criminosos testam a mesma combinação em vários serviços. O e-mail é o mais urgente: com ele, dá para redefinir as outras senhas.',
          },
          {
            id: 'b',
            text: 'Trocar só a senha do Fórum de Receitas, que foi o site invadido.',
            feedback: 'É necessário, mas não basta: a mesma senha abre seu e-mail e a loja, e é por lá que o estrago acontece.',
          },
          {
            id: 'c',
            text: 'Esperar para ver se aparece alguma movimentação estranha.',
            feedback: 'Quando a movimentação aparece, o invasor já entrou. Trocar as senhas antes é muito mais barato do que remediar depois.',
          },
          {
            id: 'd',
            text: 'Trocar todas para uma mesma senha nova, só que mais forte.',
            feedback: 'Mais forte, mas ainda repetida: no próximo vazamento, tudo cai junto de novo. Cada serviço precisa da sua senha.',
          },
        ],
      },
      {
        id: 'senha-03',
        kind: 'quiz',
        title: 'Onde guardar',
        context: 'Você tem cerca de 60 contas e já percebeu que não dá para decorar 60 senhas diferentes.',
        prompt: 'Qual é a forma mais segura e prática de guardá-las?',
        hint: 'A melhor solução exige decorar apenas uma senha, e ela precisa ser muito boa.',
        explanation:
          'Um **gerenciador de senhas** guarda tudo criptografado e só abre com a **senha mestra**. Chrome, Edge, Firefox e os aparelhos Apple têm gerenciadores embutidos; também existem apps dedicados. Proteja a conta do gerenciador com uma senha mestra longa e com verificação em duas etapas.',
        concept: 'gerenciador-senhas',
        options: [
          {
            id: 'a',
            text: 'Um gerenciador de senhas confiável (o do navegador ou um app dedicado), protegido por uma senha mestra forte e verificação em duas etapas.',
            correct: true,
            feedback: 'Isso. Você memoriza uma única senha forte, e o gerenciador cria, guarda e preenche as outras, todas diferentes.',
          },
          {
            id: 'b',
            text: 'Uma planilha `senhas.xlsx` na Área de Trabalho.',
            feedback:
              'Qualquer pessoa ou programa malicioso com acesso ao computador lê a planilha, e ela costuma ir parar em backups e anexos sem proteção.',
          },
          {
            id: 'c',
            text: 'Uma senha-base com variações por site: `Casa2025!face`, `Casa2025!banco`...',
            feedback: 'Se uma delas vazar, o padrão fica óbvio e as outras são adivinhadas rapidamente.',
          },
          {
            id: 'd',
            text: 'Um papel colado no monitor do trabalho.',
            feedback: 'Fica à vista de qualquer pessoa que passe pela mesa. Anotar em papel guardado em casa é menos ruim, mas nunca à mostra.',
          },
        ],
      },
      {
        id: 'senha-04',
        kind: 'quiz',
        title: 'Vantagens escondidas',
        prompt: 'Quais afirmações sobre gerenciadores de senhas são verdadeiras? Marque todas as corretas.',
        hint: 'Desconfie das afirmações que dizem que uma proteção torna outra desnecessária.',
        explanation:
          'Além de guardar, um bom gerenciador **gera** senhas aleatórias, **preenche** só no domínio certo e **avisa** sobre senhas fracas, repetidas ou vazadas. Ele não substitui a senha mestra forte nem a verificação em duas etapas: soma-se a elas.',
        concept: 'gerenciador-senhas',
        multiple: true,
        options: [
          {
            id: 'gera',
            text: 'Eles geram senhas longas e aleatórias com um clique.',
            correct: true,
            feedback: 'Correto: o gerador cria senhas como `vG8#qL2!pZ9@xR4m` sem você precisar inventar nada.',
          },
          {
            id: 'dominio',
            text: 'Eles só oferecem a senha no domínio em que ela foi salva, o que ajuda a perceber sites falsos.',
            correct: true,
            feedback:
              'Correto: se o gerenciador não oferece sua senha em `banco-h0rizonte.com.br`, é porque o domínio não é o mesmo onde você a salvou. Ótimo alarme contra golpes.',
          },
          {
            id: 'alerta',
            text: 'Eles avisam quando uma senha salva é fraca, repetida ou apareceu num vazamento.',
            correct: true,
            feedback: 'Correto: a maioria verifica senhas repetidas e consulta bases de vazamentos conhecidos.',
          },
          {
            id: 'mestra-simples',
            text: 'Com um gerenciador, a senha mestra pode ser simples, já que ele protege tudo.',
            feedback: 'Pelo contrário: a senha mestra é a chave de todas as outras. Ela precisa ser a mais forte de todas.',
          },
          {
            id: 'sem-2fa',
            text: 'Com um gerenciador, não é mais preciso ativar a verificação em duas etapas.',
            feedback: 'A verificação em duas etapas continua essencial, principalmente no e-mail e na própria conta do gerenciador.',
          },
        ],
      },
    ],
    debrief:
      'Senha forte é longa, imprevisível e única em cada serviço. Para dar conta de dezenas delas, use um gerenciador de senhas protegido por uma senha mestra forte e pela verificação em duas etapas. Se um site vazar, troque a senha dele e a de qualquer lugar onde ela se repetia, começando pelo e-mail.',
    platformNote:
      'Chrome e Edge guardam as senhas na conta Google ou Microsoft. No iPhone e no Mac, o app Senhas (iOS 18 e macOS Sequoia em diante) reúne as senhas que antes ficavam nas Chaves do iCloud.',
  },

  // -------------------------------------------------------------------------
  // r06 — Dupla verificação
  // -------------------------------------------------------------------------
  {
    id: 'r06-dupla-verificacao',
    version: 1,
    sector: 'rede-segura',
    order: 6,
    title: 'Dupla verificação',
    summary: 'Ativar a verificação em duas etapas, escolher o método mais forte e nunca repassar códigos.',
    briefing:
      'Mesmo a melhor senha pode vazar. Por isso as áreas sensíveis do Nexo exigem uma segunda prova de identidade, algo que só você tem em mãos. Configure essa segunda trava e aprenda a reconhecer quem tenta roubá-la.',
    category: 'seguranca',
    subcategory: 'Autenticação',
    difficulty: 2,
    estimatedMinutes: 10,
    prerequisites: ['r05-senhas-fortes'],
    objectives: [
      'Explicar como a verificação em duas etapas protege a conta',
      'Ativar a verificação com um app autenticador',
      'Comparar métodos de segundo fator',
      'Nunca repassar códigos de verificação',
    ],
    concepts: ['autenticacao-multifator'],
    steps: [
      {
        id: 'mfa-01',
        kind: 'quiz',
        title: 'Senha vazada, conta salva',
        context:
          'Um criminoso descobriu a senha do seu e-mail. Mas você ativou a verificação em duas etapas com um **app autenticador** no celular.',
        prompt: 'O que acontece quando ele tenta entrar?',
        hint: 'A senha é algo que você sabe. O que o segundo fator acrescenta?',
        explanation:
          'A **verificação em duas etapas** (2FA, ou autenticação multifator) combina provas de tipos diferentes: algo que você **sabe** (senha), algo que você **tem** (celular, chave de segurança) ou algo que você **é** (digital, rosto). Quem rouba só a senha fica do lado de fora.',
        concept: 'autenticacao-multifator',
        options: [
          {
            id: 'a',
            text: 'O serviço pede o código de 6 dígitos que só o seu celular gera; sem ele, o acesso é barrado.',
            correct: true,
            feedback:
              'Isso. O invasor tem só metade da chave. Mesmo assim, troque a senha: ela vazou e pode estar sendo testada em outros lugares.',
          },
          {
            id: 'b',
            text: 'Ele entra normalmente, porque a senha está certa.',
            feedback: 'Com a verificação em duas etapas ligada, a senha certa não basta: falta o segundo fator.',
          },
          {
            id: 'c',
            text: 'A conta é apagada automaticamente para proteger você.',
            feedback: 'Nenhum serviço apaga a conta por isso. O acesso é bloqueado e, em geral, você recebe um aviso da tentativa.',
          },
          {
            id: 'd',
            text: 'O serviço manda o código para o e-mail do criminoso.',
            feedback: 'O código é gerado no SEU aparelho. O criminoso não escolhe para onde ele vai.',
          },
        ],
      },
      {
        id: 'mfa-02',
        kind: 'order',
        title: 'Ativando a trava',
        prompt: 'Coloque em ordem os passos para ativar a verificação em duas etapas com um app autenticador.',
        hint: 'O app só gera códigos depois de "conhecer" a conta, e o serviço só ativa a proteção depois de ver que o app funciona.',
        explanation:
          'O QR code entrega ao app um segredo que gera códigos novos a cada 30 segundos. Confirmar um código prova que tudo funciona. Os **códigos de recuperação** são a saída de emergência se você perder o celular: guarde-os fora dele, impressos ou no gerenciador de senhas.',
        concept: 'autenticacao-multifator',
        items: [
          { id: 'config', text: 'Entrar na conta pelo site ou app oficial e abrir as configurações de segurança' },
          { id: 'opcao', text: 'Escolher "Verificação em duas etapas" e a opção "App autenticador"' },
          { id: 'qr', text: 'Escanear com o app autenticador o QR code exibido na tela' },
          { id: 'codigo', text: 'Digitar o código de 6 dígitos mostrado no app para confirmar' },
          { id: 'recuperacao', text: 'Guardar os códigos de recuperação num lugar seguro, fora do celular' },
        ],
      },
      {
        id: 'mfa-03',
        kind: 'quiz',
        title: 'Qual segundo fator?',
        prompt: 'Qual destas opções de segundo fator é a mais resistente a golpes?',
        hint: 'Pense em qual método não pode ser enganado por um site com endereço falso.',
        explanation:
          'Do mais fraco ao mais forte: pergunta secreta, SMS, app autenticador e, no topo, **chave de acesso (passkey)** ou chave de segurança física. Qualquer segundo fator é melhor que nenhum; use o mais forte que o serviço oferecer, principalmente no e-mail e no banco.',
        concept: 'autenticacao-multifator',
        options: [
          {
            id: 'sms',
            text: 'Código por SMS',
            feedback:
              'Muito melhor que nada, mas o SMS pode ser desviado por golpes de troca de chip, e o código pode ser "pescado" por um site falso.',
          },
          {
            id: 'app',
            text: 'Código de app autenticador',
            feedback:
              'Bem mais seguro que o SMS, porque não depende do número de telefone. Porém, um site falso ainda pode convencer você a digitar o código.',
          },
          {
            id: 'passkey',
            text: 'Chave de acesso (passkey) ou chave de segurança física',
            correct: true,
            feedback:
              'Isso. Elas conferem o domínio do site automaticamente: num site falso, simplesmente não funcionam. Por isso são consideradas resistentes a phishing.',
          },
          {
            id: 'pergunta',
            text: 'Pergunta secreta, como "nome do primeiro animal de estimação"',
            feedback:
              'Respostas assim costumam estar nas redes sociais ou são fáceis de adivinhar. Nem é um segundo fator de verdade: é mais uma coisa que você "sabe".',
          },
        ],
      },
      {
        id: 'mfa-04',
        kind: 'inspect',
        title: 'O pedido do código',
        context:
          'Você acabou de receber um SMS automático do Banco Horizonte com um código de verificação, sem ter pedido nada. Segundos depois, chega esta mensagem.',
        prompt: 'Analise a mensagem. Marque as partes suspeitas e decida o que fazer.',
        hint: 'Por que chegaria um código se você não pediu nada? Quem precisa desse código?',
        explanation:
          'Um código que chega sem você ter pedido significa que **alguém digitou sua senha** e está tentando entrar. O código é a última trava, e quem pede que você o repasse é o invasor. Nunca compartilhe códigos de verificação, nem com quem diz ser do banco.',
        concept: 'autenticacao-multifator',
        artifact: 'sms',
        parts: [
          {
            id: 'remetente',
            field: 'Remetente',
            text: 'Número desconhecido: +55 11 9xxxx-4821',
            suspicious: true,
            explanation:
              'Um celular comum, diferente do canal pelo qual o banco envia mensagens. Lembre que até remetentes "oficiais" podem ser falsificados; o conteúdo pesa mais.',
          },
          {
            id: 'saudacao',
            field: 'Mensagem',
            text: 'Olá, Carla. Aqui é a Central de Segurança do Banco Horizonte.',
            suspicious: false,
            explanation:
              'Saber seu nome e o seu banco não prova nada: esses dados circulam em vazamentos. Não é aqui que o golpe se revela, mas também não é garantia.',
          },
          {
            id: 'alerta',
            field: 'Mensagem',
            text: 'Detectamos uma tentativa de acesso à sua conta. Para bloquear, precisamos confirmar sua identidade AGORA.',
            suspicious: true,
            explanation: 'Susto e urgência servem para você agir antes de pensar.',
          },
          {
            id: 'pedido',
            field: 'Mensagem',
            text: 'Responda com o código de 6 dígitos que você acabou de receber.',
            suspicious: true,
            explanation:
              'Este é o golpe. O código chegou porque o criminoso está tentando entrar na sua conta e precisa dele. Nenhuma empresa legítima pede que você repasse um código de verificação.',
          },
          {
            id: 'link',
            field: 'Link',
            text: 'horizonte-protecao.com/bloqueio',
            suspicious: true,
            explanation: 'O domínio não é `banco-horizonte.com.br`. Links em mensagens de "segurança" costumam levar a páginas falsas.',
          },
        ],
        minFlags: 3,
        verdict: {
          question: 'O que você faz?',
          options: [
            {
              id: 'canal-oficial',
              text: 'Não respondo nem clico. Se quiser conferir, abro o app oficial do banco ou ligo para o número do verso do cartão.',
              correct: true,
              feedback:
                'Perfeito. Você sai do canal controlado pelo golpista e confere pelo oficial. E, como alguém tentou entrar, troque a senha dessa conta.',
            },
            {
              id: 'responder-codigo',
              text: 'Respondo com o código, já que é para bloquear o acesso.',
              feedback: 'Repassar o código entrega exatamente o que faltava para o criminoso entrar na sua conta.',
            },
            {
              id: 'clicar',
              text: 'Clico no link para ver se o site parece o do banco.',
              feedback: 'O site falso vai parecer idêntico ao verdadeiro, justamente para você digitar dados ali. Não abra.',
            },
            {
              id: 'nao-fui-eu',
              text: 'Respondo "não fui eu, bloqueiem".',
              feedback: 'Responder confirma que o número está ativo e abre conversa com o golpista, que vai insistir com outras desculpas.',
            },
          ],
        },
      },
      {
        id: 'mfa-05',
        kind: 'quiz',
        title: 'Trocando de celular',
        context:
          'Você vai trocar de celular e pretende apagar o antigo para vendê-lo. Seu app autenticador guarda os códigos de 12 contas.',
        prompt: 'O que fazer antes de apagar o aparelho antigo?',
        hint: 'Onde os códigos do app autenticador são gerados? O que acontece com eles se o app sumir?',
        explanation:
          'Os códigos do app autenticador nascem no próprio aparelho. Antes de apagar o celular antigo, use a função de transferência ou backup do app (muitos exportam por QR code ou sincronizam com uma conta) e confirme que o novo gera códigos aceitos. Se algo der errado, os **códigos de recuperação** salvam você.',
        concept: 'autenticacao-multifator',
        options: [
          {
            id: 'a',
            text: 'Transferir as contas para o app autenticador do celular novo e testar um código de cada antes de apagar o antigo.',
            correct: true,
            feedback: 'Isso. Só apague o antigo quando tiver certeza de que o novo gera códigos aceitos pelas contas.',
          },
          {
            id: 'b',
            text: 'Nada: os códigos acompanham o chip quando ele vai para o celular novo.',
            feedback:
              'Apps autenticadores geram os códigos no aparelho, sem depender do chip. Se o app for apagado sem transferência ou backup, os códigos somem junto.',
          },
          {
            id: 'c',
            text: 'Desativar a verificação em duas etapas de todas as contas, por garantia.',
            feedback: 'Isso remove a proteção justamente durante a troca, quando você está mais distraído. Transferir é mais seguro.',
          },
          {
            id: 'd',
            text: 'Tirar um print da tela do app autenticador com todos os códigos.',
            feedback: 'Os códigos mudam a cada 30 segundos: um print não serve para nada pouco tempo depois.',
          },
        ],
      },
    ],
    debrief:
      'A verificação em duas etapas faz da senha apenas metade da chave. Ative-a primeiro no e-mail e no banco, prefira chave de acesso ou app autenticador ao SMS e guarde os códigos de recuperação. Código que chega sem você pedir é alarme: troque a senha e nunca repasse o código a ninguém.',
    platformNote:
      'Os nomes variam: "Verificação em duas etapas" (Google e Microsoft) ou "Autenticação de dois fatores" (Apple). O caminho costuma ser Conta > Segurança, no site ou app oficial do serviço.',
  },

  // -------------------------------------------------------------------------
  // r07 — Caça ao phishing
  // -------------------------------------------------------------------------
  {
    id: 'r07-caca-ao-phishing',
    version: 1,
    sector: 'rede-segura',
    order: 7,
    title: 'Caça ao phishing',
    summary: 'Reconhecer golpes por e-mail, SMS e mensagens, e reagir rápido se cair em um.',
    briefing:
      'Uma onda de iscas digitais está atingindo as caixas de entrada do Nexo: mensagens que imitam empresas conhecidas para roubar dados. Seu trabalho é dissecar cada isca, achar os sinais que a denunciam e saber exatamente o que fazer se alguém morder.',
    category: 'seguranca',
    subcategory: 'Golpes digitais',
    difficulty: 2,
    estimatedMinutes: 11,
    prerequisites: ['r05-senhas-fortes'],
    objectives: [
      'Reconhecer os sinais de um e-mail de phishing',
      'Identificar golpes por SMS',
      'Diferenciar golpes de contatos legítimos',
      'Agir rápido se cair num golpe',
    ],
    concepts: ['phishing'],
    steps: [
      {
        id: 'phish-01',
        kind: 'inspect',
        title: 'O e-mail do bloqueio',
        context: 'Chegou na sua caixa de entrada:',
        prompt: 'Examine cada parte do e-mail. Marque o que é suspeito e dê seu veredito.',
        hint: 'Confira o domínio depois do @, o destino real do link, a extensão do anexo e o que a mensagem pede.',
        explanation:
          'Phishing é a "pescaria" de dados: uma mensagem que imita uma empresa para você entregar senha ou código, ou instalar algo. Os sinais clássicos são **domínio errado**, **urgência**, **pedido de senha ou código**, **link com destino diferente** e **anexo executável**.',
        concept: 'phishing',
        artifact: 'email',
        parts: [
          {
            id: 'de',
            field: 'De',
            text: 'Banco Horizonte <seguranca@banco-horizonte.atendimento-online.com>',
            suspicious: true,
            explanation:
              'O nome exibido é fácil de falsificar; o que vale é o domínio depois do @: `atendimento-online.com`. O "banco-horizonte" ali é só um subdomínio de outro dono.',
          },
          {
            id: 'para',
            field: 'Para',
            text: 'carla.souza@exemplo.com',
            suspicious: false,
            explanation:
              'É o seu endereço mesmo. Golpistas têm listas com milhões de e-mails reais, então receber no seu endereço não torna a mensagem confiável, mas não é um sinal de golpe.',
          },
          {
            id: 'assunto',
            field: 'Assunto',
            text: 'URGENTE: sua conta será bloqueada em 24 horas',
            suspicious: true,
            explanation: 'Prazo curto e ameaça de bloqueio servem para você agir sem pensar.',
          },
          {
            id: 'mensagem',
            field: 'Mensagem',
            text: 'Prezado(a) cliente, identificamos irregularidades no seu cadastro. Para evitar o bloqueio, confirme seus dados, sua senha e o código do token na página abaixo.',
            suspicious: true,
            explanation:
              'Tratamento genérico e, principalmente, pedido de senha e código. Bancos não pedem senha nem código de token por e-mail.',
          },
          {
            id: 'link',
            field: 'Link',
            text: 'Botão "Regularizar agora"; ao passar o mouse, aparece: http://banco-horizonte.com.br.regulariza-cadastro.top/login',
            suspicious: true,
            explanation:
              'O texto do botão pode dizer qualquer coisa; o destino real aparece ao passar o mouse (ou ao segurar o dedo no link, no celular). Aqui o domínio é `regulariza-cadastro.top`.',
          },
          {
            id: 'anexo',
            field: 'Anexo',
            text: 'Comprovante_Regularizacao.zip (contém Comprovante_Regularizacao.exe)',
            suspicious: true,
            explanation:
              'Comprovante não é programa. Um .exe dentro de um .zip é um jeito comum de driblar filtros de e-mail e instalar malware.',
          },
          {
            id: 'rodape',
            field: 'Mensagem',
            text: 'Rodapé com logotipo, CNPJ e endereço da sede do Banco Horizonte',
            suspicious: false,
            explanation: 'Logotipo e dados públicos da empresa são fáceis de copiar. Não denunciam o golpe, mas também não provam nada.',
          },
        ],
        minFlags: 4,
        verdict: {
          question: 'O que fazer com este e-mail?',
          options: [
            {
              id: 'denunciar',
              text: 'Não clicar nem abrir o anexo, marcar como phishing ou spam e excluir. Se ficar preocupado, conferir a conta pelo app oficial.',
              correct: true,
              feedback: 'Exatamente. Denunciar treina o filtro para proteger outras pessoas, e o app oficial mostra se existe mesmo algum problema.',
            },
            {
              id: 'responder',
              text: 'Responder pedindo que confirmem se é verdade.',
              feedback: 'Quem vai responder é o golpista, e ele vai "confirmar". Além disso, responder mostra que seu e-mail está ativo.',
            },
            {
              id: 'anexo',
              text: 'Abrir só o anexo para ver o comprovante, sem clicar no link.',
              feedback: 'O anexo é a parte mais perigosa: o .exe instalaria um programa malicioso no computador.',
            },
            {
              id: 'olhar',
              text: 'Clicar no link só para olhar, sem digitar nada.',
              feedback:
                'Mesmo sem digitar, você confirma ao golpista que clica em links e se expõe a páginas que tentam baixar arquivos. Não há nada a ganhar abrindo.',
            },
          ],
        },
      },
      {
        id: 'phish-02',
        kind: 'inspect',
        title: 'A encomenda retida',
        context: 'Você fez algumas compras on-line esta semana. Chega este SMS:',
        prompt: 'Analise a mensagem, marque as partes suspeitas e decida o que fazer.',
        hint: 'A mensagem diz qual é a encomenda? E para onde o link leva de verdade?',
        explanation:
          'Golpes de "taxa de entrega" se aproveitam de quem está esperando uma compra. Lojas e transportadoras mostram pendências no **site ou app oficial**. Na dúvida, acesse pelo endereço que você conhece, nunca pelo link da mensagem.',
        concept: 'phishing',
        artifact: 'sms',
        parts: [
          {
            id: 'remetente',
            field: 'Remetente',
            text: 'CORREIOEXP',
            suspicious: false,
            explanation:
              'Serviços de envio em massa deixam qualquer um escolher o nome do remetente. Parecer oficial não prova nada, mas o nome em si não é o sinal do golpe: o conteúdo e o link são.',
          },
          {
            id: 'taxa',
            field: 'Mensagem',
            text: 'Correio Expresso: sua encomenda está retida por falta de pagamento da taxa de liberação de R$ 2,90.',
            suspicious: true,
            explanation:
              'A mensagem não diz qual encomenda nem de qual loja. Taxas pequenas parecem inofensivas, mas o objetivo é capturar os dados do cartão ou um Pix.',
          },
          {
            id: 'prazo',
            field: 'Mensagem',
            text: 'Pague em até 12 horas ou o objeto será devolvido ao remetente.',
            suspicious: true,
            explanation: 'Prazo apertado para impedir que você pare e verifique.',
          },
          {
            id: 'link',
            field: 'Link',
            text: 'https://correio-expresso.taxa-entrega.info/pagar',
            suspicious: true,
            explanation: 'O domínio real é `taxa-entrega.info`. O nome da transportadora aparece só no começo, como subdomínio.',
          },
        ],
        minFlags: 2,
        verdict: {
          question: 'Você está mesmo esperando uma entrega. O que fazer?',
          options: [
            {
              id: 'rastrear-oficial',
              text: 'Ignorar o link e conferir o rastreamento no site ou app da loja onde comprei, ou no endereço oficial da transportadora.',
              correct: true,
              feedback: 'Isso. Se houvesse mesmo uma pendência, ela apareceria no canal oficial.',
            },
            {
              id: 'pagar',
              text: 'Pagar, afinal são só R$ 2,90.',
              feedback:
                'O valor é a isca. Ao digitar o cartão, você entrega número, validade e código de segurança, que serão usados em compras bem maiores.',
            },
            {
              id: 'conferir-link',
              text: 'Clicar e ver se o código de rastreio bate com o meu.',
              feedback: 'O site falso pode mostrar qualquer código ou pedir o seu "para conferir". A verificação segura é pelo canal oficial.',
            },
            {
              id: 'responder',
              text: 'Responder "PARE" para não receber mais mensagens.',
              feedback: 'Em golpes, responder só confirma que o número está ativo e atrai mais mensagens. Bloqueie e denuncie como spam.',
            },
          ],
        },
      },
      {
        id: 'phish-03',
        kind: 'classify',
        title: 'Golpe ou contato legítimo?',
        prompt: 'Classifique cada situação.',
        hint: 'Quem iniciou o contato? Pedem dinheiro, senha, código ou instalação de algo? Há pressa?',
        explanation:
          'Serviços legítimos informam e mandam você ao **canal oficial**; golpes pedem **dinheiro, dados, códigos ou instalação de apps**, quase sempre com pressa. Se o contato veio do nada e pede algo, desconfie e confirme por outro canal.',
        concept: 'phishing',
        buckets: [
          { id: 'golpe', label: 'Sinal de golpe' },
          { id: 'legitimo', label: 'Comportamento normal de serviço legítimo' },
        ],
        items: [
          {
            id: 'falso-parente',
            text: 'Mensagem de um número novo: "Oi, mãe, troquei de número. Me faz um Pix urgente? Depois explico."',
            bucket: 'golpe',
            feedback:
              'É o golpe do falso parente. Ligue para o número antigo ou faça uma pergunta que só a pessoa saberia responder antes de qualquer transferência.',
          },
          {
            id: 'acesso-remoto',
            text: 'Ligação da "central de segurança do banco" pedindo que você instale um app de acesso remoto para "proteger a conta"',
            bucket: 'golpe',
            feedback: 'Apps de acesso remoto dão ao golpista controle total do aparelho. Banco nenhum pede isso por telefone.',
          },
          {
            id: 'premio',
            text: 'E-mail dizendo que você ganhou um sorteio do qual nunca participou e precisa pagar uma "taxa de liberação"',
            bucket: 'golpe',
            feedback: 'Prêmio de sorteio que você não disputou, com taxa para liberar: o "prêmio" é o seu dinheiro indo embora.',
          },
          {
            id: 'novo-aparelho',
            text: 'Notificação dentro do app oficial do banco sobre login num novo aparelho, logo depois de você trocar de celular',
            bucket: 'legitimo',
            feedback: 'Aviso dentro do app oficial e coerente com algo que você acabou de fazer: é o sistema de segurança funcionando.',
          },
          {
            id: 'fatura',
            text: 'E-mail da operadora avisando que a fatura está disponível no app, sem link nem anexo',
            bucket: 'legitimo',
            feedback: 'Uma comunicação que só informa e direciona você ao app oficial, sem pedir dados nem cliques, é o padrão legítimo.',
          },
          {
            id: 'codigo-pedido',
            text: 'SMS com código de verificação logo depois de você mesmo pedir para entrar na sua conta',
            bucket: 'legitimo',
            feedback: 'Você pediu o acesso e o código chegou: é o esperado. O problema seria repassá-lo a alguém.',
          },
        ],
      },
      {
        id: 'phish-04',
        kind: 'quiz',
        title: 'Caí. E agora?',
        context: 'Você clicou num link de e-mail e digitou a senha do seu e-mail numa página falsa. Só percebeu depois de enviar.',
        prompt: 'Qual deve ser sua primeira ação?',
        hint: 'O que exatamente o golpista conseguiu? O que tira isso dele?',
        explanation:
          'Se cair, aja rápido e na ordem: **troque a senha** (pelo site oficial), **encerre as sessões abertas**, **ative a verificação em duas etapas** e troque a senha nos serviços onde ela se repetia. Se envolver banco ou cartão, ligue para o número oficial. Avise seus contatos, caso o golpista use sua conta para enganá-los.',
        concept: 'phishing',
        options: [
          {
            id: 'a',
            text: 'Entrar no e-mail pelo endereço oficial, trocar a senha imediatamente, encerrar as sessões ativas e ativar a verificação em duas etapas.',
            correct: true,
            feedback:
              'Isso. Quanto antes a senha muda, menor a janela do invasor, e encerrar as sessões derruba quem já tiver entrado. Depois, troque a senha onde ela se repetia.',
          },
          {
            id: 'b',
            text: 'Esperar para ver se acontece algo estranho.',
            feedback: 'Cada minuto conta: com a senha em mãos, o golpista pode trocar a senha antes de você e tomar a conta.',
          },
          {
            id: 'c',
            text: 'Formatar o computador.',
            feedback:
              'Digitar a senha num site falso não infecta o computador; o problema é a senha nas mãos do golpista. Formatar não muda isso e ainda custa tempo e dados.',
          },
          {
            id: 'd',
            text: 'Apagar o e-mail falso para não cair de novo.',
            feedback: 'Apagar não desfaz o envio da senha. Primeiro proteja a conta; depois denuncie a mensagem.',
          },
        ],
      },
    ],
    debrief:
      'Phishing funciona porque imita quem você confia e cria pressa. Desconfie de mensagens que pedem senha, código, pagamento ou instalação, confira o domínio de remetentes e links e verifique sempre pelo canal oficial. Se cair, troque a senha na hora e acione os canais oficiais.',
    platformNote:
      'No computador, passe o mouse sobre o link para ver o destino na parte de baixo da janela. No celular, segure o dedo sobre o link (sem soltar) para ver o endereço antes de abrir.',
  },

  // -------------------------------------------------------------------------
  // r08 — Privacidade e permissões
  // -------------------------------------------------------------------------
  {
    id: 'r08-privacidade-e-permissoes',
    version: 1,
    sector: 'rede-segura',
    order: 8,
    title: 'Privacidade e permissões',
    summary: 'Limitar permissões de apps, usar Wi-Fi público com cuidado e proteger dados pessoais.',
    briefing:
      'Cada aplicativo instalado no Nexo pediu algum acesso: câmera, microfone, localização, contatos. Alguns precisam; outros só coletam. Revise as permissões, decida onde é seguro se conectar e escolha o que vale ou não expor sobre você.',
    category: 'seguranca',
    subcategory: 'Privacidade',
    difficulty: 3,
    estimatedMinutes: 11,
    prerequisites: ['r07-caca-ao-phishing'],
    objectives: [
      'Revisar e limitar as permissões de aplicativos',
      'Usar redes Wi-Fi públicas com cautela',
      'Proteger dados pessoais ao publicar e se cadastrar',
      'Conhecer seus direitos pela LGPD',
    ],
    concepts: ['permissoes-apps', 'wifi-publico', 'dados-pessoais'],
    steps: [
      {
        id: 'perm-01',
        kind: 'settings',
        title: 'Faxina nas permissões',
        context: 'A bateria do celular está acabando rápido e você desconfia de alguns apps.',
        prompt: 'Ajuste as permissões para que cada app tenha só o acesso de que realmente precisa para funcionar.',
        hint: 'Pergunte, para cada permissão: o app precisa disso para fazer o que promete? Uma lanterna só precisa acender a luz.',
        explanation:
          'Dê a cada app **o mínimo necessário**. Lanterna não precisa de localização, contatos nem microfone; videochamada precisa de câmera e microfone; mapas precisam de localização, mas só enquanto você usa. Permissões demais permitem coletar e vender dados, além de gastar bateria.',
        concept: 'permissoes-apps',
        panels: [
          {
            id: 'permissoes',
            title: 'Permissões de aplicativos',
            groups: [
              {
                title: 'Lanterna Plus',
                controls: [
                  { id: 'lanterna-local', type: 'toggle', label: 'Localização', initial: true },
                  { id: 'lanterna-contatos', type: 'toggle', label: 'Contatos', initial: true },
                  { id: 'lanterna-microfone', type: 'toggle', label: 'Microfone', initial: true },
                ],
              },
              {
                title: 'Videochamada Nexo',
                controls: [
                  { id: 'video-camera', type: 'toggle', label: 'Câmera', initial: true },
                  { id: 'video-microfone', type: 'toggle', label: 'Microfone', initial: true },
                ],
              },
              {
                title: 'Mapas',
                controls: [
                  {
                    id: 'mapas-local',
                    type: 'select',
                    label: 'Localização',
                    description: 'Usada para mostrar onde você está e calcular rotas.',
                    options: [
                      { value: 'sempre', label: 'Permitir o tempo todo' },
                      { value: 'uso', label: 'Permitir só durante o uso do app' },
                      { value: 'negar', label: 'Não permitir' },
                    ],
                    initial: 'sempre',
                  },
                ],
              },
            ],
          },
        ],
        goals: [
          { control: 'lanterna-local', op: 'eq', value: false, label: 'Lanterna Plus sem acesso à localização' },
          { control: 'lanterna-contatos', op: 'eq', value: false, label: 'Lanterna Plus sem acesso aos contatos' },
          { control: 'lanterna-microfone', op: 'eq', value: false, label: 'Lanterna Plus sem acesso ao microfone' },
          { control: 'mapas-local', op: 'eq', value: 'uso', label: 'Mapas usando a localização só enquanto está aberto' },
        ],
        forbidden: [
          {
            control: 'video-camera',
            op: 'eq',
            value: false,
            reason: 'A videochamada precisa da câmera para funcionar. Tirar esse acesso só quebra o app.',
          },
          {
            control: 'video-microfone',
            op: 'eq',
            value: false,
            reason: 'Sem microfone, ninguém ouve você na videochamada. Essa permissão é necessária.',
          },
        ],
      },
      {
        id: 'wifi-01',
        kind: 'quiz',
        title: 'Wi-Fi da cafeteria',
        context: 'Você está numa cafeteria com Wi-Fi aberto, sem senha, e precisa pagar uma conta pelo app do banco.',
        prompt: 'Qual é a escolha mais segura?',
        hint: 'Existe uma conexão que só você usa e que não depende da rede do estabelecimento.',
        explanation:
          'Num **Wi-Fi público**, qualquer pessoa pode estar na mesma rede, e redes falsas com nomes parecidos são fáceis de criar. Para banco, compras e logins importantes, prefira os dados móveis. Se usar o Wi-Fi público, confirme o nome exato da rede e mantenha o perfil de rede "Pública".',
        concept: 'wifi-publico',
        options: [
          {
            id: 'a',
            text: 'Desligar o Wi-Fi e fazer o pagamento pelos dados móveis (4G/5G) do celular.',
            correct: true,
            feedback:
              'Isso. A conexão da operadora não é compartilhada com estranhos da mesa ao lado. Para operações sensíveis em locais públicos, é a opção mais segura e simples.',
          },
          {
            id: 'b',
            text: 'Usar o Wi-Fi aberto mesmo, porque o app do banco tem criptografia.',
            feedback:
              'A criptografia dos apps e do HTTPS protege bastante, mas numa rede aberta ou falsa você pode ser levado a portais e páginas falsas. Para banco, não vale o risco quando há alternativa.',
          },
          {
            id: 'c',
            text: 'Conectar e, no Windows, marcar a rede como "Privada" para ficar mais protegido.',
            feedback:
              'É o contrário: "Privada" é para a rede de casa e deixa o computador visível para outros aparelhos. Em locais públicos, use sempre o perfil "Pública".',
          },
          {
            id: 'd',
            text: 'Escolher a rede de sinal mais forte, mesmo que o nome seja diferente do informado pela cafeteria.',
            feedback: 'Golpistas criam redes com nomes atraentes e sinal forte para atrair conexões. Confirme o nome exato com o estabelecimento.',
          },
        ],
      },
      {
        id: 'dados-01',
        kind: 'classify',
        title: 'Postar ou não postar',
        prompt: 'Classifique cada publicação: pode compartilhar tranquilo ou é melhor evitar?',
        hint: 'Alguém poderia usar isso para se passar por você, acessar uma conta ou saber onde você está?',
        explanation:
          'CPF, documentos, códigos de reserva e localização em tempo real são matéria-prima de golpes. Antes de publicar, pense em quem pode ver e no que alguém mal-intencionado faria com aquilo.',
        concept: 'dados-pessoais',
        buckets: [
          { id: 'ok', label: 'Pode compartilhar' },
          { id: 'evitar', label: 'Evite expor' },
        ],
        items: [
          {
            id: 'embarque',
            text: 'Foto do cartão de embarque com o código de barras visível, antes da viagem',
            bucket: 'evitar',
            feedback: 'O código do cartão de embarque traz seu nome e o localizador da reserva; com ele, alguém pode acessar ou alterar sua viagem.',
          },
          {
            id: 'documento',
            text: 'Foto do documento de identidade novo, frente e verso',
            bucket: 'evitar',
            feedback: 'Com os dados do documento, golpistas abrem contas e fazem cadastros em seu nome.',
          },
          {
            id: 'sorteio',
            text: 'CPF e data de nascimento nos comentários para participar de um sorteio',
            bucket: 'evitar',
            feedback: 'Sorteio legítimo não pede CPF em comentário público. Esses dados juntos facilitam fraudes.',
          },
          {
            id: 'comprovante',
            text: 'Print do comprovante de Pix com nome completo, banco e parte do CPF',
            bucket: 'evitar',
            feedback: 'Comprovantes reúnem dados que ajudam golpistas a montar histórias convincentes em seu nome.',
          },
          {
            id: 'tempo-real',
            text: 'Localização em tempo real ao sair de casa para uma viagem de 15 dias',
            bucket: 'evitar',
            feedback: 'Avisa publicamente que a casa vai ficar vazia por duas semanas.',
          },
          {
            id: 'paisagem',
            text: 'Foto de paisagem da viagem, publicada depois que você voltou',
            bucket: 'ok',
            feedback: 'Paisagem não revela dados sensíveis, e publicar depois evita anunciar que a casa está vazia.',
          },
          {
            id: 'filme',
            text: 'Sua opinião sobre um filme que assistiu',
            bucket: 'ok',
            feedback: 'Opiniões sobre filmes não expõem dados que permitam fraude ou localização.',
          },
        ],
      },
      {
        id: 'dados-02',
        kind: 'quiz',
        title: 'Seus direitos',
        context:
          'Uma empresa com quem você nunca teve contato liga oferecendo empréstimo e já sabe seu nome, seu CPF e seu endereço.',
        prompt: 'O que a Lei Geral de Proteção de Dados (LGPD) permite que você faça?',
        hint: 'A lei dá ao dono dos dados o direito de saber, corrigir e pedir para apagar.',
        explanation:
          'A **LGPD** (Lei 13.709/2018) diz que seus dados pessoais são seus: empresas precisam de uma justificativa legal para usá-los e devem atender pedidos de acesso, correção e eliminação. Faça o pedido pelos canais oficiais da empresa (muitas têm um encarregado de dados ou um e-mail de privacidade) e, se não houver resposta, reclame na ANPD.',
        concept: 'dados-pessoais',
        options: [
          {
            id: 'a',
            text: 'Pedir à empresa que informe quais dados seus ela tem e de onde os obteve, e solicitar que sejam apagados; sem resposta, reclamar na ANPD.',
            correct: true,
            feedback:
              'Isso. A LGPD garante o direito de acesso, de saber com quem os dados foram compartilhados e de pedir a eliminação. A Autoridade Nacional de Proteção de Dados (ANPD) recebe reclamações.',
          },
          {
            id: 'b',
            text: 'Nada: se a empresa já tem os dados, eles passaram a ser dela.',
            feedback: 'Os dados continuam sendo seus. A empresa precisa de base legal para usá-los e deve responder aos seus pedidos.',
          },
          {
            id: 'c',
            text: 'Confirmar o CPF na própria ligação, para a empresa apagar o cadastro certo.',
            feedback: 'Nunca confirme dados numa ligação que você recebeu. Faça o pedido por escrito, pelos canais oficiais da empresa.',
          },
          {
            id: 'd',
            text: 'Exigir uma indenização imediata por telefone.',
            feedback:
              'Indenização se discute na Justiça ou em órgãos de defesa do consumidor, não numa ligação. O primeiro passo é pedir informações e a eliminação dos dados pelos canais oficiais.',
          },
        ],
      },
    ],
    debrief:
      'Privacidade é feita de pequenas escolhas: cada app com o mínimo de permissões, dados móveis no lugar de Wi-Fi aberto para operações sensíveis e cuidado com o que você publica. Seus dados pessoais são seus, e a LGPD garante o direito de saber quem os usa e de pedir que sejam apagados.',
    platformNote:
      'Permissões ficam em: Android, Configurações > Apps > (app) > Permissões; iPhone, Ajustes > Privacidade e Segurança; Windows 11, Configurações > Privacidade e segurança > Permissões do aplicativo. Os nomes das opções de localização variam um pouco entre sistemas.',
  },

  // -------------------------------------------------------------------------
  // r09 — Extensões e atualizações
  // -------------------------------------------------------------------------
  {
    id: 'r09-extensoes-e-atualizacoes',
    version: 1,
    sector: 'rede-segura',
    order: 9,
    title: 'Extensões e atualizações',
    summary: 'Avaliar extensões antes de instalar e separar atualizações legítimas de golpes.',
    briefing:
      'O navegador do Nexo aceita módulos extras, as extensões, e cada um deles pode enxergar tudo o que você faz na web. Ao mesmo tempo, falsos avisos de "atualização" circulam pela rede tentando instalar intrusos. Separe o útil do perigoso e mantenha o sistema em dia do jeito certo.',
    category: 'navegadores',
    subcategory: 'Extensões e atualizações',
    difficulty: 3,
    estimatedMinutes: 10,
    prerequisites: ['r04-downloads-sem-susto'],
    objectives: [
      'Avaliar uma extensão antes de instalar',
      'Remover extensões problemáticas',
      'Diferenciar atualizações legítimas de golpes',
      'Entender por que atualizações de segurança são urgentes',
    ],
    concepts: ['extensoes-navegador', 'atualizacoes'],
    steps: [
      {
        id: 'ext-01',
        kind: 'inspect',
        title: 'Calculadora curiosa',
        context: 'Você procurou uma calculadora para usar no navegador e encontrou esta página na loja oficial de extensões.',
        prompt: 'Avalie a página da extensão. Marque os sinais de alerta e decida se vale instalar.',
        hint: 'Compare o que a extensão faz com o que ela pede. E pergunte: quem está por trás dela?',
        explanation:
          'Extensões rodam dentro do navegador e, com permissão para "ler e alterar dados em todos os sites", podem ver senhas digitadas, mensagens e compras. Antes de instalar, confira: **permissões compatíveis com a função**, **editor identificável**, **avaliações reais** e se você precisa mesmo dela. Menos extensões, menos risco.',
        concept: 'extensoes-navegador',
        artifact: 'site',
        parts: [
          {
            id: 'endereco',
            field: 'Endereço',
            text: 'https://chromewebstore.google.com/detail/calculadora-rapida-pro',
            suspicious: false,
            explanation:
              'É a loja oficial de extensões, um bom começo. Mas extensões maliciosas às vezes passam pela revisão e aparecem lá, então avalie o resto da página.',
          },
          {
            id: 'permissoes',
            field: 'Conteúdo',
            text: 'Permissões: "Ler e alterar todos os seus dados em todos os sites", "Ler seu histórico de navegação", "Gerenciar seus downloads"',
            suspicious: true,
            explanation:
              'Uma calculadora não precisa ver os sites que você visita, nem o histórico, nem os downloads. Permissões desproporcionais à função são o maior sinal de alerta.',
          },
          {
            id: 'editor',
            field: 'Conteúdo',
            text: 'Oferecido por: dev-tools-2026 (sem site e sem política de privacidade)',
            suspicious: true,
            explanation:
              'Editor anônimo, sem site nem política de privacidade: não há a quem recorrer, nem como saber o que é feito com seus dados.',
          },
          {
            id: 'avaliacoes',
            field: 'Conteúdo',
            text: '4,9 estrelas: 14 avaliações, todas da mesma semana e com textos quase idênticos',
            suspicious: true,
            explanation: 'Poucas avaliações, parecidas entre si e concentradas em poucos dias, indicam avaliações falsas.',
          },
          {
            id: 'atualizacao',
            field: 'Conteúdo',
            text: 'Atualizada há 5 dias',
            suspicious: false,
            explanation:
              'Atualização recente é normal e até positiva; não é o problema aqui. Fique atento, porém, a extensões que mudam de dono e passam a pedir mais permissões.',
          },
          {
            id: 'botao',
            field: 'Botão',
            text: 'Usar no Chrome',
            suspicious: false,
            explanation: 'É o botão padrão da loja. O risco não está no botão, e sim no que você autoriza ao clicar nele.',
          },
        ],
        minFlags: 2,
        verdict: {
          question: 'Você instala a extensão?',
          options: [
            {
              id: 'nao',
              text: 'Não. Uso a calculadora do sistema ou procuro uma extensão de editor conhecido, com permissões compatíveis com a função.',
              correct: true,
              feedback: 'Isso. Uma calculadora que pede acesso a todos os sites e ao histórico quer bem mais do que calcular.',
            },
            {
              id: 'loja',
              text: 'Sim. Está na loja oficial, então foi verificada.',
              feedback:
                'A revisão das lojas reduz o risco, mas não o elimina. Já houve extensões com milhões de usuários removidas por espionar a navegação.',
            },
            {
              id: 'escolher',
              text: 'Sim, mas aceito só as permissões que eu quiser durante a instalação.',
              feedback:
                'Na instalação, as permissões são aceitas em bloco: ou todas, ou nenhuma. Alguns navegadores deixam restringir o acesso a sites depois, mas o mais seguro é não instalar.',
            },
            {
              id: 'depois',
              text: 'Sim, e desinstalo se aparecer algo estranho.',
              feedback: 'Uma extensão que lê todos os sites pode capturar senhas e dados no primeiro dia, sem nada "estranho" aparecer.',
            },
          ],
        },
      },
      {
        id: 'ext-02',
        kind: 'quiz',
        title: 'Navegador sequestrado',
        context:
          'Depois de instalar uma extensão para "baixar vídeos", a página inicial do navegador mudou para um buscador desconhecido e aparecem anúncios em todos os sites.',
        prompt: 'Qual é a melhor forma de resolver?',
        hint: 'Desfaça a última mudança: o que foi instalado logo antes de o problema começar?',
        explanation:
          'Quando o navegador muda sozinho logo após uma instalação, a extensão é a suspeita número um. Remova-a pela página de extensões e restaure as configurações. Se ela voltar sozinha, pode haver um programa instalado no sistema: revise a lista de apps instalados e faça uma verificação com o antivírus.',
        concept: 'extensoes-navegador',
        options: [
          {
            id: 'a',
            text: 'Abrir a página de extensões (`chrome://extensions` ou `edge://extensions`), remover a extensão suspeita e restaurar a página inicial e o buscador padrão nas configurações.',
            correct: true,
            feedback: 'Isso. Você remove a causa e desfaz o estrago, em poucos minutos e sem riscos.',
          },
          {
            id: 'b',
            text: 'Instalar outra extensão, de editor desconhecido, para bloquear os anúncios.',
            feedback: 'Esconde o sintoma e adiciona mais um desconhecido com acesso a tudo. A causa continua instalada.',
          },
          {
            id: 'c',
            text: 'Reinstalar o Windows.',
            feedback: 'Exagero: o problema está numa extensão, que se remove em segundos. Ações drásticas ficam para quando as simples falharem.',
          },
          {
            id: 'd',
            text: 'Aceitar o novo buscador, já que os resultados aparecem do mesmo jeito.',
            feedback: 'Buscadores impostos por extensões costumam registrar suas pesquisas e injetar anúncios ou links perigosos. Não é inofensivo.',
          },
        ],
      },
      {
        id: 'upd-01',
        kind: 'classify',
        title: 'Atualização ou armadilha?',
        prompt: 'Classifique cada aviso de atualização.',
        hint: 'Atualizações reais chegam pelos canais oficiais do sistema, do navegador ou da loja. Desconfie de quem oferece atualização em pop-up ou mensagem.',
        explanation:
          'O canal entrega o golpe: **atualizações legítimas** vêm do Windows Update (ou da Atualização de Software, no Mac), do próprio navegador e das lojas oficiais. Pop-ups, e-mails e sites oferecendo "atualizações" são iscas para instalar programas maliciosos.',
        concept: 'atualizacoes',
        buckets: [
          { id: 'legitima', label: 'Atualização legítima' },
          { id: 'golpe', label: 'Golpe disfarçado' },
        ],
        items: [
          {
            id: 'windows-update',
            text: 'Em Configurações, o Windows Update mostra uma atualização cumulativa de segurança pronta para instalar',
            bucket: 'legitima',
            feedback: 'Vem do próprio sistema, pelo caminho oficial. Pode instalar.',
          },
          {
            id: 'menu-navegador',
            text: 'O menu do navegador mostra "Atualização disponível: reinicie para concluir"',
            bucket: 'legitima',
            feedback: 'Navegadores se atualizam sozinhos e avisam no próprio menu. Reinicie quando puder.',
          },
          {
            id: 'loja-apps',
            text: 'A loja de apps do celular lista uma atualização para o app do seu banco',
            bucket: 'legitima',
            feedback: 'A loja oficial é o canal certo para atualizar apps.',
          },
          {
            id: 'flash',
            text: 'Pop-up num site de notícias: "Seu Flash Player está desatualizado. Baixe agora!"',
            bucket: 'golpe',
            feedback: 'O Flash Player foi descontinuado no fim de 2020. Qualquer aviso pedindo para instalá-lo hoje é golpe.',
          },
          {
            id: 'scareware',
            text: 'Site com alarme e contagem regressiva: "Seu navegador está infectado! Atualize o antivírus agora"',
            bucket: 'golpe',
            feedback:
              'Sites não conseguem examinar seu computador. Alertas alarmantes com contagem regressiva são "scareware": querem que você baixe algo ou ligue para um falso suporte.',
          },
          {
            id: 'apk',
            text: 'E-mail "Atualize o app do Banco Horizonte" com um arquivo .apk anexo',
            bucket: 'golpe',
            feedback:
              'Apps de banco são atualizados pela loja oficial. Um .apk anexo é um instalador vindo de fora da loja, caminho clássico de malware no Android.',
          },
        ],
      },
      {
        id: 'upd-02',
        kind: 'quiz',
        title: 'Adiando a atualização',
        context: 'Há três semanas o computador avisa que existe uma atualização de segurança pendente. Você vem adiando porque "está tudo funcionando".',
        prompt: 'O que é mais sensato?',
        hint: 'O que acontece com uma falha de segurança depois que a correção dela se torna pública?',
        explanation:
          'Atualizações de segurança fecham brechas que os criminosos já conhecem. Quanto mais você adia, maior a exposição. Deixe as atualizações automáticas ligadas e use o agendamento de reinicialização ou o "horário ativo" para não ser interrompido no meio do trabalho.',
        concept: 'atualizacoes',
        options: [
          {
            id: 'a',
            text: 'Salvar o trabalho e instalar logo, agendando a reinicialização para um horário conveniente.',
            correct: true,
            feedback:
              'Isso. Depois que uma correção é publicada, a falha fica conhecida, e os ataques contra quem não atualizou se multiplicam.',
          },
          {
            id: 'b',
            text: 'Desativar as atualizações automáticas para os avisos pararem.',
            feedback: 'Isso deixa o computador permanentemente exposto a falhas que já têm correção. É desligar uma proteção real.',
          },
          {
            id: 'c',
            text: 'Atualizar só quando aparecer algum problema.',
            feedback: 'Falhas de segurança não dão sinais: o computador pode ser invadido "funcionando normalmente".',
          },
          {
            id: 'd',
            text: 'Atualizar apenas os aplicativos e deixar o sistema como está.',
            feedback: 'Apps em dia ajudam, mas as falhas do sistema operacional costumam ser as mais graves. Os dois precisam estar atualizados.',
          },
        ],
      },
    ],
    debrief:
      'Cada extensão é um programa com acesso ao seu navegador: instale poucas, de editores conhecidos e com permissões compatíveis com a função. Atualizações legítimas chegam pelos canais oficiais; pop-ups e mensagens oferecendo "atualização" são golpes. Mantenha sistema, navegador e apps em dia.',
    platformNote:
      'Gerenciar extensões: Chrome em `chrome://extensions`, Edge em `edge://extensions`, Firefox em `about:addons`, Safari em Ajustes > Extensões. O suporte padrão do Windows 10 terminou em outubro de 2025; sem o programa de Atualizações de Segurança Estendidas (ESU), ele não recebe mais correções, e o ideal é migrar para uma versão suportada.',
  },
];
