import api from "./api";

export async function listarQuizzes() {
  const { data } = await api.get("/quizzes");
  return data;
}

export async function buscarQuiz(id) {
  const { data } = await api.get(`/quizzes/${id}`);
  return data;
}

export async function buscarQuizParaEdicao(id) {
  const { data } = await api.get(`/quizzes/${id}/edicao`);
  return data;
}

export async function criarQuiz(dados) {
  const { data } = await api.post("/quizzes", dados);
  return data;
}

export async function editarQuiz(id, dados) {
  const { data } = await api.put(`/quizzes/${id}`, dados);
  return data;
}

export async function excluirQuiz(id) {
  await api.delete(`/quizzes/${id}`);
}

export async function aprovarQuiz(id) {
  const { data } = await api.post(`/quizzes/${id}/aprovacoes`);
  return data;
}

export async function alterarStatusQuiz(id, status, motivo) {
  const { data } = await api.patch(`/quizzes/${id}/status`, { status, motivo });
  return data;
}

export async function listarQuizzesPendentes() {
  const { data } = await api.get("/quizzes/pendentes");
  return data;
}

export async function responderQuiz(id, respostas) {
  const { data } = await api.post(`/quizzes/${id}/tentativas`, { respostas });
  return data;
}

export async function listarNiveisDoQuiz() {
  const { data } = await api.get("/exercicios/niveis");
  return data;
}
