import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import ValidacaoArtigo from "../ArticlesComponents/ValidacaoArtigo";

const ESTILO_LINK =
  "inline-flex items-center gap-2 rounded-md border border-gray-600 px-3 py-1 text-xs text-red-200 hover:bg-white/10";

function ArtigoNaFila({ artigo, usuario, aoAlterarStatus }) {
  return (
    <div className="flex flex-col gap-3 pt-1">
      <p className="text-sm leading-relaxed text-gray-300">{artigo.resumo}</p>

      <div className="flex flex-wrap gap-2">
        <Link to={`/articles/${artigo.id}`} className={ESTILO_LINK}>
          Ver no site
        </Link>
        <a
          href={artigo.fonte}
          target="_blank"
          rel="noopener noreferrer"
          className={ESTILO_LINK}
        >
          Abrir o original
          <ExternalLink size={14} aria-hidden="true" />
          <span className="sr-only">(abre em nova aba)</span>
        </a>
      </div>

      <ValidacaoArtigo
        artigo={artigo}
        usuario={usuario}
        aoAlterarStatus={aoAlterarStatus}
      />
    </div>
  );
}

export default ArtigoNaFila;