const ESTILO_CABECALHO = "py-2 pr-4 font-semibold text-red-200 whitespace-nowrap";
const ESTILO_CELULA = "py-2 pr-4 text-gray-300 align-top";

function formatarMomento(valor) {
  if (!valor) return "--";

  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return "--";

  return data.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function TabelaAuditoria({ registros }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-3xl border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-gray-700">
            <th className={ESTILO_CABECALHO}>Quando</th>
            <th className={ESTILO_CABECALHO}>Ação</th>
            <th className={ESTILO_CABECALHO}>Usuário</th>
            <th className={ESTILO_CABECALHO}>Detalhe</th>
            <th className={ESTILO_CABECALHO}>Recurso</th>
            <th className={ESTILO_CABECALHO}>IP</th>
          </tr>
        </thead>
        <tbody>
          {registros.map((registro) => (
            <tr key={registro.id} className="border-b border-gray-700">
              <td className={`${ESTILO_CELULA} whitespace-nowrap`}>
                {formatarMomento(registro.quando)}
              </td>
              <td className={ESTILO_CELULA}>
                <span className="rounded-md bg-red-500 px-2 py-1 text-xs font-medium text-white">
                  {registro.acao?.descricao ?? registro.acao?.codigo}
                </span>
              </td>
              <td className={ESTILO_CELULA}>
                {registro.usuario ? (
                  <>
                    <span className="block text-white">
                      {registro.usuario.nomeCompleto}
                    </span>
                    <span className="block text-xs text-gray-400">
                      {registro.usuario.email}
                    </span>
                  </>
                ) : (
                  <span className="text-gray-500">não identificado</span>
                )}
              </td>
              <td className={ESTILO_CELULA}>{registro.detalhe}</td>
              <td className={`${ESTILO_CELULA} text-xs`}>
                {registro.recurso ?? "--"}
              </td>
              <td className={`${ESTILO_CELULA} text-xs whitespace-nowrap`}>
                {registro.enderecoIp ?? "--"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TabelaAuditoria;
