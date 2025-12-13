import api from "./api";

const base = "configuracion/";

const safeArray = (data) => (Array.isArray(data) ? data : []);

const ConfigService = {
  sucursales: {
    list: async (params) => safeArray((await api.get(base + "sucursales/", { params })).data),
    create: (data) => api.post(base + "sucursales/", data),
    update: (id, data) => api.put(`${base}sucursales/${id}/`, data),
    remove: (id) => api.delete(`${base}sucursales/${id}/`),
    activos: async () => safeArray((await api.get(base + "sucursales/activos/")).data),
  },

  areas: {
    list: async (params) => safeArray((await api.get(base + "areas/", { params })).data),
    create: (data) => api.post(base + "areas/", data),
    update: (id, data) => api.put(`${base}areas/${id}/`, data),
    remove: (id) => api.delete(`${base}areas/${id}/`),
    activos: async () => safeArray((await api.get(base + "areas/activos/")).data),
  },
};

export default ConfigService;
