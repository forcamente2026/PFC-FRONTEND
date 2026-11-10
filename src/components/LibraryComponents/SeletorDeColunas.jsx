const ESTILO_BOTAO =
  "h-8 w-8 rounded-md border text-sm font-semibold cursor-pointer hover:bg-red-500 hover:text-white";

function SeletorDeColunas({ colunas, aoEscolher, opcoes }) {
  return (
    <div className="mx-auto mb-2 flex w-full max-w-[88rem] items-center justify-end gap-2 px-10">
      <span className="text-sm text-gray-300">Cards por linha</span>

      {opcoes.map((valor) => {
        const ativo = valor === colunas;

        return (
          <button
            key={valor}
            type="button"
            aria-pressed={ativo}
            onClick={() => aoEscolher(valor)}
            className={`${ESTILO_BOTAO} ${
              ativo
                ? "border-red-500 bg-red-500 text-white"
                : "border-gray-700 text-red-200"
            }`}
          >
            {valor}
          </button>
        );
      })}
    </div>
  );
}

export default SeletorDeColunas;
