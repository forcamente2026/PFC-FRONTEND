
const ACOES_AUTONOMAS = [
  "LOGIN_REALIZADO",
  "LOGIN_FALHOU",
  "MFA_FALHOU",
  "ANONIMIZADO",
];

const RECURSOS_FEMININOS = ["AUDITORIA"];

function concordar(descricaoAcao, recursoTipo) {
  const verbo = descricaoAcao.toLowerCase();

  if (!RECURSOS_FEMININOS.includes(recursoTipo)) {
    return verbo;
  }

  return verbo.endsWith("o") ? `${verbo.slice(0, -1)}a` : verbo;
}

export function fraseDoEvento(registro) {
  const acao = registro.descricaoAcao ?? registro.acao ?? "";

  if (!registro.recursoTipo || ACOES_AUTONOMAS.includes(registro.acao)) {
    return acao;
  }

  const recurso = registro.descricaoRecursoTipo ?? registro.recursoTipo;
  return `${recurso} ${concordar(acao, registro.recursoTipo)}`;
}
