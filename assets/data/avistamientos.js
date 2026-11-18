/*
 * Datos públicos del mapa. Agregue un objeto por cada avistamiento validado.
 * No incluya teléfonos, correos ni información privada del observador.
 *
 * Ejemplo de estructura (reemplace los valores por datos reales):
 * {
 *   id: "RCAC-0001",
 *   especie: "Ballena jorobada",
 *   tipo: "ballena", // Opcional: "ballena", "delfin" u "otro"
 *   nombreCientifico: "Megaptera novaeangliae",
 *   fecha: "2026-08-15",
 *   observador: "Nombre autorizado para publicación",
 *   region: "Piura",
 *   latitud: -4.20,
 *   longitud: -81.10,
 *   foto: "assets/img/nombre-de-la-foto.webp", // Opcional
 *   credito: "Autor o fuente de la fotografía" // Opcional, recomendado
 * }
 */
window.AVISTAMIENTOS = [
{
id: "RCAC-0001",
especie: "Ballena jorobada",
tipo: "ballena", // Opcional: "ballena", "delfin" u "otro"
nombreCientifico: "Megaptera novaeangliae",
fecha: "2026-08-15",
observador: "Nombre autorizado para publicación",
region: "Piura",
latitud: -4.20,
longitud: -81.10,
foto: "assets/img/especie-cachalote.webp", // Opcional
credito: "Marco Begazo" // Opcional, recomendado
 },
{
id: "RCAC-0002",
especie: "delfin",
tipo: "delfin", // Opcional: "ballena", "delfin" u "otro"
nombreCientifico: "Megaptera novaeangliae",
fecha: "2026-08-15",
observador: "Nombre autorizado para publicación",
region: "A",
latitud: -13.20,
longitud: -91.10,
foto: "assets/img/especie-cachalote.webp", // Opcional
credito: "Marco Begazo" // Opcional, recomendado
 },
{
id: "RCAC-0001",
especie: "otras especies",
tipo: "otro", // Opcional: "ballena", "delfin" u "otro"
nombreCientifico: "Megaptera novaeangliae",
fecha: "2026-08-15",
observador: "Nombre autorizado para publicación",
region: "B",
latitud: -12.20,
longitud: -92.10,
foto: "assets/img/especie-cachalote.webp", // Opcional
credito: "Marco Begazo" // Opcional, recomendado
 }
];
