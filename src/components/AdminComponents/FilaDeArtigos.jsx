import { useEffect, useState } from "react";
import EstadoRequisicao from "../progress/EstadoRequisicao";
import ArtigoNaFila from "./ArtigoNaFila";
import { listarArtigosPendentes } from "../../services/artigoService";

const GRUPOS = [
  {
    status: "PENDENTE",
    titulo: "Pendentes",
    descricao:
      "Ainda não aparecem para o público. Esperam as aprovações dos professores ou a sua decisão.",
  },
  {
    status: "APROVADO_PELOS_PROFESSORES",
    titulo: "Já publicados pelos professores (revisar)",
    descricao:
      "Já aparecem no site. Aprovar confirma a publicação; rejeitar tira o artigo do ar.",
  },
];

function FilaDeArtigos({ usuario }) {
  const [artigos, setArtigos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [aviso, setAviso] = useState(null);

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

  function retirarDaFila(atualizado) {
    setArtigos((atuais) =>
      atuais.filter((artigo) => artigo.id !== atualizado.id),
    );
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
        <div className="flex flex-col gap-8">
          {GRUPOS.map((grupo) => {
            const doGrupo = artigos.filter((artigo) => artigo.status === grupo.status);
            if (doGrupo.length === 0) return null;

            return (
              <div key={grupo.status} className="flex flex-col gap-4">
                <div>
                  <h4 className="font-semibold text-white">
                    {grupo.titulo} ({doGrupo.length})
                  </h4>
                  <p className="text-xs text-gray-400">{grupo.descricao}</p>
                </div>
                {doGrupo.map((artigo) => (
                  <ArtigoNaFila
                    key={artigo.id}
                    artigo={artigo}
                    usuario={usuario}
                    aoAlterarStatus={retirarDaFila}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </EstadoRequisicao>
    </section>
  );
}

export default FilaDeArtigos;