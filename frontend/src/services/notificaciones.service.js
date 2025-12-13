import api from "./api";

const base = "/notificaciones/";

const NotifService = {
  listar: async () => {
    try {
      const r = await api.get(base);

      // Garantizar array
      return Array.isArray(r.data) ? r.data : [];
    } catch (err) {
      console.error("Error en listar notificaciones:", err);
      return [];
    }
  },

  crear: async (payload) => {
    const r = await api.post(base, payload);
    return r.data;
  },

  enviar: async (payload) => {
    const r = await api.post(base + "enviar/", payload);
    return r.data;
  },

  marcarLeido: async (id) => {
    const r = await api.post(`${base}${id}/leer/`);
    return r.data;
  },

  marcarTodas: async () => {
    const r = await api.post(base + "leer_todas/");
    return r.data;
  },
};

export default NotifService;
