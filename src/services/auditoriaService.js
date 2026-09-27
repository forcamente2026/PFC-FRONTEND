import api from "./api";
import { acoesMock, buscarAuditoriaMock } from "./mocks/auditoriaMock";

const usarMock = import.meta.env.VITE_AUDITORIA_MOCK === "true";

function responderMock(dados) {
  return new Promise((resolve) => setTimeout(() => resolve(dados), 400));
}

// Parametro vazio nao vira `?acao=` na URL: o back trataria como filtro de
// string vazia em vez de "sem filtro".
function limparParametros(parametros) {
  return Object.fromEntries(
    Object.entries(parametros).filter(([, valor]) => valor !== "" && valor != null),
  );
}

export async function buscarAuditoria(parametros) {
  if (usarMock) return responderMock(buscarAuditoriaMock(parametros));

  const { data } = await api.get("/auditoria", {
    params: limparParametros(parametros),
  });
  return data;
}

export async function listarAcoes() {
  if (usarMock) return responderMock(acoesMock);

  const { data } = await api.get("/auditoria/acoes");
  return data;
}
