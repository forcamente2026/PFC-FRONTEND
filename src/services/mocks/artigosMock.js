export const categoriasMock = [
  { codigo: "FISIOLOGIA", descricao: "Fisiologia" },
  { codigo: "BIOMECANICA", descricao: "Biomecânica" },
  { codigo: "PERIODIZACAO", descricao: "Periodização" },
  { codigo: "NUTRICAO", descricao: "Nutrição" },
];

const APROVACOES_PARA_PUBLICAR = 3;
const LIMITE_RESUMO = 250;

const AUTOR_MOCK = {
  id: "a1b2c3d4-0000-0000-0000-000000000001",
  nomeCompleto: "Prof. Carlos Andrade",
};

const PROFESSORES_MOCK = [
  { id: "a1b2c3d4-0000-0000-0000-000000000002", nomeCompleto: "Prof. Ana Lima" },
  { id: "a1b2c3d4-0000-0000-0000-000000000003", nomeCompleto: "Prof. Bruno Costa" },
  { id: "a1b2c3d4-0000-0000-0000-000000000004", nomeCompleto: "Prof. Carla Dias" },
];

const artigos = [
  {
    id: "tensao-mecanica",
    titulo: "Tensão mecânica como principal motor da hipertrofia",
    categoria: categoriasMock[0],
    resumo:
      "Revisão dos mecanismos de sinalização mTOR e do papel relativo do estresse metabólico no ganho de massa.",
    fonte: "https://example.com/estudos/tensao-mecanica",
    autoria: "Silva A, Souza B",
    tipoEstudo: "Rev. sistemática",
    ano: 2024,
    minutosLeitura: 12,
    autor: AUTOR_MOCK,
    status: "APROVADO",
    motivoRejeicao: null,
    aprovacoes: [],
    criadoEm: "2026-09-01T10:00:00",
  },
  {
    id: "amplitude-movimento",
    titulo: "Amplitude de movimento e adaptação regional do músculo",
    categoria: categoriasMock[1],
    resumo:
      "Comparação entre amplitudes parciais e completas e o efeito sobre o crescimento em diferentes regiões do músculo.",
    fonte: "https://example.com/estudos/amplitude-movimento",
    autoria: "",
    tipoEstudo: "Ensaio clínico",
    ano: 2023,
    minutosLeitura: 9,
    autor: AUTOR_MOCK,
    status: "APROVADO",
    motivoRejeicao: null,
    aprovacoes: [],
    criadoEm: "2026-09-03T10:00:00",
  },
  {
    id: "volume-semanal",
    titulo: "Volume semanal: existe um teto de séries produtivas?",
    categoria: categoriasMock[2],
    resumo:
      "Análise da relação dose-resposta entre número de séries semanais por grupo muscular e ganho de massa.",
    fonte: "https://example.com/estudos/volume-semanal",
    autoria: "Pereira C, Rocha D",
    tipoEstudo: "Meta-análise",
    ano: 2024,
    minutosLeitura: 15,
    autor: AUTOR_MOCK,
    status: "APROVADO_PELOS_PROFESSORES",
    motivoRejeicao: null,
    aprovacoes: PROFESSORES_MOCK,
    criadoEm: "2026-09-05T10:00:00",
  },
  {
    id: "distribuicao-proteica",
    titulo: "Distribuição proteica e síntese muscular ao longo do dia",
    categoria: categoriasMock[3],
    resumo:
      "Efeito de dividir a proteína diária em refeições regulares sobre a taxa de síntese proteica muscular.",
    fonte: "https://example.com/estudos/distribuicao-proteica",
    autoria: "",
    tipoEstudo: "Rev. narrativa",
    ano: 2022,
    minutosLeitura: 8,
    autor: AUTOR_MOCK,
    status: "PENDENTE",
    motivoRejeicao: null,
    aprovacoes: PROFESSORES_MOCK.slice(0, 2),
    criadoEm: "2026-09-18T10:00:00",
  },
  {
    id: "alongamento-pre-treino",
    titulo: "Alongamento estático antes do treino reduz a força?",
    categoria: categoriasMock[1],
    resumo:
      "Efeito agudo do alongamento estático prolongado sobre a produção de força nas séries seguintes.",
    fonte: "https://example.com/estudos/alongamento-pre-treino",
    autoria: "Lima E",
    tipoEstudo: "Ensaio clínico",
    ano: 2021,
    minutosLeitura: 6,
    autor: AUTOR_MOCK,
    status: "REJEITADO",
    motivoRejeicao: "O link não abre o estudo citado. Confira a fonte e reenvie.",
    aprovacoes: [],
    criadoEm: "2026-09-20T10:00:00",
  },
];

function falhar(status, mensagem) {
  throw { status, mensagem };
}

function ehAdministrador(usuario) {
  return usuario?.papel === "ADMINISTRADOR";
}

function ehAutor(artigo, usuario) {
  return Boolean(usuario) && artigo.autor.id === usuario.id;
}

function podeVer(artigo, usuario) {
  if (ehAdministrador(usuario)) return true;
  if (artigo.status === "APROVADO" || artigo.status === "APROVADO_PELOS_PROFESSORES") return true;
  if (usuario?.papel !== "PROFESSOR") return false;
  if (artigo.status === "PENDENTE") return true;
  return ehAutor(artigo, usuario);
}

function podeAprovar(artigo, usuario) {
  return (
    usuario?.papel === "PROFESSOR" &&
    !ehAutor(artigo, usuario) &&
    artigo.status === "PENDENTE" &&
    !artigo.aprovacoes.some((professor) => professor.id === usuario.id)
  );
}

