import { Link } from "react-router-dom";
import Cartao from "../ComponentesHome/Cartao";
import { STATUS_ARTIGO } from "./artigoCampos";

function CardArtigo({ artigo }) {
  const { id, categoria, titulo, resumo, tipoEstudo, ano, minutosLeitura, status } = artigo;
  const etiquetaStatus = STATUS_ARTIGO[status]?.etiqueta;

  return (
   <Link to={`/articles/${id}`} className="block h-full">
    <Cartao className="flex h-full flex-col transition-colors hover:border-red-500">
      <div className="flex items-start justify-between gap-2">
        <span className="rounded-full border border-red-500 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-red-400">
        {categoria.descricao}
      </span>
        {etiquetaStatus && (
          <span className="rounded-md bg-gray-700 px-2 py-1 text-xs font-medium text-gray-200">
            {etiquetaStatus}
          </span>
        )}
      </div>

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
  </Link>
);
}

export default CardArtigo;
