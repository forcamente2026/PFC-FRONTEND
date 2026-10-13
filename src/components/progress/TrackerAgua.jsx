import { useState } from "react";
import { formatarNumero } from "../../utils/formatar";
import CampoNumero from "./CampoNumero";
import BarraProgresso from "./BarraProgresso";

const ATALHOS = [250, 500, 1000];

function TrackerAgua({ habilitado, resumo, processando, erro, aoRegistrar }) {
  const [quantidadeMl, setQuantidadeMl] = useState("");

  function aoEnviar(evento) {
    evento.preventDefault();
    if (!habilitado || !quantidadeMl) return;

    aoRegistrar(Number(quantidadeMl));
    setQuantidadeMl("");
  }

  return (
    <div className="flex flex-col gap-6 p-7 border bg-white/5 backdrop-blur-xl border-gray-700 rounded-xl shadow-lg shadow-black/20">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-red-500"></span>
        <span className="text-xs tracking-widest text-gray-300">
          QUANTO VOCÊ JÁ BEBEU?
        </span>
      </div>

      {habilitado ? null : (
        <p className="text-sm text-gray-300">
          Calcule sua meta ao lado para começar a registrar o que você bebeu.
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        {ATALHOS.map((valor) => (
          <button
            key={valor}
            type="button"
            disabled={!habilitado || processando}
            onClick={() => aoRegistrar(valor)}
            className="text-red-200 border border-gray-500 p-2 rounded-md hover:bg-red-500 hover:text-white cursor-pointer disabled:cursor-not-allowed disabled:border-gray-700 disabled:text-gray-500 disabled:hover:bg-transparent disabled:hover:text-gray-500"
          >
            + {formatarNumero(valor)} ml
          </button>
        ))}
      </div>

      <form onSubmit={aoEnviar} className="flex flex-wrap items-end gap-3">
        <div className="grow">
          <CampoNumero
            id="quantidade-agua"
            rotulo="OUTRA QUANTIDADE (ML)"
            valor={quantidadeMl}
            aoAlterar={setQuantidadeMl}
            placeholder="350"
          />
        </div>
        <button
          type="submit"
          disabled={!habilitado || !quantidadeMl || processando}
          className="bg-red-500 py-1 px-4 font-medium text-white hover:bg-red-900 cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-300"
        >
          {processando ? "REGISTRANDO..." : "REGISTRAR"}
        </button>
      </form>

      {erro ? (
        <p className="rounded-md border border-red-500 p-3 text-sm text-red-200">
          {erro}
        </p>
      ) : null}

      {resumo ? (
        <BarraProgresso
          rotulo={`${formatarNumero(resumo.totalConsumidoMl)} ml de ${formatarNumero(resumo.metaMl)} ml`}
          percentual={resumo.percentualDaMeta}
          mensagem={resumo.mensagem}
        />
      ) : null}
    </div>
  );
}

export default TrackerAgua;
