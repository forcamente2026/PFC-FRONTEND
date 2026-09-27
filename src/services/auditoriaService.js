import api from "./api";
import { acoesMock, buscarAuditoriaMock, recursosMock } from "./mocks/auditoriaMock";

const usarMock = import.meta.env.VITE_AUDITORIA_MOCK === "true";

// O CSV vem pronto do back (GET /api/auditoria/csv), que exporta o filtro
// inteiro e nao so a pagina exibida. Enquanto o endpoint nao existir, a tela
// mantem o botao desabilitado em vez de exportar meia verdade.
export const EXPORTACAO_DISPONIVEL = !usarMock;

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

export async function listarRecursos() {
  if (usarMock) return responderMock(recursosMock);

  const { data } = await api.get("/auditoria/recursos");
  return data;
}

// Um <a href> comum nao serve: o navegador nao anexa o header Authorization.
// Por isso a chamada passa pelo axios e o download nasce do blob.
export async function exportarCsv(filtros) {
  const { data } = await api.get("/auditoria/csv", {
    params: limparParametros(filtros),
    responseType: "blob",
  });
  return data;
}
