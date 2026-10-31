import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
import CabecalhoSecao from "../components/ComponentesHome/CabecalhoSecao";
import Cartao from "../components/ComponentesHome/Cartao";
import EstadoRequisicao from "../components/progress/EstadoRequisicao";
import QuizForm from "../components/QuizComponents/QuizForm";
import { novoQuiz, SITUACOES_PUBLICADAS } from "../components/QuizComponents/quizCampos";
import { listarArtigos, listarCategorias } from "../services/artigoService";
import {
  buscarQuizParaEdicao,
  criarQuiz,
  editarQuiz,
  listarNiveisDoQuiz,
} from "../services/quizService";
import { podeValidar } from "../utils/papeis";

function valoresDoQuiz(quiz, idsPublicados) {
  return {
    titulo: quiz.titulo,
    descricao: quiz.descricao,
    categoria: quiz.categoria,
    nivel: quiz.nivel,
    artigos: quiz.artigos.filter((artigoId) => idsPublicados.has(artigoId)),
    questoes: quiz.questoes.map((questao) => ({
      enunciado: questao.enunciado,
      explicacao: questao.explicacao ?? "",
      alternativas: questao.alternativas.map((alternativa) => ({
        texto: alternativa.texto,
        correta: alternativa.correta,
      })),
    })),
  };
}

function avisoAoSalvar(quiz, editando) {
  if (quiz.status === "PENDENTE") {
    return editando
      ? "Quiz atualizado! Ele aparece no site depois de aprovado."
      : "Quiz enviado! Ele aparece no site depois de aprovado.";
  }
  return editando ? "Quiz atualizado!" : "Quiz publicado!";
}

function QuizFormPages() {
  const { id } = useParams();
  const editando = Boolean(id);
  const { usuario } = useOutletContext();
  const navigate = useNavigate();
  const [opcoes, setOpcoes] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erroAoCarregar, setErroAoCarregar] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);
  const [camposComErro, setCamposComErro] = useState([]);

  useEffect(() => {
    let ativo = true;

    Promise.all([
      listarCategorias(),
      listarNiveisDoQuiz(),
      listarArtigos(usuario),
      editando ? buscarQuizParaEdicao(id, usuario) : novoQuiz(),
    ])
      .then(([categorias, niveis, artigos, quiz]) => {
        if (!ativo) return;
        const publicados = artigos.filter((artigo) =>
          SITUACOES_PUBLICADAS.includes(artigo.status),
        );
        const idsPublicados = new Set(publicados.map((artigo) => artigo.id));
        setOpcoes({
          categorias,
          niveis,
          artigos: publicados,
          valoresIniciais: valoresDoQuiz(quiz, idsPublicados),
        });
        setErroAoCarregar(null);
      })
      .catch((err) => {
        if (!ativo) return;
        setOpcoes(null);
        setErroAoCarregar(err.mensagem || "Não foi possível carregar o formulário.");
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [id, editando, usuario]);

  async function salvar(dados) {
    setEnviando(true);
    setErro(null);
    setCamposComErro([]);

    try {
      const corpo = { ...dados, categoria: dados.categoria || null, nivel: dados.nivel || null };
      const salvo = editando
        ? await editarQuiz(id, corpo, usuario)
        : await criarQuiz(corpo, usuario);
      navigate(`/quiz/${salvo.id}`, { state: { aviso: avisoAoSalvar(salvo, editando) } });
    } catch (err) {
      setErro(err.mensagem || "Não foi possível salvar o quiz.");
      setCamposComErro(err.campos ?? []);
    } finally {
      setEnviando(false);
    }
  }

  const destinoAoCancelar = editando ? `/quiz/${id}` : "/quiz";
  const voltaParaModeracao = editando && !podeValidar(usuario);
  const textoBotao = voltaParaModeracao
    ? "Salvar e enviar para aprovação"
    : editando
      ? "Salvar alterações"
      : "Enviar quiz";

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-10 lp:py-16">
      <Link
        to={destinoAoCancelar}
        className="text-sm text-red-200 hover:text-white hover:underline"
      >
        {editando ? "← Voltar para o quiz" : "← Voltar para os quizzes"}
      </Link>

      <div className="mt-6">
        <CabecalhoSecao
          rotulo="Quiz para estudo"
          titulo={editando ? "Editar quiz" : "Novo quiz"}
          descricao="O quiz de um professor passa pela moderação antes de aparecer no site, como os artigos."
        />

        <EstadoRequisicao
          carregando={carregando}
          mensagemCarregando="Carregando o formulário..."
          erro={erroAoCarregar}
          vazio={!opcoes}
          mensagemVazio="Quiz não encontrado."
        >
          {opcoes && (
            <>
              {voltaParaModeracao && (
                <p
                  role="note"
                  className="mb-6 rounded-xl border border-yellow-500 bg-yellow-500/10 p-4 text-sm text-yellow-100"
                >
                  Ao salvar, o quiz volta para pendente e precisa ser aprovado de novo. Se ele já
                  estava no site, sai até a nova aprovação, e as aprovações que ele tinha são
                  apagadas.
                </p>
              )}
              <Cartao>
                <QuizForm
                  valoresIniciais={opcoes.valoresIniciais}
                  categorias={opcoes.categorias}
                  niveis={opcoes.niveis}
                  artigos={opcoes.artigos}
                  enviando={enviando}
                  erro={erro}
                  camposComErro={camposComErro}
                  textoBotao={textoBotao}
                  textoBotaoEnviando={editando ? "Salvando..." : "Enviando..."}
                  destinoAoCancelar={destinoAoCancelar}
                  aoEnviar={salvar}
                />
              </Cartao>
            </>
          )}
        </EstadoRequisicao>
      </div>
    </div>
  );
}

export default QuizFormPages;
