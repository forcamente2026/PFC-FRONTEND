const SITUACOES_CREF = {
  PENDENTE: "Pendente",
  APROVADO: "Aprovado",
  REJEITADO: "Rejeitado",
};

export function rotuloDaSituacaoCref(codigo) {
  return SITUACOES_CREF[codigo] ?? codigo;
}