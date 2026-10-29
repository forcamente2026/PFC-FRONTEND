import { categoriasMock, listarArtigosMock } from "./artigosMock";

export const niveisMock = [
  { codigo: "INICIANTE", descricao: "Iniciante" },
  { codigo: "INTERMEDIARIO", descricao: "Intermediário" },
  { codigo: "AVANCADO", descricao: "Avançado" },
];

const APROVACOES_PARA_PUBLICAR = 3;
const NOTA_MINIMA = 70;
const SITUACOES_PUBLICADAS = ["APROVADO", "APROVADO_PELOS_PROFESSORES"];

const AUTOR_MOCK = {
  id: "a1b2c3d4-0000-0000-0000-000000000001",
  nomeCompleto: "Prof. Carlos Andrade",
};

const PROFESSORES_MOCK = [
  { id: "a1b2c3d4-0000-0000-0000-000000000002", nomeCompleto: "Prof. Ana Lima" },
  { id: "a1b2c3d4-0000-0000-0000-000000000003", nomeCompleto: "Prof. Bruno Costa" },
  { id: "a1b2c3d4-0000-0000-0000-000000000004", nomeCompleto: "Prof. Carla Dias" },
];

function categoria(codigo) {
  return categoriasMock.find((item) => item.codigo === codigo);
}

function nivel(codigo) {
  return niveisMock.find((item) => item.codigo === codigo);
}

function questao(id, enunciado, alternativas, indiceCorreta, explicacao) {
  return {
    id,
    enunciado,
    explicacao,
    alternativas: alternativas.map((texto, indice) => ({
      id: `${id}-${indice + 1}`,
      texto,
      correta: indice === indiceCorreta,
    })),
  };
}

