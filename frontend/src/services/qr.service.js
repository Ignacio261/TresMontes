import api from "./api";

// Correcto: sin "/"
const BASE = "qr/";

const QRService = {
  listar: () => api.get(BASE),

  generar: (trabajadorId) =>
    api.post(`${BASE}generar/${trabajadorId}/`),

  descargar: (trabajadorId) =>
    api.get(`${BASE}descargar/${trabajadorId}/`, {
      responseType: "blob",
    }),

  enviarEmail: (trabajadorId) =>
    api.post(`${BASE}enviar-email/${trabajadorId}/`),

  generarMasivo: () => api.post(`${BASE}generar-masivo/`),

  enviarMasivo: () => api.post(`${BASE}enviar-masivo/`)
};

export default QRService;
