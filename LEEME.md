# Red Ciudadana de Avistamiento de Cetáceos del Perú

Sitio estático de seis páginas, preparado para GitHub Pages. No necesita instalación, Node.js ni proceso de compilación.

## Estructura exacta

```text
mi-repositorio/
├── index.html                         # Inicio
├── sobre-la-red.html                  # Origen, funcionamiento y aliados
├── como-reportar.html                 # Guía y buenas prácticas
├── avistamientos.html                 # Mapa interactivo y filtros
├── resultados-cientificos.html        # Publicaciones y acceso a datos
├── reporta.html                       # Formulario de avistamiento
├── 404.html                           # Página no encontrada
├── .nojekyll                          # Compatibilidad con GitHub Pages
├── LEEME.md
└── assets/
    ├── css/
    │   └── styles.css                 # Diseño completo y responsive
    ├── js/
    │   ├── main.js                    # Menú, parallax y utilidades
    │   ├── experiencia.js             # Video, especies, galería y contadores
    │   ├── mapa.js                    # Mapa, filtros, transiciones y fichas
    │   └── formularios.js             # Validación, ubicación y correo
    ├── data/
    │   ├── avistamientos.js           # Único archivo a editar para los registros
    │   └── peru.geojson               # Mapa base local de Perú
    ├── img/                           # Fotografías WebP, incluidas las 3 especies
    ├── videos/
    │   ├── hero-ballena.mp4           # Video H.264 de la portada y galería
    │   └── hero-ballena.webm          # Alternativa VP9 para mayor compatibilidad
    ├── logos/                         # Logos oficiales SVG/PNG + favicon
    ├── docs/                          # PDF públicos, si se agregan
    ├── fonts/                         # Marcellus y Lato locales
    └── vendor/leaflet/                # Librerías locales del mapa
```

## Publicar en GitHub Pages

1. Descargue el proyecto completo y suba **el contenido de esta carpeta** a la raíz del repositorio. `index.html` debe quedar en la raíz, no dentro de otra subcarpeta.
2. En GitHub, abra **Settings → Pages**.
3. En **Build and deployment**, elija **Deploy from a branch**.
4. Seleccione la rama `main`, la carpeta `/ (root)` y pulse **Save**.
5. GitHub mostrará la dirección pública al terminar el despliegue.

Todas las rutas son relativas, por lo que el sitio funciona tanto en `usuario.github.io` como en `usuario.github.io/mi-repositorio/`.

## Agregar registros reales al mapa

Edite `assets/data/avistamientos.js` y agregue un objeto por registro dentro de `window.AVISTAMIENTOS = [...]`. El mismo archivo contiene un ejemplo comentado con los campos y su formato. No publique correos, teléfonos ni datos personales sin autorización.

El mapa crea automáticamente los filtros, colores, leyenda, agrupaciones y fichas. Al filtrar, acerca la vista a los resultados. Cada registro puede incluir los campos opcionales `foto` y `credito`; la fotografía debe estar guardada en `assets/img/`. Si no hay registros, muestra un estado vacío en lugar de datos ficticios. El mapa base vectorial de Perú está incluido localmente y no depende de servidores de mapas externos.

Los tres contadores de la portada se calculan con este mismo archivo: total de registros, especies únicas y observadores únicos. Mientras no haya datos, permanecen como `—`; no se muestran cifras estimadas.

## Experiencias interactivas incluidas

- Portada cinematográfica con video local, imagen de respaldo y botón de pausa.
- Olas, corrientes, entradas escalonadas y parallax editorial al desplazarse.
- Explorador de tres especies con pestañas utilizables mediante ratón, tacto o teclado.
- Galería horizontal con botones, teclado y visor ampliable de fotografías y video.
- Mapa con agrupaciones, filtros, acercamiento animado y fichas con fotografía opcional.
- Contadores animados únicamente cuando existen datos públicos cargados.

Las animaciones respetan la preferencia del sistema `prefers-reduced-motion`. El video de fondo no tiene sonido y puede pausarse.

## Imágenes, videos, logos y documentos

- **Imágenes:** guárdelas en `assets/img/`, preferiblemente en WebP y con un ancho máximo de 1600 px. Actualice la ruta `src` y el texto `alt` en el HTML correspondiente.
- **Videos:** guárdelos en `assets/videos/` como MP4 o WebM. Para portada, use también una imagen de respaldo en `assets/img/`.
- **Logos:** guárdelos en `assets/logos/` como SVG o PNG con fondo transparente. El símbolo incluido es una marca gráfica provisional del sitio, no un logo institucional oficial.
- **Documentos:** guarde los PDF en `assets/docs/`. Actualmente, el botón de bases de uso abre el documento oficial de Google Docs proporcionado.

Material audiovisual oficial: https://drive.google.com/drive/folders/1rOxQGqTgnAsAodW9FZS576GGXUvHEjyo?usp=drive_link

Logos oficiales: https://drive.google.com/drive/folders/1s4yr4lUBWHMk3VMW4knNZtSv0PbnsZSr?usp=drive_link

## Formularios en esta versión estática

GitHub Pages no dispone de un servidor para recibir y almacenar formularios o archivos. Por ello, los formularios validan los campos y preparan un correo dirigido a `cetaceospe@gmail.com`. El visitante debe enviar ese correo; en un avistamiento también debe adjuntar las evidencias seleccionadas. La página no afirma que una solicitud haya sido recibida antes de ese envío.

Si más adelante se contrata un servicio de formularios con carga de archivos, podrá sustituirse esta alternativa sin cambiar el diseño.

## Créditos de recursos provisionales

Los recursos audiovisuales incluidos son reutilizables según sus páginas de origen. Se recomienda sustituirlos por el material oficial de la Red cuando esté disponible, conservando los créditos que correspondan.

- `hero-ballena.mp4` y `hero-ballena.webm`: Eclipse Chasers / Pexels, video “Humpback whale breach” 18680289, optimizado a 1280 px y sin audio; se incluyen dos códecs para ampliar la compatibilidad.
- `hero-ballena.webp`: Eclipse Chasers / Pexels, foto 22763975.
- `especie-delfin-comun.webp`: NOAA NMFS / Wikimedia Commons, “Common dolphin noaa.jpg”, dominio público.
- `especie-cachalote.webp`: Bernard Spragg. NZ / Wikimedia Commons, “Sperm Whale. (Physeter macrocephalus) (37611504244).jpg”, CC0.
- `ballena-salto.webp`: Pexels, foto 3635870.
- `delfines.webp`: Jonas Von Werne / Pexels, foto 3354346.
- `paracas-barco.webp` y `paracas-atardecer.webp`: Leandra FF / Pexels, foto 38830961.
- `ballena-vertical.webp`: Carlos Reyes / Pexels, foto 16159288.
- `cola-ballena.webp`: Unsplash, fotografía ZLDcgDaDvro.
- Tipografías Marcellus y Lato: Google Fonts, licencias SIL Open Font License.
- Mapa: Leaflet (BSD 2-Clause), Leaflet.markercluster (MIT) y geometría de Natural Earth (dominio público; atribución visible en el mapa).
