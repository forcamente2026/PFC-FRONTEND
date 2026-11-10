import { Check, X } from "lucide-react";

function ForcaSenha({ avaliacao }) {
  const { regras, pontos, total, rotulo, barra, texto } = avaliacao;

  return (
    <div className="mt-2 space-y-2 text-sm">
      <div className="flex items-center gap-3">
        <div
          role="progressbar"
          aria-label="Força da senha"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={pontos}
          className="flex flex-1 gap-1"
        >
          {Array.from({ length: total }, (_, indice) => (
            <span
              key={indice}
              className={`h-1.5 flex-1 rounded-full ${indice < pontos ? barra : "bg-gray-600"}`}
            ></span>
          ))}
        </div>
        <span aria-live="polite" className={`font-semibold ${texto}`}>
          {rotulo}
        </span>
      </div>

      <ul className="space-y-1 text-gray-400">
        {regras.map((regra) => (
          <li
            key={regra.id}
            className={`flex items-center gap-2 ${regra.atendida ? "text-green-400" : ""}`}
          >
            {regra.atendida ? (
              <Check size={14} aria-hidden="true" />
            ) : (
              <X size={14} aria-hidden="true" />
            )}
            {regra.descricao}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ForcaSenha;
