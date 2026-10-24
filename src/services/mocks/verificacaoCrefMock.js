const LIMITE_MOTIVO = 500;

const professores = [
  {
    id: "c3d4e5f6-0000-0000-0000-000000000011",
    nomeCompleto: "Prof. Daniel Souza",
    email: "daniel.souza@exemplo.test",
    cref: "012345-G/SP",
    formacao: "BACHARELADO",
    criadoEm: "2026-10-18T09:30:00",
    situacaoCref: "PENDENTE",
    motivoRejeicaoCref: null,
  },
  {
    id: "c3d4e5f6-0000-0000-0000-000000000012",
    nomeCompleto: "Profa. Elisa Ramos",
    email: "elisa.ramos@exemplo.test",
    cref: "067890-G/RJ",
    formacao: "LICENCIATURA",
    criadoEm: "2026-10-20T14:10:00",
    situacaoCref: "PENDENTE",
    motivoRejeicaoCref: null,
  },
  {
    id: "c3d4e5f6-0000-0000-0000-000000000013",
    nomeCompleto: "Prof. Fábio Lima",
    email: "fabio.lima@exemplo.test",
    cref: "054321-G/MG",
    formacao: "BACHARELADO",
    criadoEm: "2026-10-22T08:45:00",
    situacaoCref: "PENDENTE",
    motivoRejeicaoCref: null,
  },
];

function falhar(status, mensagem, campos = []) {
  throw { status, mensagem, campos };
}

function paraPendente(professor) {
  return {
    id: professor.id,
    nomeCompleto: professor.nomeCompleto,
    email: professor.email,
    cref: professor.cref,
    formacao: professor.formacao,
    criadoEm: professor.criadoEm,
  };
}

function paraDetalhe(professor) {
  return {
    ...paraPendente(professor),
    papel: "PROFESSOR",
    situacaoCref: professor.situacaoCref,
    motivoRejeicaoCref: professor.motivoRejeicaoCref,
    ativo: true,
  };
}

function validarDecisao(status, motivo) {
  const campos = [];

  if (status !== "APROVADO" && status !== "REJEITADO") {
    campos.push({
      campo: "situacaoDecidivel",
      mensagem: "A situação deve ser Aprovado ou Rejeitado",
    });
  }
  if (status === "REJEITADO" && !motivo?.trim()) {
    campos.push({
      campo: "motivoPresenteNaRejeicao",
      mensagem: "Informe o motivo da rejeição",
    });
  }
  if (motivo && motivo.length > LIMITE_MOTIVO) {
    campos.push({
      campo: "motivo",
      mensagem: `O motivo deve ter no máximo ${LIMITE_MOTIVO} caracteres`,
    });
  }

  if (campos.length > 0) falhar(400, "Dados invalidos", campos);
}

export function listarVerificacoesPendentesMock() {
  return professores
    .filter((professor) => professor.situacaoCref === "PENDENTE")
    .sort((a, b) => a.criadoEm.localeCompare(b.criadoEm))
    .map(paraPendente);
}

export function decidirVerificacaoCrefMock(id, status, motivo) {
  validarDecisao(status, motivo);

  const professor = professores.find((item) => item.id === id);
  if (!professor) falhar(404, "Usuario nao encontrado");
  if (professor.situacaoCref !== "PENDENTE") {
    falhar(409, "Esta verificacao nao esta pendente e por isso nao pode ser decidida");
  }

  professor.situacaoCref = status;
  professor.motivoRejeicaoCref = status === "REJEITADO" ? motivo.trim() : null;

  return paraDetalhe(professor);
}