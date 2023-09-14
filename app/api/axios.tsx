import axios from "axios";

const api = axios.create({
    baseURL: "https://tecnoatualizados.com/projetos/tcc/api/metodos"
});

export default api;