export const LIMITE_NOME = 120;
export const LIMITE_ETAPAS = 8;
export const LIMITE_POR_ETAPA = 120;
export const LIMITE_ERROS_COMUNS = 500;
export const LIMITE_AQUECIMENTO = 500;
export const LIMITE_EQUIPAMENTO = 100;
export const LIMITE_GIF_URL = 255;
export const LIMITE_VIDEO = 120;

const PADRAO_ID_DO_VIDEO = /^[A-Za-z0-9_-]{11}$/;
const ENDERECOS_DO_VIDEO = /(?:v=|\/shorts\/|\/embed\/|youtu\.be\/)([A-Za-z0-9_-]{11})/;

export function idDoVideoYoutube(valor) {
  const texto = (valor ?? "").trim();

  if (!texto) return "";
  if (PADRAO_ID_DO_VIDEO.test(texto)) return texto;

  const achado = texto.match(ENDERECOS_DO_VIDEO);

  return achado ? achado[1] : null;
}

export const EXERCICIO_VAZIO = {
  nome: "",
  grupoMuscular: "",
  nivel: "",
  etapas: [""],
  errosComuns: "",
  aquecimentoRecomendado: "",
  equipamento: "",
  gifUrl: "",
  videoYoutubeId: "",
};


export function montarDicionario(lista) {
  return Object.fromEntries(lista.map((item) => [item.codigo, item.descricao]));
}

export function etapasDaDescricao(descricao) {
  const etapas = (descricao ?? "")
    .split(/\r?\n/)
    .map((etapa) => etapa.trim())
    .filter(Boolean);

  return etapas.length ? etapas : [""];
}

function etapasPreenchidas(etapas) {
  return etapas.map((etapa) => etapa.trim()).filter(Boolean);
}

export function exercicioParaFormulario(exercicio) {
  return {
    ...Object.fromEntries(
      Object.keys(EXERCICIO_VAZIO).map((campo) => [campo, exercicio[campo] ?? ""]),
    ),
    etapas: etapasDaDescricao(exercicio.descricaoExecucao),
  };
}

export function exercicioParaEnvio(form) {
  const { etapas, ...campos } = form;

  return {
    ...campos,
    nome: form.nome.trim(),
    descricaoExecucao: etapasPreenchidas(etapas).join("\n"),
    videoYoutubeId: idDoVideoYoutube(form.videoYoutubeId) ?? "",
  };
}

export function validarExercicio(form) {
  const preenchidas = etapasPreenchidas(form.etapas);

  if (
    !form.nome.trim() ||
    !form.grupoMuscular ||
    !form.nivel ||
    !preenchidas.length
  ) {
    return "Preencha nome, grupo muscular, nível e pelo menos uma etapa da execução.";
  }

  if (preenchidas.length > LIMITE_ETAPAS) {
    return `Use no máximo ${LIMITE_ETAPAS} etapas na execução.`;
  }

  const etapaLonga = form.etapas.findIndex((etapa) => etapa.trim().length > LIMITE_POR_ETAPA);

  if (etapaLonga >= 0) {
    return `A etapa ${etapaLonga + 1} passou de ${LIMITE_POR_ETAPA} caracteres. Divida o texto em mais etapas.`;
  }

  if (idDoVideoYoutube(form.videoYoutubeId) === null) {
    return "O vídeo precisa ser um endereço do YouTube ou o id de 11 caracteres.";
  }

  return null;
}
