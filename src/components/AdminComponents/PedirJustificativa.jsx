import { useState } from "react";
import Dialogo from "../Dialogo";

const MINIMO = 10;
const MAXIMO = 255;

export default function PedirJustificativa({
  nomeDaPessoa,
  aoConfirmar,
  aoCancelar,
  enviando = false,
}) {
  const [justificativa, setJustificativa] = useState("");

  const texto = justificativa.trim();
  const podeConfirmar = texto.length >= MINIMO && !enviando;

  function enviar(evento) {
    evento.preventDefault();
    if (podeConfirmar) aoConfirmar(texto);
  }

  return (
    <Dialogo
      isOpen
      setCloseModal={aoCancelar}
      className="w-[min(32rem,92vw)] rounded-2xl bg-neutral-900 p-6 text-gray-200"
      classeFechar="text-gray-400 hover:text-white"
    >
      <form onSubmit={enviar} className="flex flex-col gap-4">
        <h2 className="font-montserrat text-2xl">Por que abrir os dados completos?</h2>

        <p className="text-sm text-gray-300">
          Abrir os dados de{" "}
          <span className="font-semibold text-red-200">{nomeDaPessoa}</span> sem
          máscara fica registrado na trilha de auditoria, junto com esta
          justificativa.
        </p>

        <div className="flex flex-col gap-1">
          <label htmlFor="justificativa" className="text-lg font-light">
            Justificativa
          </label>
          <textarea
            id="justificativa"
            name="justificativa"
            rows={3}
            maxLength={MAXIMO}
            value={justificativa}
            onChange={(evento) => setJustificativa(evento.target.value)}
            placeholder="Ex.: conferir o CREF enviado pelo professor"
            className="rounded-xl border border-gray-700 bg-neutral-800 px-3 py-2 text-gray-100 placeholder:text-gray-500"
          />
          <span className="text-xs text-gray-400">
            {texto.length < MINIMO
              ? `Escreva pelo menos ${MINIMO} caracteres.`
              : `${justificativa.length} de ${MAXIMO} caracteres.`}
          </span>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={aoCancelar}
            className="rounded-xl border border-gray-700 px-4 py-2 text-red-200 hover:bg-white/10 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!podeConfirmar}
            className="rounded-xl bg-red-500 px-4 py-2 font-bold text-red-100 hover:bg-red-900 hover:text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {enviando ? "Abrindo..." : "Abrir dados"}
          </button>
        </div>
      </form>
    </Dialogo>
  );
}
