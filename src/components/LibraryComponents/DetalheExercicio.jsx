import ImagemExercicio from "./ImagemExercicio";
import { etapasDaDescricao } from "./exercicioCampos";

const ESTILO_TITULO_SECAO = "font-montserrat text-lg text-red-200";
const ESTILO_TEXTO = "mt-1 text-gray-300 wrap-anywhere";

function Dado({ rotulo, valor }) {
  return (
    <div>
      <dt className="text-sm font-semibold text-red-200">{rotulo}</dt>
      <dd className="font-semibold text-white wrap-anywhere">{valor}</dd>
    </div>
  );
}

function SecaoTecnica({ titulo, texto }) {
  if (!texto?.trim()) return null;

  return (
    <section>
      <h3 className={ESTILO_TITULO_SECAO}>{titulo}</h3>
      <p className={`${ESTILO_TEXTO} whitespace-pre-line`}>{texto}</p>
    </section>
  );
}

function SecaoEtapas({ descricao }) {
  const etapas = etapasDaDescricao(descricao);

  return (
    <section>
      <h3 className={ESTILO_TITULO_SECAO}>Como executar</h3>
      {etapas.length === 1 ? (
        <p className={ESTILO_TEXTO}>{etapas[0]}</p>
      ) : (
        <ol className={`${ESTILO_TEXTO} list-decimal space-y-1 pl-6`}>
          {etapas.map((etapa, indice) => (
            <li key={indice}>{etapa}</li>
          ))}
        </ol>
      )}
    </section>
  );
}

function DetalheExercicio({ exercicio, rotuloGrupo, rotuloNivel, aoFechar }) {
  const {
    nome,
    gifUrl,
    equipamento,
    descricaoExecucao,
    errosComuns,
    aquecimentoRecomendado,
  } = exercicio;

  return (
    <div className="space-y-4 py-2 md:p-4">
      <h2 className="px-6 text-center font-montserrat text-2xl text-red-200 wrap-anywhere">
        {nome}
      </h2>
      <div className="h-px w-full bg-gray-300"></div>

      <dl className="flex flex-wrap gap-x-8 gap-y-2">
        <Dado rotulo="Grupo muscular" valor={rotuloGrupo} />
        <Dado rotulo="Dificuldade" valor={rotuloNivel} />
        {equipamento?.trim() && <Dado rotulo="Equipamento" valor={equipamento} />}
      </dl>

      {gifUrl?.trim() && (
        <ImagemExercicio src={gifUrl} alt={`Demonstração de ${nome}`} altura="h-56 md:h-72" />
      )}

      <SecaoEtapas descricao={descricaoExecucao} />
      <SecaoTecnica titulo="Erros comuns" texto={errosComuns} />
      <SecaoTecnica titulo="Aquecimento recomendado" texto={aquecimentoRecomendado} />

      <button
        type="button"
        onClick={aoFechar}
        className="w-full rounded-md bg-red-500 py-2 font-medium text-white hover:bg-red-900 cursor-pointer"
      >
        Fechar
      </button>
    </div>
  );
}

export default DetalheExercicio;
