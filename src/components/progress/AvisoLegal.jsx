import { TriangleAlert } from "lucide-react";

function AvisoLegal() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 mt-8">
      <div className="flex gap-4 p-5 border border-red-500 bg-red-500/10 rounded-xl">
        <TriangleAlert className="shrink-0 text-red-500" size={22} />

        <div className="flex flex-col gap-1">
          <span className="text-xs tracking-widest text-red-200">
            LEIA ANTES DE USAR
          </span>
          <p className="text-gray-300 wrap-break-word">
            Estimativas baseadas em fórmulas de referência.{" "}
            <span className="font-semibold text-white">
              Não substituem avaliação de profissional de saúde.
            </span>{" "}
            Nenhum número desta página é prescrição médica ou nutricional.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AvisoLegal;
