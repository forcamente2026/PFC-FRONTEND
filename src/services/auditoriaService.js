import api from "./api";

function limparParametros(parametros) {
  return Object.fromEntries(
    Object.entries(parametros).filter(([, valor]) => valor !== "" && valor != null),
  );
}

export async function buscarAuditoria(parametros) {
  const { data } = await api.get("/auditoria", {
    params: limparParametros(parametros),
  });
  return data;
}

export async function listarAcoes() {
  const { data } = await api.get("/auditoria/acoes");
  return data;
}

export async function listarRecursos() {
  const { data } = await api.get("/auditoria/recursos");
  return data;
}

export async function exportarCsv(filtros) {
  const { data } = await api.get("/auditoria/csv", {
    params: limparParametros(filtros),
    responseType: "blob",
  });
  return data;
}
