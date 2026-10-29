import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, X } from "lucide-react";
import ListaDeErros from "./ListaDeErros";
import {
  LIMITE_ALTERNATIVA,
  LIMITE_DESCRICAO,
  LIMITE_ENUNCIADO,
  LIMITE_EXPLICACAO,
  LIMITE_TITULO,
  MAXIMO_ALTERNATIVAS,
  MAXIMO_ARTIGOS,
  MAXIMO_QUESTOES,
  MINIMO_ALTERNATIVAS,
  MINIMO_QUESTOES,
  novaAlternativa,
  novaQuestao,
} from "./quizCampos";

const ESTILO_CAMPO = "bg-gray-500 rounded-xl p-2 text-white";
const ESTILO_SELECT =
  "bg-gray-400 text-gray-300 rounded-xl p-2 self-start disabled:opacity-60 disabled:cursor-not-allowed";
const ESTILO_ROTULO = "text-red-200";
const ESTILO_CONTADOR = "self-end text-xs text-gray-400";
const ESTILO_TITULO_SECAO = "text-sm font-semibold uppercase tracking-[0.25em] text-red-200";
const ESTILO_ADICIONAR =
  "inline-flex items-center gap-2 self-start rounded-md border border-gray-600 px-3 py-1 text-sm text-red-200 hover:bg-white/10 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";
const ESTILO_REMOVER =
  "rounded-md p-2 text-gray-400 hover:bg-white/10 hover:text-red-400 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed";
const ESTILO_LIMITE = "text-xs text-gray-400";

function textoDoLimite(quantidade, maximo, nome) {
  if (quantidade >= maximo) return `limite de ${maximo} ${nome}`;
  return `${quantidade} de ${maximo} ${nome}`;
}

