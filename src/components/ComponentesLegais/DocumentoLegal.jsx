import Cartao from "../ComponentesHome/Cartao";

const ESTILO_TITULO_SECAO = "font-montserrat text-2xl text-white lp:text-3xl";
const ESTILO_PARAGRAFO = "text-base leading-relaxed text-gray-300";
const ESTILO_DESTAQUE =
  "rounded-xl border border-red-500 bg-red-950/30 p-4 space-y-3 neon-suave-red-500";

function DocumentoLegal({ rotulo, titulo, versao, vigencia, secoes }) {
  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-500">
        {rotulo}
      </p>
      <h1 className="mt-1 font-montserrat text-3xl text-white md:text-4xl">
        {titulo}
      </h1>

      <p className="mt-3 mb-8 text-sm text-gray-400">
        Versão {versao} · em vigor desde {vigencia}
      </p>

      <Cartao className="space-y-8">
        {secoes.map((secao) => (
          <section key={secao.titulo} className="space-y-3">
            <h2 className={ESTILO_TITULO_SECAO}>{secao.titulo}</h2>

            <div className={secao.destaque ? ESTILO_DESTAQUE : "space-y-3"}>
              {secao.paragrafos?.map((paragrafo) => (
                <p key={paragrafo} className={ESTILO_PARAGRAFO}>
                  {paragrafo}
                </p>
              ))}

              {secao.lista && (
                <ul className={`list-disc space-y-1 pl-6 ${ESTILO_PARAGRAFO}`}>
                  {secao.lista.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}

              {secao.tabela && (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-xl border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        {secao.tabela.cabecalho.map((coluna) => (
                          <th
                            key={coluna}
                            className="py-2 pr-4 font-semibold text-red-200"
                          >
                            {coluna}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {secao.tabela.linhas.map((linha) => (
                        <tr key={linha[0]} className="border-b border-gray-700">
                          {linha.map((celula) => (
                            <td key={celula} className="py-2 pr-4 text-gray-300">
                              {celula}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {secao.nota && (
                <p className={`${ESTILO_PARAGRAFO} text-sm`}>{secao.nota}</p>
              )}
            </div>
          </section>
        ))}
      </Cartao>
    </>
  );
}

export default DocumentoLegal;
