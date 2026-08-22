/**
 * Lógica del cuestionario de reserva.
 *
 * - Navegación por pasos con validación incremental
 * - Bloques condicionales según el tipo de evento
 * - Borrador guardado en localStorage (el formulario es largo: perder lo
 *   escrito por un refresco accidental sería fatal para la conversión)
 * - Envío a un endpoint opcional, con WhatsApp como alternativa siempre viva
 */

import { PASOS } from "../data/formulario";

const CLAVE_BORRADOR = "lookuman:borrador-reserva:v1";

const form = document.querySelector<HTMLFormElement>("#form-reserva");
if (form) iniciar(form);

function iniciar(form: HTMLFormElement) {
  const raiz = form.closest("section")!;
  const paneles = Array.from(form.querySelectorAll<HTMLElement>("[data-panel]"));
  const pastillas = Array.from(raiz.querySelectorAll<HTMLButtonElement>("[data-ir-a-paso]"));

  const barra = raiz.querySelector<HTMLElement>("[data-barra]")!;
  const numeroPaso = raiz.querySelector<HTMLElement>("[data-paso-actual]")!;
  const tituloPaso = raiz.querySelector<HTMLElement>("[data-paso-titulo]")!;
  const btnAnterior = form.querySelector<HTMLButtonElement>("[data-anterior]")!;
  const btnSiguiente = form.querySelector<HTMLButtonElement>("[data-siguiente]")!;
  const btnEnviar = form.querySelector<HTMLButtonElement>("[data-enviar]")!;
  const avisoError = form.querySelector<HTMLElement>("[data-error-paso]")!;
  const panelExito = raiz.querySelector<HTMLElement>("[data-exito]")!;
  const enlaceExito = raiz.querySelector<HTMLAnchorElement>("[data-exito-whatsapp]")!;
  const btnDescargar = raiz.querySelector<HTMLButtonElement>("[data-descargar]")!;
  const estadoGuardado = form.querySelector<HTMLElement>("[data-estado-guardado]")!;
  const contenedorProgreso = raiz.querySelector<HTMLElement>("[data-progreso]")!;

  const endpoint = form.dataset.endpoint ?? "";
  const whatsapp = form.dataset.whatsapp ?? "";
  const total = paneles.length;
  let actual = 0;

  /* ---------------------------------------------------------------- */
  /* Navegación                                                        */
  /* ---------------------------------------------------------------- */

  function mostrar(indice: number, desplazar = true) {
    actual = Math.max(0, Math.min(indice, total - 1));

    paneles.forEach((panel, i) => {
      panel.hidden = i !== actual;
    });

    pastillas.forEach((pastilla, i) => {
      if (i === actual) pastilla.setAttribute("aria-current", "step");
      else pastilla.removeAttribute("aria-current");

      if (i < actual) pastilla.dataset.completo = "";
      else delete pastilla.dataset.completo;
    });

    const progreso = ((actual + 1) / total) * 100;
    barra.style.width = `${progreso}%`;
    barra.setAttribute("aria-valuenow", String(actual + 1));
    numeroPaso.textContent = String(actual + 1);
    tituloPaso.textContent = PASOS[actual]?.titulo ?? "";

    btnAnterior.disabled = actual === 0;
    btnSiguiente.hidden = actual === total - 1;
    btnEnviar.hidden = actual !== total - 1;

    ocultarError();

    if (desplazar) {
      const y =
        contenedorProgreso.getBoundingClientRect().top +
        window.scrollY -
        (window.innerWidth < 640 ? 90 : 110);
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }

  /* ---------------------------------------------------------------- */
  /* Validación                                                        */
  /* ---------------------------------------------------------------- */

  type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

  /** Controles realmente activos: descarta los de bloques ocultos. */
  function controles(ambito: ParentNode): Control[] {
    return Array.from(
      ambito.querySelectorAll<Control>("input, select, textarea"),
    ).filter((el) => !el.disabled && !el.closest("[data-bloque][hidden]"));
  }

  function primerInvalido(indice: number): Control | undefined {
    return controles(paneles[indice]!).find((el) => !el.checkValidity());
  }

  /** Valida el paso y, si falla, lo señala en pantalla. El paso debe estar visible. */
  function validarPanel(indice: number): boolean {
    const invalido = primerInvalido(indice);
    if (!invalido) return true;

    mostrarError(mensajeDe(invalido));
    invalido.focus({ preventScroll: true });
    invalido.scrollIntoView({ behavior: "smooth", block: "center" });
    /* Fuerza el estado :user-invalid aunque el campo nunca haya sido tocado */
    invalido.dispatchEvent(new Event("blur"));
    return false;
  }

  function mensajeDe(el: Control): string {
    /* La etiqueta de un checkbox es un párrafo entero: no sirve de aviso. */
    if (el instanceof HTMLInputElement && el.type === "checkbox") {
      return "Falta marcar la casilla de confirmación para poder enviar.";
    }

    const etiqueta =
      el.closest("[data-campo]")?.querySelector("label, legend")?.textContent?.trim().replace(/\*$/, "").trim() ??
      "un campo";

    if (el.validity.valueMissing) return `Falta completar: ${etiqueta}`;
    if (el.validity.typeMismatch && el.type === "email")
      return "Revisa el correo electrónico: parece que falta algo.";
    return `Revisa el campo: ${etiqueta}`;
  }

  function mostrarError(texto: string) {
    avisoError.textContent = texto;
    avisoError.dataset.visible = "";
  }

  function ocultarError() {
    delete avisoError.dataset.visible;
    avisoError.textContent = "";
  }

  btnSiguiente.addEventListener("click", () => {
    if (validarPanel(actual)) mostrar(actual + 1);
  });

  btnAnterior.addEventListener("click", () => mostrar(actual - 1));

  pastillas.forEach((pastilla, destino) => {
    pastilla.addEventListener("click", () => {
      /* Hacia atrás siempre libre; hacia adelante, validando lo que queda en medio */
      if (destino <= actual) return mostrar(destino);
      for (let i = actual; i < destino; i++) {
        if (primerInvalido(i)) {
          mostrar(i);
          validarPanel(i);
          return;
        }
      }
      mostrar(destino);
    });
  });

  /* ---------------------------------------------------------------- */
  /* Bloques condicionales según tipo de evento                        */
  /* ---------------------------------------------------------------- */

  const selectorTipo = form.querySelector<HTMLSelectElement>('[name="tipo_evento"]');

  function sincronizarCondicionales() {
    const esMatrimonio = selectorTipo?.value === "Matrimonio";

    form.querySelectorAll<HTMLElement>("[data-solo-matrimonio]").forEach((bloque) => {
      bloque.hidden = !esMatrimonio;
    });

    form.querySelectorAll<HTMLElement>("[data-aviso-matrimonio]").forEach((aviso) => {
      if (esMatrimonio) delete aviso.dataset.visible;
      else aviso.dataset.visible = "";
    });
  }

  selectorTipo?.addEventListener("change", sincronizarCondicionales);

  /* ---------------------------------------------------------------- */
  /* Botones "necesitamos sugerencias" / "sorpréndenos"                */
  /* ---------------------------------------------------------------- */

  const etiquetasOriginales = new Map<HTMLButtonElement, string>();
  form.querySelectorAll<HTMLButtonElement>("[data-autocompletar]").forEach((b) => {
    etiquetasOriginales.set(b, b.textContent ?? "");
  });

  form.querySelectorAll<HTMLButtonElement>("[data-autocompletar]").forEach((boton) => {
    boton.addEventListener("click", () => {
      const valor = boton.dataset.autocompletar ?? "";
      const bloque = boton.closest("[data-bloque]");
      if (!bloque) return;

      let rellenados = 0;
      bloque
        .querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
          'input[type="text"], textarea',
        )
        .forEach((campo) => {
          /* Sólo el campo de canción, no el de artista, y sin pisar lo escrito */
          if (campo.name.endsWith("_artista")) return;
          if (campo.value.trim() !== "") return;
          campo.value = valor;
          campo.dispatchEvent(new Event("input", { bubbles: true }));
          rellenados++;
        });

      boton.textContent = rellenados > 0 ? "¡Listo!" : "Ya está completo";
      window.setTimeout(() => {
        boton.textContent = etiquetasOriginales.get(boton) ?? "";
      }, 1800);
    });
  });

  /* ---------------------------------------------------------------- */
  /* Recolección de respuestas                                         */
  /* ---------------------------------------------------------------- */

  function recolectar(): Record<string, string> {
    const datos: Record<string, string> = {};

    for (const el of controles(form)) {
      if (!el.name || el.name === "sitio_web") continue;

      if (el instanceof HTMLInputElement && (el.type === "checkbox" || el.type === "radio")) {
        if (!el.checked) continue;
        datos[el.name] = datos[el.name] ? `${datos[el.name]}, ${el.value}` : el.value;
        continue;
      }

      const valor = el.value.trim();
      if (valor) datos[el.name] = valor;
    }

    return datos;
  }

  /** Diccionario nombre-de-campo → etiqueta legible, derivado del esquema. */
  const ETIQUETAS: Record<string, string> = (() => {
    const mapa: Record<string, string> = {};
    for (const paso of PASOS) {
      for (const bloque of paso.bloques) {
        for (const campo of bloque.campos) {
          if (campo.tipo === "cancion") {
            mapa[`${campo.nombre}_cancion`] = `${campo.etiqueta} — canción`;
            mapa[`${campo.nombre}_artista`] = `${campo.etiqueta} — artista`;
          } else {
            mapa[campo.nombre] = campo.etiqueta;
          }
        }
      }
    }
    return mapa;
  })();

  /** Texto completo y legible, agrupado por paso y bloque. */
  function comoTexto(datos: Record<string, string>): string {
    const lineas: string[] = [
      "CUESTIONARIO MUSICAL — DEEJAY LOOKUMAN ENERGYMAN",
      `Enviado el ${new Date().toLocaleString("es-CL")}`,
      "",
    ];

    for (const paso of PASOS) {
      const delPaso: string[] = [];

      for (const bloque of paso.bloques) {
        const delBloque: string[] = [];

        for (const campo of bloque.campos) {
          const claves =
            campo.tipo === "cancion"
              ? [`${campo.nombre}_cancion`, `${campo.nombre}_artista`]
              : [campo.nombre];

          for (const clave of claves) {
            const valor = datos[clave];
            if (valor) delBloque.push(`  · ${ETIQUETAS[clave] ?? clave}: ${valor}`);
          }
        }

        if (delBloque.length) {
          if (bloque.titulo) delPaso.push(` ${bloque.titulo}`);
          delPaso.push(...delBloque);
        }
      }

      if (delPaso.length) {
        lineas.push(`── ${paso.titulo.toUpperCase()} ──`, ...delPaso, "");
      }
    }

    return lineas.join("\n");
  }

  /** Resumen breve: lo que cabe cómodamente en un mensaje de WhatsApp. */
  function comoResumen(datos: Record<string, string>): string {
    const partes = [
      "¡Hola Lookuman! Acabo de enviar el cuestionario musical.",
      "",
      `*Nombre:* ${datos.nombre_contacto ?? "—"}`,
      `*Evento:* ${datos.tipo_evento ?? "—"}`,
      `*Fecha:* ${datos.fecha_evento ?? "—"}`,
      `*Lugar:* ${[datos.lugar, datos.comuna].filter(Boolean).join(", ") || "—"}`,
      `*Invitados:* ${datos.invitados ?? "—"}`,
      `*Servicios:* ${datos.servicios ?? "—"}`,
    ];

    if (datos.estilos) partes.push(`*Estilos:* ${datos.estilos}`);
    if (datos.no_generos) partes.push(`*No tocar:* ${datos.no_generos}`);

    partes.push("", "Quedo atento/a a su confirmación de disponibilidad. ¡Gracias!");
    return partes.join("\n");
  }

  /* ---------------------------------------------------------------- */
  /* Borrador en localStorage                                          */
  /* ---------------------------------------------------------------- */

  let temporizador: number | undefined;
  let borradorActivo = true;

  function guardarBorrador() {
    if (!borradorActivo) return;
    window.clearTimeout(temporizador);
    temporizador = window.setTimeout(() => {
      try {
        localStorage.setItem(CLAVE_BORRADOR, JSON.stringify(recolectar()));
        estadoGuardado.textContent = "Borrador guardado en este navegador ✓";
      } catch {
        /* Modo incógnito o almacenamiento lleno: seguir sin borrador. */
      }
    }, 600);
  }

  function restaurarBorrador() {
    let datos: Record<string, string>;
    try {
      const crudo = localStorage.getItem(CLAVE_BORRADOR);
      if (!crudo) return;
      datos = JSON.parse(crudo) as Record<string, string>;
    } catch {
      return;
    }

    for (const [nombre, valor] of Object.entries(datos)) {
      const campos = form.querySelectorAll<Control>(`[name="${CSS.escape(nombre)}"]`);
      if (!campos.length) continue;

      const primero = campos[0]!;
      if (primero instanceof HTMLInputElement && (primero.type === "checkbox" || primero.type === "radio")) {
        const elegidos = valor.split(", ");
        campos.forEach((campo) => {
          if (campo instanceof HTMLInputElement) campo.checked = elegidos.includes(campo.value);
        });
      } else {
        primero.value = valor;
      }
    }

    estadoGuardado.textContent = "Recuperamos el borrador que dejaste a medias ✓";
  }

  form.addEventListener("input", guardarBorrador);
  form.addEventListener("change", guardarBorrador);

  /* ---------------------------------------------------------------- */
  /* Envío                                                             */
  /* ---------------------------------------------------------------- */

  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    /* Honeypot: si viene relleno, es un bot. Fingimos éxito y no enviamos. */
    const trampa = form.querySelector<HTMLInputElement>('[name="sitio_web"]');
    if (trampa?.value) return;

    for (let i = 0; i < total; i++) {
      if (primerInvalido(i)) {
        mostrar(i);
        validarPanel(i);
        return;
      }
    }

    const datos = recolectar();
    const etiquetaOriginal = btnEnviar.textContent;
    btnEnviar.disabled = true;
    btnEnviar.textContent = "Enviando…";

    if (endpoint) {
      try {
        const respuesta = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ ...datos, _resumen: comoTexto(datos) }),
        });
        if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
      } catch {
        btnEnviar.disabled = false;
        btnEnviar.textContent = etiquetaOriginal;
        mostrarError(
          "No pudimos enviar el formulario. Revisa tu conexión o envíanoslo directamente por WhatsApp.",
        );
        return;
      }
    }

    exito(datos);
  });

  function exito(datos: Record<string, string>) {
    enlaceExito.href = `https://wa.me/${whatsapp}?text=${encodeURIComponent(comoResumen(datos))}`;

    form.hidden = true;
    contenedorProgreso.hidden = true;
    panelExito.hidden = false;
    panelExito.scrollIntoView({ behavior: "smooth", block: "center" });

    /* Cancelar el guardado pendiente antes de limpiar, o volvería a
       escribir el borrador justo después de borrarlo. */
    borradorActivo = false;
    window.clearTimeout(temporizador);
    try {
      localStorage.removeItem(CLAVE_BORRADOR);
    } catch {
      /* sin borrador que limpiar */
    }

    /* Sin endpoint configurado, WhatsApp es el canal real de entrega, y el
       botón de la pantalla de éxito es quien lo dispara: abrirlo desde aquí
       lo bloquearía el navegador por no venir de un gesto directo. */
    btnDescargar.onclick = () => descargar(comoTexto(datos));
  }

  function descargar(texto: string) {
    const blob = new Blob([texto], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = "cuestionario-musical-lookuman.txt";
    enlace.click();
    URL.revokeObjectURL(url);
  }

  /* ---------------------------------------------------------------- */

  restaurarBorrador();
  sincronizarCondicionales();
  mostrar(0, false);
}
