import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
import Cartao from "../components/ComponentesHome/Cartao";
import EstadoRequisicao from "../components/progress/EstadoRequisicao";
import ResponderQuiz from "../components/QuizComponents/ResponderQuiz";
import GabaritoQuiz from "../components/QuizComponents/GabaritoQuiz";
import AprovarQuiz from "../components/QuizComponents/AprovarQuiz";
import ValidacaoQuiz from "../components/QuizComponents/ValidacaoQuiz";
import ExcluirQuiz from "../components/QuizComponents/ExcluirQuiz";
import { etiquetaDoArtigo } from "../components/ArticlesComponents/artigoCampos";
import useAvisoDaNavegacao from "../hooks/useAvisoDaNavegacao";
import { buscarQuiz } from "../services/quizService";
import { podeValidar } from "../utils/papeis";

const ESTILO_CHIP =
  "rounded-full border border-red-500 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-red-400";

function textoDaNota(nota) {
  if (nota.concluido) return `Concluído · melhor nota ${nota.percentual}%`;
  return `Sua melhor nota: ${nota.percentual}%`;
}

function QuizPages() {
  const { id } = useParams();
  const { usuario } = useOutletContext();
  const navigate = useNavigate();
  const avisoDaNavegacao = useAvisoDaNavegacao();
  const [quiz, setQuiz] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [aviso, setAviso] = useState(avisoDaNavegacao);

  useEffect(() => {
    let ativo = true;

    buscarQuiz(id, usuario)
      .then((dados) => {
        if (!ativo) return;
        setQuiz(dados);
        setErro(null);
      })
      .catch((err) => {
        if (!ativo) return;
        setQuiz(null);
        setErro(err.mensagem || "Não foi possível carregar o quiz.");
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [id, usuario]);

  function atualizarEmSegundoPlano() {
    buscarQuiz(id, usuario)
      .then(setQuiz)
      .catch(() => {});
  }

  function aoAprovar(atualizado) {
    setQuiz(atualizado);
    setAviso("Sua aprovação foi registrada.");
  }

  function aoAlterarStatus(atualizado) {
    setQuiz(atualizado);
    setAviso(atualizado.status === "APROVADO" ? "Quiz aprovado." : "Quiz rejeitado.");
  }

  function aoExcluir(titulo) {
    navigate("/quiz", { state: { aviso: `"${titulo}" foi excluído.` } });
  }

  const etiquetaStatus = quiz ? etiquetaDoArtigo(quiz) : null;
  const mostrarValidacao = Boolean(quiz) && podeValidar(usuario);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-10 lp:py-16">
      <Link to="/quiz" className="text-sm text-red-200 hover:text-white hover:underline">
        ← Voltar para os quizzes
      </Link>

      <div className="mt-6">
        <EstadoRequisicao
          carregando={carregando}
          mensagemCarregando="Carregando quiz..."
          erro={erro}
          vazio={!quiz}
          mensagemVazio="Quiz não encontrado."
        >
          {quiz && (
            <Cartao className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className={ESTILO_CHIP}>{quiz.categoria.descricao}</span>
                <span className={ESTILO_CHIP}>{quiz.nivel.descricao}</span>
                {etiquetaStatus && (
                  <span className="rounded-md bg-gray-700 px-2 py-1 text-xs font-medium text-gray-200">
                    {etiquetaStatus}
                  </span>
                )}
              </div>

              <h1 className="font-montserrat text-3xl text-white md:text-4xl">{quiz.titulo}</h1>
              <p className="text-sm text-gray-400">
                por <span className="font-semibold text-red-200">{quiz.autorNome}</span>
              </p>
              <p className="text-lg leading-relaxed text-gray-300">{quiz.descricao}</p>

              <div className="flex flex-wrap justify-between gap-2 text-xs uppercase tracking-[0.2em] text-gray-400">
                <span>
                  {quiz.totalQuestoes} perguntas · nota mínima {quiz.notaMinima}%
                </span>
                {quiz.melhorTentativa && (
                  <span
                    className={quiz.melhorTentativa.concluido ? "text-green-400" : "text-gray-300"}
                  >
                    {textoDaNota(quiz.melhorTentativa)}
                  </span>
                )}
              </div>

              {quiz.artigos.length > 0 && (
                <div className="rounded-xl border border-gray-700 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-500">
                    Leitura sugerida
                  </p>
                  <ul className="mt-2 flex flex-col gap-1 text-sm">
                    {quiz.artigos.map((artigo) => (
                      <li key={artigo.id}>
                        <Link
                          to={`/articles/${artigo.id}`}
                          className="text-red-200 hover:text-white hover:underline"
                        >
                          {artigo.titulo}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {quiz.motivoRejeicao && (
                <div className="rounded-xl border border-red-500 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-500">
                    Motivo da rejeição
                  </p>
                  <p className="mt-1 text-sm text-gray-300">{quiz.motivoRejeicao}</p>
                </div>
              )}

              {aviso && (
                <p role="status" className="text-sm text-green-400">
                  {aviso}
                </p>
              )}

              {quiz.podeEditar && (
                <div className="flex flex-wrap gap-3">
                  <Link
                    to={`/quiz/${quiz.id}/editar`}
                    className="rounded-md border border-gray-700 py-2 px-4 font-bold text-red-200 hover:bg-white/10"
                  >
                    Editar
                  </Link>
                  <ExcluirQuiz
                    quiz={quiz}
                    usuario={usuario}
                    aoExcluir={() => aoExcluir(quiz.titulo)}
                  />
                </div>
              )}

              {quiz.podeAprovar && (
                <AprovarQuiz quiz={quiz} usuario={usuario} aoAprovar={aoAprovar} />
              )}

              {mostrarValidacao && (
                <ValidacaoQuiz quiz={quiz} usuario={usuario} aoAlterarStatus={aoAlterarStatus} />
              )}

              <div className="h-px bg-gray-700"></div>

              {quiz.gabarito ? (
                <GabaritoQuiz quiz={quiz} />
              ) : (
                <ResponderQuiz
                  quiz={quiz}
                  usuario={usuario}
                  aoResponder={atualizarEmSegundoPlano}
                />
              )}
            </Cartao>
          )}
        </EstadoRequisicao>
      </div>
    </div>
  );
}

export default QuizPages;
