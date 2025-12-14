import api from "./api";

const TrabajadoresService = {
  getById: (id) => api.get(`/trabajadores/${id}/`),
  historial: (id) => api.get(`/trabajadores/${id}/historial/`),
};

export default TrabajadoresService;
