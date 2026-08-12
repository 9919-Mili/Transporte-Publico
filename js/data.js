/* Datos del servicio Expreso Rosso.
   Editá acá los horarios, paradas y frecuencias: el sitio se actualiza solo. */

const LINES = {
  "501": {
    label: "Línea 501",
    route: "Terminal ↔ Villa Cattoni",
    color: "#C81D3B",
    stops: [
      { name: "Villa Cattoni",      km: 8,  lat: -35.1790, lng: -59.1180 },
      { name: "Terminal de Ómnibus", km: 12, lat: -35.1868, lng: -59.1043 },
      { name: "Barrio Celeste",     km: 6,  lat: -35.1920, lng: -59.0990 },
      { name: "Barrio Blanco",      km: 6,  lat: -35.1950, lng: -59.1100 },
      { name: "Barrio Aguada",      km: 10, lat: -35.1720, lng: -59.0950 }
    ],
    schedule: {
      weekFreq: "Cada 30 minutos",
      week: ["05:00","05:30","06:00","06:30","07:00","07:30","08:00","08:30",
             "09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30",
             "13:00","13:30","14:00"],
      sundayFreq: "Cada 2 horas",
      sunday: ["06:15","08:15","10:15","12:15","14:15","16:15","18:15","20:15","22:15"]
    }
  },
  "502": {
    label: "Línea 502",
    route: "Terminal ↔ Aguada",
    color: "rgb(12, 12, 221)",
    stops: [
      { name: "Terminal de Ómnibus", km: 0,  lat: -35.1868, lng: -59.1043 },
      { name: "Barrio Ruralia",     km: 9,  lat: -35.2010, lng: -59.0870 },
      { name: "Barrio Aguada",      km: 14, lat: -35.1720, lng: -59.0950 }
    ],
    schedule: {
      weekFreq: "Cada 1 hora",
      week: ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00",
             "16:00","17:00","18:00","19:00","20:00","21:00","22:00"],
      sundayFreq: "Cada 2 horas",
      sunday: ["06:15","08:15","10:15","12:15","14:15","16:15","18:15","20:15","22:15"]
    }
  }
};

/* Próximas salidas para el tablero de la portada (demo estático). */
const NEXT_DEPARTURES = [
  { line: "501", destination: "Estación Central", eta: "4 min" },
  { line: "502", destination: "Barrio Ruralia",    eta: "12 min" },
  { line: "501", destination: "Villa Cattoni",     eta: "18 min" },
  { line: "502", destination: "Barrio Aguada",     eta: "34 min" }
];
