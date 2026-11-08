import PainelDeFiltros from "../PainelDeFiltros";
import { LIMITE_BUSCA } from "../../utils/limites";

const ESTILO_BASE = "border p-2 rounded-md cursor-pointer";
const ESTILO_ATIVO = "border-red-500 bg-red-500 text-white";
const ESTILO_INATIVO = "border-gray-500 text-red-200 hover:bg-red-500 hover:text-white";

function descricaoDe(opcoes, codigo) {
  if (!codigo) return null;

  return opcoes.find((opcao) => opcao.codigo === codigo)?.descricao ?? null;
}

function GrupoDeOpcoes({ titulo, opcoes, selecionada, aoSelecionar }) {
  function classes(codigo) {
    return `${ESTILO_BASE} ${selecionada === codigo ? ESTILO_ATIVO : ESTILO_INATIVO}`;
  }

  return (
    <div role="group" aria-label={titulo} className="flex flex-wrap items-center justify-center gap-4">
      <h2 className="font-medium text-2xl text-red-200">{titulo}:</h2>

      <button
        type="button"
        aria-pressed={selecionada === ""}
        onClick={() => aoSelecionar("")}
        className={classes("")}
      >
        TODOS
      </button>

      {opcoes.map((opcao) => (
        <button
          key={opcao.codigo}
          type="button"
          aria-pressed={selecionada === opcao.codigo}
          onClick={() => aoSelecionar(opcao.codigo)}
          className={classes(opcao.codigo)}
        >
          {opcao.descricao}
        </button>
      ))}
    </div>
  );
}

function FiltroQuizzes({
  busca,
  aoBuscar,
  categorias,
  categoriaSelecionada,
  aoSelecionarCategoria,
  niveis,
  nivelSelecionado,
  aoSelecionarNivel,
}) {
  const escolhas = [
    descricaoDe(categorias, categoriaSelecionada),
    descricaoDe(niveis, nivelSelecionado),
  ].filter(Boolean);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 mb-10 flex flex-col gap-4">
      <input
        type="search"
        maxLength={LIMITE_BUSCA}
        value={busca}
        onChange={(evento) => aoBuscar(evento.target.value)}
        placeholder="Buscar por título"
        aria-label="Buscar quiz por título"
        className="w-full rounded-xl border border-gray-600 p-2 text-white neon-suave-red-500 focus:border-red-500 focus:neon-red-500 focus:outline-none"
      />

      <PainelDeFiltros
        id="filtros-dos-quizzes"
        rotulo="Categoria e nível"
        resumo={escolhas.length ? escolhas.join(" · ") : "Todos"}
      >
        <GrupoDeOpcoes
          titulo="Categorias"
          opcoes={categorias}
          selecionada={categoriaSelecionada}
          aoSelecionar={aoSelecionarCategoria}
        />
        <GrupoDeOpcoes
          titulo="Nível"
          opcoes={niveis}
          selecionada={nivelSelecionado}
          aoSelecionar={aoSelecionarNivel}
        />
      </PainelDeFiltros>
    </div>
  );
}

export default FiltroQuizzes;
