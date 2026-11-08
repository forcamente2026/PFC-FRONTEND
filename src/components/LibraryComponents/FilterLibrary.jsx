import { useState } from "react";
import { Menu, X } from "lucide-react";

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

function rotuloDoGrupo(codigo) {
  if (!codigo) return "Todos";

  return GRUPOS.find((grupo) => grupo.codigo === codigo)?.rotulo ?? "Todos";
}

function FilterLibrary({ grupoSelecionado, aoSelecionar }) {
  const [aberto, setAberto] = useState(false);

  const estiloBase = "border p-2 rounded-md cursor-pointer";
  const estiloAtivo = "border-red-500 bg-red-500 text-white";
  const estiloInativo =
    "border-gray-500 text-red-200 hover:bg-red-500 hover:text-white";

  function classes(codigo) {
    return `${estiloBase} ${grupoSelecionado === codigo ? estiloAtivo : estiloInativo}`;
  }

  function escolher(codigo) {
    aoSelecionar(codigo);
    setAberto(false);
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 mb-15">
      <button
        type="button"
        aria-expanded={aberto}
        aria-controls="grupos-musculares"
        onClick={() => setAberto((atual) => !atual)}
        className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-md border border-gray-500 p-3 text-red-200 hover:bg-red-500 hover:text-white xl:hidden"
      >
        <span className="flex items-center gap-2 font-medium">
          {aberto ? <X size={20} /> : <Menu size={20} />}
          Grupos musculares
        </span>
        <span className="text-sm">{rotuloDoGrupo(grupoSelecionado)}</span>
      </button>

      <div
        id="grupos-musculares"
        className={`${aberto ? "flex" : "hidden"} mt-3 flex-wrap items-center justify-center gap-4 xl:mt-0 xl:flex`}
      >
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
    </div>
  );
}

export default FilterLibrary;
