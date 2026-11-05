import api from "./api";
import {
  alterarStatusExercicioMock,
  aprovarExercicioMock,
  atualizarExercicioMock,
  criarExercicioMock,
  excluirExercicioMock,
  listarExerciciosMock,
  listarExerciciosPendentesMock,
} from "./mocks/exercicioMock";
import { estaPublicado } from "../utils/moderacao";
import { lerSessao } from "../utils/sessao";
import { exigirVagaParaCriar } from "../utils/limiteCriacao";

export const MODERACAO_DE_EXERCICIOS_SIMULADA = import.meta.env.VITE_EXERCICIOS_MOCK === "true";

function responderMock(executar) {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      try {
        resolve(executar());
      } catch (falha) {
        reject(falha);
      }
    }, 300),
  );
}

export async function listarGruposMusculares() {
  const { data } = await api.get("/exercicios/grupos-musculares");
  return data;
}

export async function listarNiveis() {
  const { data } = await api.get("/exercicios/niveis");
  return data;
}

export async function listarExercicios() {
  if (MODERACAO_DE_EXERCICIOS_SIMULADA) return responderMock(listarExerciciosMock);

  const { data } = await api.get("/exercicios");
  return data;
}

export async function listarExerciciosPublicados() {
  const { data } = await api.get("/exercicios");
  return Array.isArray(data) ? data.filter(estaPublicado) : data;
}

export async function criarExercicio(exercicio) {
  if (MODERACAO_DE_EXERCICIOS_SIMULADA) {
    return responderMock(() => {
      exigirVagaParaCriar(listarExerciciosMock(), lerSessao());
      return criarExercicioMock(exercicio);
    });
  }

  const { data } = await api.post("/exercicios", exercicio);
  return data;
}

export async function atualizarExercicio(id, exercicio) {
  if (MODERACAO_DE_EXERCICIOS_SIMULADA) {
    return responderMock(() => atualizarExercicioMock(id, exercicio));
  }

  const { data } = await api.put(`/exercicios/${id}`, exercicio);
  return data;
}

export async function excluirExercicio(id) {
  if (MODERACAO_DE_EXERCICIOS_SIMULADA) return responderMock(() => excluirExercicioMock(id));

  await api.delete(`/exercicios/${id}`);
}

export async function aprovarExercicio(id) {
  if (MODERACAO_DE_EXERCICIOS_SIMULADA) return responderMock(() => aprovarExercicioMock(id));

  const { data } = await api.post(`/exercicios/${id}/aprovacoes`);
  return data;
}

export async function alterarStatusExercicio(id, status, motivo) {
  if (MODERACAO_DE_EXERCICIOS_SIMULADA) {
    return responderMock(() => alterarStatusExercicioMock(id, status, motivo));
  }

  const { data } = await api.patch(`/exercicios/${id}/status`, { status, motivo });
  return data;
}

export async function listarExerciciosPendentes() {
  if (MODERACAO_DE_EXERCICIOS_SIMULADA) return responderMock(listarExerciciosPendentesMock);

  const { data } = await api.get("/exercicios/pendentes");
  return data;
}