function paraResposta(artigo, usuario) {
  const autorOuAdministrador = ehAdministrador(usuario) || ehAutor(artigo, usuario);
  return {
    id: artigo.id,
    titulo: artigo.titulo,
    categoria: artigo.categoria,
    resumo: artigo.resumo,
    fonte: artigo.fonte,
    autoria: artigo.autoria,
    tipoEstudo: artigo.tipoEstudo,
    ano: artigo.ano,
    minutosLeitura: artigo.minutosLeitura,
    autorNome: artigo.autor.nomeCompleto,
    status: artigo.status,
    motivoRejeicao: autorOuAdministrador ? artigo.motivoRejeicao : null,
    aprovacoesDeProfessores: artigo.aprovacoes.length,
    aprovacoesNecessarias: APROVACOES_PARA_PUBLICAR,
    podeEditar: autorOuAdministrador,
    podeAprovar: podeAprovar(artigo, usuario),
    professoresQueAprovaram: ehAdministrador(usuario)
      ? artigo.aprovacoes.map((professor) => professor.nomeCompleto)
      : [],
    criadoEm: artigo.criadoEm,
  };
}

function buscarVisivel(id, usuario) {
  const artigo = artigos.find((item) => item.id === id);
  if (!artigo || !podeVer(artigo, usuario)) falhar(404, "Artigo não encontrado.");
  return artigo;
}

function validarDados(dados) {
  if (dados.resumo.length > LIMITE_RESUMO) {
    falhar(400, `O resumo deve ter no máximo ${LIMITE_RESUMO} caracteres.`);
  }
  if (!dados.fonte.trim().startsWith("https://")) {
    falhar(400, "O link do artigo deve começar com https://.");
  }
}

function aplicarDados(artigo, dados) {
  artigo.titulo = dados.titulo.trim();
  artigo.categoria = categoriasMock.find((item) => item.codigo === dados.categoria);
  artigo.resumo = dados.resumo.trim();
  artigo.fonte = dados.fonte.trim();
  artigo.autoria = dados.autoria.trim();
  artigo.tipoEstudo = dados.tipoEstudo.trim();
  artigo.ano = Number(dados.ano);
  artigo.minutosLeitura = Number(dados.minutosLeitura);
}

export function listarArtigosMock(usuario) {
  return artigos
    .filter((artigo) => podeVer(artigo, usuario))
    .map((artigo) => paraResposta(artigo, usuario));
}

export function buscarArtigoMock(id, usuario) {
  return paraResposta(buscarVisivel(id, usuario), usuario);
}

export function criarArtigoMock(dados, usuario) {
  validarDados(dados);
  const novo = {
    id: `artigo-${Date.now()}`,
    autor: { id: usuario.id, nomeCompleto: usuario.nomeCompleto },
    status: ehAdministrador(usuario) ? "APROVADO" : "PENDENTE",
    motivoRejeicao: null,
    aprovacoes: [],
    criadoEm: new Date().toISOString(),
  };
  aplicarDados(novo, dados);
  artigos.push(novo);
  return paraResposta(novo, usuario);
}

export function editarArtigoMock(id, dados, usuario) {
  const artigo = buscarVisivel(id, usuario);
  if (!ehAdministrador(usuario) && !ehAutor(artigo, usuario)) {
    falhar(403, "Você só pode editar os artigos que indicou.");
  }
  validarDados(dados);
  aplicarDados(artigo, dados);
  if (!ehAdministrador(usuario)) {
    artigo.status = "PENDENTE";
    artigo.motivoRejeicao = null;
    artigo.aprovacoes = [];
  }
  return paraResposta(artigo, usuario);
}

export function excluirArtigoMock(id, usuario) {
  const artigo = buscarVisivel(id, usuario);
  if (!ehAdministrador(usuario) && !ehAutor(artigo, usuario)) {
    falhar(403, "Você só pode excluir os artigos que indicou.");
  }
  artigos.splice(artigos.indexOf(artigo), 1);
}

export function aprovarArtigoMock(id, usuario) {
  const artigo = buscarVisivel(id, usuario);
  if (usuario?.papel !== "PROFESSOR" || ehAutor(artigo, usuario)) {
    falhar(403, "Só outro professor pode aprovar este artigo.");
  }
  if (!podeAprovar(artigo, usuario)) {
    falhar(409, "Este artigo não está aguardando a sua aprovação.");
  }
  artigo.aprovacoes = [
    ...artigo.aprovacoes,
    { id: usuario.id, nomeCompleto: usuario.nomeCompleto },
  ];
  if (artigo.aprovacoes.length >= APROVACOES_PARA_PUBLICAR) {
    artigo.status = "APROVADO_PELOS_PROFESSORES";
  }
  return paraResposta(artigo, usuario);
}

export function alterarStatusMock(id, status, motivo, usuario) {
  if (!ehAdministrador(usuario)) falhar(403, "Acesso negado.");
  const artigo = buscarVisivel(id, usuario);
  if (artigo.status !== "PENDENTE" && artigo.status !== "APROVADO_PELOS_PROFESSORES") {
    falhar(409, "Este artigo já foi revisado.");
  }
  if (status === "REJEITADO" && !motivo?.trim()) {
    falhar(400, "Informe o motivo da rejeição.");
  }
  artigo.status = status;
  artigo.motivoRejeicao = status === "REJEITADO" ? motivo.trim() : null;
  return paraResposta(artigo, usuario);
}

export function listarPendentesMock(usuario) {
  if (!ehAdministrador(usuario)) falhar(403, "Acesso negado.");
  return artigos
    .filter(
      (artigo) =>
        artigo.status === "PENDENTE" || artigo.status === "APROVADO_PELOS_PROFESSORES",
    )
    .sort((a, b) => a.criadoEm.localeCompare(b.criadoEm))
    .map((artigo) => paraResposta(artigo, usuario));
}