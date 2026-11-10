import api from "./api";
import {
  atividadePorDiaMock,
  contasPorPapelMock,
  desempenhoMock,
  tentativasMock,
} from "./mocks/graficosMock";

export const GRAFICOS_SIMULADOS = import.meta.env.VITE_GRAFICOS_MOCK === "true";

function responderMock(dados) {
  return new Promise((resolve) => setTimeout(() => resolve(dados), 300));
}

export async function listarMinhasTentativas() {
  if (GRAFICOS_SIMULADOS) return responderMock(tentativasMock());

  const { data } = await api.get("/quizzes/minhas-tentativas");
  return data;
}

export async function listarDesempenhoDosMeusQuizzes() {
  if (GRAFICOS_SIMULADOS) return responderMock(desempenhoMock());

  const { data } = await api.get("/quizzes/meus/desempenho");
  return data;
}

export async function listarContasPorPapel() {
  if (GRAFICOS_SIMULADOS) return responderMock(contasPorPapelMock());

  const { data } = await api.get("/estatisticas/contas-por-papel");
  return data;
}

export async function listarAtividadePorDia() {
  if (GRAFICOS_SIMULADOS) return responderMock(atividadePorDiaMock());

  const { data } = await api.get("/estatisticas/atividade-por-dia", {
    params: { dias: 7 },
  });
  return data;
}
