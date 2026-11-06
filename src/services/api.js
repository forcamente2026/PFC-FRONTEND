import axios from "axios";
import { expirarSessao } from "../utils/sessao";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const caminho = config.url ?? "";
  if (caminho.startsWith("/auth/")) {
    return config;
  }

  const token = localStorage.getItem("token");
  config.tokenDaSessao = token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const caminho = error.config?.url ?? "";
    const ehAutenticacao = caminho.startsWith("/auth/");

    if (status === 401 && !ehAutenticacao &&
        error.config?.tokenDaSessao === localStorage.getItem("token")) {
      expirarSessao();
    }

    const mensagem =
      error.response?.data?.message ||
      "Não foi possível concluir a operação. Tente novamente.";

    const campos = error.response?.data?.campos ?? [];

    return Promise.reject({ status, mensagem, campos, original: error });
  }
);

export default api;
