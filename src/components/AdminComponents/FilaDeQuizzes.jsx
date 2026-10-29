import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EstadoRequisicao from "../progress/EstadoRequisicao";
import ValidacaoQuiz from "../QuizComponents/ValidacaoQuiz";
import { STATUS_ARTIGO } from "../ArticlesComponents/artigoCampos";
import { listarQuizzesPendentes } from "../../services/quizService";
import { formatarDataCurta } from "../../utils/formatar";

const ESTILO_CABECALHO = "py-2 pr-4 font-semibold text-red-200 whitespace-nowrap";
const ESTILO_CELULA = "py-2 pr-4 text-gray-300 align-top";
const ESTILO_ETIQUETA = "rounded-md border px-2 py-1 text-xs font-medium whitespace-nowrap";

const CORES_DA_SITUACAO = {
  PENDENTE: "border-yellow-500 bg-yellow-500/15 text-yellow-200",
  APROVADO_PELOS_PROFESSORES: "border-green-600 bg-green-600/20 text-green-300",
};

const ESTILO_VER =
  "rounded-md border border-gray-600 px-3 py-1 text-xs text-red-200 hover:bg-white/10 cursor-pointer whitespace-nowrap";
const ESTILO_LINK =
  "self-start rounded-md border border-gray-600 px-3 py-1 text-xs text-red-200 hover:bg-white/10";

function situacaoDoQuiz(quiz) {
  const descricao = STATUS_ARTIGO[quiz.status]?.descricao ?? quiz.status;
  return `${descricao} · ${quiz.aprovacoesDeProfessores} de ${quiz.aprovacoesNecessarias}`;
}

function FilaDeQuizzes({ usuario }) {
  const [quizzes, setQuizzes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [aviso, setAviso] = useState(null);
  const [idAberto, setIdAberto] = useState(null);

  useEffect(() => {
    let ativo = true;

    listarQuizzesPendentes(usuario)
      .then((lista) => {
        if (!ativo) return;
        setQuizzes(lista);
        setErro(null);
      })
      .catch((err) => {
        if (!ativo) return;
        setErro(err.mensagem || "Não foi possível carregar os quizzes pendentes.");
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [usuario]);

  function alternar(id) {
    setIdAberto((atual) => (atual === id ? null : id));
  }

  function retirarDaFila(atualizado) {
    setQuizzes((atuais) => atuais.filter((quiz) => quiz.id !== atualizado.id));
    setIdAberto(null);
    setAviso(
      atualizado.status === "APROVADO"
        ? `"${atualizado.titulo}" foi aprovado.`
        : `"${atualizado.titulo}" foi rejeitado.`,
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-semibold tracking-[0.25em] text-red-200 uppercase">
          Quizzes para revisar
          {!carregando && !erro && ` (${quizzes.length})`}
        </h3>
        <p className="mt-1 text-sm text-gray-400">
          Quizzes que esperam a decisão do administrador. Em "Ver no site" aparecem as
          perguntas com o gabarito.
        </p>
      </div>

      {aviso && (
        <p role="status" className="text-sm text-green-400">
          {aviso}
        </p>
      )}

      <EstadoRequisicao
        carregando={carregando}
        mensagemCarregando="Carregando quizzes..."
        erro={erro}
        vazio={quizzes.length === 0}
        mensagemVazio="Nenhum quiz aguardando revisão."
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className={ESTILO_CABECALHO}>Quiz</th>
                <th className={ESTILO_CABECALHO}>Situação</th>
                <th className={ESTILO_CABECALHO}>Enviado em</th>
                <th className={ESTILO_CABECALHO}>Ação</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz) => {
                const aberto = quiz.id === idAberto;

                return (
                  <Fragment key={quiz.id}>
                    <tr className={aberto ? "" : "border-b border-gray-700"}>
                      <td className={ESTILO_CELULA}>
                        <span className="block text-white">{quiz.titulo}</span>
                        <span className="block text-xs text-gray-400">
                          por {quiz.autorNome} · {quiz.totalQuestoes} perguntas
                        </span>
                      </td>
                      <td className={ESTILO_CELULA}>
                        <span
                          className={`${ESTILO_ETIQUETA} ${
                            CORES_DA_SITUACAO[quiz.status] ?? "border-gray-600 text-gray-300"
                          }`}
                        >
                          {situacaoDoQuiz(quiz)}
                        </span>
                      </td>
                      <td className={`${ESTILO_CELULA} whitespace-nowrap`}>
                        {formatarDataCurta(quiz.criadoEm)}
                      </td>
                      <td className={ESTILO_CELULA}>
                        <button
                          type="button"
                          aria-expanded={aberto}
                          onClick={() => alternar(quiz.id)}
                          className={ESTILO_VER}
                        >
                          {aberto ? "Ver −" : "Ver +"}
                        </button>
                      </td>
                    </tr>
                    {aberto && (
                      <tr className="border-b border-gray-700">
                        <td colSpan={4} className="pr-4 pb-6">
                          <div className="flex flex-col gap-3 pt-1">
                            <p className="text-sm leading-relaxed text-gray-300">
                              {quiz.descricao}
                            </p>
                            <Link to={`/quiz/${quiz.id}`} className={ESTILO_LINK}>
                              Ver no site
                            </Link>
                            <ValidacaoQuiz
                              quiz={quiz}
                              usuario={usuario}
                              aoAlterarStatus={retirarDaFila}
                            />
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </EstadoRequisicao>
    </section>
  );
}

export default FilaDeQuizzes;
