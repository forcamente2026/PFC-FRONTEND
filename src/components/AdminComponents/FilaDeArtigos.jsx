import { Fragment, useEffect, useState } from "react";
import EstadoRequisicao from "../progress/EstadoRequisicao";
import ArtigoNaFila from "./ArtigoNaFila";
import { STATUS_ARTIGO } from "../ArticlesComponents/artigoCampos";
import { listarArtigosPendentes } from "../../services/artigoService";
import { formatarDataCurta } from "../../utils/formatar";

const ESTILO_CABECALHO = "py-2 pr-4 font-semibold text-red-200 whitespace-nowrap";
const ESTILO_CELULA = "py-2 pr-4 text-gray-300 align-top";
const ESTILO_ETIQUETA = "rounded-md border px-2 py-1 text-xs font-medium whitespace-nowrap";

const CORES_DA_SITUACAO = {
  PENDENTE: "border-yellow-500 bg-yellow-500/15 text-yellow-200",
  APROVADO_PELOS_PROFESSORES: "border-green-600 bg-green-600/20 text-green-300",
};

const ESTILO_VER =
  "rounded-md border border-gray-600 px-3 py-1 text-xs text-red-200 hover:bg-white/10 cursor-pointer whitespace-nowrap";

function situacaoDoArtigo(artigo) {
  const descricao = STATUS_ARTIGO[artigo.status]?.descricao ?? artigo.status;
  return `${descricao} · ${artigo.aprovacoesDeProfessores} de ${artigo.aprovacoesNecessarias}`;
}

function FilaDeArtigos({ usuario }) {
  const [artigos, setArtigos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [aviso, setAviso] = useState(null);
  const [idAberto, setIdAberto] = useState(null);

  useEffect(() => {
    let ativo = true;

    listarArtigosPendentes(usuario)
      .then((lista) => {
        if (!ativo) return;
        setArtigos(lista);
        setErro(null);
      })
      .catch((err) => {
        if (!ativo) return;
        setErro(err.mensagem || "Não foi possível carregar os artigos pendentes.");
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [usuario]);

  function alternar(id) {
    setIdAberto((atual) => (atual === id ? null : id));
  }

  function retirarDaFila(atualizado) {
    setArtigos((atuais) =>
      atuais.filter((artigo) => artigo.id !== atualizado.id),
    );
    setIdAberto(null);
    setAviso(
      atualizado.status === "APROVADO"
        ? `"${atualizado.titulo}" foi aprovado.`
        : `"${atualizado.titulo}" foi rejeitado.`,
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-semibold tracking-[0.25em] text-red-200 uppercase">
          Artigos para revisar
          {!carregando && !erro && ` (${artigos.length})`}
        </h3>
        <p className="mt-1 text-sm text-gray-400">
          Artigos que esperam a decisão do administrador.
        </p>
      </div>

      {aviso && (
        <p role="status" className="text-sm text-green-400">
          {aviso}
        </p>
      )}

      <EstadoRequisicao
        carregando={carregando}
        mensagemCarregando="Carregando artigos..."
        erro={erro}
        vazio={artigos.length === 0}
        mensagemVazio="Nenhum artigo aguardando revisão."
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className={ESTILO_CABECALHO}>Artigo</th>
                <th className={ESTILO_CABECALHO}>Situação</th>
                <th className={ESTILO_CABECALHO}>Enviado em</th>
                <th className={ESTILO_CABECALHO}>Ação</th>
              </tr>
            </thead>
            <tbody>
              {artigos.map((artigo) => {
                const aberto = artigo.id === idAberto;

                return (
                  <Fragment key={artigo.id}>
                    <tr className={aberto ? "" : "border-b border-gray-700"}>
                      <td className={ESTILO_CELULA}>
                        <span className="block text-white">{artigo.titulo}</span>
                        <span className="block text-xs text-gray-400">
                          por {artigo.autorNome}
                        </span>
                      </td>
                      <td className={ESTILO_CELULA}>
                        <span
                          className={`${ESTILO_ETIQUETA} ${
                            CORES_DA_SITUACAO[artigo.status] ??
                            "border-gray-600 text-gray-300"
                          }`}
                        >
                          {situacaoDoArtigo(artigo)}
                        </span>
                      </td>
                      <td className={`${ESTILO_CELULA} whitespace-nowrap`}>
                        {formatarDataCurta(artigo.criadoEm)}
                      </td>
                      <td className={ESTILO_CELULA}>
                        <button
                          type="button"
                          aria-expanded={aberto}
                          onClick={() => alternar(artigo.id)}
                          className={ESTILO_VER}
                        >
                          {aberto ? "Ver −" : "Ver +"}
                        </button>
                      </td>
                    </tr>
                    {aberto && (
                      <tr className="border-b border-gray-700">
                        <td colSpan={4} className="pr-4 pb-6">
                          <ArtigoNaFila
                            artigo={artigo}
                            usuario={usuario}
                            aoAlterarStatus={retirarDaFila}
                          />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </EstadoRequisicao>
    </section>
  );
}

export default FilaDeArtigos;