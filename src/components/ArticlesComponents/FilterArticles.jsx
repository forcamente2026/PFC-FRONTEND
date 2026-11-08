import PainelDeFiltros from "../PainelDeFiltros";
import { LIMITE_BUSCA } from "../../utils/limites";

const ESTILO_BASE = "border p-2 rounded-md cursor-pointer";
const ESTILO_ATIVO = "border-red-500 bg-red-500 text-white";
const ESTILO_INATIVO =
  "border-gray-500 text-red-200 hover:bg-red-500 hover:text-white";

function FilterArticles({
  categorias,
  categoriaSelecionada,
  aoSelecionar,
  busca,
  aoBuscar,
}) {
  const selecionada = categorias.find(
    (categoria) => categoria.codigo === categoriaSelecionada,
  );

  function classes(codigo) {
    return `${ESTILO_BASE} ${
      categoriaSelecionada === codigo ? ESTILO_ATIVO : ESTILO_INATIVO
    }`;
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 mb-10 flex flex-col gap-4">
      <input
        type="search"
        maxLength={LIMITE_BUSCA}
        value={busca}
        onChange={(evento) => aoBuscar(evento.target.value)}
        placeholder="Buscar por titulo"
        aria-label="Buscar por artigo por titulo"
        className="w-full rounded-xl border border-gray-600 p-2 text-white neon-suave-red-500 focus:border-red-500 focus:neon-red-500 focus:outline-none"
      />

      <PainelDeFiltros
        id="categorias-dos-artigos"
        rotulo="Categorias"
        resumo={selecionada?.descricao ?? "Todas"}
      >
        {({ fechar }) => {
          function escolher(codigo) {
            aoSelecionar(codigo);
            fechar();
          }

          return (
            <div className="flex flex-wrap items-center justify-center gap-4">
              <h2 className="hidden font-medium text-2xl text-red-200 xl:block">
                Categorias:
              </h2>

              <button type="button" onClick={() => escolher("")} className={classes("")}>
                TODOS
              </button>

              {categorias.map((categoria) => (
                <button
                  key={categoria.codigo}
                  type="button"
                  onClick={() => escolher(categoria.codigo)}
                  className={classes(categoria.codigo)}
                >
                  {categoria.descricao}
                </button>
              ))}
            </div>
          );
        }}
      </PainelDeFiltros>
    </div>
  );
}

export default FilterArticles;
