import PainelDeFiltros from "../PainelDeFiltros";

const GRUPOS = [
  { codigo: "PEITO", rotulo: "Peito" },
  { codigo: "COSTAS", rotulo: "Costas" },
  { codigo: "OMBRO", rotulo: "Ombro" },
  { codigo: "BICEPS", rotulo: "Biceps" },
  { codigo: "TRICEPS", rotulo: "Triceps" },
  { codigo: "PERNA", rotulo: "Perna" },
  { codigo: "GLUTEO", rotulo: "Gluteo" },
  { codigo: "ABDOMEN", rotulo: "Abdomen" },
];

const ESTILO_BASE = "border p-2 rounded-md cursor-pointer";
const ESTILO_ATIVO = "border-red-500 bg-red-500 text-white";
const ESTILO_INATIVO =
  "border-gray-500 text-red-200 hover:bg-red-500 hover:text-white";

function FilterLibrary({ grupoSelecionado, aoSelecionar }) {
  const selecionado = GRUPOS.find((grupo) => grupo.codigo === grupoSelecionado);

  function classes(codigo) {
    return `${ESTILO_BASE} ${
      grupoSelecionado === codigo ? ESTILO_ATIVO : ESTILO_INATIVO
    }`;
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 mb-15">
      <PainelDeFiltros
        id="grupos-musculares"
        rotulo="Grupos musculares"
        resumo={selecionado?.rotulo ?? "Todos"}
      >
        {({ fechar }) => {
          function escolher(codigo) {
            aoSelecionar(codigo);
            fechar();
          }

          return (
            <div className="flex flex-wrap items-center justify-center gap-4">
              <h2 className="hidden font-medium text-2xl text-red-200 xl:block">
                Grupos Musculares:
              </h2>

              <button type="button" onClick={() => escolher("")} className={classes("")}>
                TODOS
              </button>

              {GRUPOS.map((grupo) => (
                <button
                  key={grupo.codigo}
                  type="button"
                  onClick={() => escolher(grupo.codigo)}
                  className={classes(grupo.codigo)}
                >
                  {grupo.rotulo}
                </button>
              ))}
            </div>
          );
        }}
      </PainelDeFiltros>
    </div>
  );
}

export default FilterLibrary;
