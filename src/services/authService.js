import api from "./api";

export async function login(email, senha) {
  const { data } = await api.post("/auth/login", { email, senha });
  return data;
}

export async function verificarCodigo(email, codigo) {
  const { data } = await api.post("/auth/login/verificar", { email, codigo });
  return data;
}

export async function esqueciSenha(email) {
  await api.post("/auth/esqueci-senha", { email });
}

export async function redefinirSenha(email, codigo, novaSenha) {
  await api.post("/auth/redefinir-senha", { email, codigo, novaSenha });
}