// js/model.js

// Lista de archivos JSON disponibles en la carpeta /sonetos
const sonetoFiles = [
  { 
    id: "mientrasPorCompetir", 
    path: "sonetos/mientrasPorCompetir.json",
    title: "Mientras por competir con tu cabello" 
  },
  { 
    id: "eraseUnHombre", 
    path: "sonetos/eraseUnHombre.json",
    title: "A una nariz" 
  },
  { 
    id: "escritoEstaEnMiAlma", 
    path: "sonetos/escritoEstaEnMiAlma.json",
    title: "Escrito está en mi alma " 
  },
  { 
    id: "mireLosMuros", 
    path: "sonetos/mireLosMuros.json",
    title: "Miré los muros " 
  },
  { 
    id: "unSonetoMeManda", 
    path: "sonetos/unSonetoMeManda.json",
    title: "Definición de un soneto" 
  }
];

const cache = new Map();
let currentSonetoId = "mientrasPorCompetir";

/**
 * Retorna la lista de sonetos disponibles.
 */
export function getSonetoCatalog() {
  return sonetoFiles;
}

/**
 * Retorna el ID del soneto actualmente seleccionado.
 */
export function getCurrentId() {
  return currentSonetoId;
}

/**
 * Actualiza el ID del soneto seleccionado.
 */
export function setCurrentId(id) {
  currentSonetoId = id;
}

/**
 * Descarga y procesa el soneto solicitado mediante fetch.
 * Utiliza caché para evitar descargas repetidas.
 * El nombre de la función se mantiene para no modificar sus consumidores.
 */
export async function fetchAndParseSoneto(id) {
  if (cache.has(id)) {
    return cache.get(id);
  }

  const sonetoInfo = sonetoFiles.find(item => item.id === id);
  if (!sonetoInfo) {
    throw new Error(`Soneto no encontrado: ${id}`);
  }

  const response = await fetch(sonetoInfo.path);
  if (!response.ok) {
    throw new Error(`Error al leer el archivo ${sonetoInfo.path}`);
  }

  const data = await response.json();
  const parsed = validateSonetoData(data, id, sonetoInfo.path);

  cache.set(id, parsed);
  return parsed;
}

/**
 * Comprueba que el JSON contiene la estructura esperada por la vista.
 */
function validateSonetoData(data, id, path) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new TypeError(`Formato JSON no válido en ${path}`);
  }

  if (typeof data.title !== "string" || data.title.trim() === "") {
    throw new TypeError(`El soneto ${id} no tiene un título válido`);
  }

  if (typeof data.author !== "string" || data.author.trim() === "") {
    throw new TypeError(`El soneto ${id} no tiene un autor válido`);
  }

  const stanzaLengths = [4, 4, 3, 3];
  const validStanzas = Array.isArray(data.stanzas)
    && data.stanzas.length === stanzaLengths.length
    && data.stanzas.every((stanza, index) =>
      Array.isArray(stanza)
      && stanza.length === stanzaLengths[index]
      && stanza.every(verse => typeof verse === "string" && verse.trim() !== "")
    );

  if (!validStanzas) {
    throw new TypeError(`El soneto ${id} debe tener estrofas con estructura 4-4-3-3`);
  }

  return {
    id,
    title: data.title.trim(),
    author: data.author.trim(),
    stanzas: data.stanzas
  };
}
