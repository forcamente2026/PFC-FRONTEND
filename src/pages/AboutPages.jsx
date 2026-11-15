import { Link } from "react-router-dom";
import CabecalhoPagina from "../components/CabecalhoPagina";
import IconeDaPagina from "../components/IconeDaPagina";
import Cartao from "../components/ComponentesHome/Cartao";
import { ICONES_DAS_PAGINAS } from "../utils/iconesDasPaginas";

const ESTILO_TITULO_SECAO = "font-montserrat text-2xl text-white lp:text-3xl";
const ESTILO_PARAGRAFO = "text-base leading-relaxed text-gray-300";
const ESTILO_LINK = "font-semibold text-red-200 underline hover:text-white";

const PAPEIS = [
  {
    titulo: "Aluno",
    texto: "Lê os artigos, consulta a biblioteca de exercícios, responde aos quizzes e usa as calculadoras.",
  },
  {
    titulo: "Professor",
    texto:
      "Com o CREF validado, escreve artigos, quizzes e exercícios e revisa o conteúdo dos colegas antes de ele chegar ao site.",
  },
  {
    titulo: "Administrador",
    texto:
      "Valida o CREF dos professores, decide a publicação do conteúdo e cuida das contas e dos pedidos sobre dados pessoais.",
  },
];

const RECURSOS = [
  {
    icone: ICONES_DAS_PAGINAS.artigos,
    titulo: "Artigos",
    texto: "Revisões de estudos sobre fisiologia, biomecânica, periodização e nutrição, aprovadas por professores.",
  },
  {
    icone: ICONES_DAS_PAGINAS.biblioteca,
    titulo: "Biblioteca de exercícios",
    texto: "A execução de cada exercício, os erros mais comuns, o aquecimento recomendado e, quando houver, um vídeo.",
  },
  {
    icone: ICONES_DAS_PAGINAS.quiz,
    titulo: "Quizzes",
    texto: "Perguntas sobre o que você leu, com a correção na hora e a sua melhor nota em cada quiz.",
  },
  {
    icone: ICONES_DAS_PAGINAS.calculadoras,
    titulo: "Calculadoras",
    texto: "Volume de treino, gasto energético e hidratação, cada uma com o conceito por trás do número explicado.",
  },
];

const EQUIPE = [
  { nome: "Felipe Costa Monteiro", papel: "Front-end: as telas e a experiência de uso." },
  { nome: "Jonathan Augusto Rodrigues Barbosa", papel: "Back-end: o servidor, as regras e o banco de dados." },
];

function AboutPages() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-10 lp:pb-16">
      <CabecalhoPagina
        titulo="Quem somos"
        subtitulo="Um projeto acadêmico voltado para iniciantes na musculação que querem treinar com informação de qualidade."
        icone={ICONES_DAS_PAGINAS.quemSomos}
      />

      <div className="space-y-12">
        <section className="space-y-4">
          <h2 className={ESTILO_TITULO_SECAO}>Por que o ForçaMente existe</h2>
          <p className={ESTILO_PARAGRAFO}>
            Muita gente começa a treinar sem orientação qualificada e aprende a execução dos exercícios por
            tentativa e erro. Isso aumenta o risco de lesão e reduz o resultado do treino.
          </p>
          <p className={ESTILO_PARAGRAFO}>
            O ForçaMente é uma plataforma voltada para iniciantes: reúne, num só lugar, conteúdo escrito e
            revisado por profissionais de Educação Física, para que eles entendam o que estão fazendo antes de
            fazer. Daí o lema: mais que músculos, conhecimento.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className={ESTILO_TITULO_SECAO}>O que você encontra aqui</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {RECURSOS.map((recurso) => (
              <Cartao key={recurso.titulo} className="flex items-start gap-4">
                <IconeDaPagina icone={recurso.icone} />
                <div>
                  <h3 className="font-montserrat text-xl text-white">{recurso.titulo}</h3>
                  <p className="mt-1 text-sm text-gray-300">{recurso.texto}</p>
                </div>
              </Cartao>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className={ESTILO_TITULO_SECAO}>Como o conteúdo é feito</h2>
          <p className={ESTILO_PARAGRAFO}>
            A plataforma tem três perfis. O conteúdo enviado por um professor passa pela revisão de outros
            professores e pela decisão do administrador antes de aparecer no site.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {PAPEIS.map((papel) => (
              <Cartao key={papel.titulo}>
                <h3 className="font-montserrat text-xl text-white">{papel.titulo}</h3>
                <p className="mt-2 text-sm text-gray-300">{papel.texto}</p>
              </Cartao>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className={ESTILO_TITULO_SECAO}>Nossos compromissos</h2>
          <ul className="list-disc space-y-3 pl-6 text-gray-300">
            <li>
              <strong className="text-white">Conteúdo educativo.</strong> O ForçaMente ensina, mas não substitui a
              avaliação nem o acompanhamento de um profissional de Educação Física ou de saúde.
            </li>
            <li>
              <strong className="text-white">Uso gratuito.</strong> Não há cobrança, assinatura nem conteúdo pago.
            </li>
            <li>
              <strong className="text-white">Seus dados.</strong> Coletamos só o necessário, não pedimos CPF, e você
              pode pedir a anonimização da sua conta quando quiser. Os detalhes estão na{" "}
              <Link to="/politica-de-privacidade" className={ESTILO_LINK}>
                Política de Privacidade
              </Link>
              .
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className={ESTILO_TITULO_SECAO}>Quem faz</h2>
          <p className={ESTILO_PARAGRAFO}>
            O ForçaMente é o Projeto Final de Curso do Bacharelado em Sistemas de Informação da Universidade de
            Mogi das Cruzes (UMC), desenvolvido em 2026.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {EQUIPE.map((pessoa) => (
              <Cartao key={pessoa.nome}>
                <h3 className="font-montserrat text-lg text-white">{pessoa.nome}</h3>
                <p className="mt-1 text-sm text-gray-300">{pessoa.papel}</p>
              </Cartao>
            ))}
          </div>
          <p className={ESTILO_PARAGRAFO}>
            Ficou com alguma dúvida ou quer sugerir algo?{" "}
            <Link to="/contato" className={ESTILO_LINK}>
              Fale com a gente
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}

export default AboutPages;
