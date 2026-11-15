import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import estilos from "./CardFuncionalidade.module.css";

function CardFuncionalidade({ para, icone: Icone, titulo, texto }) {
  return (
    <Link
      to={para}
      className={`${estilos.card} group flex flex-col items-center gap-4 rounded-xl border border-gray-700 bg-white/5 p-6 shadow-lg shadow-black/20 backdrop-blur-xl text-center motion-safe:transition-[translate,border-color,box-shadow] motion-safe:duration-[220ms] motion-safe:hover:-translate-y-[5px] motion-safe:focus-visible:-translate-y-[5px]`}
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/15 text-red-400">
        <Icone size={28} aria-hidden="true" />
      </span>
      <h3 className="font-montserrat text-xl text-white">{titulo}</h3>
      <p className="flex-1 text-sm text-gray-300">{texto}</p>
      <span className="flex items-center gap-1 text-sm font-semibold text-red-200 group-hover:text-white">
        Acessar
        <ArrowRight size={16} aria-hidden="true" />
      </span>
    </Link>
  );
}

export default CardFuncionalidade;
