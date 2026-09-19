// Etiqueta nula = não mostra nada no card (artigo aprovado é o caso normal).
export const STATUS_ARTIGO = {
  PENDENTE: { descricao: "Pendente", etiqueta: "Aguardando validação" },
  APROVADO: { descricao: "Aprovado", etiqueta: null },
  REJEITADO: { descricao: "Rejeitado", etiqueta: "Rejeitado" },
};

export const ARTIGO_VAZIO = {
  titulo: "",
  categoria: "",
  resumo: "",
  conteudo: "",
  tipoEstudo: "",
  ano: "",
  minutosLeitura: "",
};

export function validarArtigo(form) {
  if (
    !form.titulo.trim() ||
    !form.categoria ||
    !form.resumo.trim() ||
    !form.conteudo.trim()
  ) {
    return "Preencha título, categoria, resumo e conteúdo.";
  }

  const anoAtual = new Date().getFullYear();
  const ano = Number(form.ano);
  if (!form.ano || ano < 1900 || ano > anoAtual) {
    return `Informe um ano entre 1900 e ${anoAtual}.`;
  }

  if (!form.minutosLeitura || Number(form.minutosLeitura) <= 0) {
    return "Informe o tempo de leitura em minutos.";
  }

  return null;
}
