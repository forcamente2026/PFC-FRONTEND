function DicaDoGrafico({ active, payload, sufixo = "" }) {
  if (!active || !payload?.length) return null;

  const { rotulo, valor, detalhe } = payload[0].payload;

  return (
    <div className="max-w-56 rounded-md border border-gray-700 bg-slate-950 px-3 py-2 shadow-lg shadow-black/40">
      <p className="text-base font-bold text-white">
        {valor}
        {sufixo}
      </p>
      <p className="text-xs text-gray-300">{rotulo}</p>
      {detalhe && <p className="text-xs text-gray-400">{detalhe}</p>}
    </div>
  );
}

export default DicaDoGrafico;
