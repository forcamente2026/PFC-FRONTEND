import { somenteDigitos, somenteNumeroDecimal } from "../../utils/formatar";

function CampoNumero({
  id,
  rotulo,
  valor,
  aoAlterar,
  decimal,
  placeholder,
  classeRotulo,
}) {
  function aoDigitar(evento) {
    const texto = evento.target.value;
    aoAlterar(decimal ? somenteNumeroDecimal(texto) : somenteDigitos(texto));
  }

  return (
    <div className="flex min-w-0 flex-col gap-1">
      <label
        htmlFor={id}
        className={`text-xs tracking-widest text-gray-300 ${classeRotulo ?? ""}`}
      >
        {rotulo}
      </label>
      <input
        id={id}
        type="text"
        inputMode={decimal ? "decimal" : "numeric"}
        autoComplete="off"
        value={valor}
        placeholder={placeholder}
        onChange={aoDigitar}
        className="w-full min-w-0 bg-transparent border-b border-gray-500 py-2 text-lg text-white outline-none focus:border-red-500"
      />
    </div>
  );
}

export default CampoNumero;