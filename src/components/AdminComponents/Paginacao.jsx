const ESTILO_BOTAO =
  "rounded-md border border-gray-600 px-4 py-2 text-red-200 hover:bg-white/10 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";

function Paginacao({ pagina, totalDePaginas, totalDeItens, aoMudarPagina }) {
  const primeira = pagina <= 0;
  const ultima = pagina >= totalDePaginas - 1;

  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
      <p className="text-sm text-gray-400">
        {totalDeItens} registro{totalDeItens === 1 ? "" : "s"} · página{" "}
        {pagina + 1} de {totalDePaginas}
      </p>

      <div className="flex gap-3">
        <button
          type="button"
          disabled={primeira}
          onClick={() => aoMudarPagina(pagina - 1)}
          className={ESTILO_BOTAO}
        >
          Anterior
        </button>
        <button
          type="button"
          disabled={ultima}
          onClick={() => aoMudarPagina(pagina + 1)}
          className={ESTILO_BOTAO}
        >
          Próxima
        </button>
      </div>
    </div>
  );
}

export default Paginacao;
