// js/model.js

// Lista de archivos Markdown disponibles en la carpeta /sonetos
const sonetoFiles = [
  { 
    id: "mientrasPorCompetir", 
    path: "sonetos/mientrasPorCompetir.md",
    title: "Mientras por competir con tu cabello" 
  },
  { 
    id: "eraseUnHombre", 
    path: "sonetos/eraseUnHombre.md",
    title: "A una nariz" 
  },
  { 
    id: "escritoEstaEnMiAlma", 
    path: "sonetos/escritoEstaEnMiAlma.md",
    title: "Escrito está en mi alma " 
  },
  { 
    id: "mireLosMuros", 
    path: "sonetos/mireLosMuros.md",
    title: "Miré los muros " 
  },
  { 
    id: "unSonetoMeManda", 
    path: "sonetos/unSonetoMeManda.md",
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
 * Descarga y parsea el soneto solicitado mediante fetch.
 * Utiliza caché para evitar descargas repetidas.
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

  const rawMarkdown = await response.text();
  const parsed = parseSonetoMarkdown(rawMarkdown, id);

  cache.set(id, parsed);
  return parsed;
}

/**
 * Parsea el texto del archivo .md extrayendo metadatos y estructurando estrofas.
 */

function parseSonetoMarkdown(text, defaultId) {
  // En js/model.js dentro de parseSonetoMarkdown(text, defaultId):

// 1. Extraer título y autor
const titleMatch = text.match(/#*\s*T[ií]tulo:\s*["']?([^"\r\n]+)["']?/i);
const authorMatch = text.match(/#*\s*Autor:\s*["']?([^"\r\n]+)["']?/i);

const title = titleMatch ? titleMatch[1].trim() : defaultId;
const author = authorMatch ? authorMatch[1].trim() : "Anónimo";

// 2. Extraer los versos procesando cada línea
const allLines = text.split(/\r?\n/).map(line => line.trim());

const verses = allLines.filter(line => {
  // Ignorar líneas vacías
  if (line.length === 0) return false;

  // Ignorar líneas que empiezan por Titulo: o Autor:
  if (/^#*\s*T[ií]tulo:/i.test(line)) return false;
  if (/^#*\s*Autor:/i.test(line)) return false;

  // Ignorar únicamente si la línea entera es la palabra "Soneto" (o "# Soneto")
  if (/^#*\s*Soneto\s*$/i.test(line)) return false;

  // Ignorar separadores markdown tipo --- o ***
  if (/^[-*_]{3,}$/.test(line)) return false;

  return true;
});

// 3. Agrupar métricamente en cuartetos (4, 4) y tercetos (3, 3)
const stanzas = [
  verses.slice(0, 4),
  verses.slice(4, 8),
  verses.slice(8, 11),
  verses.slice(11, 14)
].filter(stanza => stanza.length > 0);

return {
  id: defaultId,
  title,
  author,
  stanzas
};
}