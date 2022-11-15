import api from "../Common/api";

const login = (payload) => api.post("https://fiap-reactjs-presencial.herokuapp.com/authPersons/login", payload);

const exportedObject = {
  login
};
export default exportedObject;