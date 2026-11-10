import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

function ConsentimentoSaude({ consentiu, aoAlterar }) {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 mt-8">
      <div className="flex gap-4 p-5 border border-gray-700 bg-white/5 rounded-xl">
        <ShieldCheck className="shrink-0 text-red-500" size={22} />

        <div className="flex flex-col gap-3">
          <span className="text-xs tracking-widest text-red-200">
            DADOS DE SAÚDE
          </span>
          <p className="text-gray-300 wrap-break-word">
            As calculadoras abaixo pedem peso, altura, idade, sexo, nível de
            atividade, tempo de treino e consumo de água. São dados pessoais
            sensíveis, usados só para calcular o resultado nesta tela:{" "}
            <span className="font-semibold text-white">
              não são gravados nem ficam associados à sua conta.
            </span>
          </p>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="consentimento-saude"
              checked={consentiu}
              onChange={(evento) => aoAlterar(evento.target.checked)}
              className="h-5 w-5 accent-red-500"
            />
            <label htmlFor="consentimento-saude" className="text-white">
              Concordo em informar esses dados para o cálculo, conforme a{" "}
              <Link
                to="/politica-de-privacidade"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-200 underline hover:text-white"
              >
                Política de Privacidade
              </Link>
              .
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsentimentoSaude;