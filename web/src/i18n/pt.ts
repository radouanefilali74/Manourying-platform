import type { Dictionary } from './dictionary';

/**
 * Redigido por IA, ainda não revisto por um falante nativo de português — ver
 * `common.translationNotice`. Escrito em português europeu; uma variante
 * pt-BR poderia seguir o mesmo padrão mais tarde.
 */
export const pt: Dictionary = {
  common: {
    skipToContent: 'Saltar para o conteúdo',
    nav: {
      whatThisIs: 'O que é isto',
      faq: 'Perguntas frequentes',
      directive: 'Diretiva',
      privacy: 'Privacidade',
      press: 'Imprensa',
    },
    footerTagline: 'Um projeto artístico. Não afiliado a nenhum governo, religião ou marca.',
    translationNotice:
      'Esta página é uma tradução redigida por IA e ainda não foi revista por um falante nativo de português. Em caso de divergência, prevalece a versão inglesa.',
  },

  whatThisIs: {
    title: 'O que é realmente o Manourying',
    description:
      'Uma explicação em linguagem simples do projeto, do equinócio, do que a aplicação faz ao teu telefone, e do que não afirmamos.',
    eyebrow: 'Em linguagem simples',
    h1: 'O que é isto, realmente',
    intro:
      'Sem mistério aqui, de propósito. A única coisa genuinamente secreta é o texto exato da diretiva, e mesmo essa será publicada sete dias antes do equinócio, com a sua impressão digital disponível desde já. Tudo o resto está escrito abaixo.',
    sections: [
      {
        heading: 'O que acontece',
        body: 'Num instante fixo — o equinócio de setembro — todos os que têm esta aplicação emitem o mesmo som ao mesmo tempo. Quatro segundos de vogal aberta, depois o próprio nome, depois dez segundos de silêncio. Dezasseis segundos no total. Depois termina.',
      },
      {
        heading: 'Porquê o equinócio',
        body: 'Porque ninguém o escolheu. O equinócio é fixado pela mecânica orbital, acontece duas vezes por ano, e não pertence a nenhuma religião, nação ou calendário. É o único instante em que todo o planeta partilha um dia e uma noite de igual duração, e significa o mesmo em cada língua.',
      },
      {
        heading: 'O que está selado, e o que não está',
        body: 'O texto exato da diretiva é publicado sete dias antes do equinócio, em todas as línguas ao mesmo tempo. Nada mais está escondido. A impressão digital SHA-256 do texto selado é publicada agora, para que depois qualquer pessoa possa verificar que o que lhe foi dado é o que foi selado. A estrutura — tom, nome, silêncio — está escrita nesta página e não é surpresa.',
      },
      {
        heading: 'O que esta aplicação faz ao teu telefone',
        body: 'Quando armas o momento, é agendado um alarme local no teu dispositivo com a marca temporal corrigida já incorporada. Esse alarme dispara sem sinal, sem servidor e sem notificação push. Entre armar e o equinócio, esta aplicação envia exatamente duas notificações: a abertura da diretiva, e o próprio momento. Esse é todo o orçamento de notificações, de propósito.',
      },
      {
        heading: 'O microfone',
        body: 'A gravação é opcional, desativada por predefinição, e pedida separadamente. Se a ativares, o gravador capta seis segundos fixos e para-se sozinho por código. O ficheiro fica no teu telefone. Nunca é carregado a menos que o ouças e depois escolhas carregá-lo. Não existe qualquer definição de carregamento automático.',
      },
      {
        heading: 'O que não afirmamos',
        body: 'Mil milhões de vozes não moverão um sismómetro, e não dizemos o contrário. As formas de onda nesta aplicação são textura, não medições. Onde mostramos dados sísmicos reais, provêm da IRIS e da EMSC e estão rotulados como tal — mesmo quando não mostram nada.',
      },
      {
        heading: 'Porque é que o teu tempo será «errado»',
        body: 'O som viaja a 343 metros por segundo, pelo que duas pessoas a 340 metros de distância fisicamente não conseguem ouvir-se no mesmo instante. A simultaneidade global perfeita não é possível e não é o objetivo. O teu desvio em relação à média global é a coisa mais interessante que esta aplicação alguma vez te dirá sobre ti próprio.',
      },
    ],
    whoBehindHeading: 'Quem está por trás',
    whoBehindBody:
      'Um pequeno projeto independente, nem uma empresa, nem uma campanha, nem um movimento. Não vende nada, não recolhe identificadores publicitários, e não é afiliado a nenhum governo, religião ou marca. Se quiseres perguntar algo diretamente, escreve para',
    closingFine:
      'Esta página existe porque uma aplicação de contagem decrescente inexplicada que pede acesso ao microfone e ajuda a organizar ajuntamentos públicos parece, aos olhos de um cético razoável, algo diferente de um projeto artístico. Essa suspeita é justa. Aqui está a resposta.',
  },

  index: {
    title: 'Manourying',
    description:
      'No instante do equinócio de setembro, todos os que têm a aplicação emitem o mesmo som ao mesmo tempo. Dezasseis segundos, depois termina.',
    eyebrow: 'Um instante · equinócio de setembro de 2026',
    h1: 'Todos emitem o mesmo som ao mesmo tempo.',
    ledePrefix: 'Quatro segundos de vogal aberta. Depois o teu próprio nome. Depois dez segundos de silêncio. ',
    ledeSuffix: ' segundos no total, em todos os continentes ao mesmo tempo — e depois pára por seis meses.',
    ctaGetApp: 'Obter a aplicação',
    ctaWhatThisIs: 'O que é isto, realmente',
    scoreEyebrow: 'A forma que toma',
    score: [
      {
        at: '00:00',
        heading: 'Sustém uma vogal aberta — «ah»',
        detail: 'Qualquer tom que consigas alcançar confortavelmente. Se conseguires atingir 110 Hz, fá-lo. Quatro segundos. Não grites.',
      },
      {
        at: '00:04',
        heading: 'Diz o teu próprio nome. Uma vez.',
        detail: 'Em volume normal. Seja qual for o nome a que realmente respondes.',
      },
      {
        at: '00:06',
        heading: 'Depois pára.',
        detail: 'Dez segundos de silêncio, onde quer que estejas. Esta parte não é opcional — é a parte para a qual existem as gravações.',
      },
    ],
    scoreFineBefore: 'O texto exato está selado até sete dias antes. A sua impressão SHA-256 é publicada agora, para que possas verificar depois que nada mudou.',
    scoreFineLink: 'Ver a impressão digital',
    factsPitchEyebrow: 'O tom',
    factsPitchNote: 'Suficientemente baixo para que qualquer voz o alcance. Sem treino, sem língua.',
    factsInstantEyebrow: 'O instante',
    factsInstantNote: 'Fixado pela mecânica orbital, por ninguém em particular. Significa o mesmo em todo o lado.',
    factsNotifEyebrow: 'Notificações',
    factsNotifValue: 'Duas',
    factsNotifNote: 'A abertura da diretiva, e o momento em si. Esse é todo o orçamento, de propósito.',
    closingHeading: 'Porque é que o teu tempo será «errado»',
    closingBody:
      'O som viaja a 343 metros por segundo, pelo que duas pessoas a 340 metros de distância fisicamente não conseguem ouvir-se no mesmo instante. A simultaneidade global perfeita não é possível e não é o objetivo. Depois, a aplicação diz-te o teu próprio desvio em relação à média global, em milissegundos — a coisa mais interessante que ela alguma vez te dirá sobre ti próprio.',
    moreLink: 'Perguntas que as pessoas realmente fazem →',
    countdown: {
      fallback: 'O equinócio de setembro.',
      wherePrefix: 'Onde estás, são',
      whereMidnight: '— a meio da tua noite.',
      whereEarlyMorning: '— de madrugada, onde estás.',
      wherePeriod: '.',
      passed: 'O momento passou.',
      daysUntil: 'Faltam {{DAYS}} dias para o momento.',
    },
  },

  faq: {
    title: 'Manourying — Perguntas frequentes',
    description: 'Respostas diretas sobre convites, o microfone, os dados, e se isto é uma seita.',
    eyebrow: 'Perguntas',
    h1: 'O que as pessoas realmente perguntam',
    items: [
      {
        q: 'Isto é uma seita, um protesto ou uma campanha de marca?',
        a: 'Nenhuma das três. A ninguém se pede que acredite em algo, se junte a algo, se oponha a algo ou compre algo. Acontece uma vez, dura dezasseis segundos, e depois pára. Não há nenhuma organização à qual pertencer depois.',
      },
      {
        q: 'Porque é que a aplicação quer o meu microfone?',
        a: 'Não quer, a menos que actives tu próprio a gravação. A versão atual é distribuída com a captura de microfone completamente desativada — a permissão nem sequer é pedida. Quando for ativada, estará desligada por predefinição, pedida separadamente, captará seis segundos fixos, e o ficheiro ficará no teu telefone a menos que o ouças e escolhas carregá-lo.',
      },
      {
        q: 'Preciso de um convite?',
        a: 'Para reclamar um lugar, sim. Cada lugar traz três convites que não se renovam. Se chegaste sem código, podes em vez disso reservar um lugar na fila de espera, e lugares são libertados nela.',
      },
      {
        q: 'Porque é que só há três convites?',
        a: 'Um lugar que pode convidar toda a gente é uma lista de correio. Três é suficiente para chegar às pessoas junto das quais realmente te colocarias, e poucos o suficiente para que gastar um seja uma decisão.',
      },
      {
        q: 'O que acontece se eu estiver a dormir quando acontece?',
        a: 'Para uma grande parte do planeta, acontece a meio da noite, e a aplicação diz-te isso claramente quando escolhes onde vais estar. Se armares o momento, o teu telefone agenda um alarme local que dispara sem sinal e sem rede. Levantares-te ou não é contigo.',
      },
      {
        q: 'Funciona sem internet?',
        a: 'No próprio dia, totalmente. Tudo o que é necessário — a partitura, o tom de referência, a marca temporal corrigida — é armazenado no dispositivo com bastante antecedência. A aplicação é construída assumindo que os nossos servidores estarão menos disponíveis exatamente quando forem mais pedidos.',
      },
      {
        q: 'Porquê {{TONE_HZ}} Hz?',
        a: 'É suficientemente baixo para que quase qualquer voz adulta o alcance confortavelmente, e uma única nota não requer treino nem língua partilhada. Se não conseguires atingi-lo, sustém o tom que te for confortável — isso está escrito na própria diretiva.',
      },
      {
        q: 'Que dados recolhem?',
        a: 'Um lugar é um token opaco, não um nome, um email ou um número de telefone. Não há conta, nenhum identificador publicitário, e nenhuma análise de terceiros. Vê a página de privacidade para a posição completa.',
      },
      {
        q: 'Isto vai aparecer em sismómetros?',
        a: 'Não, e não afirmaremos que sim. Mil milhões de vozes não moverão um sismómetro. Redes sísmicas urbanas densas registam efetivamente atividade humana — bem documentado durante os confinamentos de 2020 — e onde mostramos esses dados, vêm da IRIS e da EMSC e estão rotulados honestamente, mesmo quando não mostram nada.',
      },
      {
        q: 'Quem paga por isto?',
        a: 'Ninguém, no sentido que importa: não há ronda de financiamento, nenhum patrocinador, e nada à venda. Se isso mudar, será dito aqui primeiro.',
      },
      {
        q: 'Algo está errado / tenho uma pergunta a que não responderam.',
        a: 'Escreve para {{CONTACT_EMAIL}}. Uma pessoa real lê isso.',
      },
    ],
  },

  privacy: {
    title: 'Manourying — Privacidade',
    description: 'O que a aplicação armazena, o que nunca recolhe, e a posição sobre gravar terceiros presentes em locais públicos.',
    eyebrow: 'Privacidade',
    h1: 'O que guardamos, e o que nos recusamos a guardar',
    lede: 'Em resumo: não há conta, nenhum nome, nenhum email, nenhum identificador publicitário, e nenhuma análise de terceiros. Nada gravado no teu telefone sai dele a menos que decidas que deve sair.',
    seatHeading: 'O que é um lugar',
    seatBody:
      'Um lugar é um token aleatório opaco armazenado no teu dispositivo. Não é derivado do teu número de telefone, do teu email, do identificador do teu dispositivo, nem de mais nada sobre ti, e não pode ser revertido para nenhum desses. Não podemos ligar dois lugares à mesma pessoa.',
    storesHeading: 'O que a aplicação armazena no teu dispositivo',
    storesItems: [
      'O teu token de lugar, no armazenamento seguro do sistema operativo.',
      'O desvio medido entre o relógio do teu telefone e a hora real.',
      'Em que fuso UTC disseste que estarias.',
      'Se armaste o momento, e o alarme local agendado.',
    ],
    storesFooter: 'Tudo isso é removido quando desinstalas a aplicação. Nada disso é um identificador pessoal.',
    neverHeading: 'O que nunca recolhemos',
    neverItems: [
      'O teu nome, endereço de email ou número de telefone.',
      'A tua localização precisa. A aplicação pergunta em que fuso UTC vais estar — uma escolha de uma lista de vinte e quatro, não uma coordenada.',
      'Identificadores publicitários, rastreamento entre aplicações, ou SDKs de análise de terceiros.',
      'A quem enviaste um convite. Enviar um código abre o teu próprio menu de partilha; o convite é gasto quando alguém o reclama, e a única coisa que te volta é uma contagem.',
    ],
    micHeading: 'O microfone, dito com precisão',
    micIntro:
      'A gravação não está de todo presente na versão atual. A permissão não é pedida e o código de captura não é distribuído. Quando for adicionado, estas são as regras a que terá de obedecer, e já estão escritas no código como um contrato que qualquer implementação tem de cumprir:',
    micItems: [
      'Pedido separadamente, com as suas próprias palavras. Armar o momento nunca é tratado como consentimento para gravar.',
      'Uma janela fixa de seis segundos, parada por código em vez de por um temporizador em que se confia que a interface respeite.',
      'Armazenado apenas no dispositivo. Não existe qualquer definição de carregamento automático que possa ser mal configurada.',
      'Nada é carregado a menos que o tenhas voltado a ouvir e depois escolhido carregá-lo.',
    ],
    bystanderHeading: 'O problema dos presentes ocasionais',
    bystanderP1:
      'Esta é a parte que merece uma resposta direta em vez de um parágrafo de frases feitas. Uma gravação de seis segundos feita numa praça pública capta as vozes de pessoas que nunca instalaram esta aplicação, nunca concordaram com nada, e não podem ser questionadas depois.',
    bystanderP2:
      'A nossa posição: as gravações ficam no dispositivo por predefinição, precisamente para que a questão nem sequer se coloque. Qualquer arquivo público de áudio captado será composto por contribuições aprovadas individualmente — uma pessoa a decidir, depois de ouvir a sua própria gravação, que essa em concreto pode ser publicada — em vez de uma agregação em massa de tudo o que os microfones captaram. Se esse padrão não puder ser cumprido para uma dada gravação, ela não entra no arquivo.',
    bystanderP3Before: 'Se acreditas que uma gravação publicada te contém e não deste o teu consentimento, escreve para',
    bystanderP3After: 'e será removida. Não tens de te justificar nem provar nada.',
    siteHeading: 'Este site',
    siteBody:
      'Não são definidos cookies e não corre qualquer análise. As fontes web são carregadas a partir da Google Fonts, o que significa que os servidores da Google veem o pedido — se isso te importa, uma extensão que bloqueie fontes não quebra nada aqui.',
    rightsHeading: 'Os teus direitos',
    rightsBefore:
      'Ao abrigo do RGPD podes perguntar o que é guardado sobre ti, pedir que seja apagado, e reclamar junto da tua autoridade nacional de controlo. Como um lugar é um token anónimo, na maioria dos casos a resposta honesta a «o que guardam sobre mim» é «nada que te identifique» — e desinstalar a aplicação apaga o resto. Para qualquer outra coisa, escreve para',
    rightsAfter: '.',
    lastUpdatedPrefix: 'Última atualização em',
    lastUpdatedSuffix: '. As alterações materiais serão datadas aqui, não editadas silenciosamente.',
    legalReviewNotice:
      'Esta tradução não recebeu revisão jurídica. A versão inglesa em /privacy prevalece em caso de divergência.',
  },

  press: {
    title: 'Manourying — Imprensa',
    description: 'Uma descrição simples do projeto, os factos que vale a pena verificar, e como contactar uma pessoa.',
    eyebrow: 'Imprensa',
    h1: 'Para quem escreve sobre isto',
    lede: 'Pega em qualquer coisa desta página e usa-a sem pedir. Se algo aqui não estiver claro ou achares que está errado, diz — uma correção antes da publicação vale mais para nós do que um artigo lisonjeiro.',
    oneParagraphHeading: 'Num parágrafo',
    quoteBefore:
      'Manourying é um projeto artístico construído à volta de um único instante. No equinócio de setembro — o momento em que todo o planeta partilha um dia e uma noite de igual duração — todos os que têm a aplicação emitem o mesmo som ao mesmo tempo: quatro segundos de vogal aberta a cerca de',
    quoteAfter:
      'Hz, depois o próprio nome, depois dez segundos de silêncio. Dezasseis segundos no total. A aplicação é apenas por convite, não faz quase nada até ao dia, e envia exatamente duas notificações nos meses anteriores. Depois acontece, e pára por seis meses.',
    factsHeading: 'Factos que vale a pena verificar',
    factInstant: 'O instante',
    factDuration: 'Duração',
    factDurationValue: '16 segundos',
    factPitch: 'Tom de referência',
    factCadence: 'Cadência',
    factCadenceValue: 'Duas vezes por ano, a cada equinócio',
    factEntry: 'Entrada',
    factEntryValue: 'Apenas por convite · três por lugar · não renovável',
    factPlatforms: 'Plataformas',
    factPlatformsValue: 'iOS e Android',
    factCost: 'Custo',
    factCostValue: 'Gratuito · nada à venda · sem publicidade',
    threeThingsHeading: 'Três coisas que não vos deixaremos imprimir',
    threeThingsIntro: 'Não porque sejam pouco lisonjeiras, mas porque são falsas, e preferimos que as ouçam de nós:',
    thingSeismic: {
      strong: 'Que será registado em sismómetros.',
      rest: 'Não será. Mil milhões de vozes não movem um sismómetro. Redes sísmicas urbanas densas mostram efetivamente assinaturas de atividade humana — bem documentado durante os confinamentos de 2020 — e essa é uma história genuinamente interessante, mas não é a mesma afirmação.',
    },
    thingSimultaneous: {
      strong: 'Que é perfeitamente simultâneo.',
      rest: 'O som viaja a 343 m/s. Duas pessoas a 340 metros de distância não conseguem ouvir-se no mesmo instante; a física proíbe-o. O projeto trata isso como a parte interessante em vez de fingir o contrário.',
    },
    thingCampaign: {
      strong: 'Que é um protesto, uma religião ou uma campanha de marca.',
      rest: 'A ninguém se pede que acredite em algo, se oponha a algo, se junte a algo ou compre algo.',
    },
    contactHeading: 'Contacto',
    contactBefore: '',
    contactAfter: '— uma pessoa real, normalmente dentro de um dia. Para verificação de factos com prazo apertado, indica isso no assunto.',
    canonicalLabel: 'Explicação canónica:',
  },

  install: {
    title: 'Manourying — Instalação',
    description: 'Onde obter a aplicação, em Android e iOS.',
    eyebrow: 'Instalação',
    h1: 'Obter a aplicação',
    lede: 'O Manourying ainda não está na App Store nem na Google Play. As versões são distribuídas diretamente, o que significa alguns toques extra e um aviso de aspeto alarmante do teu telefone.',
    platformLabel: { android: 'Android', ios: 'iOS' },
    notYet: 'Ainda não',
    installFor: 'Instalar para',
    haveCodeHeading: 'Já tens um código?',
    haveCodeBody:
      'Instala primeiro a aplicação, depois abre-a e escreve o teu código de seis caracteres no portão. Tocar num link de convite antes de a aplicação estar instalada não faz nada — é uma limitação do link, não um problema com o teu código.',
    noCodeHeading: 'Sem código?',
    noCodeBody:
      'Instala de qualquer forma e reserva um lugar na fila de espera. Cada lugar traz três convites que não se renovam, e lugares são libertados na fila à medida que ficam livres.',
    brokenBefore: 'Algo avariado?',
  },

  directive: {
    title: 'Manourying — A diretiva selada',
    description: 'A impressão digital SHA-256 da diretiva selada, publicada com antecedência para poder ser verificada depois.',
    eyebrowSealed: 'Diretiva 02 · selada',
    eyebrowOpen: 'Diretiva 02 · aberta',
    h1: 'O selo',
    lede: 'O texto exato da diretiva é publicado sete dias antes do equinócio. A sua impressão digital é publicada agora, para que depois qualquer pessoa possa verificar que o texto que lhe foi dado é o que foi selado — mesmo que não confie em nós.',
    sealEyebrow: 'SHA-256 da diretiva selada',
    copyButton: 'Copiar impressão',
    copiedLabel: 'Copiado',
    checkHeading: 'Como verificares por ti próprio',
    checkP1Before: 'Quando a diretiva abrir em',
    checkP1After: 'pega na sua forma canónica — cada passo como hora⇥título⇥detalhe, um por linha, unidos por quebras de linha, codificado em UTF-8 — e calcula a sua impressão digital:',
    checkP2: 'Se isso não produzir a string acima, algo mudou entre o selo e a revelação, e deves dizê-lo bem alto.',
    knownHeading: 'O que já é conhecido',
    knownBody:
      'A estrutura nunca foi secreta e está escrita na página principal: quatro segundos de vogal aberta, um nome dito, dez segundos de silêncio. O que está selado é o texto preciso — que palavras, em que ordem, traduzidas para todas as línguas ao mesmo tempo.',
    footerFine:
      'A mesma impressão digital é mostrada dentro da aplicação, calculada de forma independente no teu próprio dispositivo a partir da cópia distribuída no binário. Dois cálculos, um número — se alguma vez divergirem, não confies em nenhum dos dois.',
  },

  gate: {
    title: 'Manourying — O teu convite',
    description: 'Alguém gastou um convite contigo. Aqui está o que isso significa e o que fazer com ele.',
    eyebrow: 'Alguém gastou um convite contigo',
    h1: 'Um lugar no Manourying',
    codeEyebrow: 'O teu código',
    copyButton: 'Copiar código',
    copiedLabel: 'Copiado',
    codeFine: 'Escreve-o. Este link é o único lugar onde ele existe.',
    noCodeLede: 'Cada lugar traz três convites, que não se renovam — por isso, se alguém te enviou um, abdicou de um terço do que tinha.',
    invitedHeading: 'Para o que foste convidado',
    invitedBody:
      'Num instante fixo — o equinócio de setembro — todos os que têm a aplicação emitem o mesmo som ao mesmo tempo. Quatro segundos de vogal aberta, depois o teu próprio nome, depois dez segundos de silêncio. Dezasseis segundos, depois termina.',
    invitedLinkBefore: '',
    invitedLink: 'A explicação completa, em linguagem simples,',
    invitedLinkAfter: 'vale dois minutos antes de instalares seja o que for.',
    nextHeading: 'O que fazer agora',
    nextSteps: [
      'Instala a aplicação.',
      'Abre-a e insere o teu código no portão.',
      'Escolhe onde vais realmente estar, e arma o momento.',
    ],
    ctaGetApp: 'Obter a aplicação',
    footerFine:
      'Se já tens a aplicação instalada, este link deveria tê-la aberto diretamente. O facto de não o ter feito é uma limitação conhecida enquanto a verificação de links de aplicação está a ser configurada — insere o código manualmente e vai funcionar exatamente da mesma forma.',
  },

  notFound: {
    title: 'Manourying — Não encontrada',
    description: 'Essa página não existe.',
    eyebrow: '404',
    h1: 'Nada aqui.',
    lede: 'A página que pediste não existe. O que existe com certeza:',
    linkWhatThisIs: 'O que é isto, realmente',
    linkFaq: 'Perguntas que as pessoas fazem',
    linkInstall: 'Obter a aplicação',
  },
};
