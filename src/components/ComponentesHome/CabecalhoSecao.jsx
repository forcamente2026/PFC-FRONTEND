function CabecalhoSecao({ rotulo, titulo, descricao }) {
  return (
    <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-500">
          {rotulo}
        </p>
        <h2 className="mt-1 font-montserrat text-3xl text-white md:text-4xl">
          {titulo}
        </h2>
      </div>

      {descricao && (
        <p className="text-sm text-gray-400 md:max-w-sm md:text-right">
          {descricao}
        </p>
      )}
    </div>
  );
}

export default CabecalhoSecao;
