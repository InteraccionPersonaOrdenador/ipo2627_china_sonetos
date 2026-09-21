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
  // 1. Extraer título y autor de forma tolerante a tildes y formatos
  const titleMatch = text.match(/#*\s*T[ií]tulo:\s*["']?([^"\r\n]+)["']?/i);
  const authorMatch = text.match(/#*\s*Autor:\s*["']?([^"\r\n]+)["']?/i);

  const title = titleMatch ? titleMatch[1].trim() : defaultId;
  const author = authorMatch ? authorMatch[1].trim() : "Anónimo";

  // 2. Aislar el cuerpo poético:
  // Si existe la palabra 'Soneto', corta tras ella; si no, limpia las líneas de metadatos.
  let sonetoBody = "";
  if (/Soneto/i.test(text)) {
    const parts = text.split(/#*\s*Soneto[^\r\n]*[\r\n]+/i);
    sonetoBody = parts[1] || "";
  } else {
    sonetoBody = text
      .split(/\r?\n/)
      .filter(line => !/^#*\s*(T[ií]tulo|Autor):/i.test(line.trim()))
      .join("\n");
  }

  // 3. Extracción de versos:
  // Intento A: Dividir por saltos de línea habituales
  let verses = sonetoBody
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0 && !/^[-*_]{3,}$/.test(line));

  // Intento B: Si vino todo en 1 o pocas líneas, dividir por signos de puntuación final de verso (; o .)
  if (verses.length < 14 && sonetoBody.includes(";")) {
    verses = sonetoBody
      .split(/(?<=[;.\n])\s+/)
      .map(v => v.trim())
      .filter(v => v.length > 0);
  }

  // 4. Agrupar métricamente en cuartetos (4, 4) y tercetos (3, 3)
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