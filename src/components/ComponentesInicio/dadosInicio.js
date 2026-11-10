import { PAPEIS_EDITORES, PAPEIS_VALIDADORES } from "../../utils/papeis";
import { ICONES_DAS_PAGINAS } from "../../utils/iconesDasPaginas";

export const SAUDACOES = {
  ALUNO: "Estude pelos artigos, teste o que aprendeu nos quizzes e acompanhe o seu treino.",
  PROFESSOR: "Escreva e revise artigos e quizzes, e use as mesmas ferramentas dos seus alunos.",
  ADMINISTRADOR: "Veja o que aguarda a sua análise e cuide das contas da plataforma.",
};

export const FUNCIONALIDADES = [
  {
    para: "/articles",
    icone: ICONES_DAS_PAGINAS.artigos,
    titulo: "Artigos",
    texto: "Revisões de estudos sobre treino, validadas por professores de Educação Física.",
    textoEditor: "Leia o acervo, envie artigos para revisão e aprove os dos colegas.",
  },
  {
    para: "/quiz",
    icone: ICONES_DAS_PAGINAS.quiz,
    titulo: "Quiz",
    texto: "Teste o que aprendeu nos artigos e acompanhe a sua melhor nota em cada quiz.",
    textoEditor: "Responda aos quizzes e crie os seus, com a leitura sugerida no acervo.",
  },
  {
    para: "/library",
    icone: ICONES_DAS_PAGINAS.biblioteca,
    titulo: "Biblioteca de exercícios",
    texto: "Exercícios por grupo muscular, com o equipamento e o nível de dificuldade.",
    textoEditor: "Consulte os exercícios por grupo muscular e cadastre exercícios novos.",
  },
  {
    para: "/meu-acervo",
    icone: ICONES_DAS_PAGINAS.meuAcervo,
    titulo: "Meu acervo",
    texto: "Tudo o que você criou, separado entre o que espera aprovação, o que está publicado e o que foi recusado.",
    papeis: PAPEIS_EDITORES,
  },
  {
    para: "/progress",
    icone: ICONES_DAS_PAGINAS.calculadoras,
    titulo: "Calculadoras",
    texto: "Calcule a taxa metabólica basal, a meta de hidratação e o volume de treino.",
  },
  {
    para: "/minha-conta",
    icone: ICONES_DAS_PAGINAS.meusDados,
    titulo: "Meus dados",
    texto: "Seus dados, senha e e-mail, e uma cópia de tudo o que a plataforma guarda sobre você.",
  },
  {
    para: "/admin",
    icone: ICONES_DAS_PAGINAS.administracao,
    titulo: "Administração",
    texto: "Usuários, artigos e quizzes para aprovar, verificação do CREF e trilha de auditoria.",
    papeis: PAPEIS_VALIDADORES,
  },
];
