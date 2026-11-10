import { estaEmAnalise, estaPublicado } from "../../utils/moderacao";
import { lerSessao } from "../../utils/sessao";

const CHAVE_DO_MOCK = "forcamente:mock:exercicios";
const APROVACOES_PARA_PUBLICAR = 3;
const LIMITE_MOTIVO = 500;

const PROF_CARLOS = { id: "a1b2c3d4-0000-0000-0000-000000000001", nome: "Prof. Carlos Andrade" };
const PROF_ANA = { id: "a1b2c3d4-0000-0000-0000-000000000002", nome: "Prof. Ana Lima" };
const PROF_BRUNO = { id: "a1b2c3d4-0000-0000-0000-000000000003", nome: "Prof. Bruno Costa" };
const PROF_CARLA = { id: "a1b2c3d4-0000-0000-0000-000000000004", nome: "Prof. Carla Dias" };

function aprovacaoDe(professor) {
  return { professorId: professor.id, professorNome: professor.nome };
}

function exemplo(id, nome, grupoMuscular, nivel, imagem, etapas, extras = {}) {
  return {
    id,
    nome,
    grupoMuscular,
    nivel,
    descricaoExecucao: etapas.join("\n"),
    errosComuns: extras.errosComuns ?? "",
    aquecimentoRecomendado: extras.aquecimentoRecomendado ?? "",
    equipamento: extras.equipamento ?? "",
    gifUrl: imagem,
    criadoEm: extras.criadoEm ?? "2026-09-01T10:00:00",
    atualizadoEm: null,
    status: extras.status ?? "APROVADO",
    autorId: extras.autor?.id ?? null,
    autorNome: extras.autor?.nome ?? null,
    motivoRejeicao: extras.motivoRejeicao ?? null,
    aprovacoes: extras.aprovacoes ?? [],
  };
}

const EXEMPLOS = [
  exemplo(
    "ex-supino",
    "Supino reto com barra",
    "PEITO",
    "INTERMEDIARIO",
    "/images/Supino com barra.jpg",
    [
      "Deite no banco com os pés apoiados no chão.",
      "Desça a barra até tocar o peito, com controle.",
      "Empurre até estender os braços, sem travar os cotovelos.",
    ],
    {
      equipamento: "Barra e banco",
      errosComuns: "Tirar o quadril do banco.",
      aquecimentoRecomendado: "Duas séries leves, só com a barra.",
    },
  ),
  exemplo(
    "ex-agachamento",
    "Agachamento livre",
    "PERNA",
    "INTERMEDIARIO",
    "/images/Agachamento livre.jpg",
    [
      "Apoie a barra nos ombros e afaste os pés na largura do quadril.",
      "Desça até as coxas ficarem paralelas ao chão.",
      "Suba empurrando o chão, com as costas retas.",
    ],
    { equipamento: "Barra" },
  ),
  exemplo(
    "ex-remada",
    "Remada com halter",
    "COSTAS",
    "INICIANTE",
    "/images/Remada com halter.jpg",
    ["Apoie um joelho e uma mão no banco.", "Puxe o halter até a lateral do tronco."],
    { equipamento: "Halter e banco" },
  ),
  exemplo(
    "ex-legpress",
    "Leg press 45",
    "PERNA",
    "INICIANTE",
    "/images/legpress.jpg",
    ["Apoie os pés na plataforma.", "Desça com controle e empurre sem travar os joelhos."],
    {
      equipamento: "Leg press",
      status: "PENDENTE",
      autor: PROF_ANA,
      criadoEm: "2026-10-20T09:00:00",
      aprovacoes: [aprovacaoDe(PROF_BRUNO), aprovacaoDe(PROF_CARLA)],
    },
  ),
  exemplo(
    "ex-rosca",
    "Rosca direta com barra W",
    "BICEPS",
    "INICIANTE",
    "/images/rosca direta com barra W.jpg",
    ["Segure a barra com os cotovelos junto ao corpo.", "Suba sem balançar o tronco."],
    {
      equipamento: "Barra W",
      status: "PENDENTE",
      autor: PROF_CARLOS,
      criadoEm: "2026-10-22T09:00:00",
    },
  ),
  exemplo(
    "ex-desenvolvimento",
    "Desenvolvimento com halteres",
    "OMBRO",
    "INTERMEDIARIO",
    "/images/desenvolvimento com halteres.jpg",
    ["Sente com os halteres na altura dos ombros.", "Empurre até estender os braços."],
    {
      equipamento: "Halteres e banco",
      status: "APROVADO_PELOS_PROFESSORES",
      autor: PROF_CARLA,
      criadoEm: "2026-10-18T09:00:00",
      aprovacoes: [aprovacaoDe(PROF_ANA), aprovacaoDe(PROF_BRUNO), aprovacaoDe(PROF_CARLOS)],
    },
  ),
  exemplo(
    "ex-barra-fixa",
    "Barra fixa",
    "COSTAS",
    "AVANCADO",
    "/images/Barra Fixa.jpg",
    ["Segure a barra com as mãos afastadas.", "Suba até o queixo passar da barra."],
    {
      equipamento: "Barra fixa",
      status: "REJEITADO",
      autor: PROF_CARLOS,
      criadoEm: "2026-10-15T09:00:00",
      motivoRejeicao: "Falta explicar como descer com controle.",
    },
  ),
];

