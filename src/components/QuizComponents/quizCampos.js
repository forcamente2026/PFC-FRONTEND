export const LIMITE_TITULO = 150;
export const LIMITE_DESCRICAO = 500;
export const LIMITE_ENUNCIADO = 250;
export const LIMITE_EXPLICACAO = 500;
export const LIMITE_ALTERNATIVA = 100;
export const MINIMO_QUESTOES = 3;
export const MAXIMO_QUESTOES = 10;
export const MAXIMO_ALTERNATIVAS = 5;
export const MINIMO_ALTERNATIVAS = 2;
export const MAXIMO_ARTIGOS = 10;

export const SITUACOES_PUBLICADAS = ["APROVADO", "APROVADO_PELOS_PROFESSORES"];

export function novaAlternativa() {
  return { texto: "", correta: false };
}

export function novaQuestao() {
  return { enunciado: "", explicacao: "", alternativas: [novaAlternativa(), novaAlternativa()] };
}

export function novoQuiz() {
  return {
    titulo: "",
    descricao: "",
    categoria: "",
    nivel: "",
    artigos: [],
    questoes: Array.from({ length: MINIMO_QUESTOES }, novaQuestao),
  };
}

const ROTULOS_DE_CAMPO = {
  titulo: "Título",
  descricao: "Descrição",
  categoria: "Categoria",
  nivel: "Nível",
  questoes: "Perguntas",
  artigos: "Leitura sugerida",
  respostas: "Respostas",
};

export function descreverCampo(campo) {
  const alternativa = /^questoes\[(\d+)\]\.alternativas\[(\d+)\]/.exec(campo);
  if (alternativa) {
    return `Pergunta ${Number(alternativa[1]) + 1}, alternativa ${Number(alternativa[2]) + 1}`;
  }
  const pergunta = /^questoes\[(\d+)\]/.exec(campo);
  if (pergunta) return `Pergunta ${Number(pergunta[1]) + 1}`;
  return ROTULOS_DE_CAMPO[campo] ?? null;
}
