import Cartao from "../ComponentesHome/Cartao";
import EstadoRequisicao from "../progress/EstadoRequisicao";

const ESTILO_CELULA = "border-b border-gray-700 py-1 pr-3 align-top";

function CartaoGrafico({
  titulo,
  descricao,
  simulado = false,
  carregando,
  erro,
  dados,
  mensagemVazio,
  colunas,
  sufixo = "",
  largo = false,
  children,
}) {
  const temDetalhe = dados.some((item) => item.detalhe);

  return (
    <Cartao className={`flex min-w-0 flex-col gap-4 ${largo ? "md:col-span-2" : ""}`}>
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-montserrat text-lg text-white">{titulo}</h3>
          {simulado && (
            <span className="rounded-md border border-yellow-500 bg-yellow-500/15 px-2 py-1 text-xs font-medium text-yellow-200">
              Dados de exemplo
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-gray-400">{descricao}</p>
      </div>

      <EstadoRequisicao
        carregando={carregando}
        mensagemCarregando="Carregando o gráfico..."
        erro={erro}
        vazio={dados.length === 0}
        mensagemVazio={mensagemVazio}
      >
        {children}

        <details className="text-sm text-gray-400">
          <summary className="cursor-pointer hover:text-white">Ver em tabela</summary>
          <table className="mt-2 w-full text-left text-gray-300">
            <thead>
              <tr>
                <th className={`${ESTILO_CELULA} font-semibold`}>{colunas[0]}</th>
                <th className={`${ESTILO_CELULA} font-semibold`}>{colunas[1]}</th>
                {temDetalhe && <th className={`${ESTILO_CELULA} font-semibold`}>{colunas[2]}</th>}
              </tr>
            </thead>
            <tbody>
              {dados.map((item, indice) => (
                <tr key={`${item.rotulo}-${indice}`}>
                  <td className={`${ESTILO_CELULA} wrap-anywhere`}>{item.rotulo}</td>
                  <td className={ESTILO_CELULA}>
                    {item.valor}
                    {sufixo}
                  </td>
                  {temDetalhe && <td className={`${ESTILO_CELULA} wrap-anywhere`}>{item.detalhe}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </EstadoRequisicao>
    </Cartao>
  );
}

export default CartaoGrafico;
