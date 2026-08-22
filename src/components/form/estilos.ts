import type { Acento } from "../../data/formulario";

/**
 * Tailwind purga por coincidencia literal en el código fuente, así que las
 * clases de acento se declaran completas aquí en vez de interpolarse.
 */

export const ACENTO_TEXTO: Record<Acento, string> = {
  cyan: "text-neon-cyan",
  magenta: "text-neon-magenta",
  yellow: "text-neon-yellow",
};

export const ACENTO_PUNTO: Record<Acento, string> = {
  cyan: "bg-neon-cyan shadow-[0_0_14px_2px_var(--color-neon-cyan)]",
  magenta: "bg-neon-magenta shadow-[0_0_14px_2px_var(--color-neon-magenta)]",
  yellow: "bg-neon-yellow shadow-[0_0_14px_2px_var(--color-neon-yellow)]",
};

export const ACENTO_BORDE: Record<Acento, string> = {
  cyan: "border-neon-cyan/40",
  magenta: "border-neon-magenta/40",
  yellow: "border-neon-yellow/40",
};

export const ACENTO_HALO: Record<Acento, string> = {
  cyan: "bg-neon-cyan/20",
  magenta: "bg-neon-magenta/20",
  yellow: "bg-neon-yellow/20",
};

/**
 * Chip / radio seleccionado. Se aplica sobre el <label>, que contiene al
 * input: por eso `has-[:checked]` y no `peer-checked` (el label es el padre
 * del control, no su hermano).
 */
export const ACENTO_ACTIVO: Record<Acento, string> = {
  cyan: "has-[:checked]:border-neon-cyan has-[:checked]:bg-neon-cyan/15 has-[:checked]:text-neon-cyan has-[:checked]:shadow-[0_0_22px_-4px_var(--color-neon-cyan)]",
  magenta:
    "has-[:checked]:border-neon-magenta has-[:checked]:bg-neon-magenta/15 has-[:checked]:text-neon-magenta has-[:checked]:shadow-[0_0_22px_-4px_var(--color-neon-magenta)]",
  yellow:
    "has-[:checked]:border-neon-yellow has-[:checked]:bg-neon-yellow/15 has-[:checked]:text-neon-yellow has-[:checked]:shadow-[0_0_22px_-4px_var(--color-neon-yellow)]",
};

/** Anillo de foco del label cuando el input oculto recibe foco por teclado. */
export const FOCO_LABEL =
  "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-neon-cyan " +
  "has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-ink-900";

/**
 * Caja/punto del control, que sí es hermano del input, más el tick interno
 * alcanzado con un selector descendente.
 */
export const ACENTO_MARCA: Record<Acento, string> = {
  cyan: "peer-checked:border-neon-cyan peer-checked:bg-neon-cyan peer-checked:[&>*]:scale-100 peer-checked:[&>*]:opacity-100",
  magenta:
    "peer-checked:border-neon-magenta peer-checked:bg-neon-magenta peer-checked:[&>*]:scale-100 peer-checked:[&>*]:opacity-100",
  yellow:
    "peer-checked:border-neon-yellow peer-checked:bg-neon-yellow peer-checked:[&>*]:scale-100 peer-checked:[&>*]:opacity-100",
};

/**
 * Campo de texto: base compartida por input, textarea y select.
 * `user-invalid` sólo se activa después de que la persona interactúa,
 * así el formulario no aparece "en rojo" al cargar.
 */
export const CAMPO_BASE =
  "peer w-full rounded-2xl border border-white/10 bg-ink-850/60 text-[15px] text-white " +
  "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] " +
  "transition-[border-color,box-shadow,background-color] duration-300 ease-out " +
  "hover:border-white/25 hover:bg-ink-850/90 " +
  "focus:border-neon-cyan/70 focus:bg-ink-850 focus:outline-none " +
  "focus:ring-4 focus:ring-neon-cyan/15 focus:shadow-[0_0_30px_-8px_var(--color-neon-cyan)] " +
  "user-invalid:border-rose-500/70 user-invalid:ring-4 user-invalid:ring-rose-500/15 " +
  /* El verde sólo aparece si además hay contenido: evita que cada campo
     opcional por el que se tabula quede marcado como "validado". */
  "user-valid:not-placeholder-shown:border-emerald-400/40";

/** Etiqueta flotante en su posición "arriba" (estado activo). */
export const ETIQUETA_FLOTANTE =
  "pointer-events-none absolute left-5 top-3 z-10 origin-left text-[11px] font-semibold uppercase " +
  "tracking-[0.14em] text-white/55 transition-all duration-300 ease-out " +
  "peer-focus:text-neon-cyan peer-user-invalid:text-rose-300";

/** Estado "reposo": la etiqueta baja y se agranda como placeholder. */
export const ETIQUETA_REPOSO =
  "peer-[:placeholder-shown:not(:focus)]:top-1/2 " +
  "peer-[:placeholder-shown:not(:focus)]:-translate-y-1/2 " +
  "peer-[:placeholder-shown:not(:focus)]:text-[15px] " +
  "peer-[:placeholder-shown:not(:focus)]:font-normal " +
  "peer-[:placeholder-shown:not(:focus)]:normal-case " +
  "peer-[:placeholder-shown:not(:focus)]:tracking-normal " +
  "peer-[:placeholder-shown:not(:focus)]:text-white/45";

/** Igual que el anterior pero anclado arriba (textarea, no puede centrarse). */
export const ETIQUETA_REPOSO_TEXTAREA =
  "peer-[:placeholder-shown:not(:focus)]:top-4 " +
  "peer-[:placeholder-shown:not(:focus)]:text-[15px] " +
  "peer-[:placeholder-shown:not(:focus)]:font-normal " +
  "peer-[:placeholder-shown:not(:focus)]:normal-case " +
  "peer-[:placeholder-shown:not(:focus)]:tracking-normal " +
  "peer-[:placeholder-shown:not(:focus)]:text-white/45";

export const AYUDA = "mt-2 pl-5 text-xs leading-relaxed text-white/40";
