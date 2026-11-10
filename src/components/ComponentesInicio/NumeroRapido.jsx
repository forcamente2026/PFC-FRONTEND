function NumeroRapido({ rotulo, valor, detalhe }) {
  return (
    <div className="rounded-xl border border-gray-700 bg-white/5 p-5 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-200">{rotulo}</p>
      <p className="mt-2 font-montserrat text-4xl text-white">{valor}</p>
      {detalhe && <p className="mt-1 text-xs text-gray-400">{detalhe}</p>}
    </div>
  );
}

export default NumeroRapido;