function lerExercicios() {
  try {
    const salvo = localStorage.getItem(CHAVE_DO_MOCK);
    return salvo ? JSON.parse(salvo) : EXEMPLOS;
  } catch {
    return EXEMPLOS;
  }
}

function gravarExercicios(exercicios) {
  try {
    localStorage.setItem(CHAVE_DO_MOCK, JSON.stringify(exercicios));
  } catch {
    return;
  }
}

function falha(status, mensagem, campos = []) {
  return { status, mensagem, campos };
}

function quemPede() {
  return lerSessao() ?? { id: null, nomeCompleto: "", papel: "ALUNO" };
}

function ehAdministrador(sessao) {
  return sessao.papel === "ADMINISTRADOR";
}

function ehProfessor(sessao) {
  return sessao.papel === "PROFESSOR";
}

function ehAutor(exercicio, sessao) {
  return Boolean(exercicio.autorId) && exercicio.autorId === sessao.id;
}

function podeVer(exercicio, sessao) {
  if (ehAdministrador(sessao) || estaPublicado(exercicio)) return true;
  if (!ehProfessor(sessao)) return false;
  return exercicio.status === "PENDENTE" || ehAutor(exercicio, sessao);
}

function podeEditar(exercicio, sessao) {
  return ehAdministrador(sessao) || (ehProfessor(sessao) && ehAutor(exercicio, sessao));
}

function jaAprovou(exercicio, sessao) {
  return exercicio.aprovacoes.some((aprovacao) => aprovacao.professorId === sessao.id);
}

function paraResposta(exercicio, sessao) {
  const { autorId, aprovacoes, ...campos } = exercicio;
  const mostraMotivo = ehAdministrador(sessao) || autorId === sessao.id;

  return {
    ...campos,
    motivoRejeicao: mostraMotivo ? exercicio.motivoRejeicao : null,
    aprovacoesDeProfessores: aprovacoes.length,
    aprovacoesNecessarias: APROVACOES_PARA_PUBLICAR,
    podeEditar: podeEditar(exercicio, sessao),
    podeAprovar:
      ehProfessor(sessao) &&
      !ehAutor(exercicio, sessao) &&
      exercicio.status === "PENDENTE" &&
      !jaAprovou(exercicio, sessao),
    professoresQueAprovaram: ehAdministrador(sessao)
      ? aprovacoes.map((aprovacao) => aprovacao.professorNome)
      : [],
  };
}

function buscarOuFalhar(exercicios, id) {
  const exercicio = exercicios.find((item) => item.id === id);
  if (!exercicio) throw falha(404, "Exercício não encontrado.");
  return exercicio;
}

function exigirEdicao(exercicio, sessao) {
  if (!podeEditar(exercicio, sessao)) throw falha(403, "Acesso negado");
}

function exigirNomeLivre(exercicios, nome, idAtual = null) {
  const repetido = exercicios.some(
    (item) => item.id !== idAtual && item.nome.toLowerCase() === nome.trim().toLowerCase(),
  );
  if (repetido) throw falha(409, "Já existe um exercício com este nome.");
}

function trocar(exercicios, atualizado) {
  gravarExercicios(exercicios.map((item) => (item.id === atualizado.id ? atualizado : item)));
  return paraResposta(atualizado, quemPede());
}

