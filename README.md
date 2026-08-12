## Expreso Rosso — Sitio web informativo

Sitio web estático (HTML, CSS y JavaScript puro, sin frameworks ni build tools) para la empresa de transporte urbano **Expreso Rosso** (Lobos, Buenos Aires), basado en las líneas que trabaja la empresa.

----

# Incluye:
- Tablero de próximas salidas estilo "split-flap"
- Sección de líneas con mapa de recorrido y horarios (semana / domingos y feriados)
- Mapa interactivo (Leaflet + OpenStreetMap) con las paradas de cada línea
- Alertas de servicio en tiempo real (estático, editable)
- Métodos de pago-
- Quiénes somos y formulario de contacto


## Estructura del proyecto

```
expreso-rosso/
├── index.html          → toda la estructura del sitio (una sola página con secciones ancladas)
├── css/
│   └── style.css       → estilos y diseño visual
├── js/
│   ├── data.js         → líneas, paradas, horarios y próximas salidas (editar acá los datos)
│   └── app.js          → lógica: tablero, tabs de línea, mapa, formulario
└── README.md
```
----

### Cómo actualizar horarios o alertas

Todo el contenido dinámico (líneas, paradas, horarios, coordenadas) vive en `js/data.js`. Para agregar una parada o cambiar un horario, editá ese archivo — no hace falta tocar el HTML.

Las alertas de la sección "Alertas en tiempo real" están escritas directamente en `index.html` (buscá `id="alertas"`) porque son pocas y cambian con menor frecuencia; se pueden mover a `data.js` más adelante si se necesita actualizarlas seguido.



