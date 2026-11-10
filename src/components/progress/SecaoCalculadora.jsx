function SecaoCalculadora({ numero, titulo, conceito, resultado, comoCalculamos, children }) {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-10 lp:py-16">
      <div className="flex flex-col gap-8 lp:flex-row lp:gap-12">
        <div className="flex flex-col gap-4 lp:w-2/5">
          <span className="text-xs tracking-widest text-gray-300">
            {numero}. CALCULADORA
          </span>
          <h2 className="font-montserrat text-2xl text-white lp:text-3xl">
            {titulo}
          </h2>
          <p className="text-gray-300 wrap-break-word">{conceito}</p>
          {resultado}
          {comoCalculamos}
        </div>

        <div className="lp:w-3/5">{children}</div>
      </div>

      <div className="w-full h-px bg-gray-500 mt-10 lp:mt-16"></div>
    </section>
  );
}

export default SecaoCalculadora;
