export const SITUACOES_PUBLICADAS = ["APROVADO", "APROVADO_PELOS_PROFESSORES"];
export const SITUACOES_EM_ANALISE = ["PENDENTE", "APROVADO_PELOS_PROFESSORES"];

export function estaPublicado(item) {
  return !item.status || SITUACOES_PUBLICADAS.includes(item.status);
}

export function estaEmAnalise(item) {
  return SITUACOES_EM_ANALISE.includes(item.status);
}
