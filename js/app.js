import * as Model from "./model.js";
import * as View from "./view.js";

// Función encargada de cargar y mostrar un soneto específico
async function loadAndDisplaySoneto(id) {
  Model.setCurrentId(id);
  View.applyTheme(id);
  View.showLoading();

  try {
    const soneto = await Model.fetchAndParseSoneto(id);
    View.renderSoneto(soneto);
    View.updateOptionTitle(id, `${soneto.title}`);
  } catch (error) {
    console.error(error);
    View.showError("No se pudo cargar el soneto solicitado.");
  }
}

// Función principal de arranque que orquesta todo al inicio
async function initApp() {
  const catalog = Model.getSonetoCatalog();
  const initialId = Model.getCurrentId();

  // 1. Poblar el selector de sonetos
  View.populateSelector(catalog, initialId);

  // 2. Conectar el listener delegando en la función de carga
  View.setupEventListeners({
    onSelectChange: loadAndDisplaySoneto
  });

}

document.addEventListener("DOMContentLoaded", initApp);