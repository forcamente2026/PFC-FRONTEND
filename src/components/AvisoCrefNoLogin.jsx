import AvisoCref from "./AvisoCref";

const ESTILO_BOTAO_PRIMARIO =
  "rounded-md bg-red-500 py-2 px-4 font-bold text-white hover:bg-red-900 cursor-pointer";
const ESTILO_BOTAO_SECUNDARIO =
  "rounded-md border border-gray-600 px-4 py-2 text-red-200 hover:bg-white/10 cursor-pointer";

function AvisoCrefNoLogin({ situacao, motivo, aoVerConta, aoFechar }) {
  return (
    <div className="w-full max-w-xl pr-8">
      <h2 className="mb-1 text-xl font-bold text-white">Sua verificação do CREF</h2>
      <AvisoCref situacao={situacao} motivo={motivo} />
      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <button type="button" onClick={aoFechar} className={ESTILO_BOTAO_SECUNDARIO}>
          Fechar
        </button>
        <button type="button" onClick={aoVerConta} className={ESTILO_BOTAO_PRIMARIO}>
          Ver minha conta
        </button>
      </div>
    </div>
  );
}

export default AvisoCrefNoLogin;