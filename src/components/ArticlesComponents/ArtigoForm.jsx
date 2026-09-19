import { useId } from "react";

const ESTILO_CAMPO = "bg-gray-500 rounded-xl p-1 text-white";
const ESTILO_SELECT =
  "bg-gray-400 text-gray-300 rounded-xl p-1 disabled:opacity-60 disabled:cursor-not-allowed";

function ArtigoForm({
  titulo,
  valores,
  aoAlterar,
  aoEnviar,
  categorias,
  carregandoOpcoes,
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
        <h1>{titulo}</h1>
      </div>
      <div className="w-full h-px bg-gray-300 mb-3"></div>

      {erro && (
        <p role="alert" className="text-red-500 text-sm font-normal text-center">
          {erro}
        </p>
      )}

      <div className="flex flex-col text-red-200 gap-2 mb-6">
        <label htmlFor={campoId("titulo")}>Título</label>
        <input
          type="text"
          id={campoId("titulo")}
          name="titulo"
          value={valores.titulo}
          onChange={aoAlterar}
          placeholder="Digite"
          className={ESTILO_CAMPO}
        />
      </div>

      <div className="flex flex-col text-red-200 gap-2 mb-5">
        <label htmlFor={campoId("categoria")}>Categoria</label>
        <select
          id={campoId("categoria")}
          name="categoria"
          value={valores.categoria}
          onChange={aoAlterar}
          disabled={carregandoOpcoes}
          className={`${ESTILO_SELECT} self-start`}
        >
          <option value="">
            {carregandoOpcoes ? "Carregando..." : "Selecione"}
          </option>
          {categorias.map((categoria) => (
            <option key={categoria.codigo} value={categoria.codigo}>
              {categoria.descricao}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full h-px bg-gray-300 mb-3"></div>

      <div className="flex flex-col text-red-200 gap-2 mb-6">
        <label htmlFor={campoId("resumo")}>Resumo</label>
        <input
          type="text"
          id={campoId("resumo")}
          name="resumo"
          value={valores.resumo}
          onChange={aoAlterar}
          placeholder="Uma ou duas frases"
          className={ESTILO_CAMPO}
        />

        <label htmlFor={campoId("conteudo")}>Conteúdo</label>
        <textarea
          id={campoId("conteudo")}
          name="conteudo"
          value={valores.conteudo}
          onChange={aoAlterar}
          rows={8}
          placeholder="Texto completo. Separe os parágrafos com uma linha em branco."
          className={`${ESTILO_CAMPO} text-lg`}
        />

        <label htmlFor={campoId("tipoEstudo")}>Tipo de estudo</label>
        <input
          type="text"
          id={campoId("tipoEstudo")}
          name="tipoEstudo"
          value={valores.tipoEstudo}
          onChange={aoAlterar}
          placeholder="Ex: Rev. sistemática"
          className={ESTILO_CAMPO}
        />

        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor={campoId("ano")}>Ano</label>
            <input
              type="number"
              id={campoId("ano")}
              name="ano"
              value={valores.ano}
              onChange={aoAlterar}
              min="1900"
              max={new Date().getFullYear()}
              placeholder="Ex: 2024"
              className={ESTILO_CAMPO}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor={campoId("minutosLeitura")}>Minutos de leitura</label>
            <input
              type="number"
              id={campoId("minutosLeitura")}
              name="minutosLeitura"
              value={valores.minutosLeitura}
              onChange={aoAlterar}
              min="1"
              placeholder="Ex: 10"
              className={ESTILO_CAMPO}
            />
          </div>
        </div>
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

export default ArtigoForm;
