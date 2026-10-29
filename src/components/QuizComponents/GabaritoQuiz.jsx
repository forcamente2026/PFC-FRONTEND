import { Check } from "lucide-react";

function GabaritoQuiz({ quiz }) {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-gray-400">
        Você vê o gabarito porque é o autor, o administrador ou um professor revisando um
        quiz pendente.
      </p>

      {quiz.questoes.map((questao, indice) => (
        <div key={questao.id} className="flex flex-col gap-2">
          <p className="font-semibold text-white">
            {indice + 1}. {questao.enunciado}
          </p>
          <ul className="flex flex-col gap-2">
            {questao.alternativas.map((alternativa) => (
              <li
                key={alternativa.id}
                className={`flex items-center gap-3 rounded-lg border p-3 text-sm ${
                  alternativa.correta
                    ? "border-green-600 bg-green-600/15 text-green-100"
                    : "border-gray-700 text-gray-300"
                }`}
              >
                <span className="flex-1">{alternativa.texto}</span>
                {alternativa.correta && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-green-400">
                    <Check size={16} aria-hidden="true" />
                    Correta
                  </span>
                )}
              </li>
            ))}
          </ul>
          {questao.explicacao && (
            <p className="rounded-lg bg-white/5 p-3 text-sm text-gray-300">
              {questao.explicacao}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export default GabaritoQuiz;
