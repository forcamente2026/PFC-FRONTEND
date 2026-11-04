import { BookOpen, Calculator, Dumbbell, ListChecks, ShieldCheck, UserRound } from "lucide-react";
import { PAPEIS_VALIDADORES } from "../../utils/papeis";

export const SAUDACOES = {
  ALUNO: "Estude pelos artigos, teste o que aprendeu nos quizzes e acompanhe o seu treino.",
  PROFESSOR: "Escreva e revise artigos e quizzes, e use as mesmas ferramentas dos seus alunos.",
  ADMINISTRADOR: "Veja o que espera a sua decisão e cuide das contas da plataforma.",
};

export const FUNCIONALIDADES = [
  {
    para: "/articles",
    icone: BookOpen,
    titulo: "Artigos",
    texto: "Revisões de estudos sobre treino, validadas por professores de Educação Física.",
    textoEditor: "Leia o acervo, envie artigos para revisão e aprove os dos colegas.",
  },
  {
    para: "/quiz",
    icone: ListChecks,
    titulo: "Quiz",
    texto: "Teste o que aprendeu nos artigos e acompanhe a sua melhor nota em cada quiz.",
    textoEditor: "Responda aos quizzes e crie os seus, com a leitura sugerida no acervo.",
  },
  {
    para: "/library",
    icone: Dumbbell,
    titulo: "Biblioteca de exercícios",
    texto: "Exercícios por grupo muscular, com o equipamento e o nível de dificuldade.",
    textoEditor: "Consulte os exercícios por grupo muscular e cadastre exercícios novos.",
  },
  {
    para: "/progress",
    icone: Calculator,
    titulo: "Progresso",
    texto: "Calcule a taxa metabólica basal, a meta de hidratação e o volume de treino.",
  },
  {
    para: "/minha-conta",
    icone: UserRound,
    titulo: "Meus dados",
    texto: "Seus dados, senha e e-mail, e uma cópia de tudo o que a plataforma guarda sobre você.",
  },
  {
    para: "/admin",
    icone: ShieldCheck,
    titulo: "Administração",
    texto: "Usuários, artigos e quizzes para aprovar, verificação do CREF e trilha de auditoria.",
    papeis: PAPEIS_VALIDADORES,
  },
];
