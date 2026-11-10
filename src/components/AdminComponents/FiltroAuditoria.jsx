const ESTILO_CAMPO =
  "rounded-xl border border-gray-600 bg-slate-800 p-2 text-white neon-suave-red-500 focus:border-red-500 focus:neon-red-500 focus:outline-none";
const ESTILO_ROTULO = "text-sm text-gray-300";

function FiltroAuditoria({ filtros, acoes, aoAlterar, aoLimpar }) {
  function handleChange(evento) {
    const { name, value } = evento.target;
    aoAlterar(name, value);
  }

  return (
    <div className="mb-6 flex flex-wrap items-end gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="de" className={ESTILO_ROTULO}>
          De
        </label>
        <input
          type="date"
          id="de"
          name="de"
          value={filtros.de}
          onChange={handleChange}
          className={ESTILO_CAMPO}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="ate" className={ESTILO_ROTULO}>
          Até
        </label>
        <input
          type="date"
          id="ate"
          name="ate"
          value={filtros.ate}
          onChange={handleChange}
          className={ESTILO_CAMPO}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="acao" className={ESTILO_ROTULO}>
          Ação
        </label>
        <select
          id="acao"
          name="acao"
          value={filtros.acao}
          onChange={handleChange}
          className={ESTILO_CAMPO}
        >
          <option value="">Todas</option>
          {acoes.map((opcao) => (
            <option key={opcao.codigo} value={opcao.codigo}>
              {opcao.descricao}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={aoLimpar}
        className="rounded-md border border-gray-600 px-4 py-2 text-red-200 hover:bg-white/10 cursor-pointer"
      >
        Limpar
      </button>
    </div>
  );
}

export default FiltroAuditoria;
