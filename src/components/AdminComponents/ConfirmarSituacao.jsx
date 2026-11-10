import { useState } from "react";

const ESTILO_BOTAO_PRINCIPAL =
  "rounded-md bg-red-500 py-2 px-4 font-bold text-white hover:bg-red-900 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
const ESTILO_BOTAO_SECUNDARIO =
  "rounded-md border border-gray-600 px-4 py-2 text-red-200 hover:bg-white/10 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";

function ConfirmarSituacao({ usuario, aoConfirmar, aoCancelar }) {
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);
  const inativar = usuario.ativo;

  async function confirmar() {
    setEnviando(true);
    setErro(null);
    try {
      await aoConfirmar();
    } catch (err) {
      setErro(err.mensagem || "Não foi possível alterar a situação desta conta.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="w-full max-w-xl pr-8">
      <h2 className="mb-5 text-xl font-bold text-white">
        {inativar ? "Inativar conta" : "Reativar conta"}
      </h2>
      <div className="mb-5 rounded-xl border border-gray-700 p-4">
        <span className="block text-xs text-gray-400">Conta</span>
        <span className="block text-white">{usuario.nomeCompleto}</span>
        <span className="block text-sm text-gray-400">{usuario.email}</span>
      </div>
      <p className="text-sm text-gray-300">
        {inativar
          ? "A pessoa deixa de conseguir entrar a partir do próximo login. Nenhum dado é apagado — isto não é a exclusão da LGPD."
          : "A pessoa volta a conseguir entrar com o e-mail e a senha que já tinha."}
      </p>
      {erro && <p className="mt-5 text-sm text-red-400">{erro}</p>}
      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <button type="button" onClick={aoCancelar} disabled={enviando} className={ESTILO_BOTAO_SECUNDARIO}>
          Cancelar
        </button>
        <button type="button" onClick={confirmar} disabled={enviando} className={ESTILO_BOTAO_PRINCIPAL}>
          {enviando
            ? inativar ? "Inativando..." : "Reativando..."
            : inativar ? "Inativar" : "Reativar"}
        </button>
      </div>
    </div>
  );
}

export default ConfirmarSituacao;
