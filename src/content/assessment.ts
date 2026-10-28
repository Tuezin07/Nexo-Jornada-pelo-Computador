import type { AssessmentQuestion } from './types';

/**
 * Banco da avaliação inicial: 18 situações práticas de escolha única,
 * cobrindo as 13 categorias, com 6 perguntas de cada dificuldade (1 a 3).
 * Mede familiaridade geral; não repete perguntas das missões.
 */
export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  // ----- Teclado -------------------------------------------------------------
  {
    id: 'av-01',
    category: 'teclado',
    difficulty: 1,
    step: {
      id: 'av-01',
      kind: 'quiz',
      title: 'Apagar uma letra',
      prompt:
        'Você está digitando um e-mail e percebe que a última letra que digitou está errada. O cursor está logo depois dela. Qual tecla apaga essa letra?',
      hint: 'Pense na direção: a letra errada está à esquerda do cursor.',
      explanation:
        '{{Backspace}} apaga para trás (à esquerda do cursor) e {{Delete}} apaga para frente (à direita). No macOS, a tecla chamada delete faz o papel do Backspace; para apagar à direita, use {{Fn+Delete}}.',
      concept: 'teclas-essenciais',
      options: [
        {
          id: 'a',
          text: '{{Backspace}}',
          correct: true,
          feedback: 'Isso. O Backspace apaga o caractere à esquerda do cursor, ou seja, o que você acabou de digitar.',
        },
        {
          id: 'b',
          text: '{{Delete}}',
          feedback:
            'O Delete apaga o caractere à direita do cursor. Como o cursor está depois da letra errada, ele não a alcançaria.',
        },
        {
          id: 'c',
          text: '{{Esc}}',
          feedback: 'O Esc cancela ou fecha coisas, como menus e caixas de diálogo; ele não apaga texto.',
        },
        {
          id: 'd',
          text: '{{Enter}}',
          feedback: 'O Enter quebra a linha ou confirma uma ação; a letra errada continuaria lá.',
        },
      ],
    },
  },
  {
    id: 'av-02',
    category: 'teclado',
    difficulty: 2,
    step: {
      id: 'av-02',
      kind: 'quiz',
      title: 'Mover um parágrafo',
      prompt:
        'Você quer levar um parágrafo do início do documento para o final, sem que ele fique repetido. O parágrafo já está selecionado. Qual é a sequência mais rápida?',
      hint: 'Você precisa de um comando que tire o texto do lugar original e o guarde temporariamente.',
      explanation:
        '{{Ctrl+X}} (recortar) remove a seleção e a guarda na área de transferência; {{Ctrl+V}} cola onde estiver o cursor. Já {{Ctrl+C}} copia sem remover. No macOS, use {{Cmd+X}} e {{Cmd+V}}.',
      concept: 'area-transferencia',
      options: [
        {
          id: 'a',
          text: '{{Ctrl+C}}, clicar no final do documento e {{Ctrl+V}}',
          feedback:
            'Assim o parágrafo é copiado, não movido: o original continuaria no início e o texto ficaria duplicado.',
        },
        {
          id: 'b',
          text: '{{Ctrl+X}}, clicar no final do documento e {{Ctrl+V}}',
          correct: true,
          feedback:
            'Exato. Recortar tira o trecho do lugar e o guarda na área de transferência; colar o coloca no novo ponto.',
        },
        {
          id: 'c',
          text: 'Apertar {{Delete}} e digitar o parágrafo de novo no final',
          feedback:
            'Funciona, mas desperdiça tempo e abre espaço para erros de digitação. Recortar e colar resolve em segundos.',
        },
        {
          id: 'd',
          text: '{{Ctrl+Z}}, clicar no final do documento e {{Ctrl+V}}',
          feedback:
            '{{Ctrl+Z}} desfaz a última ação; ele não guarda o parágrafo para ser colado em outro lugar.',
        },
      ],
    },
  },

  // ----- Sistema -------------------------------------------------------------
  {
    id: 'av-03',
    category: 'sistema',
    difficulty: 1,
    step: {
      id: 'av-03',
      kind: 'quiz',
      title: 'Janela no caminho',
      prompt:
        'Uma planilha aberta ocupa a tela inteira e você precisa consultar rapidamente outro programa, mas vai voltar à planilha logo em seguida. O que faz?',
      hint: 'Existe um botão no canto da janela que a esconde sem encerrá-la.',
      explanation:
        'Os três botões no canto da janela são minimizar, maximizar/restaurar e fechar. No Windows, ficam à direita; no macOS, são os círculos coloridos à esquerda (o amarelo minimiza). Para alternar entre janelas pelo teclado, use {{Alt+Tab}} ({{Cmd+Tab}} no macOS).',
      concept: 'janelas-controles',
      options: [
        {
          id: 'a',
          text: 'Clica no botão de fechar (X) da planilha',
          feedback:
            'Fechar encerra o programa: você teria de abrir o arquivo de novo e, se houver alterações não salvas, poderia perdê-las.',
        },
        {
          id: 'b',
          text: 'Clica no botão de minimizar da planilha',
          correct: true,
          feedback:
            'Isso. Minimizar esconde a janela na barra de tarefas sem fechar o arquivo; um clique no ícone dela a traz de volta.',
        },
        {
          id: 'c',
          text: 'Desliga o monitor e liga de novo',
          feedback: 'Isso só apaga e acende a imagem; a planilha continuaria cobrindo a tela.',
        },
        {
          id: 'd',
          text: 'Reinicia o computador para liberar a tela',
          feedback: 'Reiniciar fecha todos os programas e é desnecessário; minimizar resolve com um clique.',
        },
      ],
    },
  },
  {
    id: 'av-04',
    category: 'sistema',
    difficulty: 3,
    step: {
      id: 'av-04',
      kind: 'quiz',
      title: 'Notebook emprestado',
      prompt:
        'Um parente vai usar seu notebook por uma semana para estudar. Nele estão seus documentos de trabalho e há senhas salvas no navegador. Qual é a melhor configuração?',
      hint: 'Pense no princípio de dar a cada pessoa apenas o acesso de que ela precisa.',
      explanation:
        'Contas separadas isolam arquivos, navegador e configurações. Uma conta padrão, sem privilégios de administrador, é o recomendado para o uso diário de outras pessoas. No Windows, isso fica em Configurações > Contas; no macOS, em Ajustes do Sistema > Usuários e Grupos.',
      concept: 'contas-permissoes',
      options: [
        {
          id: 'a',
          text: 'Emprestar a sua própria conta e pedir que ele não mexa em nada',
          feedback:
            'Na sua conta, ele teria acesso aos seus arquivos e às senhas salvas no navegador, mesmo sem querer.',
        },
        {
          id: 'b',
          text: 'Criar uma conta de administrador para ele, para que não precise chamar você',
          feedback:
            'Um administrador pode instalar programas, mudar configurações e acessar arquivos de outros usuários. Dê só o acesso necessário.',
        },
        {
          id: 'c',
          text: 'Criar para ele uma conta de usuário padrão, com senha própria',
          correct: true,
          feedback:
            'Isso. Cada conta tem pastas, navegador e configurações separados, e uma conta padrão não instala programas nem altera o sistema sem a senha de administrador.',
        },
        {
          id: 'd',
          text: 'Manter a sua conta, mas pedir que ele use apenas janelas anônimas no navegador',
          feedback:
            'A janela anônima só evita guardar o histórico daquela sessão; seus arquivos e senhas continuam acessíveis na conta.',
        },
      ],
    },
  },

  // ----- Arquivos ------------------------------------------------------------
  {
    id: 'av-05',
    category: 'arquivos',
    difficulty: 1,
    step: {
      id: 'av-05',
      kind: 'quiz',
      title: 'Apaguei sem querer',
      prompt:
        'Você apertou {{Delete}} num arquivo do Explorador de Arquivos e percebeu, em seguida, que era o arquivo errado. O que faz?',
      hint: 'Arquivos apagados normalmente não somem de imediato: eles vão para um lugar intermediário.',
      explanation:
        'A Lixeira é uma área de segurança: o arquivo fica lá até você esvaziá-la. Atenção: {{Shift+Delete}}, arquivos de pendrive e comandos de terminal costumam apagar direto, sem passar por ela. No macOS, a Lixeira se chama Lixo.',
      concept: 'lixeira',
      options: [
        {
          id: 'a',
          text: 'Esvazia a Lixeira para liberar o arquivo',
          feedback:
            'Esvaziar a Lixeira apaga de vez tudo o que estava lá, inclusive o arquivo que você quer recuperar.',
        },
        {
          id: 'b',
          text: 'Considera o arquivo perdido e refaz o trabalho',
          feedback: 'Não precisa: ao apagar dessa forma, o arquivo vai para a Lixeira e pode ser restaurado.',
        },
        {
          id: 'c',
          text: 'Abre a Lixeira, encontra o arquivo e escolhe Restaurar',
          correct: true,
          feedback:
            'Isso. O arquivo volta ao lugar original. Logo depois de apagar, {{Ctrl+Z}} no Explorador também desfaz a exclusão.',
        },
        {
          id: 'd',
          text: 'Reinicia o computador para o arquivo reaparecer',
          feedback: 'Reiniciar não traz o arquivo de volta; ele está na Lixeira, esperando ser restaurado.',
        },
      ],
    },
  },
  {
    id: 'av-06',
    category: 'arquivos',
    difficulty: 2,
    step: {
      id: 'av-06',
      kind: 'quiz',
      title: 'Qual versão enviar',
      prompt:
        'Um cliente pediu o contrato apenas para ler, assinar e imprimir, sem alterar o texto. Na pasta há `contrato.docx` e `contrato.pdf`, com o mesmo conteúdo. Qual você envia?',
      hint: 'Pense em qual formato mantém a aparência igual em qualquer computador e não convida a edições.',
      explanation:
        'A extensão indica o tipo do arquivo: .docx é um documento editável de editor de texto; .pdf é um formato de leitura e impressão que mantém o layout em qualquer aparelho. Envie o editável apenas quando a outra pessoa precisa alterar o conteúdo.',
      concept: 'extensoes-arquivo',
      options: [
        {
          id: 'a',
          text: '`contrato.docx`, porque é o arquivo original',
          feedback:
            'O .docx é editável e pode mudar de aparência conforme o programa de quem abre. Para ler e imprimir, o PDF é mais adequado.',
        },
        {
          id: 'b',
          text: 'Os dois, para o cliente escolher',
          feedback:
            'Duas versões geram dúvida sobre qual vale e entregam uma cópia editável sem necessidade.',
        },
        {
          id: 'c',
          text: 'Nenhum: é melhor copiar o texto no corpo do e-mail',
          feedback:
            'No corpo do e-mail a formatação se perde, e o documento fica difícil de imprimir e assinar.',
        },
        {
          id: 'd',
          text: '`contrato.pdf`',
          correct: true,
          feedback:
            'Isso. O PDF preserva a formatação em qualquer aparelho e não é feito para edição casual: ideal para ler, imprimir e assinar.',
        },
      ],
    },
  },

  // ----- Internet ------------------------------------------------------------
  {
    id: 'av-07',
    category: 'internet',
    difficulty: 3,
    step: {
      id: 'av-07',
      kind: 'quiz',
      title: 'Endereço disfarçado',
      prompt:
        'Você recebe o link `https://banco.com.br.acesso-seguro.net/login`. A qual domínio esse endereço realmente pertence?',
      hint: 'Encontre a primeira barra depois de `https://` e leia o nome que vem logo antes dela, da direita para a esquerda.',
      explanation:
        'O domínio registrado fica no final do nome do servidor, logo antes da primeira barra. Assim, `banco.com.br.acesso-seguro.net` pertence a **acesso-seguro.net**; o trecho banco.com.br é só um subdomínio usado para enganar. Para acessar o banco, digite você mesmo o endereço ou use o aplicativo oficial.',
      concept: 'url-anatomia',
      options: [
        {
          id: 'a',
          text: '`banco.com.br`',
          feedback:
            'O nome do banco aparece no começo, mas ali é só um subdomínio. O domínio real é o que vem imediatamente antes da primeira barra.',
        },
        {
          id: 'b',
          text: '`acesso-seguro.net`',
          correct: true,
          feedback:
            'Exato. Tudo o que está à esquerda de acesso-seguro.net são subdomínios, que o dono desse domínio pode criar com qualquer nome.',
        },
        {
          id: 'c',
          text: '`login`',
          feedback: '`/login` é o caminho de uma página dentro do site, não o domínio.',
        },
        {
          id: 'd',
          text: 'Ao banco, porque o endereço começa com https',
          feedback:
            'O https protege a conexão, mas não garante quem é o dono do site. Sites de golpe também usam https.',
        },
      ],
    },
  },

  // ----- Navegadores ---------------------------------------------------------
  {
    id: 'av-08',
    category: 'navegadores',
    difficulty: 1,
    step: {
      id: 'av-08',
      kind: 'quiz',
      title: 'Cadê o download?',
      prompt:
        'Você baixou pelo navegador o boleto da escola, mas não sabe onde o arquivo foi parar. Qual é o caminho mais rápido para achá-lo?',
      hint: 'O navegador guarda uma lista própria de tudo o que foi baixado.',
      explanation:
        'Por padrão, os navegadores salvam os arquivos na pasta Downloads. A lista de downloads abre com {{Ctrl+J}} no Chrome e no Edge ({{Cmd+Shift+J}} no Chrome para macOS e {{Cmd+Option+L}} no Safari); nos outros navegadores, procure Downloads no menu.',
      concept: 'downloads',
      options: [
        {
          id: 'a',
          text: 'Baixar o boleto de novo até ele aparecer na tela',
          feedback:
            'Cada novo download cria outra cópia, como boleto (1).pdf, e não responde à dúvida de onde os arquivos ficam.',
        },
        {
          id: 'b',
          text: 'Procurar na Lixeira',
          feedback: 'Downloads não vão para a Lixeira; só vai para lá o que você apagou.',
        },
        {
          id: 'c',
          text: 'Abrir a lista de downloads do navegador ou a pasta Downloads',
          correct: true,
          feedback:
            'Isso. A lista mostra o arquivo e oferece a opção de abrir a pasta onde ele está, que por padrão é Downloads.',
        },
        {
          id: 'd',
          text: 'Abrir o histórico de navegação',
          feedback:
            'O histórico lista as páginas visitadas, não os arquivos baixados. A lista certa é a de downloads.',
        },
      ],
    },
  },

  // ----- Programas -----------------------------------------------------------
  {
    id: 'av-09',
    category: 'programas',
    difficulty: 2,
    step: {
      id: 'av-09',
      kind: 'quiz',
      title: 'Onde baixar',
      prompt:
        'Você precisa instalar um programa gratuito de edição de imagens. Ao pesquisar, aparecem vários sites oferecendo o download. De onde é mais seguro baixar?',
      hint: 'Quem criou o programa é a fonte mais confiável para distribuí-lo.',
      explanation:
        'Prefira sempre a fonte original: o site do desenvolvedor (confira o endereço) ou a loja oficial do sistema. Desconfie de anúncios, de sites que pedem para desativar o antivírus e de promessas de versões pagas de graça.',
      concept: 'fontes-confiaveis',
      options: [
        {
          id: 'a',
          text: 'Do primeiro resultado da pesquisa, mesmo que seja um anúncio',
          feedback:
            'Anúncios aparecem no topo porque alguém pagou, e golpistas também compram anúncios imitando programas conhecidos.',
        },
        {
          id: 'b',
          text: 'De um site de downloads que oferece a versão completa liberada',
          feedback:
            'Versões crackeadas são um dos meios mais comuns de espalhar vírus, além de serem ilegais.',
        },
        {
          id: 'c',
          text: 'Do site oficial do desenvolvedor ou da loja oficial do sistema',
          correct: true,
          feedback:
            'Isso. O site oficial e lojas como Microsoft Store, App Store ou a central de programas do Linux entregam a versão original, sem instaladores modificados.',
        },
        {
          id: 'd',
          text: 'De um link enviado num grupo de mensagens',
          feedback: 'Links repassados em grupos não têm origem garantida e podem levar a instaladores falsos.',
        },
      ],
    },
  },

  // ----- Configurações -------------------------------------------------------
  {
    id: 'av-10',
    category: 'configuracoes',
    difficulty: 1,
    step: {
      id: 'av-10',
      kind: 'quiz',
      title: 'Letras pequenas',
      prompt:
        'Num notebook novo, os textos e ícones de todo o sistema estão pequenos demais para ler com conforto. O que resolve de forma mais completa?',
      hint: 'Procure um ajuste que valha para o sistema inteiro, não só para um programa.',
      explanation:
        'No Windows, use Configurações > Sistema > Tela > Escala (por exemplo, 125% ou 150%); também há Acessibilidade > Tamanho do texto. No macOS, use Ajustes do Sistema > Monitores, com a opção de texto maior. Mantenha a resolução recomendada para a imagem ficar nítida.',
      concept: 'configuracoes-tela',
      options: [
        {
          id: 'a',
          text: 'Diminuir a resolução da tela para um valor bem baixo',
          feedback:
            'Baixar a resolução aumenta tudo, mas deixa a imagem borrada e distorcida. A escala é o ajuste feito para isso.',
        },
        {
          id: 'b',
          text: 'Aumentar a escala ou o tamanho do texto nas configurações de tela',
          correct: true,
          feedback:
            'Isso. A escala aumenta textos, ícones e janelas do sistema inteiro de uma vez, sem perder nitidez.',
        },
        {
          id: 'c',
          text: 'Usar o zoom do navegador',
          feedback:
            'O zoom do navegador só amplia as páginas da web; menus, ícones e outros programas continuam pequenos.',
        },
        {
          id: 'd',
          text: 'Aproximar o rosto da tela',
          feedback:
            'Isso cansa a vista e prejudica a postura. O sistema tem ajustes próprios para ampliar o conteúdo.',
        },
      ],
    },
  },

  // ----- Segurança -----------------------------------------------------------
  {
    id: 'av-11',
    category: 'seguranca',
    difficulty: 1,
    step: {
      id: 'av-11',
      kind: 'quiz',
      title: 'SMS urgente',
      prompt:
        'Chega um SMS dizendo que sua conta do banco será bloqueada hoje, a menos que você confirme seus dados pelo link enviado. O que faz?',
      hint: 'Urgência e link para confirmar dados são sinais clássicos de golpe.',
      explanation:
        'Bancos não pedem confirmação de dados por links em SMS. Mensagens com urgência, ameaça de bloqueio e link são típicas de phishing (por SMS, também chamado de smishing). Verifique sempre por um canal oficial que você mesmo acessa.',
      concept: 'phishing',
      options: [
        {
          id: 'a',
          text: 'Abre o link só para conferir se é verdade, sem digitar nada',
          feedback:
            'Abrir o link já pode confirmar ao golpista que seu número está ativo e levar a páginas maliciosas. Não é preciso abrir para verificar.',
        },
        {
          id: 'b',
          text: 'Responde ao SMS pedindo mais informações',
          feedback: 'Responder confirma que o número está em uso e abre uma conversa com o golpista.',
        },
        {
          id: 'c',
          text: 'Encaminha o link para um amigo testar antes',
          feedback: 'Isso só coloca outra pessoa em risco.',
        },
        {
          id: 'd',
          text: 'Ignora o link e confere a conta pelo aplicativo oficial ou pelo telefone do verso do cartão',
          correct: true,
          feedback:
            'Isso. Use um canal que você mesmo escolheu. Se houver algum problema real, ele aparecerá no app oficial.',
        },
      ],
    },
  },
  {
    id: 'av-12',
    category: 'seguranca',
    difficulty: 3,
    step: {
      id: 'av-12',
      kind: 'quiz',
      title: 'Senha vazada',
      prompt:
        'Uma loja on-line onde você tem cadastro avisa que houve vazamento de senhas. Você usava essa mesma senha no seu e-mail principal e em duas redes sociais. Qual é o melhor plano?',
      hint: 'Pense em qual conta permite recuperar todas as outras e no risco de repetir a mesma senha.',
      explanation:
        'Senhas vazadas são testadas automaticamente em outros sites. Por isso, cada serviço precisa de uma senha diferente, e um gerenciador de senhas torna isso viável. Comece pelo e-mail, que é a chave de recuperação das demais contas.',
      concept: 'senhas-fortes',
      options: [
        {
          id: 'a',
          text: 'Trocar só a senha da loja, que foi o site que vazou',
          feedback:
            'Golpistas testam a senha vazada em outros serviços. Todas as contas com a mesma senha estão em risco.',
        },
        {
          id: 'b',
          text: 'Trocar primeiro a senha do e-mail e depois a das outras contas, com uma senha diferente para cada uma, e ativar a verificação em duas etapas',
          correct: true,
          feedback:
            'Isso. O e-mail vem primeiro porque recupera as outras contas. Senhas únicas impedem que um vazamento se espalhe, e a verificação em duas etapas protege mesmo se uma senha vazar.',
        },
        {
          id: 'c',
          text: 'Trocar todas por uma única senha nova, bem forte',
          feedback:
            'Uma senha forte repetida continua sendo um ponto único de falha: no próximo vazamento, todas as contas ficam expostas de novo.',
        },
        {
          id: 'd',
          text: 'Esperar para ver se alguma conta é invadida antes de agir',
          feedback:
            'Depois de uma invasão, o golpista pode trocar a sua senha e o e-mail de recuperação. Agir antes é muito mais fácil.',
        },
      ],
    },
  },

  // ----- Diagnóstico ---------------------------------------------------------
  {
    id: 'av-13',
    category: 'diagnostico',
    difficulty: 2,
    step: {
      id: 'av-13',
      kind: 'quiz',
      title: 'Programa congelado',
      prompt:
        'O editor de texto parou de responder: a janela ignora os cliques e o título mostra "(Não está respondendo)". Você já esperou cerca de um minuto. Qual é o próximo passo?',
      hint: 'O sistema tem uma ferramenta para encerrar só o programa que travou.',
      explanation:
        'O Gerenciador de Tarefas ({{Ctrl+Shift+Esc}}) encerra apenas o programa travado, sem afetar o resto. Alterações não salvas desse programa podem se perder, por isso vale esperar um pouco antes. No macOS, o equivalente é Forçar Encerrar ({{Cmd+Option+Esc}}).',
      concept: 'gerenciador-tarefas',
      options: [
        {
          id: 'a',
          text: 'Abrir o Gerenciador de Tarefas, selecionar o editor e clicar em Finalizar tarefa',
          correct: true,
          feedback:
            'Isso. Você encerra só o programa travado e pode abri-lo de novo em seguida, sem mexer no resto do sistema.',
        },
        {
          id: 'b',
          text: 'Desligar o computador segurando o botão de energia',
          feedback:
            'Desligar à força afeta todos os programas e pode corromper arquivos. Reserve isso para quando o sistema inteiro travar.',
        },
        {
          id: 'c',
          text: 'Clicar várias vezes na janela até ela voltar',
          feedback:
            'Os cliques extras se acumulam na fila do programa travado e não o destravam; às vezes até pioram.',
        },
        {
          id: 'd',
          text: 'Desinstalar o editor imediatamente',
          feedback:
            'Um travamento isolado não indica que o programa precisa ser removido. Primeiro, encerre-o e veja se volta a funcionar.',
        },
      ],
    },
  },
  {
    id: 'av-14',
    category: 'diagnostico',
    difficulty: 3,
    step: {
      id: 'av-14',
      kind: 'quiz',
      title: 'Ninguém navega',
      prompt:
        'Nenhum site abre no notebook, que está conectado ao Wi-Fi de casa. No celular, ligado à mesma rede, também não abre nada. Qual é o próximo passo mais sensato?',
      hint: 'O que os dois aparelhos têm em comum?',
      explanation:
        'Um bom diagnóstico isola a causa: se um só aparelho falha, investigue esse aparelho; se todos falham, olhe para o que eles compartilham. Reiniciar o modem e o roteador (desligar, esperar uns 30 segundos e religar) e consultar o provedor costumam resolver ou confirmar a causa.',
      concept: 'diagnostico-metodo',
      options: [
        {
          id: 'a',
          text: 'Reinstalar o sistema operacional do notebook',
          feedback:
            'O celular também está sem internet, então o problema não é só do notebook. Reinstalar seria drástico e inútil.',
        },
        {
          id: 'b',
          text: 'Trocar o navegador do notebook',
          feedback:
            'Se o celular também falha, o navegador não é a causa. O teste mostrou que o problema é comum aos dois aparelhos.',
        },
        {
          id: 'c',
          text: 'Desativar o antivírus para liberar a conexão',
          feedback:
            'Desligar proteções não resolve uma falha que atinge também o celular, e ainda deixa o notebook exposto.',
        },
        {
          id: 'd',
          text: 'Verificar o roteador e o modem (luzes, reinício) e, se persistir, consultar o provedor',
          correct: true,
          feedback:
            'Isso. Quando todos os aparelhos da rede falham, o ponto em comum é o roteador, o modem ou o próprio provedor.',
        },
      ],
    },
  },

  // ----- Produtividade -------------------------------------------------------
  {
    id: 'av-15',
    category: 'produtividade',
    difficulty: 2,
    step: {
      id: 'av-15',
      kind: 'quiz',
      title: 'Somar uma coluna',
      prompt:
        'Numa planilha de despesas, os valores estão nas células B2 até B51. Você quer o total numa célula que se atualize sozinha quando algum valor mudar. O que digita?',
      hint: 'Fórmulas começam com = e um intervalo de células usa dois-pontos.',
      explanation:
        'Em planilhas, fórmulas começam com `=` e intervalos são escritos com dois-pontos (B2:B51). Em português, a função é SOMA; em programas configurados em inglês, é SUM. O botão de soma automática (Σ) monta essa fórmula por você.',
      concept: 'ferramentas-escritorio',
      options: [
        {
          id: 'a',
          text: 'O total calculado na calculadora do celular',
          feedback:
            'Um número digitado à mão não acompanha as mudanças: se um valor for corrigido, o total fica errado sem aviso.',
        },
        {
          id: 'b',
          text: '`=SOMA(B2;B51)`',
          feedback:
            'Com ponto e vírgula, a fórmula soma apenas as células B2 e B51. Os dois-pontos é que indicam o intervalo inteiro.',
        },
        {
          id: 'c',
          text: '`=SOMA(B2:B51)`',
          correct: true,
          feedback: 'Isso. A função SOMA recalcula o total sempre que um valor do intervalo muda.',
        },
        {
          id: 'd',
          text: '`B2+B51`',
          feedback:
            'Sem o sinal de igual, a planilha trata o conteúdo como texto. E mesmo `=B2+B51` somaria só duas células.',
        },
      ],
    },
  },

  // ----- Hardware ------------------------------------------------------------
  {
    id: 'av-16',
    category: 'hardware',
    difficulty: 2,
    step: {
      id: 'av-16',
      kind: 'quiz',
      title: 'Espaço para fotos',
      prompt:
        'Você vai comprar um notebook e quer espaço para guardar muitas fotos e vídeos. A ficha técnica diz: processador de 8 núcleos, 8 GB de RAM e SSD de 512 GB. Qual item indica quanto você consegue guardar?',
      hint: 'Procure o componente que guarda os dados mesmo com o computador desligado.',
      explanation:
        'A CPU processa, a RAM é a mesa de trabalho temporária e o armazenamento (SSD ou HD) é o arquivo permanente. Para guardar mais fotos, o que conta é a capacidade do SSD ou HD; um HD externo ou a nuvem também ajudam.',
      concept: 'cpu-ram-armazenamento',
      options: [
        {
          id: 'a',
          text: 'Os 8 núcleos do processador',
          feedback:
            'O processador executa os cálculos e influencia a velocidade, não a quantidade de arquivos que cabem.',
        },
        {
          id: 'b',
          text: 'Os 8 GB de RAM',
          feedback:
            'A RAM é a memória de trabalho, usada enquanto os programas estão abertos. Ela se esvazia ao desligar e não guarda seus arquivos.',
        },
        {
          id: 'c',
          text: 'O SSD de 512 GB',
          correct: true,
          feedback:
            'Isso. O SSD (ou HD) é o armazenamento: é onde arquivos, fotos e programas ficam guardados, mesmo com o computador desligado.',
        },
        {
          id: 'd',
          text: 'O tamanho da tela',
          feedback: 'A tela define a área de imagem, não a capacidade de guardar arquivos.',
        },
      ],
    },
  },

  // ----- Redes ---------------------------------------------------------------
  {
    id: 'av-17',
    category: 'redes',
    difficulty: 3,
    step: {
      id: 'av-17',
      kind: 'quiz',
      title: 'Endereço estranho',
      prompt:
        'O computador está ligado ao roteador por cabo, mas nada funciona. No Prompt de Comando do Windows, `ipconfig` mostra o endereço IPv4 `169.254.37.12`. O que isso indica?',
      hint: 'Numa rede doméstica comum, os endereços costumam ser 192.168.x.x. Por que o computador teria um endereço diferente?',
      explanation:
        'Ao se conectar, o computador pede um endereço ao roteador por DHCP. Sem resposta, o próprio sistema se atribui um endereço da faixa 169.254.x.x (chamado de link-local, ou APIPA no Windows), que não dá acesso à internet. A causa costuma estar no cabo, na porta ou no próprio roteador.',
      concept: 'ip-dns',
      options: [
        {
          id: 'a',
          text: 'Que a conexão está perfeita e o problema está nos sites',
          feedback:
            'Um endereço 169.254.x.x não é um endereço normal da rede: ele mostra que algo falhou antes mesmo de chegar a qualquer site.',
        },
        {
          id: 'b',
          text: 'Que o DNS está traduzindo os nomes dos sites corretamente',
          feedback:
            'O DNS traduz nomes em endereços, mas o problema aqui é anterior: o computador nem recebeu um IP válido da rede.',
        },
        {
          id: 'c',
          text: 'Que o computador foi invadido e recebeu um IP de outro país',
          feedback:
            '169.254.x.x é uma faixa reservada para uso local; não tem relação com localização ou invasão.',
        },
        {
          id: 'd',
          text: 'Que o computador não recebeu um endereço do roteador (DHCP) e se atribuiu um endereço provisório',
          correct: true,
          feedback:
            'Isso. Esse endereço automático surge quando ninguém responde ao pedido de IP. Verifique o cabo e o roteador e renove a conexão.',
        },
      ],
    },
  },

  // ----- Comandos ------------------------------------------------------------
  {
    id: 'av-18',
    category: 'comandos',
    difficulty: 3,
    step: {
      id: 'av-18',
      kind: 'quiz',
      title: 'Apagado pelo terminal',
      prompt:
        'No terminal do Linux, você digitou `rm orcamento.ods` e só depois percebeu que era o arquivo errado. Onde ele está agora?',
      hint: 'Os comandos de terminal agem diretamente, sem as redes de segurança da interface gráfica.',
      explanation:
        'No Linux e no macOS, `rm` exclui sem passar pela Lixeira; no Windows, `del` (CMD) e `rm` ou Remove-Item (PowerShell) também não usam a Lixeira. Antes de apagar, confira a pasta com `pwd` e `ls`. E mantenha backups: é a forma confiável de recuperar o que foi apagado por engano.',
      concept: 'terminal-arquivos',
      options: [
        {
          id: 'a',
          text: 'Na Lixeira, como qualquer arquivo apagado',
          feedback: 'O `rm` não usa a Lixeira: ele remove o arquivo diretamente.',
        },
        {
          id: 'b',
          text: 'Escondido na mesma pasta; basta rodar `ls` de novo',
          feedback: 'O `ls` lista o que existe na pasta; depois do `rm`, o arquivo não aparece mais.',
        },
        {
          id: 'c',
          text: 'Fora de alcance: o `rm` apaga sem passar pela Lixeira, então o caminho é restaurar de um backup',
          correct: true,
          feedback:
            'Isso. Por isso, no terminal, confira duas vezes antes de apagar e mantenha backups em dia.',
        },
        {
          id: 'd',
          text: 'Na pasta Downloads',
          feedback: 'Downloads é só a pasta padrão dos arquivos baixados; o `rm` não move nada para lá.',
        },
      ],
    },
  },
];
