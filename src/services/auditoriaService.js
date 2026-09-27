import api from "./api";
import { acoesMock, buscarAuditoriaMock, recursosMock } from "./mocks/auditoriaMock";

const usarMock = import.meta.env.VITE_AUDITORIA_MOCK === "true";

export const EXPORTACAO_DISPONIVEL = !usarMock;

function responderMock(dados) {
  return new Promise((resolve) => setTimeout(() => resolve(dados), 400));
}

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

export async function listarRecursos() {
  if (usarMock) return responderMock(recursosMock);

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
