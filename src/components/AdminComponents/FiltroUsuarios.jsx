import { PAPEIS } from "../../utils/papeis";

const ESTILO_CAMPO =
  "rounded-xl border border-gray-600 bg-slate-800 p-2 text-white neon-suave-red-500 focus:border-red-500 focus:neon-red-500 focus:outline-none";
const ESTILO_ROTULO = "text-sm text-gray-300";

function FiltroUsuarios({ filtros, aoAlterar, aoLimpar }) {
  function handleChange(evento) {
    const { name, value } = evento.target;
    aoAlterar(name, value);
  }

  return (
    <div className="mb-6 flex flex-wrap items-end gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="busca" className={ESTILO_ROTULO}>
          Nome ou e-mail
        </label>
        <input
          type="search"
          id="busca"
          name="busca"
          value={filtros.busca}
          onChange={handleChange}
          placeholder="Ex: Ana ou ana@umc.br"
          className={`${ESTILO_CAMPO} min-w-60`}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="papel" className={ESTILO_ROTULO}>
          Perfil
        </label>
        <select
          id="papel"
          name="papel"
          value={filtros.papel}
          onChange={handleChange}
          className={ESTILO_CAMPO}
        >
          <option value="">Todos</option>
          {PAPEIS.map((papel) => (
            <option key={papel.codigo} value={papel.codigo}>
              {papel.rotulo}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="ativo" className={ESTILO_ROTULO}>
          Situação
        </label>
        <select
          id="ativo"
          name="ativo"
          value={filtros.ativo}
          onChange={handleChange}
          className={ESTILO_CAMPO}
        >
          <option value="">Todas</option>
          <option value="true">Ativos</option>
          <option value="false">Inativos</option>
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

export default FiltroUsuarios;
