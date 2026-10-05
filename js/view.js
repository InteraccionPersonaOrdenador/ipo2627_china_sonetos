// js/view.js

/**
 * Configura los escuchadores de eventos sobre los identificadores del DOM.
 * @param {Object} handlers - Callbacks delegados por el controlador.
 * @param {Function} handlers.onSelectChange - Acción a ejecutar al seleccionar una obra.
 */
export function setupEventListeners(handlers = {}) {
  const selectElement = document.getElementById("soneto-select");
  if (!selectElement) return;

  selectElement.addEventListener("change", (event) => {
    if (typeof handlers.onSelectChange === "function") {
      handlers.onSelectChange(event.target.value);
    }
  });
}

/**
 * Puebla el menú desplegable (#soneto-select) con las opciones disponibles.
 * @param {Array} options - Lista de objetos de sonetos ({ id, path }).
 * @param {string} activeId - Identificador del soneto por defecto.
 */
export function populateSelector(options, activeId) {
  const selectElement = document.getElementById("soneto-select");
  if (!selectElement) return;

  selectElement.innerHTML = options
    .map(({ id, title }) => 
      `<option value="${id}" ${id === activeId ? "selected" : ""}>${title || id}</option>`
    )
    .join("");
}

/**
 * Actualiza el texto visible de una opción concreta por su ID.
 * @param {string} id - Identificador del soneto.
 * @param {string} newLabel - Cadena formateada (ej. "Título").
 */
export function updateOptionTitle(id, newLabel) {
  const selectElement = document.getElementById("soneto-select");
  if (!selectElement) return;

  const option = selectElement.querySelector(`option[value="${id}"]`);
  if (option) {
    option.textContent = newLabel;
  }
}

/**
 * Selecciona el acento cromático del soneto en el body.
 * @param {string} sonetoId - Identificador para activar body[data-soneto="..."] en CSS.
 */
export function applyTheme(sonetoId) {
  const bodyElement = document.getElementById("app-body") || document.body;
  bodyElement.setAttribute("data-soneto", sonetoId);
}

/**
 * Muestra un estado de carga en el contenedor del poema (#soneto-display).
 */
export function showLoading() {
  const displayElement = document.getElementById("soneto-display");
  if (displayElement) {
    displayElement.innerHTML = `<p class="c-status">Cargando soneto...</p>`;
  }
}

/**
 * Muestra un mensaje de error en el visor principal.
 * @param {string} message - Texto informativo del error.
 */
export function showError(message) {
  const displayElement = document.getElementById("soneto-display");
  if (displayElement) {
    displayElement.innerHTML = `<p class="c-status c-status--error">${message}</p>`;
  }
}

/**
 * Renderiza el soneto con un párrafo por estrofa y un salto de línea
 * entre versos. El espacio entre estrofas se controla desde CSS.
 * @param {Object} soneto - Objeto con title, author y array de stanzas.
 */
export function renderSoneto(soneto) {
  const displayElement = document.getElementById("soneto-display");
  if (!displayElement) return;

  const header = document.createElement("header");
  header.className = "c-soneto-header";

  const title = document.createElement("h2");
  title.className = "c-soneto-header__title";
  title.textContent = soneto.title;

  const author = document.createElement("span");
  author.className = "c-soneto-header__author";
  author.textContent = soneto.author;
  header.append(title, author);

  const body = document.createElement("blockquote");
  body.className = "c-soneto-body";

  soneto.stanzas.forEach(stanza => {
    const paragraph = document.createElement("p");
    const type = stanza.length === 4 ? "cuarteto" : "terceto";
    paragraph.className = `c-stanza c-stanza--${type}`;
    stanza.forEach((verse, verseIndex) => {
      if (verseIndex > 0) paragraph.append(document.createElement("br"));
      paragraph.append(document.createTextNode(verse));
    });

    body.append(paragraph);
  });

  displayElement.replaceChildren(header, body);
}
