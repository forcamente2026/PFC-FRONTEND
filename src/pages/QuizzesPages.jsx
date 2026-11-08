import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import CabecalhoSecao from "../components/ComponentesHome/CabecalhoSecao";
import EstadoRequisicao from "../components/progress/EstadoRequisicao";
import FiltroQuizzes from "../components/QuizComponents/FiltroQuizzes";
import CardQuiz from "../components/QuizComponents/CardQuiz";
import LimiteDeCriacao from "../components/LimiteDeCriacao";
import FiltroParaAprovar from "../components/FiltroParaAprovar";
import { listarCategorias } from "../services/artigoService";
import { listarNiveisDoQuiz, listarQuizzes } from "../services/quizService";
import { podeEditar } from "../utils/papeis";
import { limiteDeCriacao } from "../utils/limiteCriacao";

function QuizzesPages() {
  const { usuario } = useOutletContext();
  const podeCriar = podeEditar(usuario);
  const [quizzes, setQuizzes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [niveis, setNiveis] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
  const [nivelSelecionado, setNivelSelecionado] = useState("");
  const [busca, setBusca] = useState("");
  const [soParaAprovar, setSoParaAprovar] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const { bloqueado } = limiteDeCriacao(quizzes, usuario);

  useEffect(() => {
    let ativo = true;

    Promise.all([listarQuizzes(), listarCategorias(), listarNiveisDoQuiz()])
      .then(([lista, listaCategorias, listaNiveis]) => {
        if (!ativo) return;
        setQuizzes(lista);
        setCategorias(listaCategorias);
        setNiveis(listaNiveis);
      })
      .catch((err) => {
        if (!ativo) return;
        setErro(err.mensagem || "Não foi possível carregar os quizzes.");
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [usuario]);

  const buscaNormalizada = busca.trim().toLowerCase();
  const quizzesVisiveis = quizzes.filter((quiz) => {
    const daCategoria =
      !categoriaSelecionada || quiz.categoria.codigo === categoriaSelecionada;
    const doNivel = !nivelSelecionado || quiz.nivel.codigo === nivelSelecionado;
    const doTitulo =
      !buscaNormalizada || quiz.titulo.toLowerCase().includes(buscaNormalizada);
    const paraAprovar = !soParaAprovar || quiz.podeAprovar;
    return daCategoria && doNivel && doTitulo && paraAprovar;
  });

  const aguardandoMinhaAprovacao = quizzes.filter((quiz) => quiz.podeAprovar).length;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-10 lp:py-16">
      <CabecalhoSecao
        rotulo="Quiz para estudo"
        titulo="Teste o que você aprendeu"
        descricao="Perguntas escritas pelos professores, com a leitura sugerida nos artigos do acervo."
      />

      {podeCriar && (
        <>
          {!carregando && !erro && (
            <LimiteDeCriacao itens={quizzes} usuario={usuario} tipo="quizzes" />
          )}
          <div className="mb-6 flex justify-end">
            {carregando || erro || bloqueado ? (
              <button
                type="button"
                disabled
                className="bg-red-500 rounded-md py-2 px-4 font-bold text-white opacity-50 cursor-not-allowed"
              >
                Novo quiz
              </button>
            ) : (
              <Link
                to="/quiz/novo"
                className="bg-red-500 rounded-md py-2 px-4 font-bold text-white hover:bg-red-900"
              >
                Novo quiz
              </Link>
            )}
          </div>
        </>
      )}

      {usuario?.papel === "PROFESSOR" && (
        <FiltroParaAprovar
          ativo={soParaAprovar}
          aoAlternar={setSoParaAprovar}
          quantidade={aguardandoMinhaAprovacao}
        />
      )}

      <FiltroQuizzes
        busca={busca}
        aoBuscar={setBusca}
        categorias={categorias}
        categoriaSelecionada={categoriaSelecionada}
        aoSelecionarCategoria={setCategoriaSelecionada}
        niveis={niveis}
        nivelSelecionado={nivelSelecionado}
        aoSelecionarNivel={setNivelSelecionado}
      />

      <EstadoRequisicao
        carregando={carregando}
        mensagemCarregando="Carregando quizzes..."
        erro={erro}
        vazio={quizzesVisiveis.length === 0}
        mensagemVazio={
          soParaAprovar
            ? "Nenhum quiz esperando a sua aprovação."
            : "Nenhum quiz encontrado."
        }
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {quizzesVisiveis.map((quiz) => (
            <CardQuiz key={quiz.id} quiz={quiz} />
          ))}
        </div>
      </EstadoRequisicao>
    </div>
  );
}

export default QuizzesPages;
