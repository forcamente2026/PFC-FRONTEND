export const SUBTITULOS_POR_PAPEL = {
  artigos: {
    ALUNO: "Aqui você lê revisões de estudos sobre treino, aprovadas por professores de Educação Física.",
    PROFESSOR: "Aqui você escreve artigos, edita ou exclui os seus e aprova os dos colegas.",
    ADMINISTRADOR: "Aqui você publica artigos, edita ou exclui qualquer um e decide os que aguardam análise.",
  },
  quiz: {
    ALUNO: "Aqui você responde quizzes sobre os artigos e acompanha a sua melhor nota em cada um.",
    PROFESSOR: "Aqui você responde e cria quizzes, edita ou exclui os seus e aprova os dos colegas.",
    ADMINISTRADOR: "Aqui você cria quizzes, edita ou exclui qualquer um e decide os que aguardam análise.",
  },
  biblioteca: {
    ALUNO: "Aqui você consulta exercícios aprovados por professores, com a técnica de execução de cada um.",
    PROFESSOR: "Aqui você cadastra exercícios, edita ou exclui os seus e aprova os dos colegas.",
    ADMINISTRADOR: "Aqui você cadastra exercícios, edita ou exclui qualquer um e decide os que aguardam análise.",
  },
  meuAcervo: {
    PROFESSOR: "Aqui você acompanha o que você mesmo criou: o que espera aprovação, o que foi publicado e o que foi recusado, com o motivo.",
    ADMINISTRADOR: "Aqui você encontra os artigos, quizzes e exercícios que você publicou na plataforma.",
  },
};

export const SUBTITULOS_DA_ADMINISTRACAO = {
  usuarios: "Aqui você consulta as contas, corrige dados e bloqueia ou libera o acesso.",
  pendentes: "Aqui você decide o conteúdo enviado pelos professores, verifica o CREF e atende os pedidos de exclusão de conta.",
  auditoria: "Aqui você acompanha as ações sobre dados pessoais e conteúdo, e exporta a trilha em CSV.",
};

export function subtituloPorPapel(pagina, papel) {
  const textos = SUBTITULOS_POR_PAPEL[pagina];
  return textos[papel] ?? textos.ALUNO;
}
