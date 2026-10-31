import api from "./api";
import {
  alterarStatusQuizMock,
  aprovarQuizMock,
  buscarQuizMock,
  buscarQuizParaEdicaoMock,
  criarQuizMock,
  editarQuizMock,
  excluirQuizMock,
  listarQuizzesMock,
  listarQuizzesPendentesMock,
  niveisMock,
  responderQuizMock,
} from "./mocks/quizMock";

const usarMock = import.meta.env.VITE_QUIZ_MOCK === "true";

function responderMock(executar) {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      try {
        resolve(executar());
      } catch (falha) {
        reject(falha);
      }
    }, 400),
  );
}

export async function listarQuizzes(usuario) {
  if (usarMock) return responderMock(() => listarQuizzesMock(usuario));
  const { data } = await api.get("/quizzes");
  return data;
}

export async function buscarQuiz(id, usuario) {
  if (usarMock) return responderMock(() => buscarQuizMock(id, usuario));
  const { data } = await api.get(`/quizzes/${id}`);
  return data;
}

export async function buscarQuizParaEdicao(id, usuario) {
  if (usarMock) return responderMock(() => buscarQuizParaEdicaoMock(id, usuario));
  const { data } = await api.get(`/quizzes/${id}/edicao`);
  return data;
}

export async function criarQuiz(dados, usuario) {
  if (usarMock) return responderMock(() => criarQuizMock(dados, usuario));
  const { data } = await api.post("/quizzes", dados);
  return data;
}

export async function editarQuiz(id, dados, usuario) {
  if (usarMock) return responderMock(() => editarQuizMock(id, dados, usuario));
  const { data } = await api.put(`/quizzes/${id}`, dados);
  return data;
}

export async function excluirQuiz(id, usuario) {
  if (usarMock) return responderMock(() => excluirQuizMock(id, usuario));
  await api.delete(`/quizzes/${id}`);
}

export async function aprovarQuiz(id, usuario) {
  if (usarMock) return responderMock(() => aprovarQuizMock(id, usuario));
  const { data } = await api.post(`/quizzes/${id}/aprovacoes`);
  return data;
}

export async function alterarStatusQuiz(id, status, motivo, usuario) {
  if (usarMock) return responderMock(() => alterarStatusQuizMock(id, status, motivo, usuario));
  const { data } = await api.patch(`/quizzes/${id}/status`, { status, motivo });
  return data;
}

export async function listarQuizzesPendentes(usuario) {
  if (usarMock) return responderMock(() => listarQuizzesPendentesMock(usuario));
  const { data } = await api.get("/quizzes/pendentes");
  return data;
}

export async function responderQuiz(id, respostas, usuario) {
  if (usarMock) return responderMock(() => responderQuizMock(id, respostas, usuario));
  const { data } = await api.post(`/quizzes/${id}/tentativas`, { respostas });
  return data;
}

export async function listarNiveisDoQuiz() {
  if (usarMock) return responderMock(() => niveisMock);
  const { data } = await api.get("/exercicios/niveis");
  return data;
}
