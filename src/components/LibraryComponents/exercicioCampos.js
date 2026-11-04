export const LIMITE_NOME = 120;
export const LIMITE_DESCRICAO_EXECUCAO = 1000;
export const LIMITE_ERROS_COMUNS = 500;
export const LIMITE_AQUECIMENTO = 500;
export const LIMITE_EQUIPAMENTO = 100;
export const LIMITE_GIF_URL = 255;

export const EXERCICIO_VAZIO = {
  nome: "",
  grupoMuscular: "",
  nivel: "",
  descricaoExecucao: "",
  errosComuns: "",
  aquecimentoRecomendado: "",
  equipamento: "",
  gifUrl: "",
};


export function exercicioParaFormulario(exercicio) {
  return Object.fromEntries(
    Object.keys(EXERCICIO_VAZIO).map((campo) => [campo, exercicio[campo] ?? ""]),
  );
}

export function exercicioParaEnvio(form) {
  return { ...form, nome: form.nome.trim() };
}

export function validarExercicio(form) {
  if (
    !form.nome.trim() ||
    !form.grupoMuscular ||
    !form.nivel ||
    !form.descricaoExecucao.trim()
  ) {
    return "Preencha nome, grupo muscular, nível e Descrição de Execução do Exercício.";
  }

  return null;
}
