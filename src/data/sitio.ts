/**
 * Datos maestros de la marca. Un solo lugar para el teléfono, las redes
 * y la oferta comercial: si cambia el número, cambia en todo el sitio.
 */

export const MARCA = {
  nombre: "Deejay Lookuman EnergyMan",
  nombreCorto: "LOOKUMAN",
  rol: "DJ · Director Musical · MC",
  slogan: "Tú solo preocúpate de disfrutar, nosotros hacemos el resto.",
  descripcion:
    "Servicios profesionales de deejay, animación y amplificación para matrimonios, cumpleaños, bautizos, graduaciones y disco peque en todo Chile.",
} as const;

export const CONTACTO = {
  /** Formato E.164 sin signos, tal como lo espera wa.me */
  whatsapp: "56940429740",
  whatsappVisible: "+56 9 4042 9740",
  instagram: "LOOKUMAN",
  facebook: "LOOKUMAN",
  instagramUrl: "https://instagram.com/lookuman",
  facebookUrl: "https://facebook.com/lookuman",
} as const;

/** Abre WhatsApp con un mensaje precargado (funciona en móvil y escritorio). */
export function linkWhatsApp(mensaje: string): string {
  return `https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}

export const MENSAJE_WHATSAPP_DEFECTO =
  "¡Hola Lookuman! Vi tu sitio y quiero cotizar DJ + animación para mi evento.";

/* ------------------------------------------------------------------ */
/* Eventos                                                             */
/* ------------------------------------------------------------------ */

export type Evento = {
  id: string;
  titulo: string;
  descripcion: string;
  detalles: string[];
  emoji: string;
  acento: "cyan" | "magenta" | "yellow";
  destacado?: boolean;
};

export const EVENTOS: Evento[] = [
  {
    id: "matrimonios",
    titulo: "Matrimonios",
    descripcion:
      "Ceremonia, cóctel, cena y fiesta con una línea musical planificada momento a momento junto a ustedes.",
    detalles: [
      "Cuestionario musical personalizado",
      "Conducción de protocolo y discursos",
      "Primer baile, torta, ramo y liga",
    ],
    emoji: "💍",
    acento: "magenta",
    destacado: true,
  },
  {
    id: "cumpleanos",
    titulo: "Cumpleaños",
    descripcion:
      "De los 15 a los 80: la música justa para que todas las generaciones estén en la pista.",
    detalles: ["Bloques por década", "Animación del momento de la torta", "Hora Loca opcional"],
    emoji: "🎂",
    acento: "cyan",
  },
  {
    id: "disco-peque",
    titulo: "Disco Peque",
    descripcion:
      "Fiesta infantil con animación activa, juegos, concursos y un repertorio 100% apto para niños.",
    detalles: ["Repertorio sin contenido explícito", "Juegos y dinámicas guiadas", "Luces y humo seguro"],
    emoji: "🎈",
    acento: "yellow",
  },
  {
    id: "bautizos",
    titulo: "Bautizos",
    descripcion:
      "Ambiente cálido para la sobremesa y energía controlada cuando la familia quiere bailar.",
    detalles: ["Música de fondo para la recepción", "Micrófono para palabras", "Volumen apto para bebés"],
    emoji: "🕊️",
    acento: "cyan",
  },
  {
    id: "graduaciones",
    titulo: "Graduaciones",
    descripcion:
      "Licenciaturas y titulaciones: ceremonia impecable y después la fiesta que el curso estaba esperando.",
    detalles: ["Conducción de la ceremonia", "Playlist elegida por el curso", "Cierre con himno del curso"],
    emoji: "🎓",
    acento: "magenta",
  },
  {
    id: "empresas",
    titulo: "Eventos de empresa",
    descripcion:
      "Aniversarios, cenas de fin de año y lanzamientos con presentación profesional y sonido parejo.",
    detalles: ["Presentación de autoridades", "Sonido para discursos", "Playlist corporativa cuidada"],
    emoji: "🏢",
    acento: "yellow",
  },
];

/* ------------------------------------------------------------------ */
/* Equipamiento incluido                                               */
/* ------------------------------------------------------------------ */

export type Equipo = {
  cantidad: string;
  titulo: string;
  descripcion: string;
  acento: "cyan" | "magenta" | "yellow";
};

export const EQUIPAMIENTO: Equipo[] = [
  {
    cantidad: "2",
    titulo: "Cajas Activas JBL EON 15",
    descripcion:
      "Sonido profesional de rango completo, potencia real y claridad pareja en toda la pista.",
    acento: "cyan",
  },
  {
    cantidad: "1",
    titulo: "Subwoofer",
    descripcion:
      "Los graves que se sienten en el pecho y sostienen la cumbia, el reggaetón y la electrónica.",
    acento: "magenta",
  },
  {
    cantidad: "2",
    titulo: "Luces robóticas",
    descripcion:
      "Cabezales móviles sincronizados con la música para transformar el salón en pista de baile.",
    acento: "yellow",
  },
  {
    cantidad: "1",
    titulo: "Micrófono",
    descripcion:
      "Para discursos, brindis, animación y todos los momentos que necesitan ser escuchados.",
    acento: "cyan",
  },
];

/* ------------------------------------------------------------------ */
/* Qué define el precio                                                */
/* ------------------------------------------------------------------ */

/**
 * No hay tarifa publicada: cada evento se cotiza. Lo que sí se puede decir
 * de antemano es de qué depende el número, para que nadie tenga que llenar
 * un formulario entero sólo para entender por qué hay que preguntar.
 */
export type FactorPrecio = {
  titulo: string;
  descripcion: string;
  emoji: string;
  acento: "cyan" | "magenta" | "yellow";
};

export const FACTORES_PRECIO: FactorPrecio[] = [
  {
    titulo: "Cuántas horas de música",
    descripcion:
      "Un cóctel de tres horas y una fiesta que termina a las cuatro de la mañana no valen lo mismo. Se cuenta desde la primera canción hasta la última.",
    emoji: "🕒",
    acento: "cyan",
  },
  {
    titulo: "Dónde es",
    descripcion:
      "El equipo viaja conmigo. La comuna, la distancia y a qué hora puedo entrar a montar entran en el cálculo.",
    emoji: "📍",
    acento: "magenta",
  },
  {
    titulo: "Qué servicios necesitan",
    descripcion:
      "DJ solo, DJ con animación, micrófono para los discursos, iluminación, Hora Loca o karaoke. Se suma lo que usen y nada más.",
    emoji: "🎛️",
    acento: "yellow",
  },
  {
    titulo: "Cuánta gente y qué salón",
    descripcion:
      "El número de invitados y el tamaño del lugar definen cuánta potencia hay que montar para que se escuche parejo en toda la pista.",
    emoji: "🔊",
    acento: "cyan",
  },
  {
    titulo: "Qué fecha",
    descripcion:
      "Un sábado de diciembre no es un jueves de mayo. Las fechas más pedidas se reservan con bastante anticipación.",
    emoji: "📅",
    acento: "magenta",
  },
];

/* ------------------------------------------------------------------ */
/* Cómo trabajamos                                                     */
/* ------------------------------------------------------------------ */

export const PROCESO = [
  {
    paso: "01",
    titulo: "Reserva tu fecha",
    descripcion:
      "Completa el formulario o escríbeme por WhatsApp. Confirmo disponibilidad y te envío el valor del pack.",
  },
  {
    paso: "02",
    titulo: "Planificamos la música",
    descripcion:
      "Llenamos juntos el cuestionario musical: los momentos clave, sus estilos favoritos y lo que no debe sonar.",
  },
  {
    paso: "03",
    titulo: "Montaje y prueba",
    descripcion:
      "Llego con anticipación, monto amplificación e iluminación y dejo todo probado antes del primer invitado.",
  },
  {
    paso: "04",
    titulo: "La noche perfecta",
    descripcion:
      "Leo la pista, conduzco el protocolo y mantengo la energía arriba hasta la última canción.",
  },
];

/* ------------------------------------------------------------------ */
/* Ticker de la banda animada                                          */
/* ------------------------------------------------------------------ */

export const TICKER = [
  "CUMPLEAÑOS",
  "DISCO PEQUE",
  "MATRIMONIOS",
  "BAUTIZOS",
  "GRADUACIONES",
  "DEEJAY",
  "ANIMACIÓN",
  "AMPLIFICACIÓN",
];
