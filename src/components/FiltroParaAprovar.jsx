function FiltroParaAprovar({ ativo, aoAlternar, quantidade }) {
  return (
    <div className="mb-4 flex justify-end px-4">
      <label className="flex cursor-pointer items-center gap-2 text-sm text-red-200">
        <input
          type="checkbox"
          checked={ativo}
          onChange={(evento) => aoAlternar(evento.target.checked)}
          className="h-4 w-4 accent-red-500"
        />
        Só os que preciso aprovar ({quantidade})
      </label>
    </div>
  );
}

export default FiltroParaAprovar;