export function listarExerciciosMock() {
  const sessao = quemPede();

  return lerExercicios()
    .filter((exercicio) => podeVer(exercicio, sessao))
    .map((exercicio) => paraResposta(exercicio, sessao));
}

export function listarExerciciosPendentesMock() {
  const sessao = quemPede();
  if (!ehAdministrador(sessao)) throw falha(403, "Acesso negado");

  return lerExercicios()
    .filter(estaEmAnalise)
    .sort((a, b) => a.criadoEm.localeCompare(b.criadoEm))
    .map((exercicio) => paraResposta(exercicio, sessao));
}

export function criarExercicioMock(dados) {
  const sessao = quemPede();
  if (!ehAdministrador(sessao) && !ehProfessor(sessao)) throw falha(403, "Acesso negado");

  const exercicios = lerExercicios();
  exigirNomeLivre(exercicios, dados.nome);

  const novo = {
    ...dados,
    id: `ex-${Date.now()}`,
    criadoEm: new Date().toISOString(),
    atualizadoEm: null,
    status: ehAdministrador(sessao) ? "APROVADO" : "PENDENTE",
    autorId: sessao.id,
    autorNome: sessao.nomeCompleto,
    motivoRejeicao: null,
    aprovacoes: [],
  };

  gravarExercicios([...exercicios, novo]);
  return paraResposta(novo, sessao);
}

export function atualizarExercicioMock(id, dados) {
  const sessao = quemPede();
  const exercicios = lerExercicios();
  const atual = buscarOuFalhar(exercicios, id);

  exigirEdicao(atual, sessao);
  exigirNomeLivre(exercicios, dados.nome, id);

  const atualizado = { ...atual, ...dados, atualizadoEm: new Date().toISOString() };

  if (!ehAdministrador(sessao)) {
    atualizado.status = "PENDENTE";
    atualizado.motivoRejeicao = null;
    atualizado.aprovacoes = [];
  }

  return trocar(exercicios, atualizado);
}

export function excluirExercicioMock(id) {
  const sessao = quemPede();
  const exercicios = lerExercicios();

  exigirEdicao(buscarOuFalhar(exercicios, id), sessao);
  gravarExercicios(exercicios.filter((item) => item.id !== id));
}

export function aprovarExercicioMock(id) {
  const sessao = quemPede();
  if (!ehProfessor(sessao)) throw falha(403, "Acesso negado");

  const exercicios = lerExercicios();
  const atual = buscarOuFalhar(exercicios, id);

  if (ehAutor(atual, sessao)) throw falha(403, "Acesso negado");
  if (atual.status !== "PENDENTE") {
    throw falha(409, "Só é possível aprovar um exercício que está pendente.");
  }
  if (jaAprovou(atual, sessao)) throw falha(409, "Você já aprovou este exercício.");

  const aprovacoes = [
    ...atual.aprovacoes,
    { professorId: sessao.id, professorNome: sessao.nomeCompleto },
  ];

  return trocar(exercicios, {
    ...atual,
    aprovacoes,
    status:
      aprovacoes.length >= APROVACOES_PARA_PUBLICAR ? "APROVADO_PELOS_PROFESSORES" : "PENDENTE",
  });
}

export function alterarStatusExercicioMock(id, status, motivo) {
  const sessao = quemPede();
  if (!ehAdministrador(sessao)) throw falha(403, "Acesso negado");

  const exercicios = lerExercicios();
  const atual = buscarOuFalhar(exercicios, id);

  if (!estaEmAnalise(atual)) {
    throw falha(409, "Este exercício já foi decidido.");
  }

  if (status === "REJEITADO") {
    const texto = motivo?.trim() ?? "";
    if (!texto) {
      throw falha(400, "Dados invalidos", [
        { campo: "motivo", mensagem: "Informe o motivo da rejeição." },
      ]);
    }
    if (texto.length > LIMITE_MOTIVO) {
      throw falha(400, "Dados invalidos", [
        { campo: "motivo", mensagem: `O motivo deve ter no máximo ${LIMITE_MOTIVO} caracteres.` },
      ]);
    }
  }

  return trocar(exercicios, {
    ...atual,
    status,
    motivoRejeicao: status === "REJEITADO" ? motivo.trim() : null,
  });
}