function QuizForm({
  valoresIniciais,
  categorias,
  niveis,
  artigos,
  enviando,
  erro,
  camposComErro,
  textoBotao,
  textoBotaoEnviando,
  destinoAoCancelar,
  aoEnviar,
}) {
  const idBase = useId();
  const campoId = (campo) => `${idBase}-${campo}`;
  const [quiz, setQuiz] = useState(valoresIniciais);

  const limiteDeArtigos = quiz.artigos.length >= MAXIMO_ARTIGOS;

  function alterarCampo(evento) {
    const { name, value } = evento.target;
    setQuiz((atual) => ({ ...atual, [name]: value }));
  }

  function mudarQuestao(indice, transformar) {
    setQuiz((atual) => ({
      ...atual,
      questoes: atual.questoes.map((questao, posicao) =>
        posicao === indice ? transformar(questao) : questao,
      ),
    }));
  }

  function adicionarQuestao() {
    setQuiz((atual) => ({ ...atual, questoes: [...atual.questoes, novaQuestao()] }));
  }

  function removerQuestao(indice) {
    setQuiz((atual) => ({
      ...atual,
      questoes: atual.questoes.filter((_, posicao) => posicao !== indice),
    }));
  }

  function alterarTextoDaQuestao(indice, campo, valor) {
    mudarQuestao(indice, (questao) => ({ ...questao, [campo]: valor }));
  }

  function alterarAlternativa(indice, posicaoAlternativa, texto) {
    mudarQuestao(indice, (questao) => ({
      ...questao,
      alternativas: questao.alternativas.map((alternativa, posicao) =>
        posicao === posicaoAlternativa ? { ...alternativa, texto } : alternativa,
      ),
    }));
  }

  function marcarCorreta(indice, posicaoAlternativa) {
    mudarQuestao(indice, (questao) => ({
      ...questao,
      alternativas: questao.alternativas.map((alternativa, posicao) => ({
        ...alternativa,
        correta: posicao === posicaoAlternativa,
      })),
    }));
  }

  function adicionarAlternativa(indice) {
    mudarQuestao(indice, (questao) => ({
      ...questao,
      alternativas: [...questao.alternativas, novaAlternativa()],
    }));
  }

  function removerAlternativa(indice, posicaoAlternativa) {
    mudarQuestao(indice, (questao) => ({
      ...questao,
      alternativas: questao.alternativas.filter((_, posicao) => posicao !== posicaoAlternativa),
    }));
  }

  function alternarArtigo(artigoId) {
    setQuiz((atual) => ({
      ...atual,
      artigos: atual.artigos.includes(artigoId)
        ? atual.artigos.filter((escolhido) => escolhido !== artigoId)
        : [...atual.artigos, artigoId],
    }));
  }

  function enviar(evento) {
    evento.preventDefault();
    aoEnviar(quiz);
  }

  return (
    <form onSubmit={enviar} className="flex flex-col gap-10">
      <section className="flex flex-col gap-2">
        <h2 className={ESTILO_TITULO_SECAO}>Dados do quiz</h2>

        <label htmlFor={campoId("titulo")} className={ESTILO_ROTULO}>
          Título
        </label>
        <input
          type="text"
          id={campoId("titulo")}
          name="titulo"
          value={quiz.titulo}
          onChange={alterarCampo}
          maxLength={LIMITE_TITULO}
          placeholder="Ex: Princípios da hipertrofia"
          className={ESTILO_CAMPO}
        />
        <span className={ESTILO_CONTADOR}>
          {quiz.titulo.length}/{LIMITE_TITULO}
        </span>

        <label htmlFor={campoId("descricao")} className={ESTILO_ROTULO}>
          Descrição
        </label>
        <textarea
          id={campoId("descricao")}
          name="descricao"
          value={quiz.descricao}
          onChange={alterarCampo}
          rows={3}
          maxLength={LIMITE_DESCRICAO}
          placeholder="O que o quiz cobre, em poucas linhas"
          className={ESTILO_CAMPO}
        />
        <span className={ESTILO_CONTADOR}>
          {quiz.descricao.length}/{LIMITE_DESCRICAO}
        </span>

        <div className="flex flex-wrap gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor={campoId("categoria")} className={ESTILO_ROTULO}>
              Categoria
            </label>
            <select
              id={campoId("categoria")}
              name="categoria"
              value={quiz.categoria}
              onChange={alterarCampo}
              className={ESTILO_SELECT}
            >
              <option value="">Selecione</option>
              {categorias.map((categoria) => (
                <option key={categoria.codigo} value={categoria.codigo}>
                  {categoria.descricao}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor={campoId("nivel")} className={ESTILO_ROTULO}>
              Nível
            </label>
            <select
              id={campoId("nivel")}
              name="nivel"
              value={quiz.nivel}
              onChange={alterarCampo}
              className={ESTILO_SELECT}
            >
              <option value="">Selecione</option>
              {niveis.map((nivel) => (
                <option key={nivel.codigo} value={nivel.codigo}>
                  {nivel.descricao}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className={ESTILO_TITULO_SECAO}>Perguntas</h2>
          <span className={ESTILO_LIMITE}>
            mínimo de {MINIMO_QUESTOES}, máximo de {MAXIMO_QUESTOES}
          </span>
        </div>

        {quiz.questoes.map((questao, indice) => {
          const numero = indice + 1;

          return (
            <div
              key={indice}
              role="group"
              aria-labelledby={campoId(`questao-${indice}`)}
              className="flex flex-col gap-2 rounded-xl border border-gray-700 p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 id={campoId(`questao-${indice}`)} className="font-semibold text-white">
                  Pergunta {numero}
                </h3>
                <button
                  type="button"
                  onClick={() => removerQuestao(indice)}
                  disabled={quiz.questoes.length <= MINIMO_QUESTOES}
                  aria-label={`Remover a pergunta ${numero}`}
                  className={ESTILO_REMOVER}
                >
                  <Trash2 size={18} aria-hidden="true" />
                </button>
              </div>

              <label htmlFor={campoId(`enunciado-${indice}`)} className={ESTILO_ROTULO}>
                Enunciado
              </label>
              <textarea
                id={campoId(`enunciado-${indice}`)}
                value={questao.enunciado}
                onChange={(evento) =>
                  alterarTextoDaQuestao(indice, "enunciado", evento.target.value)
                }
                rows={2}
                maxLength={LIMITE_ENUNCIADO}
                className={ESTILO_CAMPO}
              />
              <span className={ESTILO_CONTADOR}>
                {questao.enunciado.length}/{LIMITE_ENUNCIADO}
              </span>

              <p className={ESTILO_ROTULO}>
                Alternativas{" "}
                <span className="text-xs text-gray-400">(marque a correta)</span>
              </p>
              {questao.alternativas.map((alternativa, posicao) => {
                const letra = posicao + 1;

                return (
                  <div key={posicao} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={campoId(`correta-${indice}`)}
                      checked={alternativa.correta}
                      onChange={() => marcarCorreta(indice, posicao)}
                      aria-label={`Marcar a alternativa ${letra} da pergunta ${numero} como correta`}
                      className="h-4 w-4 shrink-0 cursor-pointer accent-green-500"
                    />
                    <input
                      type="text"
                      value={alternativa.texto}
                      onChange={(evento) =>
                        alterarAlternativa(indice, posicao, evento.target.value)
                      }
                      maxLength={LIMITE_ALTERNATIVA}
                      placeholder={`Alternativa ${letra}`}
                      aria-label={`Texto da alternativa ${letra} da pergunta ${numero}`}
                      className={`${ESTILO_CAMPO} min-w-0 flex-1`}
                    />
                    <span className="w-14 shrink-0 text-right text-xs text-gray-400">
                      {alternativa.texto.length}/{LIMITE_ALTERNATIVA}
                    </span>
                    <button
                      type="button"
                      onClick={() => removerAlternativa(indice, posicao)}
                      disabled={questao.alternativas.length <= MINIMO_ALTERNATIVAS}
                      aria-label={`Remover a alternativa ${letra} da pergunta ${numero}`}
                      className={ESTILO_REMOVER}
                    >
                      <X size={18} aria-hidden="true" />
                    </button>
                  </div>
                );
              })}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => adicionarAlternativa(indice)}
                  disabled={questao.alternativas.length >= MAXIMO_ALTERNATIVAS}
                  className={ESTILO_ADICIONAR}
                >
                  <Plus size={16} aria-hidden="true" />
                  Adicionar alternativa
                </button>
                <span className={ESTILO_LIMITE}>
                  {textoDoLimite(questao.alternativas.length, MAXIMO_ALTERNATIVAS, "alternativas")}
                </span>
              </div>

              <label htmlFor={campoId(`explicacao-${indice}`)} className={`${ESTILO_ROTULO} mt-2`}>
                Explicação (opcional)
              </label>
              <textarea
                id={campoId(`explicacao-${indice}`)}
                value={questao.explicacao}
                onChange={(evento) =>
                  alterarTextoDaQuestao(indice, "explicacao", evento.target.value)
                }
                rows={2}
                maxLength={LIMITE_EXPLICACAO}
                placeholder="Aparece depois da resposta, para quem errou entender"
                className={ESTILO_CAMPO}
              />
              <span className={ESTILO_CONTADOR}>
                {questao.explicacao.length}/{LIMITE_EXPLICACAO}
              </span>
            </div>
          );
        })}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={adicionarQuestao}
            disabled={quiz.questoes.length >= MAXIMO_QUESTOES}
            className={ESTILO_ADICIONAR}
          >
            <Plus size={16} aria-hidden="true" />
            Adicionar pergunta
          </button>
          <span className={ESTILO_LIMITE}>
            {textoDoLimite(quiz.questoes.length, MAXIMO_QUESTOES, "perguntas")}
          </span>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className={ESTILO_TITULO_SECAO}>Leitura sugerida (opcional)</h2>
          <span className="text-xs text-gray-400">
            {quiz.artigos.length} de {MAXIMO_ARTIGOS}
          </span>
        </div>
        <p className="text-sm text-gray-400">
          Artigos publicados que ajudam a responder. Quem faz o quiz não precisa ler antes.
        </p>

        {artigos.length === 0 ? (
          <p className="text-sm text-gray-300">Ainda não há artigos publicados.</p>
        ) : (
          <ul className="flex max-h-72 flex-col gap-1 overflow-y-auto rounded-xl border border-gray-700 p-2">
            {artigos.map((artigo) => {
              const escolhido = quiz.artigos.includes(artigo.id);

              return (
                <li key={artigo.id}>
                  <label
                    className={`flex items-start gap-3 rounded-lg p-2 text-sm text-gray-200 ${
                      !escolhido && limiteDeArtigos
                        ? "opacity-50"
                        : "cursor-pointer hover:bg-white/5"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={escolhido}
                      onChange={() => alternarArtigo(artigo.id)}
                      disabled={!escolhido && limiteDeArtigos}
                      className="mt-1 h-4 w-4 shrink-0 accent-red-500"
                    />
                    <span>
                      {artigo.titulo}
                      <span className="block text-xs text-gray-400">
                        {artigo.categoria.descricao}
                      </span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <ListaDeErros erro={erro} campos={camposComErro} />

      <div className="flex flex-wrap justify-end gap-3">
        <Link
          to={destinoAoCancelar}
          className="rounded-md border border-gray-600 px-4 py-2 text-red-200 hover:bg-white/10"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={enviando}
          className="rounded-md bg-red-500 py-2 px-4 font-bold text-white hover:bg-red-900 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {enviando ? textoBotaoEnviando : textoBotao}
        </button>
      </div>
    </form>
  );
}

export default QuizForm;
