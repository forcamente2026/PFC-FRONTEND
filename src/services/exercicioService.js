import api from "./api";

export async function listarGruposMusculares() {
  const { data } = await api.get("/exercicios/grupos-musculares");
  return data;
}

export async function listarNiveis() {
  const { data } = await api.get("/exercicios/niveis");
  return data;
}

export async function listarExercicios() {
  const { data } = await api.get("/exercicios");
  return data;
}

export async function criarExercicio(exercicio) {
  const { data } = await api.post("/exercicios", exercicio);
  return data;
}

export async function atualizarExercicio(id, exercicio) {
  const { data } = await api.put(`/exercicios/${id}`, exercicio);
  return data;
}

export async function excluirExercicio(id) {
  await api.delete(`/exercicios/${id}`);
}
