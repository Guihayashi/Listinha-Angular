import api from "../Common/api";

const getDespesas = () => api.get("http://localhost:8088/despesas");
const updateDaDespesa = (id, payload) => api.put("http://localhost:8088/despesas/id/" + id, payload);
const createDespesas = (payload) => api.post("http://localhost:8088/despesas", payload);
const deleteDespesas = (id) => api.delete("http://localhost:8088/despesas/id/" + id);

const exportedObject = {
  getDespesas,
  updateDaDespesa,
  createDespesas,
  deleteDespesas
};
export default exportedObject;