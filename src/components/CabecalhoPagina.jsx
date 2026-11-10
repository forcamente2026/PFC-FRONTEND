import IconeDaPagina from "./IconeDaPagina";

function CabecalhoPagina({ titulo, subtitulo, icone, children }) {
  return (
    <header className="mx-auto mb-8 w-full max-w-6xl">
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 py-4">
        <div className="flex items-center gap-4">
          {icone && <IconeDaPagina icone={icone} />}
          <div className="max-w-2xl">
            <h1 className="font-bold text-3xl uppercase text-white md:text-4xl">{titulo}</h1>
            {subtitulo && <p className="font-bold text-red-200">{subtitulo}</p>}
          </div>
        </div>
        {children}
      </div>
      <div className="h-px w-full bg-gray-500"></div>
    </header>
  );
}

export default CabecalhoPagina;
