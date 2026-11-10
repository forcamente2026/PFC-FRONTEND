function BarraComposicao({ titulo, total, segmentos }) {
  if (!total || !segmentos || !segmentos.length) return null;

  return (
    <div className="flex flex-col gap-3">
      <span className="text-xs tracking-widest text-gray-300">{titulo}</span>

      <div className="flex h-2 w-full overflow-hidden rounded-full bg-gray-700">
        {segmentos.map((segmento) => (
          <div
            key={segmento.rotulo}
            className={segmento.cor}
            style={{ width: `${(segmento.valor / total) * 100}%` }}
          ></div>
        ))}
      </div>

      <ul className="flex flex-col">
        {segmentos.map((segmento) => (
          <li
            key={segmento.rotulo}
            className="flex items-center justify-between gap-4 border-b border-gray-700 py-2 text-sm"
          >
            <span className="flex items-center gap-2 text-gray-300">
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${segmento.cor}`}
              ></span>
              {segmento.rotulo}
            </span>
            <span className="text-red-200">{segmento.texto}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BarraComposicao;
