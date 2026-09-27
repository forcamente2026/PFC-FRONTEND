// Mock temporario da trilha de auditoria. Remover quando GET /api/auditoria
// existir no back (ver memoria/contrato-auditoria.md). O formato imita o
// contrato: acao e recurso sao dimensoes separadas, e o usuario vem em campos
// planos — a trilha guarda so o id, e nome e e-mail sao resolvidos na consulta.

export const acoesMock = [
  { codigo: "CRIADO", descricao: "Criado" },
  { codigo: "LIDO", descricao: "Lido" },
  { codigo: "ATUALIZADO", descricao: "Atualizado" },
  { codigo: "EXCLUIDO", descricao: "Excluído" },
  { codigo: "LOGIN_REALIZADO", descricao: "Login realizado" },
  { codigo: "LOGIN_FALHOU", descricao: "Falha no login" },
  { codigo: "MFA_FALHOU", descricao: "Falha na verificação do código" },
  { codigo: "ANONIMIZADO", descricao: "Conta anonimizada" },
  { codigo: "APROVADO", descricao: "Aprovado" },
  { codigo: "REJEITADO", descricao: "Rejeitado" },
];

export const recursosMock = [
  { codigo: "USUARIO", descricao: "Usuário" },
  { codigo: "EXERCICIO", descricao: "Exercício" },
  { codigo: "AUDITORIA", descricao: "Trilha de auditoria" },
  { codigo: "ARTIGO", descricao: "Artigo" },
];

const USUARIOS = [
  { id: "u-1", nome: "Administrador ForcaMente", email: "admin@forcamente.com" },
  { id: "u-2", nome: "Professor Teste", email: "professor@forcamente.com" },
  { id: "u-3", nome: "Aluno de Teste", email: "aluno@forcamente.com" },
];

// Combinacoes que fazem sentido: nem toda acao cabe em todo recurso.
const EVENTOS = [
  { acao: "LOGIN_REALIZADO", recurso: "USUARIO" },
  { acao: "LOGIN_FALHOU", recurso: "USUARIO" },
  { acao: "MFA_FALHOU", recurso: "USUARIO" },
  { acao: "CRIADO", recurso: "USUARIO" },
  { acao: "ANONIMIZADO", recurso: "USUARIO" },
  { acao: "LIDO", recurso: "USUARIO" },
  { acao: "CRIADO", recurso: "EXERCICIO" },
  { acao: "ATUALIZADO", recurso: "EXERCICIO" },
  { acao: "EXCLUIDO", recurso: "EXERCICIO" },
  { acao: "CRIADO", recurso: "ARTIGO" },
  { acao: "APROVADO", recurso: "ARTIGO" },
  { acao: "REJEITADO", recurso: "ARTIGO" },
  { acao: "LIDO", recurso: "AUDITORIA" },
];

function descricaoDe(lista, codigo) {
  return lista.find((item) => item.codigo === codigo)?.descricao ?? codigo;
}

function gerarRegistros() {
  const registros = [];
  const agora = Date.now();

  for (let indice = 0; indice < 120; indice += 1) {
    const evento = EVENTOS[indice % EVENTOS.length];

    // Falha de login com e-mail inexistente nao tem usuario a apontar.
    const semUsuario = evento.acao === "LOGIN_FALHOU" && indice % 3 === 0;
    const usuario = semUsuario ? null : USUARIOS[indice % USUARIOS.length];

    const ocorridoEm = new Date(agora - indice * 6 * 60 * 60 * 1000);

    registros.push({
      id: `auditoria-${indice}`,
      ocorridoEm: ocorridoEm.toISOString().slice(0, 19),
      acao: evento.acao,
      descricaoAcao: descricaoDe(acoesMock, evento.acao),
      recursoTipo: evento.recurso,
      descricaoRecursoTipo: descricaoDe(recursosMock, evento.recurso),
      recursoId: usuario ? `r-${indice}` : null,
      usuarioId: usuario?.id ?? null,
      usuarioNome: usuario?.nome ?? null,
      usuarioEmail: usuario?.email ?? null,
    });
  }

  return registros;
}

const REGISTROS = gerarRegistros();

export function buscarAuditoriaMock({ pagina, tamanho, de, ate, acao }) {
  const filtrados = REGISTROS.filter((registro) => {
    const dia = registro.ocorridoEm.slice(0, 10);
    if (de && dia < de) return false;
    if (ate && dia > ate) return false;
    if (acao && registro.acao !== acao) return false;
    return true;
  });

  const inicio = pagina * tamanho;

  return {
    conteudo: filtrados.slice(inicio, inicio + tamanho),
    pagina,
    tamanho,
    totalDeItens: filtrados.length,
    totalDePaginas: Math.max(1, Math.ceil(filtrados.length / tamanho)),
  };
}
