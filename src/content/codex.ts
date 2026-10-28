/**
 * Codex do Nexo: uma entrada para cada conceito de `concepts.ts`, na mesma ordem.
 *
 * Marcação permitida nos textos: **negrito**, `código` e {{Ctrl+C}} para teclas.
 * Atalhos seguem o formato "{{Ctrl+C}} / {{Cmd+C}} no macOS — Copiar".
 */
import type { CodexEntry } from './types';

export const CODEX: CodexEntry[] = [
  // -------------------------------------------------------------------------
  // Fundamentos
  // -------------------------------------------------------------------------
  {
    id: 'hardware-componentes',
    title: 'Componentes do computador',
    category: 'hardware',
    summary:
      'Por dentro, todo computador tem algumas peças principais. O **processador (CPU)** faz os cálculos; a **memória RAM** guarda o que está em uso agora; o **armazenamento (SSD ou HD)** guarda seus arquivos de forma permanente; a **placa-mãe** liga tudo e a **fonte** fornece energia. Muitos também têm uma **placa de vídeo (GPU)**, que cuida das imagens.',
    example:
      'Ao comparar dois notebooks na loja, você lê "processador de 8 núcleos, 16 GB de RAM, SSD de 512 GB". Isso quer dizer: um processador capaz de dividir bem o trabalho, memória suficiente para várias tarefas ao mesmo tempo e bastante espaço rápido para guardar arquivos.',
    whenToUse:
      'Ao comprar ou comparar computadores, ao entender por que uma máquina está lenta e ao conversar com um técnico sobre conserto ou melhoria.',
    commonMistakes: [
      'Achar que "memória" e "espaço para arquivos" são a mesma coisa — a RAM é temporária; o armazenamento (SSD/HD) é onde os arquivos ficam guardados.',
      'Chamar o gabinete (a "caixa") de CPU — CPU é o processador, uma peça lá dentro.',
      'Escolher computador só pelo processador — pouca RAM ou um HD lento também deixam tudo devagar.',
    ],
    shortcuts: ['{{Win+Pause}} — Ver as especificações do computador (Windows; nem todo teclado tem a tecla Pause)'],
    platformNote:
      'Para ver as peças do seu computador: no Windows, **Configurações > Sistema > Sobre**; no macOS, **menu Apple > Sobre Este Mac**; no Linux, geralmente **Configurações > Sobre**. No celular, procure **Sobre o telefone** (Android) ou **Ajustes > Geral > Sobre** (iPhone).',
  },
  {
    id: 'perifericos-entrada-saida',
    title: 'Dispositivos de entrada e saída',
    category: 'hardware',
    summary:
      'Periféricos são aparelhos ligados ao computador. Os de **entrada** mandam informações para ele (teclado, mouse, microfone, webcam, scanner); os de **saída** mostram ou entregam o resultado (monitor, caixas de som, fones, impressora). Alguns fazem as duas coisas, como a tela sensível ao toque, o headset com microfone e o pendrive.',
    example:
      'Numa chamada de vídeo, a webcam e o microfone são entrada: levam sua imagem e sua voz ao computador. A tela e o fone são saída: mostram e tocam o que as outras pessoas enviam.',
    whenToUse:
      'Ao conectar um aparelho novo, ao descobrir por que algo "não aparece" ou "não grava" e ao escolher acessórios para trabalho ou estudo.',
    commonMistakes: [
      'Achar que a impressora multifuncional é só saída — quando ela digitaliza um documento, está funcionando como entrada.',
      'Puxar o pendrive ou o HD externo sem ejetar — isso pode corromper arquivos; use **Ejetar** antes de remover.',
      'Culpar o computador quando o microfone não funciona — muitas vezes o aparelho certo não está selecionado nas configurações de som ou o app não tem permissão.',
    ],
    shortcuts: ['{{Win+P}} — Escolher como usar um segundo monitor ou projetor (duplicar ou estender)'],
    platformNote:
      'Para remover um pendrive com segurança: no Windows, clique no ícone de pendrive perto do relógio e escolha **Ejetar**; no macOS, clique no botão de ejetar ao lado do dispositivo no Finder; no Linux, use o botão de ejetar no gerenciador de arquivos.',
  },
  {
    id: 'teclas-essenciais',
    title: 'Teclas essenciais',
    category: 'teclado',
    summary:
      'Algumas teclas aparecem em quase toda tarefa. {{Enter}} confirma ou quebra a linha; {{Esc}} cancela ou fecha menus; {{Tab}} pula para o próximo campo; {{Shift}} deixa a letra maiúscula enquanto está pressionada; {{Backspace}} apaga o que está à esquerda do cursor e {{Delete}}, o que está à direita. {{Ctrl}} e {{Alt}} não fazem nada sozinhas: elas mudam a função de outras teclas, formando atalhos.',
    example:
      'Num formulário de cadastro, você digita o nome, aperta {{Tab}} para ir ao campo de e-mail, segura {{Shift}} para a inicial maiúscula e, no fim, aperta {{Enter}} para enviar. Abriu um menu sem querer? {{Esc}} fecha.',
    whenToUse:
      'Sempre que digitar textos, preencher formulários ou quiser trabalhar mais rápido sem depender do mouse.',
    commonMistakes: [
      'Usar {{Caps Lock}} para fazer uma única maiúscula — basta segurar {{Shift}} enquanto digita a letra.',
      'Achar que a senha está errada quando o {{Caps Lock}} está ligado — confira a luz da tecla antes de digitar senhas.',
      'Confundir {{Backspace}} com {{Delete}} — o primeiro apaga para a esquerda do cursor; o segundo, para a direita.',
      'Alinhar textos apertando a barra de espaço várias vezes — use {{Tab}} ou os botões de alinhamento do editor.',
    ],
    shortcuts: [
      '{{Shift+Tab}} — Voltar ao campo anterior',
      '{{Home}} / {{Cmd+←}} no macOS — Ir ao início da linha',
      '{{End}} / {{Cmd+→}} no macOS — Ir ao fim da linha',
      '{{AltGr+Q}} e {{AltGr+W}} — Digitar / e ? em teclados ABNT2 de notebook sem essas teclas',
    ],
    platformNote:
      'No Mac, a tecla marcada **delete** funciona como o {{Backspace}} (apaga à esquerda); para apagar à direita, use {{Fn+Delete}}. Na maioria dos atalhos, o {{Ctrl}} do Windows corresponde ao {{Cmd}} (⌘) do Mac, e o {{Alt}} corresponde ao {{Option}}.',
  },
  {
    id: 'digitacao-postura',
    title: 'Postura e posição das mãos',
    category: 'teclado',
    summary:
      'Digitar bem começa pelo corpo. Sente-se com as costas apoiadas e os pés no chão, cotovelos perto do corpo em ângulo de cerca de 90° e punhos retos, sem dobrar as mãos para cima. O topo da tela deve ficar na altura dos olhos ou um pouco abaixo, a mais ou menos um braço de distância.',
    example:
      'Quem passa horas com o notebook direto na mesa acaba curvando o pescoço. Colocar o notebook num suporte (ou sobre alguns livros) e usar teclado e mouse externos deixa a tela na altura certa e alivia ombros e pescoço.',
    whenToUse:
      'Sempre que for passar mais do que alguns minutos ao computador, especialmente em jornadas longas de estudo ou trabalho.',
    commonMistakes: [
      'Apoiar o punho na mesa e dobrar as mãos para cima ao digitar — mantenha os punhos retos e as mãos leves sobre o teclado.',
      'Bater nas teclas com força — um toque leve basta e cansa menos.',
      'Passar horas sem pausa — levante e alongue-se a cada 50 ou 60 minutos e descanse os olhos olhando para longe.',
      'Deixar a tela baixa demais, como a do notebook direto na mesa — eleve a tela e use um teclado externo.',
    ],
    shortcuts: [],
  },
  {
    id: 'digitacao-fileira-base',
    title: 'Fileira base do teclado',
    category: 'teclado',
    summary:
      'A fileira base é a do meio do teclado: a mão esquerda descansa em **A S D F** e a direita em **J K L Ç**, com os polegares na barra de espaço. As teclas **F** e **J** têm um pequeno relevo para você encontrá-las sem olhar. Cada dedo cuida das teclas da sua "coluna" e volta para a base depois de cada toque.',
    example:
      'Para digitar "dada", as mãos não saem do lugar: o dedo médio esquerdo aperta o D e o mindinho esquerdo, o A. Em "casa", o médio esquerdo desce do D até o C e volta, enquanto o mindinho e o anelar cuidam do A e do S.',
    whenToUse:
      'Ao aprender a digitar sem olhar para o teclado e sempre que perceber que está "catando milho" com dois dedos.',
    commonMistakes: [
      'Olhar para o teclado o tempo todo — use os relevos do F e do J para se orientar e mantenha os olhos na tela.',
      'Digitar só com os indicadores — dividir as teclas entre os dez dedos é mais rápido e cansa menos.',
      'Deixar as mãos "passearem" pelo teclado — depois de cada tecla, o dedo volta à fileira base.',
    ],
    shortcuts: [],
    platformNote:
      'Em teclados brasileiros (padrão **ABNT2**), a fileira base termina em **Ç**; em teclados americanos (padrão US), no lugar do Ç fica a tecla **;**. A posição das mãos é a mesma.',
  },
  {
    id: 'mouse-acoes',
    title: 'Ações do mouse',
    category: 'sistema',
    summary:
      'O mouse tem poucas ações, e cada uma tem um papel. **Um clique** com o botão esquerdo seleciona; **clique duplo** abre arquivos e programas; **clique direito** mostra um menu de opções para aquele item; **arrastar e soltar** muda coisas de lugar; e a **roda** rola a página. No touchpad do notebook, tocar com dois dedos costuma equivaler ao clique direito.',
    example:
      'Para abrir uma foto, dê clique duplo nela. Para ver as opções (copiar, renomear, excluir), clique com o botão direito. Para guardá-la numa pasta, arraste a foto até a pasta e solte.',
    whenToUse:
      'Em qualquer uso do computador. Dominar essas ações evita aberturas acidentais e arquivos movidos sem querer.',
    commonMistakes: [
      'Dar clique duplo em links e botões de sites — na web, um clique basta; o segundo pode enviar um formulário duas vezes.',
      'Dar dois cliques devagar demais sobre um arquivo — isso ativa a renomeação em vez de abrir; aperte {{Esc}} para cancelar.',
      'Soltar um arquivo na pasta errada ao arrastar — desfaça logo com {{Ctrl+Z}}.',
      'Ter medo do clique direito — ele só mostra opções; nada acontece até você escolher uma.',
    ],
    shortcuts: [
      '{{Ctrl}} + clique / {{Cmd}} + clique no macOS — Selecionar vários itens avulsos',
      '{{Shift}} + clique — Selecionar todos os itens entre o primeiro e o último clicado',
      '{{Shift+F10}} — Abrir o menu do clique direito pelo teclado (Windows)',
    ],
    platformNote:
      'No macOS, o clique direito também sai com {{Ctrl}} + clique ou com dois dedos no trackpad. A velocidade do clique duplo e a troca de botões (para canhotos) ficam em **Configurações > Bluetooth e dispositivos > Mouse** no Windows 11 e em **Ajustes do Sistema > Mouse** ou **Trackpad** no macOS.',
  },
  {
    id: 'janelas-controles',
    title: 'Controles de janela',
    category: 'sistema',
    summary:
      'Cada programa aberto fica numa janela com três botões de controle. **Minimizar** (–) esconde a janela na barra de tarefas sem fechá-la; **Maximizar** (□) faz a janela ocupar a tela toda, e **Restaurar** volta ao tamanho anterior; **Fechar** (X) encerra a janela. Para mover, arraste a barra de título; para redimensionar, arraste as bordas ou os cantos.',
    example:
      'Você está escrevendo um texto e precisa consultar um site. Minimiza o editor, consulta o site e depois clica no ícone do editor na barra de tarefas: o texto continua lá, exatamente como estava.',
    whenToUse:
      'Sempre que trabalhar com mais de um programa ou precisar liberar a tela sem perder o que está aberto.',
    commonMistakes: [
      'Achar que minimizar fecha o programa — ele continua aberto e usando memória; para encerrar, use o X.',
      'Fechar a janela sem salvar — leia o aviso "Deseja salvar as alterações?" antes de clicar.',
      'No Mac, achar que o botão vermelho encerra o aplicativo — muitas vezes ele só fecha a janela; para sair de vez, use {{Cmd+Q}}.',
    ],
    shortcuts: [
      '{{Alt+F4}} / {{Cmd+Q}} no macOS — Fechar a janela ou o programa ativo',
      '{{Win+↑}} — Maximizar a janela (Windows)',
      '{{Win+↓}} / {{Cmd+M}} no macOS — Restaurar ou minimizar a janela',
      '{{Ctrl+W}} / {{Cmd+W}} no macOS — Fechar a janela ou aba atual (em muitos programas)',
    ],
    platformNote:
      'No Windows e na maioria dos Linux, os botões ficam no canto superior direito. No macOS, ficam à esquerda e são coloridos: vermelho fecha a janela, amarelo minimiza e verde ativa a tela cheia (pare o mouse sobre ele para ver opções de organização).',
  },
  {
    id: 'area-transferencia',
    title: 'Área de transferência',
    category: 'teclado',
    summary:
      'A área de transferência é uma memória temporária onde fica o que você **copiou** ou **recortou**, à espera de ser **colado**. Copiar mantém o original; recortar serve para mover (num texto, o trecho sai na hora; com arquivos, ele só muda de lugar quando você cola). Por padrão, ela guarda só o último item: copiar outra coisa substitui o anterior.',
    example:
      'Para levar um endereço de um e-mail até o mapa: selecione o endereço, aperte {{Ctrl+C}}, abra o mapa, clique na busca e aperte {{Ctrl+V}}. Nada de redigitar e arriscar errar um número.',
    whenToUse:
      'Para repetir ou mover textos, imagens e arquivos sem redigitar — de um documento para outro, de um site para uma mensagem ou entre pastas.',
    commonMistakes: [
      'Recortar um texto e copiar outra coisa antes de colar — o trecho recortado se perde; se acontecer, use {{Ctrl+Z}} no documento original.',
      'Achar que a área de transferência guarda vários itens — por padrão, só o último; o histórico precisa ser ativado.',
      'Colar texto de um site e trazer junto fontes e cores estranhas — use colar sem formatação.',
      'Copiar senhas e esquecê-las ali — outros programas podem ler a área de transferência; prefira um gerenciador de senhas.',
    ],
    shortcuts: [
      '{{Ctrl+C}} / {{Cmd+C}} no macOS — Copiar',
      '{{Ctrl+X}} / {{Cmd+X}} no macOS — Recortar',
      '{{Ctrl+V}} / {{Cmd+V}} no macOS — Colar',
      '{{Ctrl+Shift+V}} / {{Cmd+Option+Shift+V}} no macOS — Colar sem formatação (varia conforme o programa)',
    ],
    platformNote:
      'No celular, toque e segure sobre o texto para ver Copiar, Recortar e Colar. No Finder do macOS não existe "recortar" arquivos: copie com {{Cmd+C}} e use {{Cmd+Option+V}} para mover o item para a pasta atual.',
  },
  {
    id: 'atalho-desfazer',
    title: 'Desfazer e refazer',
    category: 'teclado',
    summary:
      '**Desfazer** volta a última ação: um texto apagado, uma formatação, um arquivo movido. **Refazer** reaplica o que você acabou de desfazer. A maioria dos programas guarda várias ações em sequência, então dá para voltar vários passos.',
    example:
      'Você apagou um parágrafo inteiro sem querer. Em vez de redigitar, aperta {{Ctrl+Z}} e ele volta. Voltou demais? {{Ctrl+Y}} refaz.',
    whenToUse:
      'Logo depois de qualquer engano — apagar, mover, formatar ou colar algo errado — e para experimentar mudanças sabendo que dá para voltar.',
    commonMistakes: [
      'Fechar o programa e esperar desfazer depois — o histórico de ações costuma se perder ao fechar o arquivo.',
      'Achar que desfazer cancela o que já foi enviado — um e-mail enviado ou um formulário submetido não voltam com {{Ctrl+Z}}.',
      'Apertar desfazer vezes demais e perder alterações boas — use refazer para avançar de novo.',
    ],
    shortcuts: [
      '{{Ctrl+Z}} / {{Cmd+Z}} no macOS — Desfazer',
      '{{Ctrl+Y}} / {{Cmd+Shift+Z}} no macOS — Refazer',
      '{{Ctrl+Shift+Z}} — Refazer em alguns programas do Windows e do Linux',
    ],
    platformNote:
      'No Explorador de Arquivos do Windows e no Finder do macOS, {{Ctrl+Z}} / {{Cmd+Z}} também desfaz a última renomeação, movimentação ou envio para a Lixeira.',
  },
  {
    id: 'arquivos-pastas',
    title: 'Arquivos e pastas',
    category: 'arquivos',
    summary:
      'Um **arquivo** é qualquer item guardado no computador: um documento, uma foto, uma música, um programa. Uma **pasta** agrupa arquivos e outras pastas (as subpastas), como as gavetas de um arquivo de escritório. Você vê e organiza tudo isso no gerenciador de arquivos: o **Explorador de Arquivos** no Windows e o **Finder** no macOS.',
    example:
      'Dentro de **Documentos**, você cria a pasta **Receitas** e, dentro dela, as subpastas **Doces** e **Salgados**. O arquivo `bolo-de-cenoura.pdf` vai para **Doces** e você o encontra em segundos.',
    whenToUse: 'Sempre que salvar, baixar, procurar ou organizar qualquer coisa no computador.',
    commonMistakes: [
      'Apagar o atalho da Área de Trabalho achando que removeu o programa ou o arquivo — o atalho (ícone com uma setinha) só aponta para o item real.',
      'Salvar tudo na Área de Trabalho ou em Downloads — crie pastas por assunto para encontrar depois.',
      'Usar nomes genéricos como "documento1" ou "novo" — dê nomes que digam o que o arquivo é.',
    ],
    shortcuts: [
      '{{Win+E}} — Abrir o Explorador de Arquivos',
      '{{Ctrl+Shift+N}} / {{Cmd+Shift+N}} no macOS — Criar uma nova pasta',
      '{{F2}} / {{Enter}} no macOS — Renomear o item selecionado',
    ],
    platformNote:
      'No Linux, o gerenciador costuma se chamar **Arquivos** (ou Nautilus, Dolphin, conforme o sistema). No Android e no iPhone, use o app **Arquivos**. No macOS, o Finder é o ícone sorridente no Dock.',
  },
  {
    id: 'caminho-arquivo',
    title: 'Caminho de um arquivo',
    category: 'arquivos',
    summary:
      'O caminho é o "endereço completo" de um arquivo: a sequência de pastas, da mais externa à mais interna, até chegar a ele. No Windows, começa pela unidade e usa barras invertidas, como `C:\\Users\\Ana\\Documents\\carta.docx`; no macOS e no Linux, usa barras normais, como `/Users/ana/Documents/carta.docx`. Dois arquivos podem ter o mesmo nome, desde que estejam em caminhos diferentes.',
    example:
      'Você baixou um boleto e não o encontra. Na lista de downloads do navegador, clica em **Mostrar na pasta** e vê o caminho `C:\\Users\\Ana\\Downloads\\boleto.pdf`: o arquivo está na pasta Downloads, dentro da pasta da usuária Ana, no disco C:.',
    whenToUse:
      'Para encontrar um arquivo "sumido", explicar a alguém onde algo está, anexar arquivos e, principalmente, ao usar o terminal.',
    commonMistakes: [
      'Achar que o nome basta para localizar o arquivo — pode haver vários "foto.jpg"; o caminho diz exatamente qual é.',
      'Misturar \\ e / — o Windows usa \\ (barra invertida); macOS, Linux e endereços de sites usam /.',
      'Mover ou renomear uma pasta e esquecer que atalhos e links para ela deixam de funcionar.',
      'No terminal, digitar caminhos com espaço sem aspas — use `cd "Área de Trabalho"`.',
    ],
    shortcuts: [
      '{{Ctrl+L}} / {{Cmd+Shift+G}} no macOS — Digitar um caminho para ir direto à pasta',
      '{{Ctrl+Shift+C}} / {{Cmd+Option+C}} no macOS — Copiar o caminho do item selecionado (Windows 11)',
    ],
    platformNote:
      'No Windows 10, segure {{Shift}}, clique com o botão direito no arquivo e escolha **Copiar como caminho**. Windows e macOS exibem algumas pastas traduzidas (Documentos, Imagens), mas no caminho o nome real pode aparecer em inglês (`Documents`, `Pictures`). No Linux, a pasta pessoal fica em `/home/seu-usuario`.',
  },
  {
    id: 'extensoes-arquivo',
    title: 'Extensões de arquivo',
    category: 'arquivos',
    summary:
      'A extensão é o final do nome do arquivo, depois do ponto, e indica o tipo dele: `.pdf` é documento para leitura, `.docx` é texto do Word, `.jpg` e `.png` são imagens, `.mp3` é áudio, `.mp4` é vídeo, `.zip` é arquivo compactado e `.exe` é programa do Windows. É pela extensão que o sistema decide com qual programa abrir o arquivo. O Windows esconde as extensões por padrão, mas vale a pena exibi-las.',
    example:
      'Chega um anexo chamado "comprovante.pdf". Com as extensões visíveis, você percebe que o nome real é `comprovante.pdf.exe`: não é um documento, é um programa disfarçado. Você não abre e apaga a mensagem.',
    whenToUse:
      'Ao abrir anexos e downloads, ao escolher o formato para salvar ou enviar algo e quando um arquivo "não abre".',
    commonMistakes: [
      'Renomear `foto.png` para `foto.jpg` achando que converteu o formato — para converter, use **Salvar como** ou **Exportar** num programa adequado.',
      'Apagar a extensão sem querer ao renomear — o arquivo deixa de abrir no programa certo; restaure o final original.',
      'Confiar no ícone para saber o tipo — ícones podem ser imitados; o que vale é a extensão real.',
      'Achar que `.exe`, `.msi`, `.bat` ou `.scr` são inofensivos — esses arquivos executam ações; só abra se souber a origem.',
    ],
    shortcuts: [],
    platformNote:
      'Para mostrar extensões: no Windows 11, Explorador > **Exibir > Mostrar > Extensões de nomes de arquivos**; no Windows 10, guia **Exibir** > marque **Extensões de nomes de arquivos**; no macOS, Finder > **Ajustes > Avançado** > **Mostrar todas as extensões**. No macOS, programas costumam vir em `.dmg`; no Android, em `.apk`.',
  },
  {
    id: 'organizacao-pastas',
    title: 'Organização de pastas',
    category: 'arquivos',
    summary:
      'Organizar é criar uma estrutura simples e previsível: poucas pastas principais por assunto (Trabalho, Finanças, Fotos), com subpastas só quando necessário. Nomes claros e datas no formato **ano-mês-dia** (2026-03-15) fazem os arquivos aparecerem em ordem cronológica. Uma rotina rápida, como esvaziar a pasta Downloads toda semana, evita a bagunça.',
    example:
      'Em vez de 200 arquivos soltos em Downloads, você cria **Documentos > Finanças > 2026** e salva as contas como `2026-03-conta-de-luz.pdf` e `2026-04-conta-de-luz.pdf`. Para achar a de abril, basta olhar a lista.',
    whenToUse:
      'Ao começar a usar um computador novo, quando a Área de Trabalho estiver cheia de ícones ou sempre que você demorar para encontrar algo.',
    commonMistakes: [
      'Criar pastas dentro de pastas dentro de pastas — mais de três ou quatro níveis vira labirinto.',
      'Usar nomes como "final", "final2" e "agora-vai" — prefira versões numeradas ou datadas (`relatorio-v3`, `2026-05-10-relatorio`).',
      'Usar a pasta Downloads como arquivo permanente — mova o que importa para a pasta certa e apague o resto.',
      'Escrever datas como 15-03-2026 no nome — na ordem alfabética os meses se embaralham; use 2026-03-15.',
    ],
    shortcuts: [
      '{{Ctrl+Shift+N}} / {{Cmd+Shift+N}} no macOS — Nova pasta',
      '{{F2}} / {{Enter}} no macOS — Renomear',
      '{{Ctrl+F}} / {{Cmd+F}} no macOS — Pesquisar na pasta',
    ],
  },
  {
    id: 'lixeira',
    title: 'Lixeira',
    category: 'arquivos',
    summary:
      'Ao excluir um arquivo do jeito normal, ele vai para a **Lixeira**, onde fica guardado até você esvaziá-la. Enquanto estiver lá, dá para **restaurá-lo** ao local original. Só depois de esvaziar a Lixeira o espaço em disco é realmente liberado.',
    example:
      'Você apagou a pasta de fotos da viagem por engano. Abre a Lixeira, clica com o botão direito na pasta e escolhe **Restaurar**: ela volta exatamente para onde estava.',
    whenToUse:
      'Ao excluir arquivos, ao recuperar algo apagado por engano e ao liberar espaço em disco (esvaziando a Lixeira depois de conferir o conteúdo).',
    commonMistakes: [
      'Achar que excluir já libera espaço — os arquivos continuam ocupando o disco até a Lixeira ser esvaziada.',
      'Esvaziar a Lixeira sem olhar o que há nela — depois disso, recuperar fica muito difícil.',
      'Achar que tudo passa pela Lixeira — no Windows, itens apagados de pendrives ou pastas de rede, com {{Shift+Delete}} ou pelo terminal (`rm`, `del`) são excluídos direto.',
    ],
    shortcuts: [
      '{{Delete}} / {{Cmd+Delete}} no macOS — Mover o item para a Lixeira',
      '{{Shift+Delete}} — Excluir permanentemente, sem passar pela Lixeira (cuidado!)',
      '{{Ctrl+Z}} / {{Cmd+Z}} no macOS — Desfazer uma exclusão recente',
    ],
    platformNote:
      'No Windows, a Lixeira fica na Área de Trabalho; no macOS, no fim do Dock. Arquivos muito grandes podem não caber na Lixeira e ser excluídos direto (o sistema avisa antes). No celular, galerias de fotos e apps de arquivos costumam ter uma lixeira própria, que se esvazia sozinha depois de cerca de 30 dias.',
  },
  // -------------------------------------------------------------------------
  // Domínio do sistema
  // -------------------------------------------------------------------------
  {
    id: 'sistema-operacional',
    title: 'Sistema operacional',
    category: 'sistema',
    summary:
      'O sistema operacional é o programa principal do aparelho: ele controla o hardware, gerencia arquivos, memória e janelas e permite que os outros programas funcionem. Nos computadores, os mais comuns são **Windows**, **macOS** e **Linux**; nos celulares, **Android** e **iOS**. Cada programa é feito para um sistema específico.',
    example:
      'Você encontra um programa de edição com versões "para Windows" e "para macOS". Antes de baixar, confere qual sistema o seu computador usa — a versão errada simplesmente não instala.',
    whenToUse:
      'Ao instalar programas, seguir tutoriais (que mudam conforme o sistema), pedir ajuda técnica e verificar se o aparelho ainda recebe atualizações.',
    commonMistakes: [
      'Confundir o navegador com o sistema — Chrome, Edge e Firefox são programas que rodam sobre o Windows, o macOS ou o Linux.',
      'Achar que todo programa roda em qualquer sistema — um `.exe` é para Windows, um `.dmg` para macOS e um `.apk` para Android.',
      'Continuar usando um sistema sem suporte — sem atualizações de segurança, ele fica cada vez mais vulnerável.',
    ],
    shortcuts: ['{{Win}} — Abrir o menu Iniciar (Windows)', '{{Cmd+Space}} — Abrir a busca Spotlight (macOS)'],
    platformNote:
      'Para ver o sistema e a versão: no Windows, aperte {{Win+R}}, digite `winver` e tecle {{Enter}}; no macOS, **menu Apple > Sobre Este Mac**. O suporte padrão ao Windows 10 terminou em outubro de 2025; o recomendado é migrar para o Windows 11 (se o computador for compatível) ou para outro sistema que ainda receba atualizações.',
  },
  {
    id: 'configuracoes-tela',
    title: 'Configurações de tela',
    category: 'configuracoes',
    summary:
      'Nas configurações de tela você ajusta como as coisas aparecem. A **resolução** é a quantidade de pontos (pixels) da imagem: use a recomendada, que deixa tudo nítido. Para aumentar letras e ícones, ajuste a **escala** (100%, 125%, 150%...). Também dá para mudar o **brilho**, ativar o **modo escuro** e a **luz noturna**, que deixa as cores mais quentes à noite.',
    example:
      'Num notebook novo, as letras parecem minúsculas. Em vez de baixar a resolução (o que deixa a imagem borrada), você aumenta a escala para 125%: tudo fica maior e continua nítido.',
    whenToUse:
      'Ao configurar um computador ou monitor novo, quando o texto estiver pequeno ou cansativo de ler e ao conectar um segundo monitor ou projetor.',
    commonMistakes: [
      'Diminuir a resolução para aumentar as letras — a imagem fica embaçada; use a escala ou o tamanho do texto.',
      'Usar brilho máximo em ambiente escuro — cansa a vista; ajuste ao ambiente ou ative o brilho automático.',
      'Achar que o segundo monitor "não funciona" quando só está no modo errado — confira se está em **Duplicar** ou **Estender**.',
    ],
    shortcuts: [
      '{{Win+P}} — Escolher Duplicar, Estender ou Somente segunda tela',
      '{{Win+Ctrl+Shift+B}} — Reiniciar o driver de vídeo quando a tela trava ou fica preta (Windows)',
      '{{Ctrl+0}} / {{Cmd+0}} no macOS — Voltar o zoom ao padrão (navegadores e muitos apps)',
    ],
    platformNote:
      'Windows 10/11: **Configurações > Sistema > Tela**. macOS: **Ajustes do Sistema > Telas**. Linux (GNOME): **Configurações > Telas**. No celular, procure **Tela** ou **Tela e Brilho** nas configurações.',
  },
  {
    id: 'acessibilidade-sistema',
    title: 'Recursos de acessibilidade',
    category: 'configuracoes',
    summary:
      'Recursos de acessibilidade adaptam o computador a cada pessoa: aumentar o texto, usar a **lupa**, aplicar temas de **alto contraste**, ouvir a tela com um **leitor de tela**, ditar texto pela voz, ver **legendas ao vivo** e facilitar o uso do teclado. Eles já vêm nos sistemas, sem custo. Servem a pessoas com deficiência e a qualquer um em situações de cansaço visual, barulho ou mãos ocupadas.',
    example:
      'Seu pai tem dificuldade para ler a tela. Em vez de comprar um monitor maior, você aumenta o tamanho do texto em **Acessibilidade > Tamanho do texto** e mostra a Lupa para os momentos de letra miúda.',
    whenToUse:
      'Quando ler, ouvir ou usar teclado e mouse for difícil ou cansativo — de forma permanente ou temporária, como depois de uma cirurgia nos olhos.',
    commonMistakes: [
      'Achar que acessibilidade é só para pessoas com deficiência — esses recursos ajudam qualquer pessoa em muitas situações.',
      'Ligar o leitor de tela sem saber desligar — use o mesmo atalho de novo ({{Win+Ctrl+Enter}} no Windows, {{Cmd+F5}} no macOS).',
      'Reduzir a resolução para enxergar melhor — prefira o tamanho do texto, a escala ou a lupa.',
    ],
    shortcuts: [
      '{{Win+U}} — Abrir as configurações de Acessibilidade (Windows)',
      '{{Win+Ctrl+Enter}} / {{Cmd+F5}} no macOS — Ligar ou desligar o leitor de tela (Narrador / VoiceOver)',
      '{{Win}} e a tecla de adição (+) — Abrir a Lupa; {{Win+Esc}} fecha (Windows)',
      '{{Win+H}} — Digitação por voz (Windows)',
      '{{Cmd+Option+F5}} — Painel de atalhos de acessibilidade (macOS)',
    ],
    platformNote:
      'Windows 11: **Configurações > Acessibilidade** (no Windows 10, **Facilidade de Acesso**). macOS: **Ajustes do Sistema > Acessibilidade**. Linux (GNOME): **Configurações > Acessibilidade**, com o leitor de tela Orca. Android: **Configurações > Acessibilidade** (TalkBack); iPhone: **Ajustes > Acessibilidade** (VoiceOver).',
  },
  {
    id: 'configuracoes-som',
    title: 'Configurações de som',
    category: 'configuracoes',
    summary:
      'O computador pode ter vários dispositivos de som: alto-falantes, fones com fio, fones Bluetooth e até o monitor ou a TV (via HDMI). O som sai pelo **dispositivo de saída** selecionado, e a voz entra pelo **dispositivo de entrada** (microfone) escolhido. Além do volume geral, cada programa tem o próprio volume no **mixer**.',
    example:
      'Você liga o notebook na TV por HDMI e o som do computador some. Ele não quebrou: a saída passou para a TV. Basta escolher de volta os alto-falantes do notebook (ou aumentar o volume da TV).',
    whenToUse:
      'Quando o som não sai, sai no lugar errado ou está baixo, e quando o microfone não é ouvido numa chamada.',
    commonMistakes: [
      'Mexer só no volume geral — confira também se o programa (navegador, app de reunião) não está mudo ou baixo no mixer.',
      'Esquecer o dispositivo de saída — o som pode estar indo para um fone Bluetooth desligado ou para um monitor sem alto-falantes.',
      'Reinstalar drivers antes de verificar o básico — mudo, volume, saída selecionada e cabo vêm primeiro.',
    ],
    shortcuts: [
      '{{Win+Ctrl+V}} — Escolher rapidamente a saída de som e abrir o mixer (Windows 11)',
      '{{Win+A}} — Configurações rápidas, com o controle de volume (Windows 11)',
    ],
    platformNote:
      'Windows 11: clique no ícone de alto-falante na barra de tarefas e na seta ao lado do volume para escolher a saída; detalhes em **Configurações > Sistema > Som**. macOS: **Central de Controle > Som** ou **Ajustes do Sistema > Som**. Linux: **Configurações > Som**. No celular e no computador, apps de chamada também precisam de permissão para usar o microfone.',
  },
  {
    id: 'notificacoes',
    title: 'Notificações e modo foco',
    category: 'configuracoes',
    summary:
      'Notificações são os avisos que aparecem no canto da tela do computador ou do celular. Você escolhe quais apps podem avisar e de que forma (com som, só na central, com ou sem prévia do conteúdo). O **modo foco** (ou **Não Perturbe**) silencia os avisos por um tempo ou em horários definidos, deixando passar só o que você permitir.',
    example:
      'Durante uma prova online, você ativa o Não Perturbe por duas horas: mensagens e redes sociais esperam, mas ligações dos contatos favoritos continuam tocando.',
    whenToUse:
      'Quando os avisos atrapalham a concentração ou o sono, em reuniões e apresentações e para impedir que sites fiquem enviando propaganda.',
    commonMistakes: [
      'Aceitar "Permitir notificações" em qualquer site — muitos usam isso para mandar propaganda e golpes; permita só nos sites que você quer acompanhar.',
      'Acreditar em notificação do navegador dizendo "vírus detectado" — alertas de segurança reais vêm do sistema ou do antivírus, não de sites.',
      'Desligar tudo, inclusive avisos importantes — prefira filtrar por app e manter os alertas de segurança e de atualização.',
      'Deixar a prévia das mensagens visível na tela bloqueada — qualquer pessoa por perto pode ler códigos e conversas.',
    ],
    shortcuts: ['{{Win+N}} — Abrir a central de notificações (Windows 11)'],
    platformNote:
      'Windows 11: **Configurações > Sistema > Notificações** (inclui **Não incomodar**); no Windows 10, o recurso se chama **Assistente de Foco**. macOS: **Ajustes do Sistema > Notificações** e **Foco**. Android: **Configurações > Notificações** e **Não perturbe**; iPhone: **Ajustes > Notificações** e **Foco**. Nos navegadores, a permissão de notificação fica nas configurações de cada site.',
  },
  {
    id: 'instalacao-programas',
    title: 'Instalação de programas',
    category: 'programas',
    summary:
      'Instalar é colocar um programa no computador para que ele possa ser usado. O jeito mais seguro é usar a **loja oficial** do sistema (Microsoft Store, App Store) ou o **site oficial** do desenvolvedor. Durante a instalação, leia cada tela: algumas tentam incluir programas extras que você não pediu.',
    example:
      'Ao instalar um leitor de PDF, uma tela traz uma caixa já marcada: "Instalar também a barra de ferramentas Turbo Busca". Você desmarca a opção antes de clicar em **Avançar** e instala só o que queria.',
    whenToUse:
      'Sempre que precisar de um programa novo — e, antes disso, para verificar se o sistema já não tem algo que resolva.',
    commonMistakes: [
      'Clicar em "Avançar" sem ler — é assim que entram barras de ferramentas, buscadores trocados e programas indesejados.',
      'Baixar de sites de "download grátis" cheios de anúncios — os botões "Baixar" muitas vezes são propaganda; vá ao site oficial.',
      'Instalar versões "crackeadas" ou "ativadores" — são uma das formas mais comuns de pegar vírus.',
      'Autorizar o pedido de administrador sem saber de onde ele veio — confira o nome do programa e do editor na janela de confirmação.',
    ],
    shortcuts: [],
    platformNote:
      'Windows: instaladores `.exe` ou `.msi`, Microsoft Store ou o comando `winget`. macOS: App Store ou arquivos `.dmg` (arraste o app para a pasta **Aplicativos**). Linux: a loja de software da distribuição ou comandos como `sudo apt install`. Android e iPhone: Google Play e App Store.',
  },
  {
    id: 'desinstalacao',
    title: 'Desinstalação de programas',
    category: 'programas',
    summary:
      'Desinstalar é remover um programa do jeito certo, pelo próprio sistema, que apaga os arquivos dele e as referências espalhadas. Apagar a pasta ou o atalho do programa **não** desinstala. Remover o que você não usa libera espaço, deixa a inicialização mais leve e reduz riscos de segurança.',
    example:
      'Um jogo que ninguém mais usa ocupa 40 GB. Em **Configurações > Aplicativos > Aplicativos instalados**, você clica nos três pontinhos ao lado dele, escolhe **Desinstalar** e confirma.',
    whenToUse:
      'Quando um programa não é mais usado, foi instalado junto com outro sem você querer, apresenta problemas ou ocupa espaço demais.',
    commonMistakes: [
      'Apagar o atalho da Área de Trabalho achando que removeu o programa — ele continua instalado.',
      'Remover itens que você não reconhece, como bibliotecas "Microsoft Visual C++" ou drivers — outros programas dependem deles; pesquise antes.',
      'Usar "desinstaladores" e "otimizadores" de procedência duvidosa — o próprio sistema faz isso com segurança.',
    ],
    shortcuts: [
      '{{Win+I}} — Abrir as Configurações (Windows)',
      '{{Win+X}} — Menu rápido com acesso a Aplicativos instalados (Windows 11)',
    ],
    platformNote:
      'Windows 11: **Configurações > Aplicativos > Aplicativos instalados**; Windows 10: **Configurações > Aplicativos > Aplicativos e recursos**. macOS: arraste o app da pasta **Aplicativos** para a Lixeira (alguns trazem desinstalador próprio). Linux: loja de software ou gerenciador de pacotes. Celular: toque e segure o ícone e escolha **Desinstalar** ou **Remover app**.',
  },
  {
    id: 'atalhos-janelas',
    title: 'Atalhos de janelas',
    category: 'teclado',
    summary:
      'Alguns atalhos do sistema poupam muitos cliques. {{Alt+Tab}} alterna entre os programas abertos; {{Win+D}} mostra a Área de Trabalho (aperte de novo para voltar); {{Win+E}} abre o Explorador de Arquivos; {{Win+Tab}} mostra todas as janelas lado a lado. A tecla {{Win}} é a que tem o logotipo do Windows.',
    example:
      'Você está com navegador, planilha e e-mail abertos. Segurando {{Alt}} e tocando {{Tab}} algumas vezes, vai direto para a planilha, sem procurar na barra de tarefas.',
    whenToUse:
      'Sempre que alternar entre programas, precisar de algo na Área de Trabalho ou quiser trabalhar com menos mouse.',
    commonMistakes: [
      'Soltar o {{Alt}} cedo demais — segure {{Alt}} e vá tocando {{Tab}} até chegar à janela desejada; só então solte.',
      'Achar que {{Win+D}} fecha os programas — ele só esconde as janelas; aperte de novo para trazê-las de volta.',
      'No Mac, tentar {{Option+Tab}} para alternar programas — lá o atalho é {{Cmd+Tab}}.',
    ],
    shortcuts: [
      '{{Alt+Tab}} / {{Cmd+Tab}} no macOS — Alternar entre programas abertos',
      '{{Win+D}} — Mostrar ou esconder a Área de Trabalho (Windows)',
      '{{Win+E}} — Abrir o Explorador de Arquivos',
      '{{Win+Tab}} / {{Ctrl+↑}} no macOS — Ver todas as janelas (Visão de Tarefas / Mission Control)',
      '{{Win+R}} — Abrir a caixa Executar',
      '{{Win+I}} — Abrir as Configurações',
    ],
    platformNote:
      'No Linux, a tecla {{Win}} costuma se chamar **Super**, e vários atalhos são parecidos ({{Alt+Tab}} alterna; {{Super}} abre a visão geral). No macOS, {{Cmd+Tab}} alterna aplicativos e o Mission Control ({{Ctrl+↑}}) mostra as janelas.',
  },
  {
    id: 'bloquear-tela',
    title: 'Bloqueio de tela',
    category: 'seguranca',
    summary:
      'Bloquear a tela protege o computador quando você se afasta: tudo continua aberto, mas só volta a ser usado com sua senha, PIN ou biometria. É diferente de desligar ou de sair da conta. O ideal é bloquear sempre que levantar e configurar um **bloqueio automático** para quando esquecer.',
    example:
      'No escritório, você vai buscar um café. Antes de levantar, aperta {{Win+L}}: o documento continua aberto, mas ninguém consegue ler seus e-mails ou mandar mensagens em seu nome.',
    whenToUse:
      'Toda vez que se afastar do computador no trabalho, na escola, na biblioteca, em casa compartilhada ou em qualquer lugar público — mesmo por "só um minutinho".',
    commonMistakes: [
      'Achar que desligar o monitor bloqueia o computador — o sistema continua desbloqueado.',
      'Deixar o bloqueio automático com tempo muito longo — de 2 a 5 minutos sem uso é uma boa medida.',
      'Usar PIN ou senha óbvios, como 1234 ou a data de nascimento — o bloqueio só protege se o código for difícil de adivinhar.',
    ],
    shortcuts: [
      '{{Win+L}} / {{Ctrl+Cmd+Q}} no macOS — Bloquear a tela',
      '{{Super+L}} — Bloquear a tela no Linux (GNOME e muitos outros ambientes)',
    ],
    platformNote:
      'Bloqueio automático: no Windows 11, **Configurações > Contas > Opções de entrada** (há também o **Bloqueio dinâmico**, que usa o celular pareado); no macOS, **Ajustes do Sistema > Tela Bloqueada**. No celular, aperte o botão lateral e ajuste o tempo em **Tela** ou **Segurança**.',
  },
  {
    id: 'captura-tela',
    title: 'Captura de tela',
    category: 'sistema',
    summary:
      'Uma captura de tela (o famoso "print") é uma imagem do que aparece na tela. Dá para capturar a tela inteira, só uma janela ou uma área escolhida. É a forma mais rápida de mostrar um erro a alguém ou guardar uma informação que está visível.',
    example:
      'Aparece uma mensagem de erro ao instalar um programa. Você aperta {{Win+Shift+S}}, seleciona a área da mensagem e cola a imagem com {{Ctrl+V}} na conversa com o suporte.',
    whenToUse:
      'Para mostrar um problema a quem vai ajudar, guardar comprovantes e confirmações e registrar instruções que aparecem na tela.',
    commonMistakes: [
      'Fotografar a tela com o celular — a imagem fica torta e com reflexos; o print sai nítido.',
      'Compartilhar prints com dados sensíveis (senhas, códigos, número do cartão, CPF) — recorte ou cubra essas partes antes de enviar.',
      'Não saber onde a imagem foi parar — {{Win+Shift+S}} copia para a área de transferência (e o Windows 11 também costuma salvar em **Imagens > Capturas de Tela**); no Mac, os prints vão para a Mesa (Área de Trabalho).',
    ],
    shortcuts: [
      '{{Win+Shift+S}} / {{Cmd+Shift+4}} no macOS — Capturar uma área escolhida',
      '{{Win+PrtScn}} / {{Cmd+Shift+3}} no macOS — Capturar a tela inteira e salvar como arquivo',
      '{{Alt+PrtScn}} — Copiar só a janela ativa (Windows)',
      '{{Cmd+Shift+5}} — Painel com opções de captura e gravação de tela (macOS)',
    ],
    platformNote:
      'No Windows 11, a tecla {{PrtScn}} sozinha costuma abrir a Ferramenta de Captura; no Linux (GNOME), também abre a ferramenta de captura. No Android, aperte **liga/desliga + diminuir volume**; no iPhone com Face ID, **botão lateral + aumentar volume**.',
  },
  {
    id: 'gerenciador-tarefas',
    title: 'Gerenciador de Tarefas',
    category: 'sistema',
    summary:
      'O Gerenciador de Tarefas mostra tudo o que está rodando no computador e quanto cada programa usa de **CPU** (processador), **memória**, **disco** e **rede**. É nele que você encerra um programa travado ("Não está respondendo") com **Finalizar tarefa** e descobre o que está deixando a máquina lenta. No macOS, o equivalente é o **Monitor de Atividade**.',
    example:
      'O editor de fotos congelou e não fecha pelo X. Você aperta {{Ctrl+Shift+Esc}}, seleciona o programa na lista, clica em **Finalizar tarefa** e, segundos depois, já pode abri-lo de novo.',
    whenToUse:
      'Quando um programa trava e não fecha, quando o computador fica lento sem motivo aparente e para ver quais apps abrem junto com o sistema.',
    commonMistakes: [
      'Finalizar processos do sistema que você não conhece — o computador pode travar ou reiniciar; mexa só nos programas que reconhece.',
      'Finalizar no primeiro segundo de lentidão — às vezes o programa só está ocupado; espere um pouco, porque finalizar descarta o que não foi salvo.',
      'Achar que todo pico de 100% de CPU é vírus — atualizações, antivírus e programas pesados causam picos normais e passageiros.',
    ],
    shortcuts: [
      '{{Ctrl+Shift+Esc}} — Abrir o Gerenciador de Tarefas (Windows)',
      '{{Ctrl+Alt+Delete}} — Tela de segurança, com opção de abrir o Gerenciador de Tarefas',
      '{{Cmd+Option+Esc}} — Forçar o encerramento de um app (macOS)',
    ],
    platformNote:
      'No macOS, abra o Monitor de Atividade pelo Spotlight ({{Cmd+Space}}). No Linux, use o **Monitor do Sistema** ou equivalente. No Windows, se você finalizar o "Windows Explorer" sem querer, a barra de tarefas some: no Gerenciador, use **Executar nova tarefa** e digite `explorer`.',
  },
  {
    id: 'multitarefa-janelas',
    title: 'Organização de janelas',
    category: 'sistema',
    summary:
      'Organizar janelas é dividir a tela para trabalhar com vários programas ao mesmo tempo. O **encaixe** (Snap) coloca uma janela em cada metade ou em cada canto da tela. As **áreas de trabalho virtuais** criam "mesas" separadas — uma para trabalho, outra para estudo — e você alterna entre elas.',
    example:
      'Para copiar dados de um PDF para uma planilha, você aperta {{Win+←}} com o PDF ativo e {{Win+→}} com a planilha: cada um ocupa metade da tela e você não precisa ficar alternando.',
    whenToUse:
      'Ao comparar documentos, copiar informações entre programas, acompanhar uma reunião enquanto anota e separar assuntos diferentes.',
    commonMistakes: [
      'Empilhar dezenas de janelas sobrepostas e se perder — encaixe as que estão em uso e minimize ou feche o resto.',
      'Achar que fechar uma área de trabalho virtual fecha os programas — as janelas dela passam para outra área de trabalho.',
      'Manter muitos programas abertos "por via das dúvidas" — cada um consome memória e pode deixar tudo lento.',
    ],
    shortcuts: [
      '{{Win+←}} / {{Win+→}} — Encaixar a janela na metade esquerda ou direita',
      '{{Win+Z}} — Layouts de ajuste (Windows 11)',
      '{{Win+Tab}} / {{Ctrl+↑}} no macOS — Ver janelas e áreas de trabalho',
      '{{Win+Ctrl+D}} — Criar uma área de trabalho virtual (Windows)',
      '{{Win+Ctrl+→}} / {{Ctrl+→}} no macOS — Ir para a próxima área de trabalho',
    ],
    platformNote:
      'No Windows 11, pare o mouse sobre o botão Maximizar para ver os layouts. No macOS, pare o mouse sobre o botão verde para colocar janelas lado a lado; as áreas de trabalho se chamam **Spaces** e ficam no Mission Control. No Linux (GNOME), arraste a janela até a borda da tela ou use {{Super+←}} / {{Super+→}}.',
  },
  {
    id: 'contas-permissoes',
    title: 'Contas e permissões',
    category: 'sistema',
    summary:
      'Cada pessoa que usa o computador deve ter a própria **conta**, com seus arquivos, configurações e senha. Contas de **administrador** podem instalar programas e mudar configurações do sistema; contas **padrão** só usam o que já está instalado. Usar uma conta padrão no dia a dia e digitar a senha de administrador só quando necessário limita o estrago de um erro ou de um vírus.',
    example:
      'Numa casa com crianças, cada filho tem uma conta padrão. Quando um jogo tenta se instalar, aparece o pedido da senha de administrador — e um adulto decide se permite.',
    whenToUse:
      'Ao configurar um computador novo ou compartilhado, quando aparecer um pedido de permissão de administrador e ao emprestar o computador para alguém.',
    commonMistakes: [
      'Toda a família usar a mesma conta — arquivos, senhas salvas e histórico ficam misturados e expostos.',
      'Clicar "Sim" em todo pedido de administrador — confira qual programa está pedindo e se foi você que iniciou a ação.',
      'Passar a senha de administrador para quem liga dizendo ser do "suporte técnico" — empresas sérias não pedem isso; desligue.',
    ],
    shortcuts: ['{{Win+L}} — Bloquear a tela para outra pessoa entrar com a conta dela (Windows)'],
    platformNote:
      'Windows 11: **Configurações > Contas > Outros usuários** (ou **Família**); a janela que pede permissão se chama **Controle de Conta de Usuário**. macOS: **Ajustes do Sistema > Usuários e Grupos**. No Linux, tarefas administrativas pedem a sua senha por meio do `sudo`.',
  },
  // -------------------------------------------------------------------------
  // Internet e segurança
  // -------------------------------------------------------------------------
  {
    id: 'navegador-basico',
    title: 'Navegador, buscador e site',
    category: 'internet',
    summary:
      'O **navegador** é o programa que abre sites (Chrome, Edge, Firefox, Safari). O **buscador** é um site que procura outros sites a partir de palavras (Google, Bing, DuckDuckGo). Um **site** é um conjunto de páginas com endereço próprio, como `exemplo.com.br`. Ou seja: você usa o navegador para entrar no buscador e encontrar sites.',
    example:
      'Para acessar o site da prefeitura, você abre o navegador e, se já sabe o endereço, digita direto na barra de endereço. Se não sabe, pesquisa no buscador e confere o endereço do resultado antes de clicar.',
    whenToUse:
      'Sempre que for usar a internet, seguir instruções como "abra o navegador" ou "pesquise" e explicar a alguém um problema com um site.',
    commonMistakes: [
      'Achar que o buscador "é a internet" — ele só indica caminhos; o conteúdo está nos sites.',
      'Clicar no primeiro resultado sem ver se é **Patrocinado** — anúncios podem imitar sites oficiais.',
      'Concluir que a internet caiu porque um site não abre — teste outro site antes.',
    ],
    shortcuts: [
      '{{Ctrl+L}} / {{Cmd+L}} no macOS — Ir para a barra de endereço',
      '{{Alt+←}} / {{Cmd+[}} no macOS — Voltar à página anterior',
      '{{F5}} / {{Cmd+R}} no macOS — Recarregar a página',
    ],
    platformNote:
      'Os navegadores funcionam de forma parecida em qualquer sistema. O Windows já vem com o Edge; o macOS e o iPhone, com o Safari; o Android, geralmente com o Chrome. Você pode escolher outro como padrão nas configurações do sistema.',
  },
  {
    id: 'url-anatomia',
    title: 'Anatomia de um endereço (URL)',
    category: 'internet',
    summary:
      'O endereço de um site (URL) tem partes. Em `https://loja.exemplo.com.br/ofertas?id=42`: `https://` é o protocolo (o "s" indica conexão criptografada), `loja` é um subdomínio, `exemplo.com.br` é o **domínio** — quem de fato responde pelo site —, `/ofertas` é o caminho da página e `?id=42` são parâmetros. Para saber de quem é o site, olhe o domínio: as palavras que vêm **imediatamente antes da primeira barra** `/`.',
    example:
      'Um link diz `https://banco-horizonte.com.br.atualiza-cadastro.top/login`. Parece o Banco Horizonte, mas o domínio real é `atualiza-cadastro.top` — o que vem logo antes da primeira barra. É golpe.',
    whenToUse:
      'Antes de digitar senhas ou dados de pagamento, ao receber links por mensagem e para conferir se você está mesmo no site oficial.',
    commonMistakes: [
      'Achar que o cadeado garante que o site é confiável — ele só indica que a conexão é criptografada; sites de golpe também usam `https`.',
      'Ler o domínio a partir da esquerda — o nome de uma marca no começo não prova nada; vale o que vem logo antes da primeira `/`.',
      'Não notar letras trocadas, como `rn` no lugar de `m` ou o número 0 no lugar da letra o.',
      'Clicar em links encurtados sem saber o destino — na dúvida, acesse o site digitando você mesmo o endereço oficial.',
    ],
    shortcuts: ['{{Ctrl+L}} / {{Cmd+L}} no macOS — Selecionar o endereço para ler ou copiar'],
    platformNote:
      'Alguns navegadores, principalmente no celular, mostram só o domínio na barra. Toque (ou clique) na barra para ver o endereço completo.',
  },
  {
    id: 'abas-navegador',
    title: 'Abas do navegador',
    category: 'navegadores',
    summary:
      'Abas permitem ter várias páginas abertas na mesma janela do navegador, cada uma numa "lingueta" no topo. Você abre, fecha e alterna entre elas sem perder o lugar. Abas podem ser **fixadas** (ficam pequenas e sempre abertas) e organizadas em **grupos**.',
    example:
      'Para comparar o preço de uma geladeira em três lojas, você abre cada loja numa aba e alterna com {{Ctrl+Tab}}. Fechou uma sem querer? {{Ctrl+Shift+T}} reabre.',
    whenToUse:
      'Ao pesquisar e comparar informações, manter ferramentas de trabalho abertas (e-mail, agenda) e consultar algo sem sair da página atual.',
    commonMistakes: [
      'Acumular dezenas de abas abertas — cada uma usa memória e deixa o computador lento; salve nos favoritos ou numa lista de leitura e feche.',
      'Achar que uma aba fechada se perdeu — {{Ctrl+Shift+T}} reabre a última, e o histórico guarda as outras.',
      'Abrir links na mesma aba e perder a página original — use o botão do meio do mouse (ou {{Ctrl}} + clique) para abrir em nova aba.',
    ],
    shortcuts: [
      '{{Ctrl+T}} / {{Cmd+T}} no macOS — Nova aba',
      '{{Ctrl+W}} / {{Cmd+W}} no macOS — Fechar a aba atual',
      '{{Ctrl+Shift+T}} / {{Cmd+Shift+T}} no macOS — Reabrir a última aba fechada',
      '{{Ctrl+Tab}} — Ir para a próxima aba (também no macOS)',
      '{{Ctrl+1}} a {{Ctrl+8}} / {{Cmd+1}} a {{Cmd+8}} no macOS — Ir direto para uma aba pela posição',
      '{{Ctrl}} + clique / {{Cmd}} + clique no macOS — Abrir o link em nova aba',
    ],
    platformNote:
      'No celular, as abas ficam num botão com um número (a quantidade de abas abertas). Para fixar ou agrupar abas no Chrome, Edge e Firefox, clique com o botão direito na aba; o Safari usa **Grupos de Abas** na barra lateral.',
  },
  {
    id: 'atalhos-navegador',
    title: 'Atalhos do navegador',
    category: 'navegadores',
    summary:
      'Os navegadores compartilham um conjunto de atalhos que agilizam a navegação: ir à barra de endereço, procurar uma palavra na página, recarregar, abrir o histórico e os downloads e abrir uma janela anônima. Eles funcionam quase igual no Chrome, no Edge e no Firefox, e no macOS trocam {{Ctrl}} por {{Cmd}}.',
    example:
      'Numa página enorme de edital, você precisa achar a data da inscrição. Aperta {{Ctrl+F}}, digita "inscrição" e o navegador destaca cada ocorrência, sem você ler tudo.',
    whenToUse:
      'No uso diário da internet, especialmente para localizar informações em páginas longas e navegar sem depender do mouse.',
    commonMistakes: [
      'Achar que a janela anônima deixa você invisível — ela só não guarda histórico e cookies no aparelho; sites, empresa e provedor ainda podem ver o acesso.',
      'Recarregar ou voltar durante um pagamento — isso pode enviar o pedido duas vezes; espere a confirmação.',
      'Ler a página inteira procurando uma palavra — {{Ctrl+F}} encontra em segundos.',
    ],
    shortcuts: [
      '{{Ctrl+F}} / {{Cmd+F}} no macOS — Localizar na página',
      '{{Ctrl+L}} / {{Cmd+L}} no macOS — Ir para a barra de endereço',
      '{{Ctrl+H}} / {{Cmd+Y}} no macOS — Abrir o histórico',
      '{{Ctrl+D}} / {{Cmd+D}} no macOS — Adicionar aos favoritos',
      '{{Ctrl+Shift+N}} / {{Cmd+Shift+N}} no macOS — Abrir janela anônima (Chrome, Edge e Safari)',
      '{{Ctrl+0}} / {{Cmd+0}} no macOS — Voltar o zoom ao tamanho normal',
    ],
    platformNote:
      'No Firefox, a janela anônima se chama **janela privativa** e abre com {{Ctrl+Shift+P}} ({{Cmd+Shift+P}} no macOS). A lista de downloads abre com {{Ctrl+J}} no Chrome e no Edge; no Safari, use {{Cmd+Option+L}}.',
  },
  {
    id: 'pesquisa-eficiente',
    title: 'Pesquisa eficiente',
    category: 'internet',
    summary:
      'Bons resultados vêm de boas palavras-chave: use os termos mais específicos e importantes, sem enfeites. Alguns operadores refinam a busca: **aspas** procuram a frase exata, o **sinal de menos** exclui uma palavra e `site:` limita a busca a um site ou tipo de site. Se o resultado não ajudar, reformule em vez de rolar página após página.',
    example:
      'O computador mostra o erro 0x80070005. Em vez de pesquisar "meu computador deu erro", você busca `"0x80070005" windows 11` e encontra explicações exatas. Para informações oficiais sobre vacinação, `calendário vacinação site:gov.br`.',
    whenToUse:
      'Sempre que procurar informações, soluções de problemas, documentos oficiais ou instruções passo a passo.',
    commonMistakes: [
      'Usar termos vagos — inclua o nome do programa, o modelo do aparelho ou a mensagem de erro exata.',
      'Clicar no primeiro resultado sem olhar — ele pode ser um anúncio (**Patrocinado**) ou um site pouco confiável.',
      'Aceitar sem conferir os resumos automáticos e respostas de IA no topo da busca — eles podem errar; abra a fonte citada.',
      'Desistir após a primeira tentativa — troque palavras por sinônimos ou tire termos desnecessários.',
    ],
    shortcuts: [
      '{{Ctrl+F}} / {{Cmd+F}} no macOS — Achar o termo dentro da página aberta',
      '{{Ctrl+L}} / {{Cmd+L}} no macOS — Ir à barra de endereço, que também pesquisa',
    ],
    platformNote:
      'Aspas, sinal de menos e `site:` funcionam nos principais buscadores, mas os resultados variam entre eles. Use `filetype:pdf` para procurar documentos em PDF.',
  },
  {
    id: 'avaliar-fontes',
    title: 'Avaliação de fontes',
    category: 'internet',
    summary:
      'Nem tudo o que está na internet é verdade. Antes de acreditar ou compartilhar, verifique **quem publicou** (é uma fonte reconhecida?), **quando** (a informação é atual?), **quais provas** são apresentadas e se **outras fontes independentes** dizem o mesmo. Títulos alarmantes, pedidos de "compartilhe antes que apaguem" e ausência de autor são sinais de alerta.',
    example:
      'Chega pelo grupo da família: "Nova taxa sobre transferências começa amanhã!". Você abre uma nova aba, procura o assunto em veículos de notícias conhecidos e no site oficial do governo e descobre que é boato antigo.',
    whenToUse:
      'Antes de compartilhar uma notícia, tomar decisões sobre saúde, dinheiro ou voto e ao usar informações em trabalhos e estudos.',
    commonMistakes: [
      'Confiar porque "todo mundo está compartilhando" — popularidade não é prova.',
      'Ler só o título — o texto pode dizer outra coisa ou nem ter relação com ele.',
      'Ignorar a data — notícias antigas circulam como se fossem de hoje.',
      'Confiar em prints, fotos e vídeos sem origem — imagens podem ser editadas ou geradas por inteligência artificial.',
    ],
    shortcuts: ['{{Ctrl+T}} / {{Cmd+T}} no macOS — Abrir uma nova aba para conferir em outra fonte'],
  },
  {
    id: 'downloads',
    title: 'Downloads',
    category: 'navegadores',
    summary:
      'Baixar (fazer download) é trazer um arquivo da internet para o seu aparelho. Por padrão, os navegadores salvam tudo na pasta **Downloads**, e a lista de downloads mostra o nome, o tamanho e a opção **Mostrar na pasta**. Antes de abrir qualquer arquivo baixado, confira o nome e a extensão: é mesmo o que você esperava?',
    example:
      'Você baixa o boletim da escola e espera um PDF. A lista de downloads mostra `boletim.pdf` — tudo certo. Se aparecesse `boletim.exe`, ou um `.zip` protegido por senha, seria sinal para não abrir.',
    whenToUse:
      'Ao baixar documentos, programas, fotos e anexos e quando não encontrar um arquivo que acabou de baixar.',
    commonMistakes: [
      'Abrir o arquivo sem conferir o tipo — um "documento" que termina em `.exe` é um programa.',
      'Clicar em botões grandes de "Download" em sites cheios de anúncios — muitos são propagandas que baixam outra coisa.',
      'Ignorar o aviso do navegador de que o arquivo é perigoso ou incomum — na dúvida, descarte.',
      'Deixar a pasta Downloads acumular por anos — mova o que importa e apague o resto.',
    ],
    shortcuts: [
      '{{Ctrl+J}} — Abrir a lista de downloads (Chrome e Edge; no macOS, {{Cmd+Shift+J}} no Chrome e {{Cmd+Option+L}} no Safari)',
    ],
    platformNote:
      'Windows e macOS: pasta **Downloads**, dentro da pasta pessoal. Android: app **Arquivos > Downloads**. iPhone: app **Arquivos > Downloads** (para o Safari). Nas configurações do navegador, dá para escolher outra pasta ou pedir que ele pergunte onde salvar a cada download.',
  },
  {
    id: 'fontes-confiaveis',
    title: 'Fontes confiáveis de programas',
    category: 'programas',
    summary:
      'Programas e apps só devem vir de fontes confiáveis: a **loja oficial** do sistema, o **site oficial** do desenvolvedor ou o gerenciador de pacotes do Linux. Sites de terceiros, links recebidos por mensagem e versões piratas são a principal porta de entrada de vírus e programas espiões. Mesmo nas lojas oficiais, confira o nome do desenvolvedor e as avaliações.',
    example:
      'Você quer instalar o editor de vídeo "Cortex". Em vez de clicar no primeiro resultado — um anúncio de `cortex-download-gratis.net` —, você procura o site oficial do desenvolvedor, confere o domínio e baixa de lá.',
    whenToUse: 'Sempre que for baixar ou instalar um programa, app, extensão ou atualização.',
    commonMistakes: [
      'Baixar programa pago "de graça" em sites de pirataria — cracks e ativadores frequentemente trazem vírus.',
      'Confiar no primeiro resultado da busca — anúncios falsos imitam páginas oficiais; confira o domínio.',
      'Instalar um app recebido por link numa mensagem ou SMS (como um arquivo `.apk`) — instale apenas pela loja oficial.',
      'Achar que estar na loja oficial basta — existem apps falsos com nomes parecidos; verifique o desenvolvedor, o número de downloads e as avaliações.',
    ],
    shortcuts: [],
    platformNote:
      'Windows: o **SmartScreen** avisa sobre programas desconhecidos — leve o aviso a sério. macOS: o **Gatekeeper** bloqueia apps de desenvolvedores não identificados; não contorne esse bloqueio para apps de origem duvidosa. Android: mantenha desativada a opção de **instalar apps desconhecidos**. Linux: prefira os repositórios da distribuição.',
  },
  {
    id: 'senhas-fortes',
    title: 'Senhas fortes',
    category: 'seguranca',
    summary:
      'Uma senha forte é **longa**, **única** e **difícil de adivinhar**. O comprimento conta mais do que símbolos: uma frase-senha com quatro ou mais palavras aleatórias, somando pelo menos 15 caracteres, é forte e fácil de lembrar. E cada serviço deve ter uma senha diferente, para que um vazamento não abra todas as suas contas.',
    example:
      'Em vez de `Maria1985!`, que mistura nome e ano de nascimento, uma frase-senha como `girafa-tijolo-nuvem-pandeiro` é muito mais difícil de quebrar e fácil de memorizar (só não use exatamente esta!).',
    whenToUse:
      'Ao criar qualquer conta, ao trocar senhas antigas e quando souber que um serviço que você usa sofreu vazamento.',
    commonMistakes: [
      'Reutilizar a mesma senha em vários sites — se um vazar, criminosos testam a mesma senha em todos os outros.',
      'Usar dados pessoais (nome, data de nascimento, nome do pet, time) — são fáceis de descobrir nas redes sociais.',
      'Trocar só um número no final (`Senha1` → `Senha2`) — esse padrão é um dos primeiros que os criminosos testam.',
      'Anotar senhas num papel colado no monitor ou num arquivo "senhas.txt" — use um gerenciador de senhas.',
    ],
    shortcuts: [],
  },
  {
    id: 'gerenciador-senhas',
    title: 'Gerenciador de senhas',
    category: 'seguranca',
    summary:
      'Um gerenciador de senhas é um cofre digital criptografado que guarda todas as suas senhas, protegido por uma única **senha mestra**. Ele cria senhas fortes e diferentes para cada site e as preenche automaticamente — você só precisa lembrar de uma. Navegadores e sistemas já trazem um gerenciador, e também existem apps dedicados.',
    example:
      'Ao criar conta numa loja online, o gerenciador sugere uma senha como `T7#qv9!Lm2@xR4p` e a guarda. Na próxima visita, preenche sozinho. Se um dia ele não oferecer o preenchimento no que parece ser o site da loja, desconfie: o endereço pode ser falso.',
    whenToUse:
      'Assim que você tiver mais contas do que senhas que consegue lembrar com segurança — ou seja, para praticamente todo mundo.',
    commonMistakes: [
      'Usar uma senha mestra fraca ou repetida — ela protege todas as outras; crie uma frase-senha longa e exclusiva.',
      'Não ativar a verificação em duas etapas no próprio gerenciador — ela protege o cofre mesmo que a senha mestra vaze.',
      'Não guardar o código ou kit de recuperação — se esquecer a senha mestra, você pode perder o acesso ao cofre.',
      'Achar que guardar tudo num só lugar é mais arriscado do que repetir senhas — repetir senhas é muito mais perigoso.',
    ],
    shortcuts: [],
    platformNote:
      'O Chrome e o Edge têm gerenciadores embutidos; em aparelhos Apple, use o app **Senhas** (em versões antigas, as Chaves do iCloud). Muitos serviços já aceitam **chaves de acesso (passkeys)**, que trocam a senha pelo desbloqueio do aparelho e resistem a sites falsos — os gerenciadores também guardam essas chaves.',
  },
  {
    id: 'autenticacao-multifator',
    title: 'Autenticação em dois fatores',
    category: 'seguranca',
    summary:
      'A verificação em duas etapas (2FA) pede, além da senha, uma segunda prova de que é você — normalmente algo que você tem, como o celular. Assim, mesmo que alguém descubra sua senha, não consegue entrar. O melhor é usar um **app autenticador** (que gera códigos que mudam a cada 30 segundos), uma chave de acesso ou uma chave de segurança; o código por **SMS** é melhor do que nada, mas pode ser desviado com a clonagem do chip.',
    example:
      'Você ativa a verificação em duas etapas no e-mail usando um app autenticador. Meses depois, sua senha vaza num site antigo, mas o invasor para na tela do código: sem o seu celular, não entra.',
    whenToUse:
      'Em todas as contas importantes: e-mail (que recupera as outras), banco, redes sociais, mensageiros, nuvem e o próprio gerenciador de senhas.',
    commonMistakes: [
      'Informar o código a alguém por telefone ou mensagem — nenhuma empresa séria pede; quem pede está tentando invadir sua conta.',
      'Aprovar uma notificação de login que você não iniciou — recuse e troque a senha, pois alguém já sabe qual é.',
      'Não guardar os códigos de recuperação — se perder ou trocar de celular, você pode ficar sem acesso à conta.',
      'Achar que SMS é tão seguro quanto um app autenticador — prefira o app ou a chave de acesso quando o serviço oferecer.',
    ],
    shortcuts: [],
    platformNote:
      'A opção costuma ficar em **Configurações > Segurança > Verificação em duas etapas** de cada serviço. Antes de trocar de celular, transfira as contas do app autenticador (ou confirme que ele tem backup). Nos mensageiros, ative o PIN de confirmação em duas etapas, que dificulta a clonagem da conta.',
  },
  {
    id: 'phishing',
    title: 'Phishing',
    category: 'seguranca',
    summary:
      'Phishing é a mensagem falsa que finge ser de um banco, loja, órgão público ou conhecido para fazer você clicar num link, entregar senhas e códigos ou pagar algo. Chega por e-mail, SMS, aplicativo de mensagens ou ligação. Os sinais clássicos são **urgência** ("sua conta será bloqueada hoje"), **ameaça ou prêmio**, **remetente ou endereço estranho** e **pedido de dados ou códigos**.',
    example:
      'SMS: "Banco Horizonte: compra de R$ 2.890 aprovada. Não reconhece? Cancele em hrz-seguranca.top". O domínio não é o do banco e a mensagem quer causar pânico. Você não clica: abre o app oficial do banco e vê que não houve compra nenhuma.',
    whenToUse:
      'Sempre que receber uma mensagem pedindo ação rápida, dados pessoais, senha, código ou pagamento, ou para clicar num link ou abrir um anexo.',
    commonMistakes: [
      'Confiar porque a mensagem tem logotipo, nome da empresa ou até seus dados — golpistas copiam tudo isso facilmente.',
      'Clicar "só para ver" — o link pode levar a uma página falsa ou baixar um programa malicioso; vá ao site ou app oficial por conta própria.',
      'Ligar para o telefone que veio na mensagem — use o número do verso do cartão ou do site oficial.',
      'Achar que, depois de cair, não há o que fazer — troque a senha pelo site oficial, avise o banco pelos canais oficiais e ative a verificação em duas etapas.',
    ],
    shortcuts: [],
    platformNote:
      'No computador, pare o mouse sobre o link (sem clicar) para ver o destino real no canto inferior da janela. No celular, toque e segure o link para ver o endereço sem abri-lo. E-mails e apps de mensagem têm as opções **Denunciar** ou **Marcar como spam**.',
  },
  {
    id: 'permissoes-apps',
    title: 'Permissões de aplicativos',
    category: 'seguranca',
    summary:
      'Apps e sites pedem permissão para usar recursos sensíveis: câmera, microfone, localização, contatos, fotos, notificações. A regra é dar **só o necessário para a função** e, quando possível, **só durante o uso**. Você pode rever e retirar permissões a qualquer momento nas configurações.',
    example:
      'Um app de lanterna pede acesso aos contatos e à localização. Uma lanterna não precisa disso: você nega e, se o app insistir, desinstala e procura outro.',
    whenToUse:
      'Ao instalar um app, quando surgir um pedido de permissão e numa revisão periódica (a cada poucos meses) das permissões do celular e do computador.',
    commonMistakes: [
      'Tocar "Permitir" em tudo para o aviso sumir — leia o que está sendo pedido e pense se faz sentido para aquele app.',
      'Dar localização "sempre" a apps que só precisam dela durante o uso, como mapas e entrega de comida.',
      'Conceder a permissão de **Acessibilidade** do Android a um app desconhecido — ela permite controlar o celular e é muito usada em golpes.',
      'Nunca revisar as permissões — apps antigos podem manter acessos que você nem lembra que deu.',
    ],
    shortcuts: [],
    platformNote:
      'Android: **Configurações > Segurança e privacidade > Gerenciador de permissões** (o caminho varia por fabricante). iPhone: **Ajustes > Privacidade e Segurança**. Windows 11: **Configurações > Privacidade e segurança**. macOS: **Ajustes do Sistema > Privacidade e Segurança**. No navegador, clique no ícone à esquerda do endereço para ver as permissões do site.',
  },
  {
    id: 'wifi-publico',
    title: 'Redes Wi-Fi públicas',
    category: 'seguranca',
    summary:
      'Redes Wi-Fi de cafés, aeroportos e shoppings são práticas, mas compartilhadas com desconhecidos. Um golpista pode criar uma rede falsa com nome parecido para espionar quem se conecta. Hoje a maioria dos sites usa `https`, o que protege bastante o conteúdo, mas para banco e compras o mais seguro é usar os **dados móveis** do celular.',
    example:
      'No aeroporto aparecem as redes "Aeroporto_Gratis" e "Aeroporto-Free-WiFi". Você confirma no balcão de informações qual é a oficial, lê notícias e deixa o app do banco para quando estiver nos dados móveis.',
    whenToUse: 'Sempre que for se conectar a uma rede que não é a da sua casa ou do seu trabalho.',
    commonMistakes: [
      'Conectar em qualquer rede com "grátis" no nome — confirme o nome exato com o estabelecimento.',
      'Deixar o aparelho entrar sozinho em redes abertas — desative a conexão automática e "esqueça" a rede depois de usar.',
      'Ignorar avisos de certificado do navegador ("sua conexão não é particular") — numa rede pública, isso pode ser um ataque; não continue.',
      'Fazer pagamentos e acessar o banco na rede pública — prefira os dados móveis.',
    ],
    shortcuts: [],
    platformNote:
      'No Windows, defina o perfil da rede como **Pública** (**Configurações > Rede e Internet > Wi-Fi** > nome da rede): isso esconde seu computador dos outros aparelhos. No celular e no macOS, use **Esquecer esta rede** depois de usar. Uma VPN de um provedor confiável acrescenta proteção.',
  },
  {
    id: 'dados-pessoais',
    title: 'Proteção de dados pessoais',
    category: 'seguranca',
    summary:
      'Dados pessoais são informações que identificam você: nome completo, CPF, RG, endereço, telefone, data de nascimento, fotos, localização. Com poucos deles, golpistas abrem contas, fazem compras ou aplicam golpes em seu nome. Compartilhe só o necessário — e saiba que, no Brasil, a **LGPD** (Lei Geral de Proteção de Dados) garante o direito de saber quais dados uma empresa tem sobre você e de pedir correção ou exclusão.',
    example:
      'Empolgado com a viagem, você quase posta a foto do cartão de embarque. Mas o código de barras e o código da reserva permitem que estranhos acessem e alterem sua reserva. Você posta a foto da paisagem.',
    whenToUse:
      'Ao preencher cadastros, postar em redes sociais, enviar documentos por mensagem e responder a questionários "divertidos" na internet.',
    commonMistakes: [
      'Postar fotos de documentos, cartões, cartão de embarque ou crachá — eles carregam dados que facilitam fraudes.',
      'Responder a brincadeiras como "seu nome artístico é o nome do seu primeiro pet + a rua onde você cresceu" — são respostas típicas de perguntas de segurança.',
      'Enviar foto de RG ou CPF a quem pede por mensagem — confirme por outro canal quem está pedindo e por quê.',
      'Deixar o perfil das redes sociais público com data de nascimento, escola e endereço — revise quem pode ver cada informação.',
    ],
    shortcuts: [],
  },
  {
    id: 'extensoes-navegador',
    title: 'Extensões do navegador',
    category: 'navegadores',
    summary:
      'Extensões são pequenos programas que adicionam funções ao navegador, como bloquear anúncios, traduzir páginas ou preencher senhas. Muitas pedem permissões amplas, como **"ler e alterar todos os seus dados nos sites"** — o que inclui senhas e mensagens. Por isso, instale poucas, só da loja oficial do navegador e de desenvolvedores confiáveis, e remova as que não usa.',
    example:
      'Um site de filmes diz que você precisa instalar a extensão "Player HD Turbo" para assistir. Você desconfia: extensões exigidas por sites duvidosos costumam espionar a navegação ou injetar anúncios. Fecha a página.',
    whenToUse: 'Antes de instalar qualquer extensão e numa revisão periódica das extensões já instaladas.',
    commonMistakes: [
      'Instalar extensões pedidas por pop-ups ou sites para "liberar" um vídeo ou download.',
      'Não ler as permissões pedidas — se uma calculadora quer acesso a todos os sites, algo está errado.',
      'Acumular extensões esquecidas — cada uma é um risco e deixa o navegador mais lento; algumas são vendidas e passam a agir mal depois de uma atualização.',
    ],
    shortcuts: ['{{Ctrl+Shift+A}} / {{Cmd+Shift+A}} no macOS — Abrir os complementos no Firefox'],
    platformNote:
      'Chrome: menu **⋮ > Extensões > Gerenciar extensões** (ou `chrome://extensions`). Edge: `edge://extensions`. Firefox: `about:addons`. Safari: **Ajustes > Extensões**. No celular, a maioria dos navegadores não aceita extensões ou aceita poucas.',
  },
  {
    id: 'atualizacoes',
    title: 'Atualizações de software',
    category: 'seguranca',
    summary:
      'Atualizações corrigem falhas de segurança, resolvem erros e trazem melhorias. Elas existem para o sistema, o navegador, os apps e até para o roteador. Mantenha as **atualizações automáticas** ligadas e reinicie quando o sistema pedir: muitos ataques exploram falhas que já têm correção, em aparelhos que ninguém atualizou.',
    example:
      'O Windows avisa que precisa reiniciar para concluir uma atualização. Em vez de adiar por semanas, você salva seus arquivos e agenda o reinício para o horário do almoço.',
    whenToUse:
      'Sempre que o sistema ou um app avisar que há atualização e, de vez em quando, verificando manualmente — principalmente o sistema e o navegador.',
    commonMistakes: [
      'Adiar atualizações indefinidamente — quanto mais tempo sem atualizar, mais falhas conhecidas ficam abertas.',
      'Atualizar por um pop-up de site ("seu navegador está desatualizado, baixe aqui") — atualizações reais vêm do próprio sistema, do app ou da loja oficial.',
      'Desligar o computador no meio de uma atualização — espere terminar, mesmo que demore.',
      'Atualizar só o sistema e esquecer navegador, apps e roteador.',
    ],
    shortcuts: ['{{Win+I}} — Abrir as Configurações para chegar ao Windows Update'],
    platformNote:
      'Windows: **Configurações > Windows Update**. macOS: **Ajustes do Sistema > Geral > Atualização de Software**. Linux: o Atualizador de Software ou comandos como `sudo apt update && sudo apt upgrade`. Android: **Configurações > Sistema > Atualização do sistema** (varia por fabricante); iPhone: **Ajustes > Geral > Atualização de Software**. O suporte padrão ao Windows 10 terminou em outubro de 2025.',
  },
  // -------------------------------------------------------------------------
  // Diagnóstico
  // -------------------------------------------------------------------------
  {
    id: 'diagnostico-metodo',
    title: 'Método de diagnóstico',
    category: 'diagnostico',
    summary:
      'Resolver problemas é investigar, não chutar. Primeiro **descreva o sintoma** com precisão (inclusive a mensagem de erro); depois pergunte **o que mudou** recentemente; comece pelas verificações **simples e reversíveis** (cabos, reiniciar, testar em outro aparelho); e **mude uma coisa por vez**, testando depois de cada mudança. Anotar o que você tentou ajuda você e quem for ajudar.',
    example:
      'A impressora "parou". Você confere: está ligada e com papel? O computador a vê? Outro computador consegue imprimir? Só o seu falha — então o problema está no seu computador, não na impressora. Você reinicia o computador, tenta de novo e resolve.',
    whenToUse:
      'Diante de qualquer problema técnico: sem internet, programa travando, som que sumiu, arquivo que não abre.',
    commonMistakes: [
      'Mudar várias coisas ao mesmo tempo — se funcionar, você não sabe o que resolveu; se piorar, não sabe o que desfazer.',
      'Começar por soluções drásticas, como formatar ou reinstalar tudo — elas devem ser o último recurso.',
      'Ignorar a mensagem de erro — ela é a melhor pista; capture a tela e pesquise o texto exato.',
      'Seguir "soluções" que mandam desativar o antivírus ou baixar programas de sites duvidosos — elas podem criar um problema maior.',
    ],
    shortcuts: [
      '{{Win+Shift+S}} / {{Cmd+Shift+4}} no macOS — Capturar a mensagem de erro para pesquisar ou pedir ajuda',
    ],
  },
  {
    id: 'wifi-ethernet',
    title: 'Wi-Fi e Ethernet',
    category: 'redes',
    summary:
      'Há dois jeitos comuns de ligar o computador à rede. O **Wi-Fi** é sem fio e prático, mas perde força com distância, paredes e interferências. O **cabo de rede (Ethernet)** é mais estável e geralmente mais rápido, ideal para computadores fixos, videochamadas importantes e jogos online. Estar conectado ao Wi-Fi não garante internet: o roteador pode estar sem conexão com a operadora.',
    example:
      'Suas reuniões online travam no quarto, longe do roteador. Você liga o notebook ao roteador com um cabo de rede e as chamadas ficam estáveis. Sem como passar cabo, chegar mais perto do roteador ou usar a rede de 5 GHz também ajuda.',
    whenToUse:
      'Ao escolher como conectar um aparelho, quando a conexão estiver instável e no começo de qualquer diagnóstico de "sem internet".',
    commonMistakes: [
      'Esquecer o modo avião ligado — ele desliga o Wi-Fi; confira isso antes de qualquer outra coisa.',
      'Achar que sinal cheio significa internet rápida — as barrinhas medem só a conexão com o roteador, não com a internet.',
      'Achar que "Conectado, sem internet" é defeito do computador — o problema pode estar no roteador ou na operadora; teste em outro aparelho.',
      'Usar sempre a rede de 2,4 GHz — ela alcança mais longe, mas a de 5 GHz costuma ser bem mais rápida perto do roteador.',
    ],
    shortcuts: ['{{Win+A}} — Configurações rápidas (Wi-Fi, Bluetooth, modo avião) no Windows 11'],
    platformNote:
      'Windows: ícone de rede na barra de tarefas e **Configurações > Rede e Internet**. macOS: ícone de Wi-Fi na barra de menus ou **Ajustes do Sistema > Wi-Fi**. Muitos notebooks finos não têm entrada para cabo de rede: use um adaptador USB para Ethernet.',
  },
  {
    id: 'armazenamento-espaco',
    title: 'Espaço de armazenamento',
    category: 'diagnostico',
    summary:
      'O armazenamento (SSD ou HD) tem capacidade limitada, medida em gigabytes (GB) ou terabytes (TB). Quando fica quase cheio, o computador fica lento, atualizações falham e programas não conseguem salvar. Libere espaço com segurança: esvazie a Lixeira, limpe a pasta Downloads, desinstale programas sem uso e mova fotos e vídeos para um HD externo ou para a nuvem.',
    example:
      'O Windows avisa "Pouco espaço em disco". Em **Configurações > Sistema > Armazenamento**, você vê que a pasta Downloads tem 30 GB de instaladores antigos e vídeos. Apaga o que não precisa, esvazia a Lixeira e recupera o espaço.',
    whenToUse:
      'Quando aparecer aviso de pouco espaço, quando uma atualização falhar por falta de espaço ou quando o computador ficar lento com o disco quase cheio.',
    commonMistakes: [
      'Apagar arquivos de pastas do sistema, como `C:\\Windows` — isso pode impedir o computador de ligar; use as ferramentas de limpeza do próprio sistema.',
      'Excluir arquivos e esquecer de esvaziar a Lixeira — o espaço só volta depois disso.',
      'Confundir armazenamento com memória RAM — liberar espaço em disco não aumenta a memória.',
      'Usar "limpadores milagrosos" de procedência duvidosa — as ferramentas do próprio sistema fazem isso com segurança.',
    ],
    shortcuts: [],
    platformNote:
      'Windows: **Configurações > Sistema > Armazenamento** (com o **Sensor de Armazenamento** e as **Recomendações de limpeza**). macOS: **Ajustes do Sistema > Geral > Armazenamento**. Android: **Configurações > Armazenamento**. iPhone: **Ajustes > Geral > Armazenamento do iPhone**. Manter de 10% a 15% do disco livre ajuda o sistema a funcionar bem.',
  },
  {
    id: 'abrir-com',
    title: 'Programa padrão e "Abrir com"',
    category: 'arquivos',
    summary:
      'Cada tipo de arquivo (cada extensão) está associado a um **programa padrão**, que abre quando você dá clique duplo. Para usar outro programa só uma vez, use **Abrir com**; para mudar de vez, altere o padrão. Quando nenhum programa instalado entende o formato, o sistema pergunta como abrir ou mostra um erro.',
    example:
      'Seus PDFs abrem num editor pesado que demora a carregar. Você clica com o botão direito num PDF, escolhe **Abrir com > Escolher outro aplicativo**, seleciona o navegador e marca **Sempre**. Pronto: os PDFs passam a abrir rapidinho.',
    whenToUse:
      'Quando um arquivo abre no programa errado, quando ele "não abre" ou quando você instalou um programa melhor para determinado tipo de arquivo.',
    commonMistakes: [
      'Achar que o arquivo está estragado quando só falta um programa compatível — confira a extensão e procure um programa confiável para ela.',
      'Mudar a extensão para "forçar" outro programa a abrir — isso não converte nada e pode piorar.',
      'Baixar "abridores universais" de sites duvidosos — prefira programas conhecidos ou a loja oficial.',
      'Marcar "Sempre" com o programa errado — dá para trocar de novo nas configurações de aplicativos padrão.',
    ],
    shortcuts: [
      '{{Alt+Enter}} / {{Cmd+I}} no macOS — Propriedades / Obter Informações do arquivo (mostra e altera o programa padrão)',
    ],
    platformNote:
      'Windows 11: clique direito > **Abrir com > Escolher outro aplicativo**; padrões em **Configurações > Aplicativos > Aplicativos padrão**. macOS: clique direito > **Abrir com**; para mudar de vez, {{Cmd+I}} > seção **Abrir com** > **Alterar Tudo**. Android e iPhone: o sistema pergunta qual app usar ou oferece **Compartilhar** / **Abrir em**.',
  },
  {
    id: 'drivers',
    title: 'Drivers',
    category: 'hardware',
    summary:
      'Drivers são pequenos programas que ensinam o sistema operacional a conversar com uma peça ou aparelho: placa de vídeo, som, Wi-Fi, impressora. Sem o driver certo, o aparelho não funciona ou funciona mal. Na maioria dos casos, o próprio sistema instala e atualiza os drivers automaticamente.',
    example:
      'Você liga uma impressora nova e ela não aparece. O Windows Update encontra e instala o driver; se não encontrasse, você baixaria do site oficial do fabricante da impressora, procurando pelo modelo exato.',
    whenToUse:
      'Quando um aparelho novo não é reconhecido, depois de reinstalar o sistema ou quando algo (som, vídeo, Wi-Fi) para de funcionar após uma atualização.',
    commonMistakes: [
      'Baixar drivers em sites de "atualizadores de drivers" — muitos trazem programas indesejados; use o Windows Update ou o site do fabricante.',
      'Achar que todo problema é de driver — no som, por exemplo, confira antes o volume, o mudo e o dispositivo de saída.',
      'Atualizar drivers que funcionam bem só por atualizar — se tudo está certo, deixe o sistema cuidar disso.',
      'Não saber voltar atrás — se um driver novo causar problema, use **Reverter driver** no Gerenciador de Dispositivos.',
    ],
    shortcuts: ['{{Win+X}} — Menu rápido com o Gerenciador de Dispositivos (Windows)'],
    platformNote:
      'Windows: **Gerenciador de Dispositivos** (itens com triângulo amarelo têm problema) e **Windows Update > Opções avançadas > Atualizações opcionais**. macOS: os drivers vêm com as atualizações do sistema e quase nunca são instalados à mão. Linux: a maioria já vem no sistema; alguns, como os de placa de vídeo, aparecem em **Drivers adicionais** (Ubuntu).',
  },
  {
    id: 'cpu-ram-armazenamento',
    title: 'CPU, RAM e armazenamento',
    category: 'hardware',
    summary:
      'Pense numa cozinha. A **CPU** (processador) é quem cozinha: faz o trabalho e os cálculos. A **RAM** (memória) é a bancada: guarda o que está em uso agora e é esvaziada quando o computador desliga. O **armazenamento** (SSD ou HD) é a despensa: guarda tudo de forma permanente, mesmo com o computador desligado.',
    example:
      'Com 30 abas abertas, um editor de fotos e uma chamada de vídeo, o notebook de 8 GB de RAM fica lento: a "bancada" está cheia e o sistema passa a usar o disco como apoio, que é bem mais lento. Fechar abas e programas parados alivia na hora.',
    whenToUse:
      'Ao comprar ou melhorar um computador, ao entender a causa de uma lentidão e ao ler os gráficos do Gerenciador de Tarefas.',
    commonMistakes: [
      'Chamar o espaço de armazenamento de "memória" — o "celular de 128 GB" fala de armazenamento; a RAM costuma ser bem menor (4, 8, 16 GB).',
      'Achar que mais armazenamento deixa o computador mais rápido — para muitas tarefas ao mesmo tempo, o que ajuda é mais RAM (e um SSD).',
      'Achar que RAM bastante ocupada é sempre um problema — o sistema aproveita a memória livre para agilizar; preocupe-se quando ela fica no limite e tudo trava.',
    ],
    shortcuts: [
      '{{Ctrl+Shift+Esc}} — Ver o uso de CPU, memória e disco no Gerenciador de Tarefas (Windows)',
    ],
    platformNote:
      'Windows: Gerenciador de Tarefas > **Desempenho**. macOS: **Monitor de Atividade** (abra pelo Spotlight, {{Cmd+Space}}). Linux: **Monitor do Sistema**. Em celulares e em muitos notebooks finos, a RAM é soldada na placa e não pode ser ampliada depois.',
  },
  {
    id: 'hdd-ssd',
    title: 'HDD e SSD',
    category: 'hardware',
    summary:
      'São os dois tipos principais de armazenamento. O **HDD** (disco rígido) grava em discos magnéticos que giram; é mais barato por GB, porém mais lento e sensível a quedas. O **SSD** usa chips de memória, sem partes móveis; é muito mais rápido, silencioso e resistente. Trocar um HDD por um SSD é uma das melhorias que mais dão vida a um computador antigo.',
    example:
      'Um notebook antigo com HDD leva três minutos para ficar pronto depois de ligar. Depois da troca por um SSD (com o sistema copiado para ele), passa a ligar em menos de 30 segundos e os programas abrem quase na hora.',
    whenToUse:
      'Ao comprar um computador, ao decidir uma melhoria para uma máquina lenta e ao escolher um disco externo para backup.',
    commonMistakes: [
      'Desfragmentar o SSD manualmente — desfragmentação é coisa de HDD; no SSD, o Windows faz sozinho a otimização adequada (TRIM).',
      'Achar que SSD dura pouco — os modernos aguentam muitos anos de uso doméstico.',
      'Dispensar o backup por ter um SSD — qualquer disco pode falhar, às vezes sem aviso.',
      'Confundir SSD com memória RAM — o SSD é armazenamento permanente.',
    ],
    shortcuts: [],
    platformNote:
      'Para saber o tipo: no Windows, Gerenciador de Tarefas > **Desempenho > Disco** (mostra SSD ou HDD) ou o app **Desfragmentar e Otimizar Unidades**. No macOS, **Informações do Sistema > Armazenamento**; os Macs atuais usam SSD. Existem SSDs SATA e NVMe; os NVMe são ainda mais rápidos.',
  },
  {
    id: 'programas-inicializacao',
    title: 'Programas de inicialização',
    category: 'diagnostico',
    summary:
      'Programas de inicialização são os que abrem sozinhos quando o computador liga. Alguns são úteis (antivírus, sincronização da nuvem, drivers de áudio e touchpad), mas muitos apps se colocam ali sem necessidade e deixam a inicialização lenta. Você pode **desativar** a abertura automática sem desinstalar o programa.',
    example:
      'O computador demora para ficar utilizável depois de ligar. No Gerenciador de Tarefas, em **Aplicativos de inicialização**, você vê um inicializador de jogos e um player de música com impacto "Alto". Desativa os dois: eles continuam instalados e abrem quando você quiser.',
    whenToUse:
      'Quando o computador demora para ficar pronto depois de ligar ou aparecem ícones e janelas que você não abriu.',
    commonMistakes: [
      'Desativar tudo da lista — mantenha o antivírus e os itens de segurança e de drivers; desative só o que você reconhece como dispensável.',
      'Confundir desativar a inicialização com desinstalar — o programa continua no computador e funciona normalmente quando aberto.',
      'Usar "otimizadores" que prometem acelerar o PC — o próprio sistema mostra e controla essa lista.',
    ],
    shortcuts: [
      '{{Ctrl+Shift+Esc}} — Gerenciador de Tarefas, seção Aplicativos de inicialização (Windows)',
    ],
    platformNote:
      'Windows 11: **Configurações > Aplicativos > Inicialização** ou Gerenciador de Tarefas > **Aplicativos de inicialização** (no Windows 10, aba **Inicializar**). macOS: **Ajustes do Sistema > Geral > Itens de Início**. Linux (GNOME): app **Ajustes** > **Aplicativos de inicialização**.',
  },
  {
    id: 'ip-dns',
    title: 'Endereço IP e DNS',
    category: 'redes',
    summary:
      'Todo aparelho conectado a uma rede tem um **endereço IP**, um número que diz para onde enviar os dados — como o endereço de uma casa. Na rede de casa, ele costuma ser algo como `192.168.0.23`, distribuído pelo roteador. Já o **DNS** é a "lista telefônica da internet": traduz nomes fáceis, como `exemplo.com.br`, nos números IP dos servidores.',
    example:
      'Nenhum site abre. No terminal, `ping 1.1.1.1` (um endereço IP na internet) responde, mas `ping exemplo.com.br` falha. Conclusão: a conexão funciona, mas os nomes não estão sendo traduzidos — o problema está no DNS.',
    whenToUse:
      'Ao diagnosticar problemas de conexão, configurar impressoras e outros aparelhos na rede e entender mensagens como "endereço DNS não encontrado".',
    commonMistakes: [
      'Achar que o IP `192.168.x.x` identifica você na internet — é um endereço da rede local, repetido em milhões de casas; para a internet, a casa toda sai pelo IP público do roteador.',
      'Achar que o IP do aparelho é fixo para sempre — em geral o roteador distribui os IPs automaticamente (DHCP), e eles podem mudar.',
      'Concluir que "a internet caiu" quando só o DNS falhou — teste um ping por IP e outro por nome para separar os dois casos.',
    ],
    shortcuts: [
      '{{Win+R}}, digite `cmd` e tecle {{Enter}} — Abrir o Prompt de Comando para usar `ipconfig`, `ping` e `nslookup`',
    ],
    platformNote:
      'Windows: `ipconfig` mostra o IP, o gateway (o roteador) e o DNS. macOS: **Ajustes do Sistema > Rede > Detalhes**, ou `ifconfig` no Terminal. Linux: `ip addr`. Os comandos `ping` e `nslookup` existem nos três; no macOS e no Linux, o `ping` continua até você apertar {{Ctrl+C}}.',
  },
  {
    id: 'roteador-modem',
    title: 'Roteador e modem',
    category: 'redes',
    summary:
      'O **modem** é o aparelho que recebe a conexão da operadora (pela fibra, pelo cabo ou pela linha telefônica) e a liga à internet. O **roteador** distribui essa conexão para os aparelhos da casa, por Wi-Fi e por cabo, criando a rede local e dando um IP a cada um. Muitas operadoras entregam um aparelho só que faz as duas funções.',
    example:
      'A internet caiu. Você olha as luzes: no aparelho da fibra, a luz **LOS** está vermelha. Isso indica problema na linha da operadora, não no seu Wi-Fi — então o certo é ligar para a operadora, e não trocar senhas ou reinstalar nada.',
    whenToUse:
      'Quando a internet cair, ao reiniciar os equipamentos, ao escolher onde posicionar o roteador e ao conversar com o suporte da operadora.',
    commonMistakes: [
      'Apertar o botão **Reset** para "reiniciar" — ele apaga todas as configurações, inclusive nome e senha do Wi-Fi; para reiniciar, desligue da tomada, espere uns 30 segundos e ligue de novo.',
      'Manter a senha padrão do painel de administração do roteador — troque por uma senha forte.',
      'Esconder o roteador dentro de armários ou atrás da TV — paredes, metal e espelhos enfraquecem o Wi-Fi; deixe-o alto e num ponto central.',
      'Achar que um roteador melhor aumenta a velocidade contratada — ele melhora a cobertura e a estabilidade, não o plano.',
    ],
    shortcuts: [],
    platformNote:
      'O painel do roteador geralmente abre no navegador pelo endereço `192.168.0.1` ou `192.168.1.1`; o endereço e o usuário padrão vêm na etiqueta do aparelho. Em casas grandes, sistemas **mesh** ou repetidores ajudam a levar o Wi-Fi mais longe.',
  },
  // -------------------------------------------------------------------------
  // Eficiência
  // -------------------------------------------------------------------------
  {
    id: 'historico-transferencia',
    title: 'Histórico da área de transferência',
    category: 'produtividade',
    summary:
      'O histórico da área de transferência guarda os últimos itens que você copiou, não só o último. Assim, dá para copiar várias coisas seguidas e depois escolher qual colar. No Windows, ele abre com {{Win+V}} e precisa ser ativado na primeira vez; itens podem ser **fixados** para ficarem sempre disponíveis.',
    example:
      'Você precisa preencher um formulário com nome, telefone e endereço que estão num documento. Copia os três, um após o outro; no formulário, aperta {{Win+V}} em cada campo e escolhe o item certo.',
    whenToUse:
      'Ao copiar várias informações de um lugar para outro, ao reutilizar textos frequentes (como uma assinatura) e para recuperar algo que você copiou minutos atrás.',
    commonMistakes: [
      'Achar que o histórico guarda para sempre — itens não fixados somem quando o computador reinicia.',
      'Deixar senhas e dados sensíveis no histórico — exclua esses itens (ou use **Limpar tudo**) e cuidado com a sincronização entre aparelhos.',
      'Apertar {{Win+V}} e achar que não funciona — na primeira vez, é preciso clicar em **Ativar**.',
    ],
    shortcuts: ['{{Win+V}} — Abrir o histórico da área de transferência (Windows 10 e 11)'],
    platformNote:
      'Windows: **Configurações > Sistema > Área de transferência**. No macOS Tahoe (26) ou mais recente, o Spotlight oferece um histórico da área de transferência; em versões anteriores, é preciso um app de terceiros. No Linux, depende do ambiente (o KDE, por exemplo, tem o Klipper). No Android, muitos teclados guardam os itens copiados.',
  },
  {
    id: 'atalhos-texto',
    title: 'Atalhos de edição de texto',
    category: 'produtividade',
    summary:
      'Alguns atalhos tornam a edição de texto muito mais rápida: selecionar tudo, pular palavra por palavra, selecionar com {{Shift}} e as setas e apagar palavras inteiras. Combinados com copiar, colar e desfazer, eles evitam arrastar o mouse com precisão milimétrica. Regra geral: {{Ctrl}} faz as setas andarem por palavras e {{Shift}} faz elas selecionarem.',
    example:
      'Você quer trocar a última frase de um parágrafo. Com o cursor no início dela, aperta {{Shift+End}} para selecionar até o fim da linha e digita a nova frase por cima. Errou uma palavra? {{Ctrl+Backspace}} apaga a palavra inteira.',
    whenToUse:
      'Ao escrever e revisar textos, e-mails, mensagens e documentos — em praticamente qualquer campo de texto.',
    commonMistakes: [
      'Achar que {{Ctrl+S}} salva em todo programa — no Microsoft Word em português, {{Ctrl+S}} é sublinhado e salvar é {{Ctrl+B}}; o menu mostra o atalho ao lado de cada comando.',
      'Selecionar arrastando o mouse e perder o ponto — clique no início e use {{Shift}} + clique no fim.',
      'Digitar com um trecho selecionado sem perceber — tudo o que está selecionado é substituído; use {{Ctrl+Z}} se acontecer.',
    ],
    shortcuts: [
      '{{Ctrl+A}} / {{Cmd+A}} no macOS — Selecionar tudo',
      '{{Ctrl+→}} / {{Option+→}} no macOS — Pular para a próxima palavra',
      '{{Ctrl+Shift+→}} / {{Option+Shift+→}} no macOS — Selecionar palavra por palavra',
      '{{Shift+End}} / {{Cmd+Shift+→}} no macOS — Selecionar até o fim da linha',
      '{{Ctrl+Backspace}} / {{Option+Delete}} no macOS — Apagar a palavra anterior',
      '{{Ctrl+Home}} / {{Cmd+↑}} no macOS — Ir para o início do texto',
      '{{Ctrl+F}} / {{Cmd+F}} no macOS — Localizar no texto',
    ],
    platformNote:
      'Clique duplo seleciona uma palavra e clique triplo, o parágrafo ou a linha, em quase todos os programas. No Word em português, negrito é {{Ctrl+N}}, itálico {{Ctrl+I}} e sublinhado {{Ctrl+S}}; no Google Docs e em muitos editores, os atalhos seguem o padrão em inglês ({{Ctrl+B}}, {{Ctrl+I}}, {{Ctrl+U}}).',
  },
  {
    id: 'digitacao-precisao',
    title: 'Precisão e ritmo na digitação',
    category: 'teclado',
    summary:
      'Na digitação, **precisão vem antes da velocidade**: cada erro custa o tempo de perceber, apagar e redigitar. Mantenha um ritmo constante, sem pressa, com os olhos na tela e os dedos voltando à fileira base. A velocidade, medida em **palavras por minuto (ppm)**, cresce naturalmente com prática curta e frequente.',
    example:
      'Ana digitava 45 ppm, mas errava uma em cada dez palavras e vivia corrigindo. Reduziu o ritmo, focou em acertar e treinou 10 minutos por dia. Em um mês, chegou a 50 ppm quase sem erros — e passou a render bem mais.',
    whenToUse:
      'Ao treinar digitação, em trabalhos com muito texto (atendimento, relatórios, programação) e sempre que perceber que corrige mais do que escreve.',
    commonMistakes: [
      'Correr e errar muito — corrigir custa mais tempo do que digitar devagar e certo.',
      'Olhar para o teclado para conferir cada tecla — confie nos relevos do F e do J e mantenha os olhos no texto.',
      'Treinar por horas de uma vez, raramente — 10 a 15 minutos por dia rendem mais.',
      'Digitar com mãos e ombros tensos — relaxe, faça pausas e cuide da postura.',
    ],
    shortcuts: ['{{Ctrl+Backspace}} / {{Option+Delete}} no macOS — Apagar a palavra inteira anterior'],
  },
  {
    id: 'ferramentas-escritorio',
    title: 'Ferramentas de escritório',
    category: 'produtividade',
    summary:
      'Os pacotes de escritório têm três ferramentas principais. O **editor de texto** (Word, Google Docs, LibreOffice Writer) serve para cartas, trabalhos e relatórios. A **planilha** (Excel, Google Planilhas, LibreOffice Calc) organiza dados em tabelas e faz cálculos automáticos com fórmulas. O **editor de apresentações** (PowerPoint, Google Apresentações, LibreOffice Impress) cria slides.',
    example:
      'Para controlar os gastos do mês, você usa uma planilha: coloca os valores na coluna B e, na última linha, digita `=SOMA(B2:B31)`. Se mudar qualquer valor, o total se atualiza sozinho — algo que um editor de texto não faria.',
    whenToUse:
      'Ao escolher o programa certo para cada tarefa: texto corrido no editor, números e listas na planilha, apresentações visuais nos slides.',
    commonMistakes: [
      'Fazer contas na calculadora e digitar o resultado na planilha — use fórmulas, que se atualizam sozinhas.',
      'Alinhar texto com a barra de espaço — use tabulação, tabelas ou os botões de alinhamento.',
      'Enviar o arquivo editável quando a pessoa só precisa ler ou imprimir — envie em PDF, que mantém a aparência em qualquer aparelho.',
      'Achar que só existem opções pagas — Google Docs, LibreOffice e as versões web do Office oferecem uso gratuito.',
    ],
    shortcuts: ['{{Ctrl+P}} / {{Cmd+P}} no macOS — Imprimir ou salvar como PDF'],
    platformNote:
      'O Microsoft Office tem versões para Windows, macOS, web e celular; o LibreOffice é gratuito para Windows, macOS e Linux; o Google Docs funciona no navegador. No Mac, o pacote da Apple (Pages, Numbers e Keynote) é gratuito. Formatos comuns: `.docx`, `.xlsx` e `.pptx` (Office) e `.odt`, `.ods` e `.odp` (LibreOffice); eles se convertem entre si, com pequenas diferenças.',
  },
  {
    id: 'salvar-como',
    title: 'Salvar e Salvar como',
    category: 'produtividade',
    summary:
      '**Salvar** grava as alterações no mesmo arquivo, substituindo a versão anterior. **Salvar como** cria um arquivo novo: você escolhe outro nome, outra pasta ou outro formato, e o original fica intacto. Na primeira vez que você salva um documento, o programa sempre pergunta o nome e o local.',
    example:
      'Você recebeu um modelo de currículo. Antes de editar, usa **Salvar como** e cria `curriculo-joao-2026.docx` na pasta Documentos. Assim, o modelo original continua limpo para a próxima vez.',
    whenToUse:
      'Salvar: o tempo todo, enquanto trabalha. Salvar como: ao começar a partir de um modelo, criar uma nova versão, guardar em outro lugar ou mudar o formato (por exemplo, para PDF).',
    commonMistakes: [
      'Editar um modelo e salvar por cima — use **Salvar como** antes de mexer.',
      'Não prestar atenção na pasta escolhida e não achar o arquivo depois — confira o local na janela de salvar.',
      'Trabalhar por horas sem salvar — salve com frequência ou ative o salvamento automático.',
      'Renomear a extensão achando que mudou o formato — escolha o formato em **Salvar como** ou **Exportar**.',
    ],
    shortcuts: [
      '{{Ctrl+S}} / {{Cmd+S}} no macOS — Salvar (no Word em português: {{Ctrl+B}})',
      '{{F12}} — Salvar como (Word, Excel e PowerPoint no Windows)',
      '{{Ctrl+Shift+S}} / {{Cmd+Shift+S}} no macOS — Salvar como (em muitos outros programas)',
    ],
    platformNote:
      'Em apps da Apple (Pages, TextEdit), o menu **Arquivo** mostra **Duplicar**; segure {{Option}} para aparecer **Salvar Como**. O Google Docs e os arquivos no OneDrive salvam automaticamente; para gerar outro formato, use **Arquivo > Fazer download** ou **Salvar uma cópia**.',
  },
  {
    id: 'arquivos-compactados',
    title: 'Arquivos compactados',
    category: 'produtividade',
    summary:
      'Compactar junta vários arquivos e pastas num único arquivo, geralmente `.zip`, que pode ficar menor e é mais fácil de enviar. Para usar o conteúdo, é preciso **extrair** (descompactar). Windows, macOS e Linux já fazem isso sem programas extras.',
    example:
      'Você precisa mandar 40 fotos de um evento por e-mail. Seleciona todas, clica com o botão direito e escolhe **Compactar para > Arquivo ZIP**. Em vez de 40 anexos, vai um só: `fotos-evento.zip`.',
    whenToUse: 'Ao enviar muitos arquivos de uma vez, arquivar projetos antigos e abrir downloads compactados.',
    commonMistakes: [
      'Abrir e editar arquivos direto dentro do `.zip` — as alterações podem não ser salvas; extraia primeiro.',
      'Esperar que fotos e vídeos encolham muito — esses formatos já são comprimidos; o ganho é pequeno.',
      'Abrir `.zip` com senha enviado por desconhecidos — golpistas usam isso para esconder vírus do antivírus.',
      'Achar que um `.zip` é backup — ele é só um pacote; um backup precisa estar em outro disco ou na nuvem.',
    ],
    shortcuts: [],
    platformNote:
      'Windows 11: clique direito > **Compactar para > Arquivo ZIP**; para abrir, **Extrair tudo**. Windows 10: **Enviar para > Pasta compactada**. Versões recentes do Windows 11 também extraem `.rar` e `.7z`. macOS: clique direito > **Comprimir**; o clique duplo extrai. Linux: clique direito > **Comprimir** ou **Extrair aqui**.',
  },
  {
    id: 'terminal-basico',
    title: 'O que é um terminal',
    category: 'comandos',
    summary:
      'O terminal (ou linha de comando) é uma janela onde você controla o computador digitando comandos em vez de clicar. Ele mostra em que pasta você está e espera um comando; ao apertar {{Enter}}, o comando é executado na hora, muitas vezes **sem pedir confirmação**. É poderoso para diagnósticos e tarefas repetitivas — e, por isso mesmo, pede atenção.',
    example:
      'Para ver o IP do computador, em vez de passar por várias telas de configuração, você abre o terminal, digita `ipconfig` e aperta {{Enter}}. A resposta aparece em um segundo.',
    whenToUse:
      'Em diagnósticos de rede, tarefas repetitivas com muitos arquivos, instruções técnicas de fontes confiáveis e pequenas automações.',
    commonMistakes: [
      'Colar comandos de fontes desconhecidas sem entender — um único comando pode apagar arquivos ou instalar programas maliciosos.',
      'Obedecer a um site que pede para apertar {{Win+R}} e colar um texto para "provar que não é robô" — isso é golpe; feche a página.',
      'Achar que abrir o terminal já é perigoso — comandos que só mostram informações, como `pwd`, `ls` e `ipconfig`, são seguros.',
      'Esquecer que no Linux e no macOS maiúsculas e minúsculas fazem diferença — `Documentos` e `documentos` são pastas diferentes.',
    ],
    shortcuts: [
      '{{Ctrl+Alt+T}} — Abrir o terminal no Ubuntu e em muitas distribuições Linux',
      '{{Tab}} — Completar nomes de arquivos e pastas',
      '{{↑}} — Recuperar comandos digitados antes',
      '{{Ctrl+C}} — Interromper o comando em execução (no terminal, sem texto selecionado, não é "copiar")',
    ],
    platformNote:
      'Windows: app **Terminal** (com PowerShell) ou Prompt de Comando — clique com o botão direito no botão Iniciar ou pesquise "Terminal". macOS: app **Terminal** (pelo Spotlight, {{Cmd+Space}}). Linux: **Terminal**. Os nomes dos comandos variam: `ls` no Linux e no macOS, `dir` no Prompt do Windows (o PowerShell aceita os dois).',
  },
  {
    id: 'navegacao-terminal',
    title: 'Navegação no terminal',
    category: 'comandos',
    summary:
      'No terminal, você está sempre "dentro" de uma pasta: o **diretório atual**. `pwd` mostra onde você está; `ls` (ou `dir`) lista o conteúdo; `cd nome-da-pasta` entra numa pasta; `cd ..` volta para a pasta de cima. Nomes com espaço precisam de aspas: `cd "Área de Trabalho"`.',
    example:
      'O terminal abre em `/Documentos` e você quer ver as fotos. Digita `cd ..` para subir, `ls` para ver as pastas, `cd Imagens` para entrar e `pwd` para confirmar: `/Imagens`.',
    whenToUse:
      'Antes de qualquer comando que mexa em arquivos — confirmar onde você está evita agir na pasta errada.',
    commonMistakes: [
      'Não conferir o diretório atual antes de agir — use `pwd` (e `ls`) antes de copiar, mover ou apagar.',
      'Esquecer as aspas em nomes com espaço — `cd Área de Trabalho` falha; use `cd "Área de Trabalho"`.',
      'Escrever `cd..` sem espaço — funciona no Prompt do Windows, mas não no Linux nem no macOS; use `cd ..`.',
      'Digitar nomes longos letra por letra — digite o começo e aperte {{Tab}} para completar.',
    ],
    shortcuts: [
      '{{Tab}} — Completar o nome da pasta ou do arquivo',
      '{{↑}} / {{↓}} — Navegar pelos comandos anteriores',
      '{{Ctrl+L}} — Limpar a tela (Linux, macOS e PowerShell; ou os comandos `clear` e `cls`)',
    ],
    platformNote:
      'No Prompt de Comando do Windows, `cd` sozinho mostra a pasta atual (como o `pwd`) e `dir` lista os arquivos; o PowerShell aceita `pwd` e `ls`. No Linux e no macOS, caminhos que começam com `/` são **absolutos** (partem da raiz); no Windows, começam pela unidade, como `C:\\`. Os demais são **relativos** à pasta atual.',
  },
  {
    id: 'terminal-arquivos',
    title: 'Arquivos pelo terminal',
    category: 'comandos',
    summary:
      'Pelo terminal dá para criar, copiar, mover e apagar arquivos com poucos comandos: `mkdir` cria pasta, `cp` (ou `copy`) copia, `mv` (ou `move`) move e também renomeia, `cat` (ou `type`) mostra o conteúdo e `rm` (ou `del`) apaga. **Atenção:** `rm` e `del` apagam de verdade, **sem passar pela Lixeira**. Confira sempre a pasta atual com `pwd` antes de apagar.',
    example:
      'Antes de editar um texto, você faz uma cópia de segurança: `cp relatorio.txt relatorio-copia.txt`. Depois organiza: `mkdir Antigos` e `mv relatorio-copia.txt Antigos`.',
    whenToUse:
      'Ao lidar com muitos arquivos de uma vez, quando não há interface gráfica disponível ou para preparar automações.',
    commonMistakes: [
      'Usar `rm` ou `del` achando que o arquivo vai para a Lixeira — não vai; ele é apagado definitivamente.',
      'Apagar com curinga (`rm *.txt`) sem conferir — rode antes `pwd` e `ls *.txt` para ver exatamente o que será apagado.',
      'Usar `>` para acrescentar texto — `echo texto > arquivo` **substitui** todo o conteúdo; para acrescentar ao final, use `>>`.',
      'Mover ou copiar para um destino que já tem um arquivo com o mesmo nome — no Linux e no macOS, ele costuma ser substituído sem aviso.',
    ],
    shortcuts: ['{{Tab}} — Completar nomes e evitar erros de digitação'],
    platformNote:
      'No Prompt do Windows, os comandos são `copy`, `move`, `del`, `type` e `rmdir`; o PowerShell também aceita `cp`, `mv`, `rm` e `cat`. `rm -r` apaga uma pasta inteira com tudo dentro — evite até ter bastante prática. No terminal do Nexo, nada afeta o seu computador de verdade.',
  },
  {
    id: 'automacao-basica',
    title: 'Automação básica',
    category: 'comandos',
    summary:
      'Automatizar é deixar o computador repetir tarefas por você. O primeiro passo são os **curingas**: `*.pdf` quer dizer "todos os arquivos que terminam em .pdf", e um único comando age em todos eles. Depois vêm os **scripts** (arquivos com uma sequência de comandos) e os **agendadores**, que executam tarefas em horários definidos.',
    example:
      'A pasta Downloads tem 60 arquivos misturados. Em vez de arrastar um por um, você digita `mkdir PDFs` e depois `mv *.pdf PDFs`: todos os PDFs vão para a nova pasta de uma vez.',
    whenToUse:
      'Quando perceber que repete a mesma sequência de ações com frequência — organizar downloads, renomear lotes de arquivos, fazer cópias periódicas.',
    commonMistakes: [
      'Testar a automação direto nos arquivos importantes — experimente antes numa cópia ou numa pasta de teste.',
      'Usar um curinga largo demais — `*` sozinho pega tudo; antes de mover ou apagar, liste com `ls` usando o mesmo padrão.',
      'Executar scripts baixados da internet sem ler e entender o que fazem — eles têm o mesmo poder que você no computador.',
      'Automatizar algo destrutivo sem ter backup — um erro repetido 100 vezes vira um problema 100 vezes maior.',
    ],
    shortcuts: [],
    platformNote:
      'Windows: scripts do PowerShell (`.ps1`) ou em lote (`.bat`) e o **Agendador de Tarefas**; por segurança, o Windows pode bloquear scripts que não reconhece. macOS: app **Atalhos** e scripts no Terminal. Linux: scripts `.sh` e o agendador `cron`. No celular, o app Atalhos (iPhone) e as rotinas do Android automatizam tarefas sem comandos.',
  },
  {
    id: 'backup',
    title: 'Backup',
    category: 'produtividade',
    summary:
      'Backup é uma **cópia de segurança** dos seus arquivos guardada em outro lugar, para recuperá-los se o computador quebrar, for roubado ou for atacado por vírus. A regra **3-2-1** é um bom guia: **3** cópias dos dados, em **2** tipos de mídia diferentes, com **1** delas fora de casa (por exemplo, na nuvem). O ideal é que o backup seja automático e testado de vez em quando.',
    example:
      'O notebook de Carla caiu e o SSD parou de funcionar. Como ela fazia backup automático semanal num HD externo e mantinha as fotos também na nuvem, comprou um disco novo e recuperou tudo em uma tarde.',
    whenToUse:
      'Agora — antes que algo aconteça. Depois, de forma contínua e automática, e sempre antes de formatar, atualizar o sistema ou levar o computador ao conserto.',
    commonMistakes: [
      'Achar que a sincronização com a nuvem é backup — se você apagar ou um vírus estragar um arquivo, a mudança se repete na nuvem; use também o histórico de versões ou um backup separado.',
      'Guardar o backup no mesmo disco do computador — se o disco falhar, as duas cópias se perdem juntas.',
      'Deixar o HD de backup sempre conectado — um vírus de sequestro de dados (ransomware) pode atingi-lo também; conecte só durante o backup.',
      'Nunca testar a restauração — de vez em quando, recupere um arquivo para ter certeza de que o backup funciona.',
    ],
    shortcuts: [],
    platformNote:
      'Windows 11: app **Backup do Windows** (para a nuvem) e **Histórico de Arquivos** (para HD externo, no Painel de Controle). macOS: **Time Machine** (**Ajustes do Sistema > Geral > Time Machine**). Linux: o app **Backups** (Déjà Dup) em muitas distribuições. Android: backup da conta Google; iPhone: **Backup do iCloud**.',
  },
  {
    id: 'nuvem-sincronizacao',
    title: 'Nuvem e sincronização',
    category: 'produtividade',
    summary:
      'A **nuvem** é um espaço de armazenamento em computadores de uma empresa, acessado pela internet (OneDrive, Google Drive, iCloud Drive, Dropbox). A **sincronização** mantém a mesma versão dos arquivos em todos os seus aparelhos: o que você altera ou apaga num deles muda nos outros. Assim, você começa um trabalho no computador e continua no celular.',
    example:
      'Você escreve um trabalho na pasta sincronizada do computador de casa. Na escola, entra na mesma conta pelo navegador e o arquivo está lá, com a última versão salva.',
    whenToUse:
      'Para acessar arquivos de vários aparelhos, compartilhar documentos com outras pessoas e ter uma camada extra de proteção contra a perda de arquivos.',
    commonMistakes: [
      'Apagar arquivos do computador para liberar espaço e perdê-los também da nuvem — use a opção **Liberar espaço** (manter só online).',
      'Compartilhar documentos sensíveis com "qualquer pessoa com o link" — compartilhe com pessoas específicas e, se possível, só para leitura.',
      'Achar que sincronização é backup completo — exclusões e arquivos danificados também sincronizam; mantenha um backup separado.',
      'Proteger a conta da nuvem só com senha — ative a verificação em duas etapas.',
    ],
    shortcuts: [],
    platformNote:
      'OneDrive (Windows): clique direito no arquivo > **Liberar espaço** ou **Sempre manter neste dispositivo**. iCloud Drive (macOS): **Remover Download**. Google Drive para computador: opção **Disponível off-line**. No celular, o app de cada serviço mostra os arquivos sem precisar baixar tudo.',
  },
];
