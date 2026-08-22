# Deejay Lookuman EnergyMan — Landing + Cuestionario Musical

Landing page de conversión y sistema de reservas para **Deejay Lookuman
EnergyMan**: servicios profesionales de deejay, animación y amplificación en
Chile.

El formulario de reserva integra completo el *Cuestionario Musical de
Matrimonio* oficial (14 secciones) reorganizado en 7 pasos navegables.

---

## Stack

| Pieza | Elección |
| --- | --- |
| Framework | [Astro](https://astro.build) 7 — salida estática, cero JS por defecto |
| Estilos | [Tailwind CSS](https://tailwindcss.com) 4 vía `@tailwindcss/vite` |
| Tipografías | Autoalojadas con la API de fuentes de Astro (Anton + Plus Jakarta Sans) |
| JS de cliente | ~6 KB propios, sin dependencias de runtime |

---

## Comandos

```bash
npm install        # instalar dependencias
npm run dev        # servidor de desarrollo en localhost:4321
npm run build      # astro check + build estático a dist/
npm run preview    # previsualizar la build
```

El `build` corre `astro check` primero, así que un error de tipos rompe el
build antes de desplegar.

---

## Estructura

```
src/
├── data/
│   ├── sitio.ts         ← marca, contacto, eventos, equipamiento, proceso
│   └── formulario.ts    ← esquema completo del cuestionario (7 pasos)
├── components/
│   ├── Nav.astro          Hero.astro       Ticker.astro
│   ├── Servicios.astro    Equipamiento.astro
│   ├── Proceso.astro      Reserva.astro    ← sección del formulario
│   ├── Footer.astro       CtaFlotante.astro
│   └── form/
│       ├── estilos.ts     ← clases compartidas de los campos
│       ├── Campo.astro    ← despachador por tipo de campo
│       ├── Bloque.astro   Input.astro      Textarea.astro
│       ├── Select.astro   Chips.astro      Radio.astro
│       ├── Checkbox.astro Cancion.astro
├── scripts/reserva.ts   ← navegación por pasos, validación, borrador, envío
├── layouts/BaseLayout.astro
├── pages/index.astro
└── styles/global.css    ← tokens del sistema de diseño
```

### Editar contenido

- **Teléfono, redes, eventos, equipamiento:** `src/data/sitio.ts`.
  El número de WhatsApp vive en una sola constante y se propaga a todos los
  botones del sitio.
- **Preguntas del cuestionario:** `src/data/formulario.ts`. Añadir un campo es
  añadir un objeto al array del bloque correspondiente; el renderizado, la
  validación, el borrador y el resumen se adaptan solos.

Tipos de campo disponibles: `texto`, `email`, `tel`, `fecha`, `hora`, `numero`,
`textarea`, `select`, `radio`, `chips`, `checkbox` y `cancion` (par
canción + artista).

---

## Recepción de las respuestas

El formulario tiene dos modos, según haya o no un endpoint configurado:

**Sin configurar (por defecto).** Al enviar, la pantalla final ofrece un botón
que abre WhatsApp con un resumen precargado, más un botón para descargar todas
las respuestas en `.txt`. No requiere servidor.

**Con endpoint.** Definir `PUBLIC_FORM_ENDPOINT` en un `.env` (ver
`.env.example`). El formulario hace `POST` de un JSON con todos los campos más
una clave `_resumen` con el cuestionario completo ya formateado y legible.
Funciona con Formspree, Web3Forms, Getform, Basin o una función serverless
propia. Si la petición falla, se avisa en pantalla y WhatsApp queda como
alternativa.

---

## Detalles de implementación

- **Borrador automático.** El cuestionario es largo, así que las respuestas se
  guardan en `localStorage` mientras se completa y se restauran al volver. Se
  limpia al enviar.
- **Bloques condicionales.** Las canciones de protocolo de matrimonio sólo
  aparecen si el tipo de evento es «Matrimonio»; los campos ocultos no se
  validan ni se envían.
- **Validación por pasos.** Nativa (`checkValidity`) y progresiva: los estados
  de error usan `:user-invalid`, así ningún campo se pinta de rojo antes de que
  la persona lo toque.
- **Antispam.** Campo trampa oculto, sin captchas ni terceros.
- **Accesibilidad.** Navegación completa por teclado, `:focus-visible` en todos
  los controles, enlace para saltar al formulario, `aria-current` en el paso
  activo y respeto por `prefers-reduced-motion`.
- **Rendimiento.** Página estática, tipografías autoalojadas con métricas de
  respaldo (sin salto de texto) y ninguna petición a terceros.

---

## Despliegue

Es un sitio estático: `npm run build` genera `dist/`, que se puede publicar tal
cual en Netlify, Vercel, Cloudflare Pages, GitHub Pages o cualquier hosting.

Antes de publicar, ajustar `site` en `astro.config.mjs` al dominio real (se usa
para la URL canónica y las etiquetas Open Graph).
