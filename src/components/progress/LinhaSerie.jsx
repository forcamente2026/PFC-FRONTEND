import { X } from "lucide-react";
import CampoNumero from "./CampoNumero";

function LinhaSerie({
  grade,
  linha,
  exercicios,
  carregandoExercicios,
  aoAlterar,
  aoRemover,
  podeRemover,
}) {
  return (
    <div className={grade}>
      <div className="flex min-w-0 flex-col gap-1">
        <label
          htmlFor={`exercicio-${linha.id}`}
          className="text-xs tracking-widest text-gray-300 md:sr-only"
        >
          EXERCÍCIO
        </label>
        <select
          id={`exercicio-${linha.id}`}
          value={linha.exercicioId}
          disabled={carregandoExercicios}
          onChange={(evento) => aoAlterar("exercicioId", evento.target.value)}
          className="w-full min-w-0 bg-transparent border-b border-gray-500 py-2 text-white outline-none focus:border-red-500 disabled:text-gray-500"
        >
          <option value="" className="bg-slate-950">
            {carregandoExercicios ? "Carregando..." : "Selecione"}
          </option>
          {exercicios.map((exercicio) => (
            <option
              key={exercicio.id}
              value={exercicio.id}
              className="bg-slate-950"
            >
              {exercicio.nome}
            </option>
          ))}
        </select>
      </div>

      <CampoNumero
        id={`series-${linha.id}`}
        rotulo="SÉRIES"
        valor={linha.series}
        aoAlterar={(valor) => aoAlterar("series", valor)}
        placeholder="4"
        classeRotulo="md:sr-only"
      />

      <CampoNumero
        id={`reps-${linha.id}`}
        rotulo="REPS"
        valor={linha.repeticoes}
        aoAlterar={(valor) => aoAlterar("repeticoes", valor)}
        placeholder="10"
        classeRotulo="md:sr-only"
      />

      <CampoNumero
        id={`carga-${linha.id}`}
        rotulo="CARGA (KG)"
        valor={linha.cargaKg}
        aoAlterar={(valor) => aoAlterar("cargaKg", valor)}
        decimal
        placeholder="60"
        classeRotulo="md:sr-only"
      />

      <button
        type="button"
        onClick={aoRemover}
        disabled={!podeRemover}
        aria-label="Remover exercício"
        className="self-end py-2 text-gray-300 hover:text-red-200 cursor-pointer disabled:cursor-not-allowed disabled:text-gray-700"
      >
        <X size={18} />
      </button>
    </div>
  );
}

export default LinhaSerie;
