import { formatarNumero } from "../../utils/formatar";

function CardResultado({ rotulo, valor, unidade, rodape, variante, tamanho }) {
  const corValor = variante === "neutro" ? "text-white" : "text-red-200";
  const tamanhoValor =
    tamanho === "medio" ? "text-3xl lp:text-4xl" : "text-5xl lp:text-6xl";

  return (
    <div className="flex flex-1 min-w-0 flex-col gap-2 p-7 border bg-white/5 backdrop-blur-xl border-gray-700 rounded-xl shadow-lg shadow-black/20">
      <span className="text-xs tracking-widest text-gray-300">{rotulo}</span>

      <div className="flex items-end gap-2">
        <span
          className={`font-montserrat ${tamanhoValor} ${corValor} break-all`}
        >
          {formatarNumero(valor)}
        </span>
        <span className="text-white text-sm pb-1 shrink-0">{unidade}</span>
      </div>

      {rodape ? (
        <>
          <div className="w-full h-px bg-gray-500"></div>
          <div className="text-gray-300 text-sm">{rodape}</div>
        </>
      ) : null}
    </div>
  );
}

export default CardResultado;
