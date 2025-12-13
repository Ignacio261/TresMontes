import api from "./api";

// IMPORTANTE: sin "/" inicial
const base = "reportes/entregas/";

const ReportesService = {
  listar: async (params = {}) => {
    const res = await api.get(base, { params });
    return res.data;
  },

  exportExcel: () =>
    api.get(base + "export/excel/", { responseType: "blob" }),

  exportCSV: () =>
    api.get(base + "export/csv/", { responseType: "blob" }),

  exportPDF: () =>
    api.get(base + "export/pdf/", { responseType: "blob" }),
};

export default ReportesService;
