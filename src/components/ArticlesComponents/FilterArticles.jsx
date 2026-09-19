function FilterArticles({
    categorias,
    categoriaSelecionada,
    aoSelecionar,
    busca,
    aoBuscar,
}) {
    const estiloBase = "border p-2 rounded-md cursor-pointer";
    const estiloAtivo = "border-red-500 bg-red-500 text-white";
    const estiloInativo = "border-gray-500 text-red-200 hover:bg-red-500 hover:text-white";

    function classes(codigo) {
        return `${estiloBase} ${categoriaSelecionada === codigo ? estiloAtivo : estiloInativo}`;
    }

    return(
        <div className="w-full max-w-6xl mx-auto px-4 mb-10 flex flex-col gap-4">
            <input
                type="search"
                value={busca}
                onChange={(evento) => aoBuscar(evento.target.value)}
                placeholder="Buscar por titulo"
                aria-label="Buscar por artigo por titulo"
                className="w-full rounded-xl border border-gray-600 p-2 text-white neon-suave-red-500 focus:border-red-500 focus:neon-red-500 focus:outline-none"
            />

            <div className="flex flex-wrap items-center justify-center gap-4">
                <h2 className="font-medium text-2xl text-red-200">Categorias:</h2>

                <button
                    type="button"
                    onClick={() => aoSelecionar("")}
                    className={classes("")}
                >
                    TODOS
                </button>

                {categorias.map((categoria) => (
                    <button
                        key={categoria.codigo}
                        type="button"
                        onClick={() => aoSelecionar(categoria.codigo)}
                        className={classes(categoria.codigo)}
                    >
                        {categoria.descricao}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default FilterArticles;