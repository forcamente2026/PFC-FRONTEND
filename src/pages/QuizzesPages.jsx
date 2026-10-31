import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import CabecalhoSecao from "../components/ComponentesHome/CabecalhoSecao";
import EstadoRequisicao from "../components/progress/EstadoRequisicao";
import FiltroQuizzes from "../components/QuizComponents/FiltroQuizzes";
import CardQuiz from "../components/QuizComponents/CardQuiz";
import useAvisoDaNavegacao from "../hooks/useAvisoDaNavegacao";
import { listarCategorias } from "../services/artigoService";
import { listarNiveisDoQuiz, listarQuizzes } from "../services/quizService";
import { podeEditar } from "../utils/papeis";

function QuizzesPages() {
  const { usuario } = useOutletContext();
  const aviso = useAvisoDaNavegacao();
  const podeCriar = podeEditar(usuario);
  const [quizzes, setQuizzes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [niveis, setNiveis] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
  const [nivelSelecionado, setNivelSelecionado] = useState("");
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let ativo = true;

    Promise.all([listarQuizzes(usuario), listarCategorias(), listarNiveisDoQuiz()])
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
    return daCategoria && doNivel && doTitulo;
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-10 lp:py-16">
      <CabecalhoSecao
        rotulo="Quiz para estudo"
        titulo="Teste o que você aprendeu"
        descricao="Perguntas escritas pelos professores, com a leitura sugerida nos artigos do acervo."
      />

      {aviso && (
        <p role="status" className="mb-6 text-sm text-green-400">
          {aviso}
        </p>
      )}

      {podeCriar && (
        <div className="mb-6 flex justify-end">
          <Link
            to="/quiz/novo"
            className="bg-red-500 rounded-md py-2 px-4 font-bold text-white hover:bg-red-900"
          >
            Novo quiz
          </Link>
        </div>
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
        mensagemVazio="Nenhum quiz encontrado."
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
