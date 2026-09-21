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
 * Aplica el esquema cromático y tipográfico dinámico en el body.
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
 * Renderiza el soneto completo estructurado en cuartetos y tercetos
 * utilizando clases compatibles con el diseño Flexbox.
 * @param {Object} soneto - Objeto con title, author y array de stanzas.
 */
export function renderSoneto(soneto) {
  const displayElement = document.getElementById("soneto-display");
  if (!displayElement) return;

  const stanzasHtml = soneto.stanzas
    .map((stanza, index) => {
      const type = stanza.length === 4 ? "cuarteto" : "terceto";
      const versesHtml = stanza
        .map(verse => `<span class="c-verse">${verse}</span><br>`)
        .join("");

      return `<p class="c-stanza c-stanza--${type}" aria-label="Estrofa ${index + 1}">${versesHtml}</p><br>`;
    })
    .join("");

  displayElement.innerHTML = `
    <header class="c-soneto-header">
      <h2 class="c-soneto-header__title">${soneto.title}</h2>
      <span class="c-soneto-header__author">${soneto.author}</span>
    </header>
      ${stanzasHtml}
    
  `;
}