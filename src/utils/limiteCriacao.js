export const LIMITE_CRIACAO_PROFESSOR = 3;

export function limiteDeCriacao(itens, usuario) {
  const professor = usuario?.papel === "PROFESSOR";
  const quantidade = professor
    ? itens.filter((item) => item.podeEditar && item.status && item.status !== "APROVADO").length
    : 0;

  return {
    quantidade,
    bloqueado: professor && quantidade >= LIMITE_CRIACAO_PROFESSOR,
  };
}

export function exigirVagaParaCriar(itens, usuario) {
  if (!Array.isArray(itens)) {
    throw { mensagem: "Não foi possível conferir o limite de criação. Recarregue a página e tente novamente." };
  }
  if (limiteDeCriacao(itens, usuario).bloqueado) {
    throw {
      itensDoLimite: itens,
      mensagem: `Você atingiu o limite de ${LIMITE_CRIACAO_PROFESSOR} itens deste tipo sem aprovação do administrador. Aguarde uma aprovação para criar outro.`,
    };
  }
}
