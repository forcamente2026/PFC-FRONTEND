// Etiqueta nula = não mostra nada no card (artigo aprovado é o caso normal).
export const STATUS_ARTIGO = {
  PENDENTE: { descricao: "Pendente", etiqueta: "Aguardando aprovação" },
  APROVADO_PELOS_PROFESSORES: {
  descricao: "Aprovado pelos professores",
  etiqueta: null,
},
  APROVADO: { descricao: "Aprovado", etiqueta: null },
  REJEITADO: { descricao: "Rejeitado", etiqueta: "Rejeitado" },
};

export function etiquetaDoArtigo(artigo) {
  const etiqueta = STATUS_ARTIGO[artigo.status]?.etiqueta;
  if (artigo.status !== "PENDENTE") return etiqueta;
  return `${etiqueta} · ${artigo.aprovacoesDeProfessores} de ${artigo.aprovacoesNecessarias}`;
}

export const MINIMO_RESUMO = 250;
export const LIMITE_RESUMO = 1000;
export const LIMITE_MOTIVO = 500;
export const ARTIGO_VAZIO = {
  titulo: "",
  categoria: "",
  resumo: "",
  fonte: "",
  autoria:"",
  tipoEstudo: "",
  ano: ""
};

export function validarArtigo(form) {
  if (
    !form.titulo.trim() ||
    !form.categoria ||
    !form.resumo.trim() ||
    !form.fonte.trim()
  ) {
    return "Preencha título, categoria, resumo e link do artigo.";
  }

  const anoAtual = new Date().getFullYear();
  const ano = Number(form.ano);
  if (!form.ano || ano < 1900 || ano > anoAtual) {
    return `Informe um ano de publicação entre 1900 e ${anoAtual}.`;
  }

  return null;
}

export function artigoParaEnvio(form) {
  return { ...form, ano: form.ano === "" ? null : Number(form.ano) };
}