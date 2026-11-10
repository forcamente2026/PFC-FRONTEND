import ConteudoExercicio from "./ConteudoExercicio";

function DetalheExercicio({ exercicio, rotuloGrupo, rotuloNivel, aoFechar, children }) {
  return (
    <div className="space-y-4 py-2 md:p-4">
      <h2 className="px-6 text-center font-montserrat text-2xl text-red-200 wrap-anywhere">
        {exercicio.nome}
      </h2>
      <div className="h-px w-full bg-gray-300"></div>

      <ConteudoExercicio
        exercicio={exercicio}
        rotuloGrupo={rotuloGrupo}
        rotuloNivel={rotuloNivel}
      />

      {children}

      <button
        type="button"
        onClick={aoFechar}
        className="w-full rounded-md bg-red-500 py-2 font-medium text-white hover:bg-red-900 cursor-pointer"
      >
        Fechar
      </button>
    </div>
  );
}

export default DetalheExercicio;
