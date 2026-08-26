import type { Dictionary } from './dictionary';

/** AI-drafted, not yet reviewed by a native Spanish speaker — see `common.translationNotice`. */
export const es: Dictionary = {
  common: {
    skipToContent: 'Saltar al contenido',
    nav: {
      whatThisIs: 'Qué es esto',
      faq: 'Preguntas frecuentes',
      directive: 'Directiva',
      privacy: 'Privacidad',
      press: 'Prensa',
    },
    footerTagline: 'Un proyecto artístico. No afiliado a ningún gobierno, religión o marca.',
    translationNotice:
      'Esta página es una traducción redactada por IA y aún no ha sido revisada por un hablante nativo de español. En caso de discrepancia, prevalece la versión en inglés.',
  },

  whatThisIs: {
    title: 'Qué es realmente Manourying',
    description:
      'Una explicación en lenguaje sencillo del proyecto, el equinoccio, lo que la aplicación hace en tu teléfono y lo que no afirmamos.',
    eyebrow: 'En lenguaje sencillo',
    h1: 'Qué es esto, realmente',
    intro:
      'Nada de misterio aquí, a propósito. Lo único genuinamente secreto es el texto exacto de la directiva, y hasta eso se publicará siete días antes del equinoccio, con su huella disponible desde ahora. Todo lo demás está escrito a continuación.',
    sections: [
      {
        heading: 'Qué sucede',
        body: 'En un instante fijo — el equinoccio de septiembre — todos los que tengan esta aplicación emiten el mismo sonido en el mismo momento. Cuatro segundos de vocal abierta, luego su propio nombre, luego diez segundos de silencio. Dieciséis segundos en total. Luego termina.',
      },
      {
        heading: 'Por qué el equinoccio',
        body: 'Porque nadie lo eligió. El equinoccio está fijado por la mecánica orbital, ocurre dos veces al año, y no pertenece a ninguna religión, nación o calendario. Es el único instante en que todo el planeta comparte un día y una noche de igual duración, y significa lo mismo en cada idioma.',
      },
      {
        heading: 'Qué está sellado, y qué no',
        body: 'El texto exacto de la directiva se publica siete días antes del equinoccio, en todos los idiomas a la vez. Nada más está oculto. La huella SHA-256 del texto sellado se publica ahora, para que después puedas verificar que lo que se te dio es lo que se selló. La estructura — tono, nombre, silencio — está escrita en esta página y no es una sorpresa.',
      },
      {
        heading: 'Qué le hace esta aplicación a tu teléfono',
        body: 'Cuando armas el momento, se programa una alarma local en tu dispositivo con la marca de tiempo corregida ya incorporada. Esa alarma se dispara sin señal, sin servidor y sin notificación push. Entre armar y el equinoccio, esta aplicación envía exactamente dos notificaciones: la apertura del sello de la directiva, y el momento mismo. Ese es todo el presupuesto de notificaciones, a propósito.',
      },
      {
        heading: 'El micrófono',
        body: 'La grabación es opcional, está desactivada por defecto, y se solicita por separado. Si la activas, el grabador captura seis segundos fijos y se detiene solo mediante código. El archivo permanece en tu teléfono. Nunca se sube a menos que lo escuches y luego elijas subirlo. No existe ninguna opción de subida automática.',
      },
      {
        heading: 'Lo que no afirmamos',
        body: 'Mil millones de voces no moverán un sismómetro, y no decimos lo contrario. Las formas de onda en esta aplicación son textura, no mediciones. Cuando mostramos datos sísmicos reales, provienen de IRIS y EMSC y están etiquetados como tales — incluso cuando no muestran nada en absoluto.',
      },
      {
        heading: 'Por qué tu sincronización será «incorrecta»',
        body: 'El sonido viaja a 343 metros por segundo, así que dos personas separadas por 340 metros físicamente no pueden oírse en el mismo instante. La simultaneidad global perfecta no es posible y no es el objetivo. Tu desviación respecto a la media global es lo más interesante que esta aplicación te dirá jamás sobre ti mismo.',
      },
    ],
    whoBehindHeading: 'Quién está detrás',
    whoBehindBody:
      'Un pequeño proyecto independiente, ni una empresa, ni una campaña, ni un movimiento. No vende nada, no recopila identificadores publicitarios, y no está afiliado a ningún gobierno, religión o marca. Si quieres preguntar algo directamente, escribe a',
    closingFine:
      'Esta página existe porque una aplicación de cuenta regresiva sin explicación que pide acceso al micrófono y ayuda a organizar reuniones públicas parece, a los ojos de un escéptico razonable, algo distinto de un proyecto artístico. Esa sospecha es justa. Esta es la respuesta.',
  },

  index: {
    title: 'Manourying',
    description:
      'En el instante del equinoccio de septiembre, todos los que tienen la aplicación emiten el mismo sonido al mismo tiempo. Dieciséis segundos, y luego termina.',
    eyebrow: 'Un instante · equinoccio de septiembre de 2026',
    h1: 'Todos emiten el mismo sonido al mismo tiempo.',
    ledePrefix: 'Cuatro segundos de vocal abierta. Luego tu propio nombre. Luego diez segundos de silencio. ',
    ledeSuffix: ' segundos en total, en cada continente a la vez — y luego termina durante seis meses.',
    ctaGetApp: 'Obtener la aplicación',
    ctaWhatThisIs: 'Qué es esto realmente',
    scoreEyebrow: 'La forma que toma',
    score: [
      {
        at: '00:00',
        heading: 'Sostén una vocal abierta — «ah»',
        detail: 'Cualquier tono que puedas alcanzar cómodamente. Si puedes igualar 110 Hz, hazlo. Cuatro segundos. No grites.',
      },
      {
        at: '00:04',
        heading: 'Di tu propio nombre. Una vez.',
        detail: 'A volumen normal. El nombre al que realmente respondes.',
      },
      {
        at: '00:06',
        heading: 'Luego detente.',
        detail: 'Diez segundos de silencio, dondequiera que estés. Esta parte no es opcional — es la parte para la que existen las grabaciones.',
      },
    ],
    scoreFineBefore:
      'El texto exacto está sellado hasta siete días antes. Su SHA-256 se publica ahora, para que puedas verificar después que nada cambió.',
    scoreFineLink: 'Ver la huella',
    factsPitchEyebrow: 'El tono',
    factsPitchNote: 'Suficientemente bajo para que cualquier voz lo alcance. Sin entrenamiento, sin idioma.',
    factsInstantEyebrow: 'El instante',
    factsInstantNote: 'Fijado por la mecánica orbital, no por nadie. Significa lo mismo en todas partes.',
    factsNotifEyebrow: 'Notificaciones',
    factsNotifValue: 'Dos',
    factsNotifNote: 'La apertura del sello de la directiva, y el momento. Ese es todo el presupuesto, a propósito.',
    closingHeading: 'Por qué tu sincronización será «incorrecta»',
    closingBody:
      'El sonido viaja a 343 metros por segundo, así que dos personas separadas por 340 metros físicamente no pueden oírse en el mismo instante. La simultaneidad global perfecta no es posible y no es el objetivo. Después, la aplicación te indica tu propia desviación respecto a la media global, en milisegundos — lo más interesante que te dirá jamás sobre ti mismo.',
    moreLink: 'Preguntas que la gente realmente hace →',
    countdown: {
      fallback: 'El equinoccio de septiembre.',
      wherePrefix: 'Donde estás, son las',
      whereMidnight: '— en plena madrugada.',
      whereEarlyMorning: '— temprano por la mañana donde estás.',
      wherePeriod: '.',
      passed: 'El momento ha pasado.',
      daysUntil: 'Faltan {{DAYS}} días para el momento.',
    },
  },

  faq: {
    title: 'Manourying — Preguntas frecuentes',
    description: 'Respuestas directas sobre las invitaciones, el micrófono, los datos, y si esto es una secta.',
    eyebrow: 'Preguntas',
    h1: 'Lo que la gente realmente pregunta',
    items: [
      {
        q: '¿Es esto una secta, una protesta o una campaña de marca?',
        a: 'Ninguna de las tres. No se pide a nadie que crea en nada, se una a nada, se oponga a nada o compre nada. Ocurre una vez, dura dieciséis segundos, y luego se detiene. No hay ninguna organización a la que pertenecer después.',
      },
      {
        q: '¿Por qué la aplicación quiere mi micrófono?',
        a: 'No lo quiere, a menos que actives la grabación tú mismo. La versión actual se distribuye con la captura de micrófono completamente desactivada — ni siquiera se solicita el permiso. Cuando se active, estará desactivada por defecto, se pedirá por separado, capturará seis segundos fijos, y el archivo permanecerá en tu teléfono a menos que lo escuches y elijas subirlo.',
      },
      {
        q: '¿Necesito una invitación?',
        a: 'Para reclamar un lugar, sí. Cada lugar lleva tres invitaciones que no se renuevan. Si llegaste sin código, puedes en cambio reservar un puesto en la lista de espera, y se liberan lugares en ella.',
      },
      {
        q: '¿Por qué solo tres invitaciones?',
        a: 'Un lugar que puede invitar a todos es una lista de correo. Tres es suficiente para llegar a las personas junto a las que realmente te pondrías, y lo bastante pocas como para que gastar una sea una decisión.',
      },
      {
        q: '¿Qué pasa si estoy dormido cuando ocurre?',
        a: 'Para gran parte del planeta ocurre en plena noche, y la aplicación te lo dice claramente cuando eliges dónde estarás parado. Si armas el momento, tu teléfono programa una alarma local que se dispara sin señal y sin red. Levantarte o no es asunto tuyo.',
      },
      {
        q: '¿Funciona sin internet?',
        a: 'El día en sí, completamente. Todo lo necesario — la partitura, el tono de referencia, la marca de tiempo corregida — se almacena en el dispositivo con bastante antelación. La aplicación está diseñada bajo el supuesto de que nuestros servidores estarán menos disponibles justo cuando sean más demandados.',
      },
      {
        q: '¿Por qué {{TONE_HZ}} Hz?',
        a: 'Es suficientemente bajo para que casi cualquier voz adulta lo alcance cómodamente, y una sola nota no requiere entrenamiento ni idioma compartido. Si no puedes igualarlo, sostén el tono que te resulte cómodo — eso está escrito en la propia directiva.',
      },
      {
        q: '¿Qué datos recopilan?',
        a: 'Un lugar es un token opaco, no un nombre, un correo electrónico o un número de teléfono. No hay cuenta, ni identificador publicitario, ni análisis de terceros. Consulta la página de privacidad para la posición completa.',
      },
      {
        q: '¿Esto aparecerá en sismómetros?',
        a: 'No, y no afirmaremos que sí. Mil millones de voces no moverán un sismómetro. Las redes sísmicas urbanas densas sí registran actividad humana — bien documentado durante los confinamientos de 2020 — y cuando mostramos esos datos provienen de IRIS y EMSC y están etiquetados honestamente, incluso cuando no muestran nada.',
      },
      {
        q: '¿Quién paga esto?',
        a: 'Nadie, en el sentido que importa: no hay ronda de financiación, ni patrocinador, y nada se vende. Si eso cambia, se dirá aquí primero.',
      },
      {
        q: 'Algo está mal / tengo una pregunta que no han respondido.',
        a: 'Escribe a {{CONTACT_EMAIL}}. Una persona real lo lee.',
      },
    ],
  },

  privacy: {
    title: 'Manourying — Privacidad',
    description: 'Lo que la aplicación almacena, lo que nunca recopila, y la posición sobre grabar a terceros presentes en lugares públicos.',
    eyebrow: 'Privacidad',
    h1: 'Lo que guardamos, y lo que nos negamos a guardar',
    lede: 'En resumen: no hay cuenta, ni nombre, ni correo electrónico, ni identificador publicitario, ni análisis de terceros. Nada grabado en tu teléfono sale de él a menos que tú decidas que así sea.',
    seatHeading: 'Qué es un lugar',
    seatBody:
      'Un lugar es un token aleatorio opaco almacenado en tu dispositivo. No se deriva de tu número de teléfono, tu correo electrónico, el identificador de tu dispositivo, ni nada más sobre ti, y no puede invertirse hacia ninguno de ellos. No podemos vincular dos lugares a la misma persona.',
    storesHeading: 'Qué almacena la aplicación en tu dispositivo',
    storesItems: [
      'Tu token de lugar, en el almacenamiento seguro del sistema operativo.',
      'El desfase medido entre el reloj de tu teléfono y la hora real.',
      'En qué zona UTC dijiste que estarías.',
      'Si has armado el momento, y la alarma local programada.',
    ],
    storesFooter: 'Todo ello se elimina al desinstalar la aplicación. Nada de ello es un identificador personal.',
    neverHeading: 'Lo que nunca recopilamos',
    neverItems: [
      'Tu nombre, correo electrónico o número de teléfono.',
      'Tu ubicación precisa. La aplicación pregunta en qué zona UTC estarás — una elección de una lista de veinticuatro, no una coordenada.',
      'Identificadores publicitarios, seguimiento entre aplicaciones, o kits de análisis de terceros.',
      'A quién enviaste una invitación. Enviar un código abre tu propio menú de compartir; la invitación se gasta cuando alguien la reclama, y lo único que recibes es un recuento.',
    ],
    micHeading: 'El micrófono, dicho con precisión',
    micIntro:
      'La grabación no está presente en absoluto en la versión actual. El permiso no se solicita y el código de captura no se distribuye. Cuando se añada, estas son las reglas a las que deberá ajustarse, y ya están escritas en el código como un contrato que cualquier implementación debe cumplir:',
    micItems: [
      'Se solicita por separado, con sus propias palabras. Armar el momento nunca se trata como consentimiento para grabar.',
      'Una ventana fija de seis segundos, detenida por código en lugar de por un temporizador cuya fiabilidad dependa de la interfaz.',
      'Almacenado solo en el dispositivo. No existe ninguna opción de subida automática que pueda configurarse mal.',
      'Nada se sube a menos que lo hayas vuelto a escuchar y luego elegido subirlo.',
    ],
    bystanderHeading: 'El problema de los terceros presentes',
    bystanderP1:
      'Esta es la parte que merece una respuesta directa en lugar de un párrafo de relleno. Una grabación de seis segundos hecha en una plaza pública captura las voces de personas que nunca instalaron esta aplicación, nunca aceptaron nada, y no pueden ser consultadas después.',
    bystanderP2:
      'Nuestra posición: las grabaciones permanecen en el dispositivo por defecto, precisamente porque eso evita que la pregunta siquiera surja. Cualquier archivo público de audio capturado estará compuesto de contribuciones aprobadas individualmente — una persona que decide, tras escuchar su propia grabación, que esa en concreto puede publicarse — en lugar de una agregación masiva de todo lo que captaron los micrófonos. Si ese estándar no puede cumplirse para una grabación dada, no entra en el archivo.',
    bystanderP3Before: 'Si crees que una grabación publicada te contiene y no diste tu consentimiento, escribe a',
    bystanderP3After: 'y será retirada. No tienes que justificarte ni probar nada.',
    siteHeading: 'Este sitio web',
    siteBody:
      'No se establecen cookies ni se ejecuta ningún análisis. Las fuentes web se cargan desde Google Fonts, lo que significa que los servidores de Google ven la solicitud — si eso te importa, una extensión que bloquee fuentes no rompe nada aquí.',
    rightsHeading: 'Tus derechos',
    rightsBefore:
      'Bajo el RGPD puedes preguntar qué se guarda sobre ti, pedir que se elimine, y presentar una queja ante tu autoridad de control nacional. Como un lugar es un token anónimo, en la mayoría de los casos la respuesta honesta a «qué guardáis sobre mí» es «nada que te identifique» — y desinstalar la aplicación elimina el resto. Para cualquier otra cosa, escribe a',
    rightsAfter: '.',
    lastUpdatedPrefix: 'Última actualización el',
    lastUpdatedSuffix: '. Los cambios importantes se fecharán aquí, no se editarán en silencio.',
    legalReviewNotice:
      'Esta traducción no ha recibido revisión legal. La versión en inglés en /privacy prevalece en caso de discrepancia.',
  },

  press: {
    title: 'Manourying — Prensa',
    description: 'Una descripción sencilla del proyecto, los datos que vale la pena verificar, y cómo contactar a una persona.',
    eyebrow: 'Prensa',
    h1: 'Para quien escriba sobre esto',
    lede: 'Toma cualquier cosa de esta página y úsala sin pedir permiso. Si algo aquí no está claro o crees que es incorrecto, dilo — una corrección antes de la publicación vale más para nosotros que un artículo halagador.',
    oneParagraphHeading: 'En un párrafo',
    quoteBefore:
      'Manourying es un proyecto artístico construido alrededor de un instante único. En el equinoccio de septiembre — el momento en que todo el planeta comparte un día y una noche de igual duración — todos los que tienen la aplicación emiten el mismo sonido al mismo tiempo: cuatro segundos de vocal abierta a unos',
    quoteAfter:
      'Hz, luego su propio nombre, luego diez segundos de silencio. Dieciséis segundos en total. La aplicación es solo por invitación, no hace casi nada hasta el día, y envía exactamente dos notificaciones en los meses previos. Luego ocurre, y termina durante seis meses.',
    factsHeading: 'Datos que vale la pena verificar',
    factInstant: 'El instante',
    factDuration: 'Duración',
    factDurationValue: '16 segundos',
    factPitch: 'Tono de referencia',
    factCadence: 'Cadencia',
    factCadenceValue: 'Dos veces al año, en cada equinoccio',
    factEntry: 'Entrada',
    factEntryValue: 'Solo por invitación · tres por lugar · no renovable',
    factPlatforms: 'Plataformas',
    factPlatformsValue: 'iOS y Android',
    factCost: 'Coste',
    factCostValue: 'Gratis · nada a la venta · sin publicidad',
    threeThingsHeading: 'Tres cosas que no os dejaremos publicar',
    threeThingsIntro: 'No porque sean poco favorecedoras, sino porque son falsas, y preferimos que lo oigáis de nosotros:',
    thingSeismic: {
      strong: 'Que se registrará en sismómetros.',
      rest: 'No lo hará. Mil millones de voces no mueven un sismómetro. Las redes sísmicas urbanas densas sí muestran firmas de actividad humana — bien documentado durante los confinamientos de 2020 — y esa es una historia genuinamente interesante, pero no es la misma afirmación.',
    },
    thingSimultaneous: {
      strong: 'Que es perfectamente simultáneo.',
      rest: 'El sonido viaja a 343 m/s. Dos personas separadas por 340 metros no pueden oírse en el mismo instante; la física lo prohíbe. El proyecto trata eso como la parte interesante en lugar de fingir lo contrario.',
    },
    thingCampaign: {
      strong: 'Que es una protesta, una religión o una campaña de marca.',
      rest: 'No se pide a nadie que crea en nada, se oponga a nada, se una a nada o compre nada.',
    },
    contactHeading: 'Contacto',
    contactBefore: '',
    contactAfter: '— una persona real, normalmente en un día. Para verificación de datos con plazo ajustado, indícalo en el asunto.',
    canonicalLabel: 'Explicación canónica:',
  },

  install: {
    title: 'Manourying — Instalación',
    description: 'Dónde conseguir la aplicación, en Android e iOS.',
    eyebrow: 'Instalación',
    h1: 'Conseguir la aplicación',
    lede: 'Manourying aún no está en la App Store ni en Google Play. Las versiones se distribuyen directamente, lo que implica un par de toques adicionales y una advertencia de aspecto alarmante de tu teléfono.',
    platformLabel: { android: 'Android', ios: 'iOS' },
    notYet: 'Aún no',
    installFor: 'Instalar para',
    haveCodeHeading: '¿Ya tienes un código?',
    haveCodeBody:
      'Instala primero la aplicación, luego ábrela e introduce tu código de seis caracteres en el portal. Tocar un enlace de invitación antes de instalar la aplicación no hace nada — es una limitación del enlace, no un problema con tu código.',
    noCodeHeading: '¿Sin código?',
    noCodeBody:
      'Instala de todos modos y reserva un puesto en la lista de espera. Cada lugar lleva tres invitaciones que no se renuevan, y se liberan lugares en la lista a medida que quedan disponibles.',
    brokenBefore: '¿Algo no funciona?',
  },

  directive: {
    title: 'Manourying — La directiva sellada',
    description: 'La huella SHA-256 de la directiva sellada, publicada con antelación para poder verificarse después.',
    eyebrowSealed: 'Directiva 02 · sellada',
    eyebrowOpen: 'Directiva 02 · abierta',
    h1: 'El sello',
    lede: 'El texto exacto de la directiva se publica siete días antes del equinoccio. Su huella se publica ahora, para que después cualquiera pueda verificar que el texto que se le dio es el que se selló — incluso si no confía en nosotros.',
    sealEyebrow: 'SHA-256 de la directiva sellada',
    copyButton: 'Copiar huella',
    copiedLabel: 'Copiado',
    checkHeading: 'Cómo verificarlo tú mismo',
    checkP1Before: 'Cuando la directiva se abra el',
    checkP1After: 'toma su forma canónica — cada paso como hora⇥título⇥detalle, uno por línea, unidos por saltos de línea, codificado en UTF-8 — y calcula su huella:',
    checkP2: 'Si eso no produce la cadena de arriba, algo cambió entre el sellado y la revelación, y deberías decirlo en voz alta.',
    knownHeading: 'Lo que ya se sabe',
    knownBody:
      'La estructura nunca fue secreta y está escrita en la página principal: cuatro segundos de vocal abierta, un nombre pronunciado, diez segundos de silencio. Lo que está sellado es el texto preciso — qué palabras, en qué orden, traducidas a todos los idiomas a la vez.',
    footerFine:
      'La misma huella se muestra dentro de la aplicación, calculada independientemente en tu propio dispositivo a partir de la copia incluida en el binario. Dos cálculos, un número — si alguna vez difieren, no confíes en ninguno.',
  },

  gate: {
    title: 'Manourying — Tu invitación',
    description: 'Alguien gastó una invitación en ti. Esto es lo que significa y qué hacer con ella.',
    eyebrow: 'Alguien gastó una invitación en ti',
    h1: 'Un lugar en Manourying',
    codeEyebrow: 'Tu código',
    copyButton: 'Copiar código',
    copiedLabel: 'Copiado',
    codeFine: 'Anótalo. Este enlace es el único lugar donde existe.',
    noCodeLede: 'Cada lugar lleva tres invitaciones, que no se renuevan — así que si alguien te envió una, renunció a un tercio de lo que tenía.',
    invitedHeading: 'A qué has sido invitado',
    invitedBody:
      'En un instante fijo — el equinoccio de septiembre — todos los que tienen la aplicación emiten el mismo sonido al mismo tiempo. Cuatro segundos de vocal abierta, luego tu propio nombre, luego diez segundos de silencio. Dieciséis segundos, y luego termina.',
    invitedLinkBefore: '',
    invitedLink: 'La explicación completa, en lenguaje sencillo,',
    invitedLinkAfter: 'merece dos minutos antes de instalar nada.',
    nextHeading: 'Qué hacer ahora',
    nextSteps: [
      'Instala la aplicación.',
      'Ábrela e introduce tu código en el portal.',
      'Elige dónde estarás realmente, y arma el momento.',
    ],
    ctaGetApp: 'Obtener la aplicación',
    footerFine:
      'Si ya tienes la aplicación instalada, este enlace debería haberla abierto directamente. Que no lo haya hecho es una limitación conocida mientras se configura la verificación de enlaces de aplicación — introduce el código a mano y funcionará exactamente igual.',
  },

  notFound: {
    title: 'Manourying — No encontrado',
    description: 'Esa página no existe.',
    eyebrow: '404',
    h1: 'Nada aquí.',
    lede: 'La página que pediste no existe. Lo que sin duda sí existe:',
    linkWhatThisIs: 'Qué es esto realmente',
    linkFaq: 'Preguntas que la gente hace',
    linkInstall: 'Conseguir la aplicación',
  },
};
