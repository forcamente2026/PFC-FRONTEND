import ImagemExercicio from "./ImagemExercicio";
import { etapasDaDescricao } from "./exercicioCampos";
import { etiquetaDoArtigo } from "../ArticlesComponents/artigoCampos";

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

function ConteudoExercicio({ exercicio, rotuloGrupo, rotuloNivel }) {
  const {
    nome,
    gifUrl,
    equipamento,
    autorNome,
    descricaoExecucao,
    errosComuns,
    aquecimentoRecomendado,
  } = exercicio;
  const situacao = etiquetaDoArtigo(exercicio);

  return (
    <>
      <dl className="flex flex-wrap gap-x-8 gap-y-2">
        <Dado rotulo="Grupo muscular" valor={rotuloGrupo} />
        <Dado rotulo="Dificuldade" valor={rotuloNivel} />
        {equipamento?.trim() && <Dado rotulo="Equipamento" valor={equipamento} />}
        {autorNome && <Dado rotulo="Autor" valor={autorNome} />}
        {situacao && <Dado rotulo="Situação" valor={situacao} />}
      </dl>

      {gifUrl?.trim() && (
        <ImagemExercicio src={gifUrl} alt={`Demonstração de ${nome}`} altura="h-56 md:h-72" />
      )}

      <SecaoEtapas descricao={descricaoExecucao} />
      <SecaoTecnica titulo="Erros comuns" texto={errosComuns} />
      <SecaoTecnica titulo="Aquecimento recomendado" texto={aquecimentoRecomendado} />
    </>
  );
}

export default ConteudoExercicio;
