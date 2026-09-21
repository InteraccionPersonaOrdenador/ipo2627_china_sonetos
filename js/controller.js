import * as Model from "./model.js";
import * as View from "./view.js";

/**
 * Maneja el evento de selección de un soneto:
 * actualiza el modelo, aplica el tema visual y renderiza la obra.
 */
async function handleSonetoSelection(id) {
  Model.setCurrentId(id);
  View.applyTheme(id);
  View.showLoading();

  try {
    const soneto = await Model.fetchAndParseSoneto(id);
    View.renderSoneto(soneto);
    View.updateOptionTitle(id, `${soneto.title} — ${soneto.author}`);
  } catch (error) {
    console.error(error);
    View.showError("No se pudo cargar el soneto solicitado.");
  }
}

/**
 * Inicializa la aplicación:
 * puebla los controles y registra los listeners de eventos.
 */
export function initApp() {
  const catalog = Model.getSonetoCatalog();
  const initialId = Model.getCurrentId();

  // 1. Poblar el selector en la vista
  View.populateSelector(catalog, initialId);

  // 2. Conectar los eventos delegando en el manejador del controlador
  View.setupEventListeners({
    onSelectChange: handleSonetoSelection
  });
}

// Disparar el arranque al cargar el documento
document.addEventListener("DOMContentLoaded", initApp);