import { useOutletContext } from "react-router-dom";
import AprovarExercicio from "./AprovarExercicio";
import ValidacaoExercicio from "./ValidacaoExercicio";
import { estaEmAnalise } from "../../utils/moderacao";
import { podeValidar } from "../../utils/papeis";

function ModeracaoExercicio({ exercicio, aoAprovar, aoDecidir }) {
  const { usuario } = useOutletContext();

  if (!exercicio.status) return null;

  return (
    <>
      {exercicio.motivoRejeicao && (
        <div className="rounded-xl border border-red-500 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-500">
            Motivo da rejeição
          </p>
          <p className="mt-1 text-sm text-gray-300 wrap-anywhere">{exercicio.motivoRejeicao}</p>
        </div>
      )}

      {exercicio.podeAprovar && (
        <AprovarExercicio exercicio={exercicio} aoAprovar={aoAprovar} />
      )}

      {podeValidar(usuario) && estaEmAnalise(exercicio) && (
        <ValidacaoExercicio exercicio={exercicio} aoAlterarStatus={aoDecidir} />
      )}
    </>
  );
}

export default ModeracaoExercicio;