const quizzes = [
  {
    id: "quiz-hipertrofia",
    titulo: "Princípios da hipertrofia",
    descricao:
      "Confira o que você sabe sobre o que faz o músculo crescer: o estímulo principal, o volume de treino e a progressão de carga.",
    categoria: categoria("FISIOLOGIA"),
    nivel: nivel("INICIANTE"),
    autor: AUTOR_MOCK,
    status: "APROVADO",
    motivoRejeicao: null,
    aprovacoes: [],
    artigoIds: ["tensao-mecanica", "volume-semanal"],
    questoes: [
      questao(
        "hip-1",
        "Qual é considerado o principal estímulo para a hipertrofia muscular?",
        ["Tensão mecânica", "Dor muscular tardia", "Suor durante o treino", "Treinar sempre em jejum"],
        0,
        "A tensão gerada pela carga é o principal sinal para o músculo crescer; a dor tardia não indica crescimento.",
      ),
      questao(
        "hip-2",
        "Para quem está começando, qual faixa de séries semanais por grupo muscular costuma bastar para progredir?",
        ["1 a 2 séries", "10 a 20 séries", "40 a 50 séries"],
        1,
        "Entre 10 e 20 séries semanais atendem a maioria das pessoas; muito acima disso, a recuperação piora.",
      ),
      questao(
        "hip-3",
        "O que significa progressão de carga?",
        [
          "Aumentar aos poucos a dificuldade do treino",
          "Trocar todos os exercícios toda semana",
          "Treinar até a exaustão em todas as séries",
        ],
        0,
        "Progredir é aumentar aos poucos a carga, as repetições ou as séries, para o corpo continuar se adaptando.",
      ),
    ],
    criadoEm: "2026-10-20T10:00:00",
  },
  {
    id: "quiz-periodizacao",
    titulo: "Periodização do treino de força",
    descricao:
      "Perguntas sobre como organizar o treino em fases ao longo das semanas e para que serve a semana de descarga.",
    categoria: categoria("PERIODIZACAO"),
    nivel: nivel("INTERMEDIARIO"),
    autor: AUTOR_MOCK,
    status: "PENDENTE",
    motivoRejeicao: null,
    aprovacoes: [PROFESSORES_MOCK[0]],
    artigoIds: ["volume-semanal"],
    questoes: [
      questao(
        "per-1",
        "O que é periodização?",
        ["Organizar o treino em fases ao longo do tempo", "Treinar sempre no mesmo horário", "Fazer um único treino por semana"],
        0,
        "Periodizar é dividir o treino em fases com objetivos diferentes, para continuar evoluindo e evitar o excesso.",
      ),
      questao(
        "per-2",
        "Na periodização linear, o que costuma acontecer ao longo das semanas?",
        ["A carga aumenta e o volume diminui", "A carga e o volume ficam iguais", "O volume aumenta sem limite"],
        0,
        "No modelo linear, a intensidade sobe aos poucos enquanto o volume cai.",
      ),
      questao(
        "per-3",
        "Para que serve uma semana de descarga?",
        ["Reduzir o volume para recuperar", "Testar a carga máxima todos os dias", "Trocar de modalidade"],
        0,
        "A descarga reduz o volume por alguns dias para o corpo se recuperar antes da próxima fase.",
      ),
    ],
    criadoEm: "2026-10-25T10:00:00",
  },
  {
    id: "quiz-proteina",
    titulo: "Proteína e recuperação",
    descricao:
      "Um quiz rápido sobre a quantidade de proteína, a distribuição nas refeições e o papel do sono na recuperação.",
    categoria: categoria("NUTRICAO"),
    nivel: nivel("AVANCADO"),
    autor: PROFESSORES_MOCK[1],
    status: "APROVADO_PELOS_PROFESSORES",
    motivoRejeicao: null,
    aprovacoes: [PROFESSORES_MOCK[0], PROFESSORES_MOCK[2], AUTOR_MOCK],
    artigoIds: [],
    questoes: [
      questao(
        "pro-1",
        "Qual faixa diária de proteína é recomendada, com frequência, para quem treina força?",
        ["0,5 g por kg de peso", "1,6 a 2,2 g por kg de peso", "5 g por kg de peso"],
        1,
        "A faixa de 1,6 a 2,2 g por kg de peso por dia aparece com frequência nas revisões sobre ganho de massa.",
      ),
      questao(
        "pro-2",
        "Dividir a proteína do dia em várias refeições tende a:",
        ["Favorecer a síntese proteica ao longo do dia", "Impedir o ganho de massa", "Não ter relação com a recuperação"],
        0,
        "Distribuir a proteína mantém o estímulo de síntese ao longo do dia.",
      ),
      questao(
        "pro-3",
        "O sono influencia a recuperação muscular?",
        ["Sim, dormir pouco atrapalha a recuperação", "Não, só a alimentação importa"],
        0,
        "Dormir pouco reduz a recuperação e o desempenho no treino seguinte.",
      ),
    ],
    criadoEm: "2026-10-22T10:00:00",
  },
  {
    id: "quiz-alongamento",
    titulo: "Alongamento antes do treino",
    descricao: "Perguntas sobre o efeito do alongamento estático feito antes do treino de força.",
    categoria: categoria("BIOMECANICA"),
    nivel: nivel("INICIANTE"),
    autor: AUTOR_MOCK,
    status: "REJEITADO",
    motivoRejeicao: "A pergunta 2 tem duas alternativas que podem ser consideradas corretas. Reescreva uma delas.",
    aprovacoes: [],
    artigoIds: [],
    questoes: [
      questao(
        "alo-1",
        "O alongamento estático longo antes do treino pode:",
        ["Reduzir um pouco a força nas séries seguintes", "Dobrar a força", "Não ter efeito nenhum, nunca"],
        0,
        "Alongamentos estáticos longos podem reduzir a força por alguns minutos.",
      ),
      questao(
        "alo-2",
        "Qual aquecimento costuma ser indicado antes da musculação?",
        ["Séries leves do próprio exercício", "Movimentos que imitam o exercício", "Ficar parado"],
        0,
        "Séries leves preparam o corpo para a carga do treino.",
      ),
      questao(
        "alo-3",
        "Alongar depois do treino é proibido?",
        ["Não", "Sim"],
        0,
        "Alongar depois do treino não atrapalha e pode ajudar na mobilidade.",
      ),
    ],
    criadoEm: "2026-10-18T10:00:00",
  },
];

const tentativas = [];

function falhar(status, mensagem, campos = []) {
  throw { status, mensagem, campos };
}

function ehAdministrador(usuario) {
  return usuario?.papel === "ADMINISTRADOR";
}

function ehProfessor(usuario) {
  return usuario?.papel === "PROFESSOR";
}

function ehAutor(quiz, usuario) {
  return Boolean(usuario) && quiz.autor.id === usuario.id;
}

function publicado(quiz) {
  return SITUACOES_PUBLICADAS.includes(quiz.status);
}

