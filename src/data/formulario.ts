/**
 * Estructura completa del formulario de reserva.
 *
 * Recoge el "Cuestionario Musical de Matrimonio" oficial de Deejay Lookuman
 * EnergyMan (14 secciones) y lo reorganiza en 7 pasos navegables, añadiendo
 * al inicio los datos de contacto y del evento que necesita cualquier
 * cotización — no sólo un matrimonio.
 *
 * Bloques y campos pueden declarar `soloEventos`: la lista de tipos de evento
 * en los que la pregunta aplica. Lo que queda fuera se oculta, y al estar
 * oculto no se valida ni se envía.
 */

export type Acento = "cyan" | "magenta" | "yellow";

type Base = {
  nombre: string;
  etiqueta: string;
  ayuda?: string;
  requerido?: boolean;
  /** Ancho dentro de la grilla de 2 columnas del bloque */
  ancho?: "completo" | "mitad";
  /**
   * Tipos de evento en los que la pregunta tiene sentido. Sin la lista, se
   * pregunta siempre. Lo que queda oculto no se valida ni se envía.
   */
  soloEventos?: string[];
};

export type Campo =
  | (Base & {
      tipo: "texto" | "email" | "tel" | "fecha" | "hora" | "numero";
      autocomplete?: string;
      min?: string;
      inputmode?: "text" | "tel" | "email" | "numeric";
    })
  | (Base & { tipo: "textarea"; filas?: number })
  | (Base & { tipo: "select"; opciones: string[] })
  | (Base & { tipo: "radio"; opciones: string[] })
  | (Base & { tipo: "chips"; opciones: string[] })
  | (Base & { tipo: "cancion" })
  | (Base & { tipo: "checkbox"; texto: string });

export type Bloque = {
  titulo?: string;
  nota?: string;
  acento?: Acento;
  /** Igual que en los campos, pero para el bloque entero. */
  soloEventos?: string[];
  /** Botón que rellena todos los campos del bloque con un texto dado */
  autocompletar?: { etiqueta: string; valor: string };
  campos: Campo[];
};

export type Paso = {
  id: string;
  titulo: string;
  /** Etiqueta corta para la barra de progreso */
  corto: string;
  intro: string;
  acento: Acento;
  bloques: Bloque[];
};

/* ------------------------------------------------------------------ */
/* Catálogos                                                           */
/* ------------------------------------------------------------------ */

export const TIPOS_EVENTO = [
  "Matrimonio",
  "Cumpleaños",
  "Disco Peque (fiesta infantil)",
  "Bautizo",
  "Graduación / Licenciatura",
  "Evento de empresa",
  "Otro",
];

/* Qué se pregunta según el evento. Se declaran aquí, en lista blanca, para
   que añadir un tipo de evento obligue a decidir dónde entra. */

/** Tienen un rito formal antes de la fiesta. */
export const CON_CEREMONIA = [
  "Matrimonio",
  "Bautizo",
  "Graduación / Licenciatura",
  "Otro",
];

/** Hay discursos, entrada oficial y micrófono para los anfitriones. */
export const CON_PROTOCOLO = TIPOS_EVENTO.filter(
  (tipo) => tipo !== "Disco Peque (fiesta infantil)",
);

/** Hay cóctel y cena de por medio: en una fiesta infantil, no. */
export const CON_SOBREMESA = TIPOS_EVENTO.filter(
  (tipo) => tipo !== "Disco Peque (fiesta infantil)",
);

export const ESTILOS_MUSICALES = [
  "Salsa",
  "Merengue",
  "Cumbia",
  "Rancheras",
  "Rock de los 80",
  "Rock latino",
  "Rock argentino",
  "New Wave",
  "Disco / Funk",
  "Rock & Roll",
  "Instrumental",
  "Bossa Nova",
  "Reggaetón",
  "Electrónica",
  "House",
  "Axé",
  "Hip-Hop",
  "Hora Loca",
  "Pop",
  "R&B / Soul",
  "Oldies",
  "Música romántica",
  "Música brasileña",
  "Reggae / Dancehall",
  "Country",
  "Otro",
];

export const DECADAS = ["60", "70", "80", "90", "2000", "2010", "Actual"];

export const SERVICIOS = [
  "DJ",
  "Animación / MC",
  "Amplificación",
  "Iluminación",
  "Micrófono extra",
  "Hora Loca",
  "Karaoke",
];

