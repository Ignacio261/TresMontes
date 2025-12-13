import api from './api';

// Importante: NO usar "/" al inicio,
// porque entonces axios ignora el baseURL y arma URLs incorrectas.
const base = 'trabajadores/';

export const trabajadoresService = {
  list: (params = {}) => api.get(base, { params }),

  retrieve: (id) => api.get(`${base}${id}/`),

  create: (data) => api.post(base, data),

  update: (id, data) => api.put(`${base}${id}/`, data),

  partialUpdate: (id, data) => api.patch(`${base}${id}/`, data),

  delete: (id) => api.delete(`${base}${id}/`),

  filtros: (data) => api.post(`${base}filtros_avanzados/`, data),

  exportExcel: (params) =>
    api.get(`${base}exportar_excel/`, { params, responseType: 'blob' }),

  exportCSV: (params) =>
    api.get(`${base}exportar_csv/`, { params, responseType: 'blob' }),

  historial: (id) => api.get(`${base}${id}/historial/`),

  estadisticas: () => api.get(`${base}estadisticas/`),

  cumpleanos: () => api.get(`${base}cumpleanos/`),

  aniversarios: () => api.get(`${base}aniversarios/`)
};
