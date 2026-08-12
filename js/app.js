document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Lista de próximas salidas (sección Líneas) ---------- */
function renderDepartures(){
  const wrap = document.getElementById('departureList');
  if (!wrap) return;
  wrap.innerHTML = NEXT_DEPARTURES.map(dep => `
    <div class="departure-item">
      <span class="departure-badge badge-${dep.line}">LÍNEA<br>${dep.line}</span>
      <div>
        <div class="departure-dest">${dep.destination}</div>
        <div class="departure-sub">${LINES[dep.line]?.route ?? ''}</div>
      </div>
      <div class="departure-right">
        <div class="departure-eta ${parseInt(dep.eta) <= 5 ? 'soon' : ''}">${dep.eta}</div>
        <div class="departure-proximo">próximo</div>
      </div>
    </div>
  `).join('');
}

/* ---------- Panel de línea (botones grandes + horarios) ---------- */
function renderLine(id){
  const line = LINES[id];

  document.querySelectorAll('.line-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.line === id);
  });

  const panel = document.getElementById('linePanel');
  panel.innerHTML = `
    <div class="line-panel-head">
      <span class="line-panel-route">${line.route}</span>
    </div>
    <div class="route-track" style="--line-color:${line.color}">
      ${line.stops.map(s => `
        <button class="route-stop" data-lat="${s.lat}" data-lng="${s.lng}">
          <span class="route-stop-dot"></span>
          <span class="route-stop-name">${s.name}</span>
          <span class="route-stop-km">${s.km} km</span>
        </button>
      `).join('')}
    </div>
  `;

  panel.querySelectorAll('.route-stop').forEach(btn => {
    btn.addEventListener('click', () => {
      const lat = parseFloat(btn.dataset.lat), lng = parseFloat(btn.dataset.lng);
      showSection('mapa');
      if (map) map.flyTo([lat, lng], 15, { duration: 0.8 });
    });
  });

  document.getElementById('freqWeek').textContent = line.schedule.weekFreq;
  document.getElementById('freqSunday').textContent = line.schedule.sundayFreq;
  document.getElementById('scheduleWeek').innerHTML =
    line.schedule.week.map(t => `<span class="schedule-time">${t}</span>`).join('');
  document.getElementById('scheduleSunday').innerHTML =
    line.schedule.sunday.map(t => `<span class="schedule-time">${t}</span>`).join('');

  drawRouteOnMap(id);
}

document.querySelectorAll('.line-btn').forEach(btn => {
  btn.addEventListener('click', () => renderLine(btn.dataset.line));
});

/* ---------- Mapa (Leaflet) — solo si hay #map en el DOM ---------- */
let map = null, routeLayers = {};

function initMap(){
  const mapEl = document.getElementById('map');
  if (!mapEl || typeof L === 'undefined' || map) return; // evita reinicializar

  const TILE_LAYERS = {
    satellite: L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      { attribution: 'Tiles &copy; Esri', maxZoom: 19 }
    ),
    streets: L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { attribution: '&copy; OpenStreetMap contributors', maxZoom: 18 }
    )
  };
  let activeLayer = 'satellite';

  map = L.map('map', { scrollWheelZoom: false }).setView([-35.1868, -59.1043], 13);
  TILE_LAYERS.satellite.addTo(map);

  const ctrl = L.control({ position: 'topright' });
  ctrl.onAdd = () => {
    const btn = L.DomUtil.create('button', 'map-toggle-btn');
    btn.textContent = 'Calles';
    L.DomEvent.on(btn, 'click', () => {
      if (activeLayer === 'satellite') {
        map.removeLayer(TILE_LAYERS.satellite);
        TILE_LAYERS.streets.addTo(map);
        activeLayer = 'streets';
        btn.textContent = 'Satélite';
      } else {
        map.removeLayer(TILE_LAYERS.streets);
        TILE_LAYERS.satellite.addTo(map);
        activeLayer = 'satellite';
        btn.textContent = 'Calles';
      }
    });
    return btn;
  };
  ctrl.addTo(map);

  Object.entries(LINES).forEach(([id, line]) => {
    const markers = line.stops.map(s =>
      L.circleMarker([s.lat, s.lng], {
        radius: 7, color: line.color, weight: 2, fillColor: line.color, fillOpacity: 0.9
      }).bindPopup(`<strong>${s.name}</strong><br>Línea ${id} · ${s.km} km`)
    );
    const poly = L.polyline(line.stops.map(s => [s.lat, s.lng]), {
      color: line.color, weight: 3, opacity: 0.6, dashArray: id === '502' ? '6 6' : null
    });
    routeLayers[id] = L.layerGroup([poly, ...markers]).addTo(map);
  });
}

function drawRouteOnMap(activeId){
  if (!map) return;
  Object.entries(routeLayers).forEach(([id, layer]) => {
    layer.eachLayer(l => {
      if (l.setStyle) l.setStyle({ opacity: id === activeId ? 1 : 0.25, fillOpacity: id === activeId ? 0.9 : 0.3 });
    });
  });
}

/* ---------- Navegación tipo SPA: mostrar/ocultar secciones ---------- */
const ALL_SECTION_IDS = ['inicio', 'lineas', 'mapa', 'alertas', 'pagos'];
const navLinks  = document.querySelectorAll('.nav-link');
const mnavLinks = document.querySelectorAll('.mnav-link');

function showSection(targetId) {
  if (!ALL_SECTION_IDS.includes(targetId)) return;

  ALL_SECTION_IDS.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.hidden = (id !== targetId);
  });

  navLinks.forEach(l  => l.classList.toggle('active', l.getAttribute('href') === `#${targetId}`));
  mnavLinks.forEach(l => l.classList.toggle('active', l.dataset.target === targetId));

  window.scrollTo({ top: 0, behavior: 'instant' });
  history.pushState(null, '', '#' + targetId);

  if (targetId === 'mapa' && map) {
    setTimeout(() => map.invalidateSize(), 100);
  }
}

/* ---------- Un único punto de arranque ---------- */
window.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') lucide.createIcons();

  // Intercepta cualquier link/botón que apunte a una sección (#id o data-section)
  document.querySelectorAll('[href^="#"], [data-section]').forEach(el => {
    const id = el.getAttribute('href')?.slice(1) || el.dataset.section;
    if (!ALL_SECTION_IDS.includes(id)) return;
    el.addEventListener('click', e => { e.preventDefault(); showSection(id); });
  });

  const initialHash = location.hash.replace('#', '');
  showSection(ALL_SECTION_IDS.includes(initialHash) ? initialHash : 'inicio');

  if (typeof L !== 'undefined') initMap();
  renderLine('501');
  renderDepartures();
});

window.addEventListener('load', () => { if (map) map.invalidateSize(); });

/* ---------- Envío del formulario de contacto (con recarga) ---------- */
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  sessionStorage.setItem('consultaEnviada', 'true');
  location.reload();
});

/* ---------- Mostrar notificación toast ---------- */
function showToast(message, duration = 4000) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

/* ---------- Verificar si venimos de un envío exitoso ---------- */
window.addEventListener('DOMContentLoaded', () => {
  if (sessionStorage.getItem('consultaEnviada') === 'true') {
    sessionStorage.removeItem('consultaEnviada');
    showToast('¡Gracias! Tu consulta fue registrada correctamente.');
  }
});