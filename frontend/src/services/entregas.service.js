import api from "./api";

// RUTA CORRECTA: sin "/" inicial
const base = "entregas/";

const EntregasService = {
  listar: async (params) => {
    const res = await api.get(base, { params });
    return res.data;
  },

  crearMasiva: async (data) => {
    const res = await api.post(base + "entrega_general/", data);
    return res.data;
  },

  crearGrupo: async (data) => {
    const res = await api.post(base + "entrega_grupo/", data);
    return res.data;
  },

  marcarRetirado: async (id, evidencia) => {
    const form = new FormData();
    form.append("evidencia", evidencia);

    const res = await api.post(`${base}${id}/marcar_retirado/`, form, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    return res.data;
  },

  historial: async (id) => {
    const res = await api.get(`${base}${id}/historial/`);
    return res.data;
  },

  exportExcel: () => {
    window.open(api.defaults.baseURL + base + "export_excel/", "_blank");
  },

  exportPDF: () => {
    window.open(api.defaults.baseURL + base + "export_pdf/", "_blank");
  },
};

export default EntregasService;
