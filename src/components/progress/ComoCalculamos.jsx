function ComoCalculamos({ formulas, variaveis, arredondamento, seuCalculo }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-700 p-5">
      <span className="text-xs tracking-widest text-red-200">
        COMO CALCULAMOS
      </span>

      <ul className="flex flex-col gap-1">
        {formulas.map((formula) => (
          <li
            key={formula}
            className="text-sm font-semibold text-white wrap-break-word"
          >
            {formula}
          </li>
        ))}
      </ul>

      <ul className="flex flex-col gap-2 text-sm">
        {variaveis.map((variavel) => (
          <li key={variavel.simbolo} className="text-gray-300 wrap-break-word">
            <span className="font-semibold text-red-200">
              {variavel.simbolo}:
            </span>{" "}
            {variavel.descricao}
          </li>
        ))}
      </ul>

      <p className="text-xs text-gray-300">{arredondamento}</p>

      {seuCalculo ? (
        <div className="flex flex-col gap-1 border-t border-gray-700 pt-4">
          <span className="text-xs tracking-widest text-gray-300">
            SEU CÁLCULO
          </span>
          {seuCalculo.map((linha) => (
            <p key={linha} className="text-sm text-white wrap-break-word">
              {linha}
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default ComoCalculamos;