function MemoriaCalculo({ itens }) {
  if (!itens || !itens.length) return null;

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs tracking-widest text-gray-300">
        MEMÓRIA DE CÁLCULO
      </span>

      <ul className="flex flex-col">
        {itens.map((item) => (
          <li
            key={item.rotulo}
            className="flex justify-between gap-4 border-b border-gray-700 py-2 text-sm"
          >
            <span className="text-gray-300">{item.rotulo}</span>
            <span className="text-red-200">{item.valor}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MemoriaCalculo;
