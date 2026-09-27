import { formatarDataCurta } from "../../utils/formatar";
import { rotuloDoPapel } from "../../utils/papeis";

const ESTILO_CABECALHO = "py-2 pr-4 font-semibold text-red-200 whitespace-nowrap";
const ESTILO_CELULA = "py-2 pr-4 text-gray-300 align-top";
const ESTILO_ETIQUETA = "rounded-md px-2 py-1 text-xs font-medium whitespace-nowrap";

const ESTILO_ACAO =
  "rounded-md border border-gray-600 px-3 py-1 text-xs text-red-200 hover:bg-white/10 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";

function descricaoDaFormacao(codigo, formacoes) {
  if (!codigo) return null;
  return formacoes.find((opcao) => opcao.codigo === codigo)?.descricao ?? codigo;
}

function TabelaUsuarios({
  usuarios,
  formacoes,
  aoEditar,
  aoAlternarAtivo,
  idEmOperacao,
  idDoLogado,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-4xl border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-gray-700">
            <th className={ESTILO_CABECALHO}>Usuário</th>
            <th className={ESTILO_CABECALHO}>Perfil</th>
            <th className={ESTILO_CABECALHO}>Habilitação</th>
            <th className={ESTILO_CABECALHO}>Situação</th>
            <th className={ESTILO_CABECALHO}>Desde</th>
            <th className={ESTILO_CABECALHO}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => {
            const anonimizada = Boolean(usuario.anonimizadoEm);
            const ocupada = idEmOperacao === usuario.id;

            const ehAPropriaConta = usuario.id === idDoLogado;
            const naoPodeInativar = anonimizada || (ehAPropriaConta && usuario.ativo);

            return (
              <tr key={usuario.id} className="border-b border-gray-700">
                <td className={ESTILO_CELULA}>
                  <span className="block text-white">{usuario.nomeCompleto}</span>
                  <span className="block text-xs text-gray-400">{usuario.email}</span>
                </td>

                <td className={ESTILO_CELULA}>
                  <span className={`${ESTILO_ETIQUETA} bg-red-500 text-white`}>
                    {rotuloDoPapel(usuario.papel)}
                  </span>
                </td>

                <td className={ESTILO_CELULA}>
                  {usuario.cref ? (
                    <>
                      <span className="block text-white">{usuario.cref}</span>
                      <span className="block text-xs text-gray-400">
                        {descricaoDaFormacao(usuario.formacao, formacoes)}
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}
                </td>

                <td className={ESTILO_CELULA}>
                  <span
                    className={`${ESTILO_ETIQUETA} border ${
                      usuario.ativo
                        ? "border-green-600 bg-green-600/20 text-green-300"
                        : "border-gray-500 bg-gray-600/20 text-gray-300"
                    }`}
                  >
                    {usuario.ativo ? "Ativo" : "Inativo"}
                  </span>

                  {anonimizada && (
                    <span className="mt-1 block text-xs text-gray-500">
                      Anonimizada em {formatarDataCurta(usuario.anonimizadoEm)}
                    </span>
                  )}

                  {!anonimizada && usuario.anonimizacaoSolicitadaEm && (
                    <span className="mt-1 block text-xs text-red-300">
                      Exclusão pedida em{" "}
                      {formatarDataCurta(usuario.anonimizacaoSolicitadaEm)}
                    </span>
                  )}
                </td>

                <td className={`${ESTILO_CELULA} whitespace-nowrap`}>
                  {formatarDataCurta(usuario.criadoEm)}
                </td>

                <td className={ESTILO_CELULA}>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => aoEditar(usuario)}
                      disabled={anonimizada || ocupada}
                      className={ESTILO_ACAO}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => aoAlternarAtivo(usuario)}
                      disabled={naoPodeInativar || ocupada}
                      title={
                        ehAPropriaConta && usuario.ativo
                          ? "Você não pode inativar a própria conta"
                          : undefined
                      }
                      className={ESTILO_ACAO}
                    >
                      {ocupada ? "Salvando..." : usuario.ativo ? "Inativar" : "Reativar"}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TabelaUsuarios;
