import { CircleAlert, CircleCheck } from "lucide-react";

function AvisoDeAcao({ tipo, titulo, mensagem, aoFechar }) {
  const erro = tipo === "erro";
  const Icone = erro ? CircleAlert : CircleCheck;

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-3 px-6 py-4 text-center">
      <Icone
        size={44}
        aria-hidden="true"
        className={erro ? "text-red-500" : "text-green-400"}
      />
      <h2 className="text-xl font-bold text-white">{titulo}</h2>
      <p role={erro ? "alert" : "status"} className="text-gray-300">
        {mensagem}
      </p>
      <button
        type="button"
        autoFocus
        onClick={aoFechar}
        className="mt-2 rounded-md bg-red-500 py-2 px-8 font-bold text-white hover:bg-red-900 cursor-pointer"
      >
        OK
      </button>
    </div>
  );
}

export default AvisoDeAcao;