function podeVer(quiz, usuario) {
  if (ehAdministrador(usuario) || publicado(quiz)) return true;
  if (!ehProfessor(usuario)) return false;
  if (quiz.status === "PENDENTE") return true;
  return ehAutor(quiz, usuario);
}

function podeAprovar(quiz, usuario) {
  return (
    ehProfessor(usuario) &&
    !ehAutor(quiz, usuario) &&
    quiz.status === "PENDENTE" &&
    !quiz.aprovacoes.some((professor) => professor.id === usuario.id)
  );
}

function mostraGabarito(quiz, usuario) {
  return (
    ehAdministrador(usuario) ||
    ehAutor(quiz, usuario) ||
    (ehProfessor(usuario) && quiz.status === "PENDENTE")
  );
}

function artigosPublicados() {
  return listarArtigosMock({ papel: "ALUNO" });
}

function melhorTentativa(quiz, usuario) {
  const minhas = tentativas.filter(
    (tentativa) => tentativa.quizId === quiz.id && tentativa.usuarioId === usuario?.id,
  );
  if (minhas.length === 0) return null;
  const melhor = minhas.reduce((atual, tentativa) =>
    tentativa.acertos > atual.acertos ? tentativa : atual,
  );
  return paraNota(melhor.acertos, melhor.total);
}

function paraNota(acertos, total) {
  const percentual = Math.round((acertos / total) * 100);
  return { acertos, total, percentual, concluido: percentual >= NOTA_MINIMA };
}

function paraResumo(quiz, usuario) {
  const autorOuAdministrador = ehAdministrador(usuario) || ehAutor(quiz, usuario);
  return {
    id: quiz.id,
    titulo: quiz.titulo,
    descricao: quiz.descricao,
    categoria: quiz.categoria,
    nivel: quiz.nivel,
    autorNome: quiz.autor.nomeCompleto,
    status: quiz.status,
    motivoRejeicao: autorOuAdministrador ? quiz.motivoRejeicao : null,
    aprovacoesDeProfessores: quiz.aprovacoes.length,
    aprovacoesNecessarias: APROVACOES_PARA_PUBLICAR,
    podeEditar: autorOuAdministrador,
    podeAprovar: podeAprovar(quiz, usuario),
    professoresQueAprovaram: ehAdministrador(usuario)
      ? quiz.aprovacoes.map((professor) => professor.nomeCompleto)
      : [],
    totalQuestoes: quiz.questoes.length,
    notaMinima: NOTA_MINIMA,
    melhorTentativa: melhorTentativa(quiz, usuario),
    criadoEm: quiz.criadoEm,
  };
}

function paraDetalhe(quiz, usuario) {
  const gabarito = mostraGabarito(quiz, usuario);
  const titulos = new Map(artigosPublicados().map((artigo) => [artigo.id, artigo.titulo]));
  return {
    ...paraResumo(quiz, usuario),
    gabarito,
    artigos: quiz.artigoIds
      .filter((artigoId) => titulos.has(artigoId))
      .map((artigoId) => ({ id: artigoId, titulo: titulos.get(artigoId) })),
    questoes: quiz.questoes.map((item) => ({
      id: item.id,
      enunciado: item.enunciado,
      explicacao: gabarito ? item.explicacao : null,
      alternativas: item.alternativas.map((alternativa) => ({
        id: alternativa.id,
        texto: alternativa.texto,
        ...(gabarito ? { correta: alternativa.correta } : {}),
      })),
    })),
  };
}

function buscarVisivel(id, usuario) {
  const quiz = quizzes.find((item) => item.id === id);
  if (!quiz || !podeVer(quiz, usuario)) falhar(404, "Quiz não encontrado");
  return quiz;
}

function exigirAutorOuAdministrador(quiz, usuario, acao) {
  if (!ehAdministrador(usuario) && !ehAutor(quiz, usuario)) {
    falhar(403, `Você só pode ${acao} os quizzes que criou`);
  }
}

function vazio(valor) {
  return !valor || !String(valor).trim();
}

function validarTexto(campos, valor, campo, rotulo, limite, obrigatorio = true) {
  if (obrigatorio && vazio(valor)) {
    campos.push({ campo, mensagem: `Informe ${rotulo}` });
  } else if (valor && valor.trim().length > limite) {
    campos.push({ campo, mensagem: `O campo deve ter no máximo ${limite} caracteres` });
  }
}

