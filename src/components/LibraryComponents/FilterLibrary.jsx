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

function FilterLibrary({ grupoSelecionado, aoSelecionar }) {
  const estiloBase = "border p-2 rounded-md cursor-pointer";
  const estiloAtivo = "border-red-500 bg-red-500 text-white";
  const estiloInativo =
    "border-gray-500 text-red-200 hover:bg-red-500 hover:text-white";

  function classes(codigo) {
    return `${estiloBase} ${grupoSelecionado === codigo ? estiloAtivo : estiloInativo}`;
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-center gap-4 mb-15">
      <h2 className="font-medium text-2xl text-red-200">Grupos Musculares:</h2>

      <button
        type="button"
        onClick={() => aoSelecionar("")}
        className={classes("")}
      >
        TODOS
      </button>

      {GRUPOS.map((grupo) => (
        <button
          key={grupo.codigo}
          type="button"
          onClick={() => aoSelecionar(grupo.codigo)}
          className={classes(grupo.codigo)}
        >
          {grupo.rotulo}
        </button>
      ))}
    </div>
  );
}

export default FilterLibrary;
