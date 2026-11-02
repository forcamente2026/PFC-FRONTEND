import { useId } from "react";
import {
  LIMITE_AQUECIMENTO,
  LIMITE_DESCRICAO_EXECUCAO,
  LIMITE_EQUIPAMENTO,
  LIMITE_ERROS_COMUNS,
  LIMITE_GIF_URL,
  LIMITE_NOME,
} from "./exercicioCampos";

const ESTILO_CAMPO = "bg-gray-500 rounded-xl p-1 text-white";
const ESTILO_SELECT =
  "bg-gray-400 text-gray-300 rounded-xl p-1 disabled:opacity-60 disabled:cursor-not-allowed";

function ExercicioForm({
  titulo,
  valores,
  aoAlterar,
  aoEnviar,
  gruposMusculares,
  niveis,
  carregandoOpcoes,
  grupoMuscularBloqueado = false,
  enviando,
  erro,
  textoBotao,
  textoBotaoEnviando,
}) {
  const idBase = useId();
  const campoId = (campo) => `${idBase}-${campo}`;

  return (
    <form onSubmit={aoEnviar} className="p-4 text-2xl space-y-2">
      <div className="text-red-200 text-center font-montserrat">
        <h2>{titulo}</h2>
      </div>
      <div className="w-full h-px bg-gray-300 mb-3"></div>

      {erro && (
        <p
          role="alert"
          className="text-red-500 text-sm font-normal text-center"
        >
          {erro}
        </p>
      )}

      <div className="flex flex-col text-red-200 gap-2 mb-6">
        <label htmlFor={campoId("nome")}>Nome do Exercicio</label>
        <input
          type="text"
          id={campoId("nome")}
          maxLength={LIMITE_NOME}
          name="nome"
          value={valores.nome}
          onChange={aoAlterar}
          placeholder="Digite"
          className={ESTILO_CAMPO}
        />
      </div>

      <div className="flex flex-col text-red-200 gap-2">
        <label htmlFor={campoId("grupoMuscular")}>Grupo Muscular</label>
        <select
          id={campoId("grupoMuscular")}
          name="grupoMuscular"
          value={valores.grupoMuscular}
          onChange={aoAlterar}
          disabled={grupoMuscularBloqueado || carregandoOpcoes}
          className={`${ESTILO_SELECT} self-start`}
        >
          <option value="">
            {carregandoOpcoes ? "Carregando..." : "Selecione"}
          </option>
          {gruposMusculares.map((grupo) => (
            <option key={grupo.codigo} value={grupo.codigo}>
              {grupo.descricao}
            </option>
          ))}
        </select>
        {grupoMuscularBloqueado && (
          <p className="text-sm text-gray-300">
            O grupo muscular não pode ser alterado.
          </p>
        )}
      </div>

      <div className="flex flex-col text-red-200 gap-2 mb-5">
        <label htmlFor={campoId("nivel")}>Nivel</label>
        <select
          id={campoId("nivel")}
          name="nivel"
          value={valores.nivel}
          onChange={aoAlterar}
          disabled={carregandoOpcoes}
          className={`${ESTILO_SELECT} self-start`}
        >
          <option value="">
            {carregandoOpcoes ? "Carregando..." : "Selecione"}
          </option>
          {niveis.map((nivel) => (
            <option key={nivel.codigo} value={nivel.codigo}>
              {nivel.descricao}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full h-px bg-gray-300 mb-3"></div>

      <div className="flex flex-col text-red-200 gap-2 mb-6">
        <label htmlFor={campoId("descricaoExecucao")}>Descrição execução</label>
        <textarea
          id={campoId("descricaoExecucao")}
          name="descricaoExecucao"
          value={valores.descricaoExecucao}
          onChange={aoAlterar}
          rows={4}
          maxLength={LIMITE_DESCRICAO_EXECUCAO}
          placeholder="Digite"
          className={`${ESTILO_CAMPO} text-lg`}
        />
        <span className="self-end text-sm text-gray-300">
          {valores.descricaoExecucao.length}/{LIMITE_DESCRICAO_EXECUCAO}
        </span>

        <label htmlFor={campoId("errosComuns")}>Erros comuns</label>
        <textarea
          id={campoId("errosComuns")}
          name="errosComuns"
          value={valores.errosComuns}
          onChange={aoAlterar}
          rows={4}
          maxLength={LIMITE_ERROS_COMUNS}
          placeholder="Digite"
          className={`${ESTILO_CAMPO} text-lg`}
        />
        <span className="self-end text-sm text-gray-300">
          {valores.errosComuns.length}/{LIMITE_ERROS_COMUNS}
        </span>

        <label htmlFor={campoId("aquecimentoRecomendado")}>
          Aquecimento Recomendado
        </label>
        <textarea
          id={campoId("aquecimentoRecomendado")}
          name="aquecimentoRecomendado"
          value={valores.aquecimentoRecomendado}
          onChange={aoAlterar}
          rows={4}
          maxLength={LIMITE_AQUECIMENTO}
          placeholder="Digite"
          className={`${ESTILO_CAMPO} text-lg`}
        />
        <span className="self-end text-sm text-gray-300">
          {valores.aquecimentoRecomendado.length}/{LIMITE_AQUECIMENTO}
        </span>

        <label htmlFor={campoId("equipamento")}>Equipamento</label>
        <input
          type="text"
          id={campoId("equipamento")}
          maxLength={LIMITE_EQUIPAMENTO}
          name="equipamento"
          value={valores.equipamento}
          onChange={aoAlterar}
          placeholder="Digite"
          className={ESTILO_CAMPO}
        />

        <label htmlFor={campoId("gifUrl")}>Gif</label>
        <input
          type="text"
          id={campoId("gifUrl")}
          maxLength={LIMITE_GIF_URL}
          name="gifUrl"
          value={valores.gifUrl}
          onChange={aoAlterar}
          placeholder="URL do gif"
          className={ESTILO_CAMPO}
        />
      </div>

      <button
        type="submit"
        disabled={enviando}
        className="w-full bg-red-500 text-white rounded-md cursor-pointer hover:bg-red-900 py-2 px-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {enviando ? textoBotaoEnviando : textoBotao}
      </button>
    </form>
  );
}

export default ExercicioForm;
