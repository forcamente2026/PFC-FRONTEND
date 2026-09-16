import Cartao from "./Cartao";

function CardArtigo({ artigo }) {
  const { categoria, titulo, resumo, tipoEstudo, ano, minutosLeitura } = artigo;

  return (
    <Cartao className="flex flex-col">
      <span className="self-start rounded-full border border-red-500 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-red-400">
        {categoria}
      </span>

      <h3 className="mt-4 font-montserrat text-lg text-white">{titulo}</h3>
      <p className="mt-2 text-sm text-gray-400">{resumo}</p>

      <div className="mt-auto pt-4">
        <div className="h-px bg-gray-700"></div>
        <div className="mt-4 flex justify-between text-xs uppercase tracking-[0.2em] text-gray-400">
          <span>
            {tipoEstudo} · {ano}
          </span>
          <span>{minutosLeitura} min</span>
        </div>
      </div>
    </Cartao>
  );
}

export default CardArtigo;
