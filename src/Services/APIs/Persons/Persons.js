import api from "../Common/api";

const getPersons = () => api.get("https://fiap-reactjs-presencial.herokuapp.com/simplePersons/");
const updatePersons = (id, payload) => api.put("https://fiap-reactjs-presencial.herokuapp.com/simplePersons/" + id, payload);
const addPersons = (payload) => api.post("https://fiap-reactjs-presencial.herokuapp.com/simplePersons/", payload);
const deletePersons = (id) => api.delete("https://fiap-reactjs-presencial.herokuapp.com/simplePersons/" + id);

const exportedObject = {
  getPersons,
  updatePersons,
  addPersons,
  deletePersons
};
export default exportedObject;