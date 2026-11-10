import { Link } from "react-router-dom";
import Cartao from "../ComponentesHome/Cartao";
import { etiquetaDoArtigo } from "../ArticlesComponents/artigoCampos";

function CardQuiz({ quiz }) {
  const etiquetaStatus = etiquetaDoArtigo(quiz);
  const nota = quiz.melhorTentativa;

  return (
    <Link to={`/quiz/${quiz.id}`} className="block h-full">
      <Cartao className="flex h-full flex-col transition-colors hover:border-red-500">
        <div className="flex items-start justify-between gap-2">
          <span className="rounded-full border border-red-500 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-red-400">
            {quiz.categoria.descricao}
          </span>
          {etiquetaStatus && (
            <span className="rounded-md bg-gray-700 px-2 py-1 text-xs font-medium text-gray-200">
              {etiquetaStatus}
            </span>
          )}
        </div>

        <h3 className="mt-4 font-montserrat text-lg text-white">{quiz.titulo}</h3>
        <p className="mt-2 text-sm text-gray-400">{quiz.descricao}</p>

        <div className="mt-auto pt-4">
          <div className="h-px bg-gray-700"></div>
          <div className="mt-4 flex justify-between gap-2 text-xs uppercase tracking-[0.2em] text-gray-400">
            <span>
              {quiz.nivel.descricao} · {quiz.totalQuestoes} perguntas
            </span>
            {nota && (
              <span className={nota.concluido ? "text-green-400" : "text-gray-300"}>
                {nota.concluido ? "Concluído" : `Melhor nota: ${nota.percentual}%`}
              </span>
            )}
          </div>
        </div>
      </Cartao>
    </Link>
  );
}

export default CardQuiz;
