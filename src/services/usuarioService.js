import api from "./api";

function limparParametros(parametros) {
  return Object.fromEntries(
    Object.entries(parametros).filter(([, valor]) => valor !== "" && valor != null),
  );
}

export async function criarUsuario(usuario) {
  const { data } = await api.post("/usuarios", usuario);
  return data;
}

export async function listarFormacoes() {
  const { data } = await api.get("/usuarios/formacoes");
  return data;
}

export async function buscarUsuarios(parametros) {
  const { data } = await api.get("/usuarios", {
    params: limparParametros(parametros),
  });
  return data;
}

export async function atualizarUsuario(id, dados) {
  const { data } = await api.put(`/usuarios/${id}`, dados);
  return data;
}

export async function alterarAtivo(id, ativo) {
  const { data } = await api.patch(`/usuarios/${id}/ativo`, { ativo });
  return data;
}
