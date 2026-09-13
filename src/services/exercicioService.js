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

/**
 * @param {{
 *   nome: string,
 *   grupoMuscular: string,
 *   nivel: string,
 *   descricaoExecucao: string,
 *   errosComuns: string,
 *   aquecimentoRecomendado: string,
 *   equipamento: string,
 *   gifUrl: string
 * }} exercicio
 */
export async function criarExercicio(exercicio) {
  const { data } = await api.post("/exercicios", exercicio);
  return data;
}

/**
 * O grupo muscular não pode ser alterado: vai no corpo com o valor original
 * apenas para o PUT substituir o recurso inteiro. Cabe ao back-end recusar
 * qualquer tentativa de trocá-lo.
 */
export async function atualizarExercicio(id, exercicio) {
  const { data } = await api.put(`/exercicios/${id}`, exercicio);
  return data;
}

export async function excluirExercicio(id) {
  await api.delete(`/exercicios/${id}`);
}
