import { useEffect, useRef, useState } from "react";
import { Check, X } from "lucide-react";
import ListaDeErros from "./ListaDeErros";
import { responderQuiz } from "../../services/quizService";

const ESTILO_BOTAO_PRIMARIO =
  "rounded-md bg-red-500 py-2 px-4 font-bold text-white hover:bg-red-900 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
const ESTILO_BOTAO_SECUNDARIO =
  "rounded-md border border-gray-600 px-4 py-2 text-red-200 hover:bg-white/10 cursor-pointer";

function estiloDaAlternativa(correcao, alternativaId) {
  if (!correcao) return "border-gray-700 hover:border-red-500";
  if (alternativaId === correcao.alternativaCorretaId) return "border-green-600 bg-green-600/15";
  if (alternativaId === correcao.alternativaEscolhidaId) return "border-red-500 bg-red-500/15";
  return "border-gray-700 opacity-70";
}

function ResponderQuiz({ quiz, usuario, aoResponder }) {
  const [respostas, setRespostas] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);
  const [camposComErro, setCamposComErro] = useState([]);
  const [resultado, setResultado] = useState(null);
  const caixaDoResultado = useRef(null);

  useEffect(() => {
    if (resultado) caixaDoResultado.current?.scrollIntoView({ block: "center" });
  }, [resultado]);

  const todasRespondidas = quiz.questoes.every((questao) => respostas[questao.id]);
  const correcoes = new Map((resultado?.correcao ?? []).map((item) => [item.questaoId, item]));

  function escolher(questaoId, alternativaId) {
    setRespostas((atuais) => ({ ...atuais, [questaoId]: alternativaId }));
  }

  async function enviar(evento) {
    evento.preventDefault();
    setEnviando(true);
    setErro(null);
    setCamposComErro([]);

    try {
      const lista = Object.entries(respostas).map(([questaoId, alternativaId]) => ({
        questaoId,
        alternativaId,
      }));
      const devolvido = await responderQuiz(quiz.id, lista, usuario);
      setResultado(devolvido);
      aoResponder();
    } catch (err) {
      setErro(err.mensagem || "Não foi possível enviar as respostas.");
      setCamposComErro(err.campos ?? []);
    } finally {
      setEnviando(false);
    }
  }

  function tentarDeNovo() {
    setRespostas({});
    setResultado(null);
    setErro(null);
    setCamposComErro([]);
  }

  return (
    <form onSubmit={enviar} className="flex flex-col gap-6">
      {resultado && (
        <div
          ref={caixaDoResultado}
          role="status"
          className={`rounded-xl border p-4 ${
            resultado.concluido
              ? "border-green-600 bg-green-600/10 text-green-100"
              : "border-yellow-500 bg-yellow-500/10 text-yellow-100"
          }`}
        >
          <p className="font-semibold">
            Você acertou {resultado.acertos} de {resultado.total} ({resultado.percentual}%).
          </p>
          <p className="mt-1 text-sm">
            {resultado.concluido
              ? "Quiz concluído!"
              : `Para concluir, a nota mínima é ${resultado.notaMinima}%. Releia a leitura sugerida e tente de novo.`}
          </p>
        </div>
      )}

      {quiz.questoes.map((questao, indice) => {
        const correcao = correcoes.get(questao.id);
        return (
          <fieldset key={questao.id} className="flex flex-col gap-2">
            <legend className="mb-2 font-semibold text-white">
              {indice + 1}. {questao.enunciado}
            </legend>

            {questao.alternativas.map((alternativa) => (
              <label
                key={alternativa.id}
                className={`flex items-center gap-3 rounded-lg border p-3 text-sm text-gray-200 ${
                  resultado ? "" : "cursor-pointer"
                } ${estiloDaAlternativa(correcao, alternativa.id)}`}
              >
                <input
                  type="radio"
                  name={`questao-${questao.id}`}
                  value={alternativa.id}
                  checked={respostas[questao.id] === alternativa.id}
                  onChange={() => escolher(questao.id, alternativa.id)}
                  disabled={Boolean(resultado)}
                  className="accent-red-500"
                />
                <span className="flex-1">{alternativa.texto}</span>
                {correcao && alternativa.id === correcao.alternativaCorretaId && (
                  <Check size={18} className="text-green-400" aria-label="Alternativa correta" />
                )}
                {correcao &&
                  alternativa.id === correcao.alternativaEscolhidaId &&
                  !correcao.acertou && (
                    <X size={18} className="text-red-400" aria-label="Sua resposta" />
                  )}
              </label>
            ))}

            {correcao?.explicacao && (
              <p className="rounded-lg bg-white/5 p-3 text-sm text-gray-300">
                {correcao.explicacao}
              </p>
            )}
          </fieldset>
        );
      })}

      <ListaDeErros erro={erro} campos={camposComErro} />

      <div className="flex flex-wrap justify-end gap-3">
        {resultado ? (
          <button type="button" onClick={tentarDeNovo} className={ESTILO_BOTAO_SECUNDARIO}>
            Tentar de novo
          </button>
        ) : (
          <button
            type="submit"
            disabled={!todasRespondidas || enviando}
            className={ESTILO_BOTAO_PRIMARIO}
          >
            {enviando ? "Corrigindo..." : "Enviar respostas"}
          </button>
        )}
      </div>
    </form>
  );
}

export default ResponderQuiz;
