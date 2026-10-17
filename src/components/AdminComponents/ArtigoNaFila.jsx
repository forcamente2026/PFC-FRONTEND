import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import ValidacaoArtigo from "../ArticlesComponents/ValidacaoArtigo";
import { formatarDataCurta } from "../../utils/formatar";

const ESTILO_LINK =
  "inline-flex items-center gap-2 rounded-md border border-gray-600 px-3 py-1 text-xs text-red-200 hover:bg-white/10";

function ArtigoNaFila({ artigo, usuario, aoAlterarStatus }) {
  return (
    <article className="flex flex-col gap-3 border-b border-gray-700 pb-6">
      <div>
        <h5 className="text-lg font-bold text-white">{artigo.titulo}</h5>
        <p className="mt-1 text-xs text-gray-400">
          por {artigo.autorNome} · enviado em {formatarDataCurta(artigo.criadoEm)}
        </p>
      </div>

      <p className="line-clamp-3 text-sm text-gray-300">{artigo.resumo}</p>

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
    </article>
  );
}

export default ArtigoNaFila;