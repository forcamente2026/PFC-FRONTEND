import { useEffect, useId, useRef } from "react";
import { Plus, Trash2 } from "lucide-react";
import { LIMITE_ETAPAS, LIMITE_POR_ETAPA } from "./exercicioCampos";

const ESTILO_CAMPO = "field-sizing-content bg-gray-500 rounded-xl p-1 text-lg text-white";
const ESTILO_CAMPO_ACIMA_DO_LIMITE = "border border-red-500";
const ESTILO_REMOVER =
  "rounded-md p-1 text-gray-300 hover:bg-white/10 hover:text-red-400 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed";
const ESTILO_ADICIONAR =
  "inline-flex items-center gap-2 rounded-md border border-gray-600 px-3 py-1 text-sm text-red-200 hover:bg-white/10 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";

function EditorDeEtapas({ etapas, aoMudar }) {
  const idBase = useId();
  const proximoFoco = useRef(null);
  const campoId = (indice) => `${idBase}-etapa-${indice}`;
  const limiteAtingido = etapas.length >= LIMITE_ETAPAS;

  useEffect(() => {
    if (proximoFoco.current === null) return;

    document.getElementById(campoId(proximoFoco.current))?.focus();
    proximoFoco.current = null;
  });

  function alterar(indice, texto) {
    const semQuebra = texto.replace(/\r?\n/g, " ");
    aoMudar(etapas.map((etapa, posicao) => (posicao === indice ? semQuebra : etapa)));
  }

  function adicionar() {
    proximoFoco.current = etapas.length;
    aoMudar([...etapas, ""]);
  }

  function remover(indice) {
    proximoFoco.current = Math.max(indice - 1, 0);
    aoMudar(etapas.filter((_, posicao) => posicao !== indice));
  }

  function aoTeclar(evento, indice) {
    if (evento.key !== "Enter") return;

    evento.preventDefault();

    if (indice < etapas.length - 1) {
      document.getElementById(campoId(indice + 1))?.focus();
      return;
    }

    if (!limiteAtingido && etapas[indice].trim()) adicionar();
  }

  return (
    <div role="group" aria-labelledby={`${idBase}-titulo`} className="flex flex-col gap-3">
      <span id={`${idBase}-titulo`}>Etapas da execução</span>

      {etapas.map((etapa, indice) => {
        const numero = indice + 1;
        const acimaDoLimite = etapa.length > LIMITE_POR_ETAPA;

        return (
          <div key={indice} className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-2">
              <label htmlFor={campoId(indice)} className="text-base text-red-200">
                Etapa {numero}
              </label>
              <button
                type="button"
                onClick={() => remover(indice)}
                disabled={etapas.length <= 1}
                aria-label={`Remover a etapa ${numero}`}
                className={ESTILO_REMOVER}
              >
                <Trash2 size={18} aria-hidden="true" />
              </button>
            </div>
            <textarea
              id={campoId(indice)}
              value={etapa}
              onChange={(evento) => alterar(indice, evento.target.value)}
              onKeyDown={(evento) => aoTeclar(evento, indice)}
              rows={2}
              maxLength={LIMITE_POR_ETAPA}
              aria-invalid={acimaDoLimite}
              aria-describedby={`${campoId(indice)}-contador`}
              placeholder="Digite"
              className={`${ESTILO_CAMPO} ${acimaDoLimite ? ESTILO_CAMPO_ACIMA_DO_LIMITE : ""}`}
            />
            <span
              id={`${campoId(indice)}-contador`}
              className={`self-end text-sm ${acimaDoLimite ? "text-red-400" : "text-gray-300"}`}
            >
              {etapa.length}/{LIMITE_POR_ETAPA}
            </span>
          </div>
        );
      })}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={adicionar}
          disabled={limiteAtingido}
          className={ESTILO_ADICIONAR}
        >
          <Plus size={16} aria-hidden="true" />
          Adicionar etapa
        </button>
        <span className="text-sm text-gray-300">
          {etapas.length} de {LIMITE_ETAPAS} etapas
        </span>
      </div>
    </div>
  );
}

export default EditorDeEtapas;
