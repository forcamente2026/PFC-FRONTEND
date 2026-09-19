import { useState } from "react";
import { alterarStatusArtigo } from "../../services/artigoService";
import { STATUS_ARTIGO } from "./artigoCampos";

const ACOES = [
  { status: "APROVADO", rotulo: "Aprovar", estilo: "bg-green-600 hover:bg-green-800" },
  { status: "REJEITADO", rotulo: "Rejeitar", estilo: "bg-red-500 hover:bg-red-900" },
];

// Ponte da rodada C: bloco que o administrador vê na leitura do artigo.
// A futura página de fila de pendentes pode reaproveitar este componente por card.
function ValidacaoArtigo({ artigo, aoAlterarStatus }) {
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  async function alterar(status) {
    setEnviando(true);
    setErro(null);

    try {
      const atualizado = await alterarStatusArtigo(artigo.id, status);
      aoAlterarStatus(atualizado);
    } catch (err) {
      setErro(err.mensagem || "Não foi possível alterar o status.");
    } finally {
      setEnviando(false);
    }
  }

  const acoesDisponiveis = ACOES.filter((acao) => acao.status !== artigo.status);

  return (
    <div className="rounded-xl border border-gray-700 bg-white/5 p-4 backdrop-blur-xl">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-500">
        Validação do administrador
      </p>
      <p className="mt-1 text-sm text-gray-300">
        Status atual:{" "}
        <span className="font-semibold text-white">
          {STATUS_ARTIGO[artigo.status]?.descricao ?? artigo.status}
        </span>
      </p>

      {erro && (
        <p role="alert" className="mt-2 text-sm text-red-500">
          {erro}
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-3">
        {acoesDisponiveis.map((acao) => (
          <button
            key={acao.status}
            type="button"
            disabled={enviando}
            onClick={() => alterar(acao.status)}
            className={`rounded-md py-2 px-4 font-bold text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${acao.estilo}`}
          >
            {enviando ? "Salvando..." : acao.rotulo}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ValidacaoArtigo;