function validarDados(dados) {
  const campos = [];
  validarTexto(campos, dados.titulo, "titulo", "o título", 150);
  validarTexto(campos, dados.descricao, "descricao", "a descrição", 500);
  if (!categoria(dados.categoria)) campos.push({ campo: "categoria", mensagem: "Informe a categoria" });
  if (!nivel(dados.nivel)) campos.push({ campo: "nivel", mensagem: "Informe o nível" });

  const questoes = dados.questoes ?? [];
  if (questoes.length < 3 || questoes.length > 10) {
    campos.push({ campo: "questoes", mensagem: "O quiz deve ter de 3 a 10 perguntas" });
  }

  questoes.forEach((item, indice) => {
    const base = `questoes[${indice}]`;
    validarTexto(campos, item.enunciado, `${base}.enunciado`, "o enunciado da pergunta", 250);
    validarTexto(campos, item.explicacao, `${base}.explicacao`, "a explicação", 500, false);

    const alternativas = item.alternativas ?? [];
    if (alternativas.length < 2 || alternativas.length > 5) {
      campos.push({ campo: `${base}.alternativas`, mensagem: "Cada pergunta deve ter de 2 a 5 alternativas" });
    }
    alternativas.forEach((alternativa, posicao) => {
      validarTexto(campos, alternativa.texto, `${base}.alternativas[${posicao}].texto`, "o texto da alternativa", 100);
    });
    if (alternativas.filter((alternativa) => alternativa.correta).length !== 1) {
      campos.push({ campo: `${base}.alternativas`, mensagem: "Marque exatamente uma alternativa correta" });
    }
  });

  const artigoIds = dados.artigos ?? [];
  const publicados = new Set(artigosPublicados().map((artigo) => artigo.id));
  if (artigoIds.length > 10) {
    campos.push({ campo: "artigos", mensagem: "Indique no máximo 10 artigos" });
  }
  if (new Set(artigoIds).size !== artigoIds.length) {
    campos.push({ campo: "artigos", mensagem: "Não repita artigos na leitura sugerida" });
  }
  if (artigoIds.some((artigoId) => !publicados.has(artigoId))) {
    campos.push({ campo: "artigos", mensagem: "Indique só artigos publicados" });
  }

  if (campos.length > 0) falhar(400, "Dados invalidos", campos);
}

function aplicarDados(quiz, dados, prefixo) {
  quiz.titulo = dados.titulo.trim();
  quiz.descricao = dados.descricao.trim();
  quiz.categoria = categoria(dados.categoria);
  quiz.nivel = nivel(dados.nivel);
  quiz.artigoIds = [...(dados.artigos ?? [])];
  quiz.questoes = dados.questoes.map((item, indice) =>
    questao(
      `${prefixo}-${indice + 1}`,
      item.enunciado.trim(),
      item.alternativas.map((alternativa) => alternativa.texto.trim()),
      item.alternativas.findIndex((alternativa) => alternativa.correta),
      item.explicacao?.trim() || null,
    ),
  );
}

export function listarQuizzesMock(usuario) {
  return quizzes
    .filter((quiz) => podeVer(quiz, usuario))
    .sort((a, b) => b.criadoEm.localeCompare(a.criadoEm))
    .map((quiz) => paraResumo(quiz, usuario));
}

export function buscarQuizMock(id, usuario) {
  return paraDetalhe(buscarVisivel(id, usuario), usuario);
}

export function buscarQuizParaEdicaoMock(id, usuario) {
  const quiz = buscarVisivel(id, usuario);
  exigirAutorOuAdministrador(quiz, usuario, "editar");
  return {
    id: quiz.id,
    titulo: quiz.titulo,
    descricao: quiz.descricao,
    categoria: quiz.categoria.codigo,
    nivel: quiz.nivel.codigo,
    artigos: [...quiz.artigoIds],
    questoes: quiz.questoes.map((item) => ({
      enunciado: item.enunciado,
      explicacao: item.explicacao ?? "",
      alternativas: item.alternativas.map((alternativa) => ({
        texto: alternativa.texto,
        correta: alternativa.correta,
      })),
    })),
  };
}

export function criarQuizMock(dados, usuario) {
  if (!ehProfessor(usuario) && !ehAdministrador(usuario)) {
    falhar(403, "Somente professores verificados e administradores criam quizzes");
  }
  validarDados(dados);
  const id = `quiz-${Date.now()}`;
  const novo = {
    id,
    autor: { id: usuario.id, nomeCompleto: usuario.nomeCompleto },
    status: ehAdministrador(usuario) ? "APROVADO" : "PENDENTE",
    motivoRejeicao: null,
    aprovacoes: [],
    criadoEm: new Date().toISOString(),
  };
  aplicarDados(novo, dados, id);
  quizzes.push(novo);
  return paraDetalhe(novo, usuario);
}

