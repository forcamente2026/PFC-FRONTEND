// O back manda acao e recurso como dimensoes separadas — decisao do contrato,
// para o enum de acoes parar de crescer quando os artigos chegarem. A frase que
// o usuario le e montada aqui, no front, que e onde mora texto de tela.

// Acoes que ja sao uma frase inteira: grudar o recurso nelas produziria
// "Login realizado Usuário".
const ACOES_AUTONOMAS = [
  "LOGIN_REALIZADO",
  "LOGIN_FALHOU",
  "MFA_FALHOU",
  "ANONIMIZADO",
];

// Os verbos do enum vem no masculino ("Criado", "Lido"). Sem isto, um recurso
// feminino viraria "Trilha de auditoria lido".
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