const PISTA_SUGERENCIAS = {
  etiqueta: "Necesitamos sugerencias",
  valor: "Necesitamos sugerencias",
};

/* ------------------------------------------------------------------ */
/* Los 7 pasos                                                         */
/* ------------------------------------------------------------------ */

export const PASOS: Paso[] = [
  /* ---------------------------------------------------------------- */
  {
    id: "contacto",
    titulo: "Contacto y evento",
    corto: "Contacto",
    intro:
      "Empecemos por lo esencial: quiénes son, cuándo es y dónde. Si sólo quieren saber si tengo su fecha libre y cuánto vale, con este paso basta: envíenlo y les respondo. El cuestionario musical puede esperar.",
    acento: "cyan",
    bloques: [
      {
        titulo: "¿Con quién hablo?",
        acento: "cyan",
        campos: [
          {
            tipo: "texto",
            nombre: "nombre_contacto",
            etiqueta: "Nombre y apellido",
            requerido: true,
            ancho: "mitad",
            autocomplete: "name",
          },
          {
            tipo: "texto",
            nombre: "nombre_pareja",
            etiqueta: "Segundo contacto o pareja",
            ayuda: "Opcional — útil para coordinar el día del evento.",
            ancho: "mitad",
          },
          {
            tipo: "tel",
            nombre: "telefono",
            etiqueta: "WhatsApp de contacto",
            requerido: true,
            ancho: "mitad",
            autocomplete: "tel",
            inputmode: "tel",
            ayuda: "Ejemplo: +56 9 1234 5678",
          },
          {
            tipo: "email",
            nombre: "email",
            etiqueta: "Correo electrónico",
            requerido: true,
            ancho: "mitad",
            autocomplete: "email",
            inputmode: "email",
          },
        ],
      },
      {
        titulo: "Datos del evento",
        acento: "magenta",
        campos: [
          {
            tipo: "select",
            nombre: "tipo_evento",
            etiqueta: "Tipo de evento",
            requerido: true,
            ancho: "mitad",
            opciones: TIPOS_EVENTO,
          },
          {
            tipo: "fecha",
            nombre: "fecha_evento",
            etiqueta: "Fecha del evento",
            requerido: true,
            ancho: "mitad",
          },
          {
            tipo: "hora",
            nombre: "hora_inicio",
            etiqueta: "Hora de inicio",
            ancho: "mitad",
          },
          {
            tipo: "hora",
            nombre: "hora_termino",
            etiqueta: "Hora de término",
            ancho: "mitad",
          },
          {
            tipo: "texto",
            nombre: "lugar",
            etiqueta: "Nombre del recinto o salón",
            ancho: "mitad",
          },
          {
            tipo: "texto",
            nombre: "comuna",
            etiqueta: "Comuna y región",
            requerido: true,
            ancho: "mitad",
            ayuda: "Para calcular traslado del equipo.",
          },
          {
            tipo: "numero",
            nombre: "invitados",
            etiqueta: "Invitados aproximados",
            ancho: "mitad",
            inputmode: "numeric",
          },
          {
            tipo: "chips",
            nombre: "servicios",
            etiqueta: "¿Qué necesitan?",
            ayuda: "Pueden marcar varias opciones.",
            opciones: SERVICIOS,
          },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: "momentos",
    titulo: "Los momentos más importantes",
    corto: "Momentos",
    intro:
      "Estas canciones conviene definirlas con anticipación. Si aún no tienen una, escriban «necesitamos sugerencias» y les propongo alternativas.",
    acento: "magenta",
    bloques: [
      {
        titulo: "Canciones del protocolo",
        nota: "Indiquen el nombre de la canción y, si lo conocen, el artista o intérprete.",
        acento: "magenta",
        soloEventos: ["Matrimonio"],
        autocompletar: PISTA_SUGERENCIAS,
        campos: [
          { tipo: "cancion", nombre: "entrada_novia", etiqueta: "Entrada de la novia" , ancho: "mitad" },
          { tipo: "cancion", nombre: "baile_novia_papa", etiqueta: "Baile de la novia con su papá" , ancho: "mitad" },
          { tipo: "cancion", nombre: "baile_novio_mama", etiqueta: "Baile del novio con su mamá" , ancho: "mitad" },
          { tipo: "cancion", nombre: "primer_baile", etiqueta: "Primer baile de los novios" , ancho: "mitad" },
          { tipo: "cancion", nombre: "corte_torta", etiqueta: "Corte de la torta" , ancho: "mitad" },
          { tipo: "cancion", nombre: "lanzamiento_ramo", etiqueta: "Lanzamiento del ramo" , ancho: "mitad" },
          { tipo: "cancion", nombre: "lanzamiento_liga", etiqueta: "Lanzamiento de la liga" , ancho: "mitad" },
          { tipo: "cancion", nombre: "ultima_cancion", etiqueta: "Última canción de la noche" , ancho: "mitad" },
        ],
      },
      {
        titulo: "Otros momentos especiales",
        acento: "yellow",
        campos: [
          {
            tipo: "textarea",
            nombre: "otros_momentos",
            etiqueta: "¿Hay otro momento que quieran acompañar con una canción?",
            ayuda:
              "Momento, canción, artista e instrucciones especiales. Ej.: entrada de los padrinos, sorpresa a un familiar, brindis.",
            filas: 4,
          },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: "etapas",
    titulo: "Música por etapa del evento",
    corto: "Etapas",
    intro:
      "Cada momento pide una energía distinta. Pueden indicar géneros, artistas, canciones concretas o simplemente «sorpréndenos».",
    acento: "cyan",
    bloques: [
      {
        acento: "cyan",
        autocompletar: { etiqueta: "Sorpréndenos con propuestas", valor: "Sorpréndenos con propuestas" },
        campos: [
          {
            tipo: "textarea",
            nombre: "musica_recibimiento",
            etiqueta: "Recibimiento de los invitados",
            filas: 2,
            ancho: "mitad",
          },
          {
            tipo: "textarea",
            nombre: "musica_ceremonia",
            etiqueta: "Ceremonia",
            filas: 2,
            ancho: "mitad",
            soloEventos: CON_CEREMONIA,
          },
          {
            tipo: "textarea",
            nombre: "musica_coctel",
            etiqueta: "Cóctel",
            filas: 2,
            ancho: "mitad",
            soloEventos: CON_SOBREMESA,
          },
          {
            tipo: "textarea",
            nombre: "musica_cena",
            etiqueta: "Cena",
            filas: 2,
            ancho: "mitad",
            soloEventos: CON_SOBREMESA,
          },
          {
            tipo: "textarea",
            nombre: "musica_inicio_fiesta",
            etiqueta: "Inicio de la fiesta",
            filas: 2,
            ancho: "mitad",
          },
          {
            tipo: "textarea",
            nombre: "musica_fiesta",
            etiqueta: "Fiesta / baile",
            filas: 2,
            ancho: "mitad",
          },
          { tipo: "textarea", nombre: "musica_cierre", etiqueta: "Cierre", filas: 2 },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: "gustos",
    titulo: "Sus gustos musicales",
    corto: "Gustos",
    intro:
      "Marquen todo lo que quieran escuchar. Mientras más específicos sean, más precisa será la selección de la noche.",
    acento: "yellow",
    bloques: [
      {
        titulo: "Estilos que quieren escuchar",
        acento: "yellow",
        campos: [
          {
            tipo: "chips",
            nombre: "estilos",
            etiqueta: "Estilos musicales",
            ayuda: "Marquen todos los que apliquen.",
            opciones: ESTILOS_MUSICALES,
          },
          {
            tipo: "chips",
            nombre: "decadas",
            etiqueta: "¿Qué décadas quieren destacar?",
            opciones: DECADAS,
          },
        ],
      },
      {
        titulo: "Cuéntenme más",
        acento: "cyan",
        campos: [
          {
            tipo: "textarea",
            nombre: "estilos_prioritarios",
            etiqueta: "Sus 5 estilos prioritarios",
            ayuda: "En orden de importancia, si pueden.",
            filas: 3,
            ancho: "mitad",
          },
          {
            tipo: "textarea",
            nombre: "artistas_favoritos",
            etiqueta: "Artistas o bandas que les encantan",
            filas: 3,
            ancho: "mitad",
          },
          {
            tipo: "textarea",
            nombre: "canciones_historia",
            etiqueta: "Canciones que representan su historia",
            ayuda: "Esas que no pueden faltar porque significan algo para ustedes.",
            filas: 3,
          },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: "no",
    titulo: "Definitivamente no",
    corto: "Los «no»",
    intro:
      "Esta es la sección más importante del cuestionario. Todo lo que escriban aquí se trata como restricción del servicio: no sonará bajo ninguna circunstancia.",
    acento: "magenta",
    bloques: [
      {
        titulo: "Lista de exclusión",
        nota: "Puede ser una canción, un artista, un género, una década o un tipo de contenido.",
        acento: "magenta",
        campos: [
          {
            tipo: "textarea",
            nombre: "no_canciones",
            etiqueta: "Canciones que no debo tocar por ningún motivo",
            filas: 3,
            ancho: "mitad",
          },
          {
            tipo: "textarea",
            nombre: "no_artistas",
            etiqueta: "Artistas que no debo tocar",
            filas: 3,
            ancho: "mitad",
          },
          {
            tipo: "textarea",
            nombre: "no_generos",
            etiqueta: "Géneros o estilos que no debo tocar",
            filas: 3,
            ancho: "mitad",
          },
          {
            tipo: "textarea",
            nombre: "no_contenidos",
            etiqueta: "Contenidos que quieren evitar",
            ayuda: "Ej.: letras explícitas, violencia, sexualización.",
            filas: 3,
            ancho: "mitad",
          },
        ],
      },
      {
        titulo: "Semáforo musical",
        nota:
          "Para saber cuándo tengo libertad para decidir y cuándo debo consultarles antes de poner algo.",
        acento: "yellow",
        campos: [
          {
            tipo: "textarea",
            nombre: "semaforo_apto",
            etiqueta: "🟢 Apto — puedo tocarlo libremente",
            filas: 3,
            ancho: "mitad",
          },
          {
            tipo: "textarea",
            nombre: "semaforo_consultar",
            etiqueta: "🟡 Consultar — confírmenlo antes",
            filas: 3,
            ancho: "mitad",
          },
          {
            tipo: "textarea",
            nombre: "semaforo_evitar",
            etiqueta: "🔴 Evitar — prefieren no escucharlo",
            filas: 3,
          },
        ],
      },
      {
        titulo: "Contenido y ambiente",
        acento: "cyan",
        campos: [
          {
            tipo: "radio",
            nombre: "nivel_libertad",
            etiqueta: "¿Qué nivel de libertad musical desean?",
            opciones: [
              "100% familiar",
              "Familiar + música juvenil",
              "Amplio pero cuidado",
              "Otro (lo explico abajo)",
            ],
          },
          {
            tipo: "radio",
            nombre: "musica_limpia",
            etiqueta: "¿Quieren música exclusivamente limpia, sin contenido explícito?",
            opciones: [
              "Sí, sólo versiones limpias",
              "Limpia hasta cierta hora, luego libre",
              "No es necesario",
            ],
          },
          {
            tipo: "textarea",
            nombre: "temas_evitar",
            etiqueta: "¿Alguna letra o temática a evitar aunque la canción sea popular?",
            filas: 3,
            ancho: "mitad",
          },
          {
            tipo: "textarea",
            nombre: "consideraciones",
            etiqueta: "¿Alguna consideración religiosa, cultural o familiar que deba conocer?",
            filas: 3,
            ancho: "mitad",
          },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: "fiesta",
    titulo: "La fiesta y sus invitados",
    corto: "La fiesta",
    intro:
      "Aquí definimos cómo se comporta la noche: qué tan variada, quién baila, qué es infaltable y cómo manejo las peticiones.",
    acento: "cyan",
    bloques: [
      {
        titulo: "Preferencias de la fiesta",
        acento: "cyan",
        campos: [
          {
            tipo: "radio",
            nombre: "pista_llena",
            etiqueta: "¿Qué tan importante es que la pista esté llena?",
            opciones: [
              "Es la prioridad número uno",
              "Importante, pero con equilibrio",
              "Preferimos el ambiente por sobre la pista llena",
            ],
          },
          {
            tipo: "radio",
            nombre: "variada_o_concentrada",
            etiqueta: "¿Fiesta variada o concentrada en sus estilos favoritos?",
            opciones: [
              "Variada, que haya de todo",
              "Concentrada en nuestros estilos",
              "Equilibrio entre ambas",
            ],
          },
          {
            tipo: "radio",
            nombre: "bloques_o_cambios",
            etiqueta: "¿Cambios de género frecuentes o bloques musicales?",
            opciones: [
              "Bloques musicales largos",
              "Cambios frecuentes de género",
              "Que el DJ lea la pista y decida",
            ],
          },
          {
            tipo: "radio",
            nombre: "hora_loca",
            etiqueta: "¿Desean Hora Loca?",
            opciones: ["Sí", "No", "Aún no lo decidimos"],
            ancho: "mitad",
          },
          {
            tipo: "textarea",
            nombre: "hora_loca_detalle",
            etiqueta: "Si es sí, ¿qué estilos o canciones quieren incluir?",
            filas: 3,
            ancho: "mitad",
          },
          {
            tipo: "textarea",
            nombre: "dinamicas",
            etiqueta: "¿Quieren juegos, concursos o participación de los invitados?",
            filas: 3,
            ancho: "mitad",
          },
          {
            tipo: "textarea",
            nombre: "tradicion_familiar",
            etiqueta: "¿Hay alguna tradición familiar que deba coordinar musicalmente?",
            filas: 3,
            ancho: "mitad",
          },
        ],
      },
      {
        titulo: "Generaciones",
        nota: "Para equilibrar la fiesta, cuéntenme quiénes serán sus invitados.",
        acento: "yellow",
        campos: [
          {
            tipo: "texto",
            nombre: "edades_invitados",
            etiqueta: "Edades aproximadas de los invitados",
            ayuda: "Ej.: mayoría entre 25 y 45, con un grupo de adultos mayores.",
          },
          {
            tipo: "radio",
            nombre: "ninos_adolescentes",
            etiqueta: "¿Habrá muchos niños o adolescentes?",
            opciones: ["Muchos", "Algunos", "Casi ninguno"],
            ancho: "mitad",
          },
          {
            tipo: "radio",
            nombre: "adultos_mayores",
            etiqueta: "¿Habrá muchos adultos mayores?",
            opciones: ["Muchos", "Algunos", "Casi ninguno"],
            ancho: "mitad",
          },
          {
            tipo: "textarea",
            nombre: "invitados_extranjeros",
            etiqueta: "¿Habrá invitados extranjeros o de otras culturas? ¿De cuáles?",
            filas: 2,
          },
        ],
      },
      {
        titulo: "Canciones infaltables",
        nota: "Sus cartas bajo la manga si la pista necesita un empujón.",
        acento: "magenta",
        campos: [
          {
            tipo: "textarea",
            nombre: "infaltables",
            etiqueta: "5 canciones que siempre les gustaría escuchar",
            filas: 4,
            ancho: "mitad",
          },
          {
            tipo: "textarea",
            nombre: "bailables_familia",
            etiqueta: "5 canciones que harán bailar a su familia o amigos",
            filas: 4,
            ancho: "mitad",
          },
          {
            tipo: "textarea",
            nombre: "cancion_tradicion",
            etiqueta: "¿Alguna canción que no sea su favorita pero sea tradición familiar?",
            filas: 2,
          },
        ],
      },
      {
        titulo: "Solicitudes de los invitados",
        nota:
          "Para proteger su experiencia, díganme cómo gestiono las peticiones que no estén dentro de sus preferencias.",
        acento: "cyan",
        campos: [
          {
            tipo: "radio",
            nombre: "solicitudes_libres",
            etiqueta: "¿Puedo aceptar solicitudes libremente si encajan con la fiesta?",
            opciones: [
              "Sí, con criterio del DJ",
              "Sólo si encajan con nuestra lista",
              "No, únicamente nuestra selección",
            ],
          },
          {
            tipo: "textarea",
            nombre: "solicitudes_consultar",
            etiqueta: "¿Qué tipo de solicitudes prefieren que consulte antes?",
            filas: 3,
            ancho: "mitad",
          },
          {
            tipo: "texto",
            nombre: "persona_autorizada",
            etiqueta: "Persona autorizada para aprobar canciones durante la fiesta",
            ayuda: "Nombre y, si es posible, teléfono.",
            ancho: "mitad",
          },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: "produccion",
    titulo: "Protocolo, producción y visión",
    corto: "Producción",
    intro:
      "Los últimos detalles: quién habla, a qué hora parte y termina la música, y cómo se ve la noche perfecta para ustedes.",
    acento: "magenta",
    bloques: [
      {
        titulo: "Momentos y protocolo",
        acento: "magenta",
        soloEventos: CON_PROTOCOLO,
        campos: [
          {
            tipo: "textarea",
            nombre: "discursos",
            etiqueta: "¿Quién hará los discursos?",
            ayuda: "Nombres y relación con los protagonistas del evento.",
            filas: 3,
            ancho: "mitad",
          },
          {
            tipo: "textarea",
            nombre: "entrada_oficial",
            etiqueta: "¿Habrá entrada oficial? ¿Cómo la imaginan?",
            filas: 3,
            ancho: "mitad",
          },
          {
            tipo: "radio",
            nombre: "palabras_agradecimiento",
            etiqueta: "¿Habrá palabras de agradecimiento de los anfitriones?",
            opciones: ["Sí", "No", "Por confirmar"],
          },
          {
            tipo: "textarea",
            nombre: "momento_sorpresa",
            etiqueta: "¿Habrá algún momento sorpresa para familiares o invitados?",
            filas: 3,
            ancho: "mitad",
          },
          {
            tipo: "textarea",
            nombre: "no_anunciar",
            etiqueta: "¿Hay algún momento que NO quieran que anuncie por micrófono?",
            filas: 3,
            ancho: "mitad",
          },
        ],
      },
      {
        titulo: "Información operativa",
        nota: "Todo lo que necesito para llegar, montar y operar sin sobresaltos.",
        acento: "cyan",
        campos: [
          {
            tipo: "texto",
            nombre: "encargado_lugar",
            etiqueta: "Encargado del lugar o coordinación",
            ayuda: "Nombre y teléfono.",
            ancho: "mitad",
          },
          {
            tipo: "texto",
            nombre: "horario_musica",
            etiqueta: "Horario exacto de inicio y término de la música",
            ayuda: "Ej.: 20:30 a 04:00.",
            ancho: "mitad",
          },
          {
            tipo: "texto",
            nombre: "limite_volumen",
            etiqueta: "¿Existe horario límite de volumen o de música?",
            ancho: "mitad",
          },
          {
            tipo: "radio",
            nombre: "mismo_lugar",
            etiqueta: "¿Ceremonia y recepción en el mismo lugar?",
            opciones: ["Sí", "No", "Aún no lo sabemos"],
            ancho: "mitad",
            soloEventos: CON_CEREMONIA,
          },
          {
            tipo: "textarea",
            nombre: "desplazamientos",
            etiqueta: "¿Hay cambios de salón o desplazamientos durante el evento?",
            filas: 2,
            ancho: "mitad",
          },
          {
            tipo: "textarea",
            nombre: "instrucciones_recinto",
            etiqueta: "¿Instrucciones especiales del recinto que deba conocer?",
            ayuda: "Accesos, horarios de carga, límites de decibeles, electricidad.",
            filas: 2,
            ancho: "mitad",
          },
        ],
      },
      {
        titulo: "Su visión de la noche",
        acento: "yellow",
        campos: [
          {
            tipo: "texto",
            nombre: "tres_palabras",
            etiqueta: "La fiesta perfecta en 3 palabras",
            ayuda: "Ej.: enérgica, emotiva, inolvidable.",
          },
          {
            tipo: "textarea",
            nombre: "que_no_ocurra",
            etiqueta: "¿Qué NO quieren que ocurra durante la fiesta?",
            filas: 3,
            ancho: "mitad",
          },
          {
            tipo: "textarea",
            nombre: "exito",
            etiqueta: "¿Qué tendría que pasar para decir «fue exactamente como queríamos»?",
            filas: 3,
            ancho: "mitad",
          },
          {
            tipo: "textarea",
            nombre: "algo_mas",
            etiqueta: "¿Hay algo que no les haya preguntado y quieran contarme?",
            filas: 3,
          },
        ],
      },
      {
        titulo: "Confirmación final",
        nota:
          "Antes de cerrar la planificación revisaremos juntos las respuestas y estableceremos las prioridades musicales.",
        acento: "magenta",
        campos: [
          {
            tipo: "checkbox",
            nombre: "confirmacion",
            etiqueta: "Confirmación",
            requerido: true,
            texto:
              "Confirmamos que las preferencias indicadas como «no tocar» se tratarán como restricciones del servicio, salvo autorización posterior de nuestra parte.",
          },
        ],
      },
    ],
  },
];

/** Campos obligatorios agrupados por paso, para la validación por pasos. */
export const CAMPOS_REQUERIDOS: Record<string, string[]> = Object.fromEntries(
  PASOS.map((paso) => [
    paso.id,
    paso.bloques.flatMap((bloque) =>
      bloque.campos.filter((campo) => campo.requerido).map((campo) => campo.nombre),
    ),
  ]),
);