export function editarQuizMock(id, dados, usuario) {
  const quiz = buscarVisivel(id, usuario);
  exigirAutorOuAdministrador(quiz, usuario, "editar");
  validarDados(dados);
  aplicarDados(quiz, dados, `${quiz.id}-${Date.now()}`);
  if (!ehAdministrador(usuario)) {
    quiz.status = "PENDENTE";
    quiz.motivoRejeicao = null;
    quiz.aprovacoes = [];
  }
  return paraDetalhe(quiz, usuario);
}

export function excluirQuizMock(id, usuario) {
  const quiz = buscarVisivel(id, usuario);
  exigirAutorOuAdministrador(quiz, usuario, "excluir");
  quizzes.splice(quizzes.indexOf(quiz), 1);
}

export function aprovarQuizMock(id, usuario) {
  const quiz = buscarVisivel(id, usuario);
  if (!ehProfessor(usuario) || ehAutor(quiz, usuario)) {
    falhar(403, "Só outro professor pode aprovar este quiz");
  }
  if (!podeAprovar(quiz, usuario)) {
    falhar(409, "Este quiz não está aguardando a sua aprovação");
  }
  quiz.aprovacoes = [...quiz.aprovacoes, { id: usuario.id, nomeCompleto: usuario.nomeCompleto }];
  if (quiz.aprovacoes.length >= APROVACOES_PARA_PUBLICAR) {
    quiz.status = "APROVADO_PELOS_PROFESSORES";
  }
  return paraDetalhe(quiz, usuario);
}

export function alterarStatusQuizMock(id, status, motivo, usuario) {
  if (!ehAdministrador(usuario)) falhar(403, "Acesso negado");
  const quiz = buscarVisivel(id, usuario);
  if (status === "REJEITADO" && vazio(motivo)) {
    falhar(400, "Dados invalidos", [
      { campo: "motivoPresenteNaRejeicao", mensagem: "Informe o motivo da rejeição" },
    ]);
  }
  if (quiz.status !== "PENDENTE" && quiz.status !== "APROVADO_PELOS_PROFESSORES") {
    falhar(409, "Este quiz já foi revisado");
  }
  quiz.status = status;
  quiz.motivoRejeicao = status === "REJEITADO" ? motivo.trim() : null;
  return paraDetalhe(quiz, usuario);
}

export function listarQuizzesPendentesMock(usuario) {
  if (!ehAdministrador(usuario)) falhar(403, "Acesso negado");
  return quizzes
    .filter((quiz) => quiz.status === "PENDENTE" || quiz.status === "APROVADO_PELOS_PROFESSORES")
    .sort((a, b) => a.criadoEm.localeCompare(b.criadoEm))
    .map((quiz) => paraResumo(quiz, usuario));
}

export function responderQuizMock(id, respostas, usuario) {
  const quiz = buscarVisivel(id, usuario);
  if (!publicado(quiz)) falhar(409, "Este quiz ainda não foi publicado");

  const escolhidas = new Map((respostas ?? []).map((resposta) => [resposta.questaoId, resposta.alternativaId]));
  if (quiz.questoes.some((item) => !escolhidas.has(item.id))) {
    falhar(400, "Dados invalidos", [{ campo: "respostas", mensagem: "Responda todas as perguntas" }]);
  }

  const correcao = quiz.questoes.map((item) => {
    const certa = item.alternativas.find((alternativa) => alternativa.correta);
    const escolhida = escolhidas.get(item.id);
    return {
      questaoId: item.id,
      alternativaCorretaId: certa.id,
      alternativaEscolhidaId: escolhida,
      acertou: escolhida === certa.id,
      explicacao: item.explicacao,
    };
  });

  const acertos = correcao.filter((item) => item.acertou).length;
  tentativas.push({
    quizId: quiz.id,
    usuarioId: usuario.id,
    acertos,
    total: quiz.questoes.length,
    feitaEm: new Date().toISOString(),
  });

  return { ...paraNota(acertos, quiz.questoes.length), notaMinima: NOTA_MINIMA, correcao };
}
