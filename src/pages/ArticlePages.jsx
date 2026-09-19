import { useEffect, useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import Cartao from "../components/ComponentesHome/Cartao";
import EstadoRequisicao from "../components/progress/EstadoRequisicao";
import ValidacaoArtigo from "../components/ArticlesComponents/ValidacaoArtigo";
import { STATUS_ARTIGO } from "../components/ArticlesComponents/artigoCampos";
import { buscarArtigoPorId } from "../services/artigoService";
import { podeValidar } from "../utils/papeis";

function ArticlePages() {
  const { id } = useParams();
  const { usuario } = useOutletContext();
  const [artigo, setArtigo] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let ativo = true;

    buscarArtigoPorId(id, usuario?.papel)
      .then((dados) => {
        if (!ativo) return;
        setArtigo(dados);
        setErro(null);
      })
      .catch((err) => {
        if (!ativo) return;
        setArtigo(null);
        setErro(err.mensagem || "Não foi possível carregar o artigo.");
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [id, usuario?.papel]);

  const paragrafos = artigo ? artigo.conteudo.split("\n\n") : [];
  const etiquetaStatus = artigo ? STATUS_ARTIGO[artigo.status]?.etiqueta : null;
  const mostrarValidacao = Boolean(artigo) && podeValidar(usuario);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-10 lp:py-16">
      <Link
        to="/articles"
        className="text-sm text-red-200 hover:text-white hover:underline"
      >
        ← Voltar para os artigos
      </Link>

      <div className="mt-6">
        <EstadoRequisicao
          carregando={carregando}
          mensagemCarregando="Carregando artigo..."
          erro={erro}
          vazio={!artigo}
          mensagemVazio="Artigo não encontrado."
        >
          {artigo && (
            <Cartao className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-red-500 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-red-400">
                  {artigo.categoria.descricao}
                </span>
                {etiquetaStatus && (
                  <span className="rounded-md bg-gray-700 px-2 py-1 text-xs font-medium text-gray-200">
                    {etiquetaStatus}
                  </span>
                )}
              </div>

              <h1 className="font-montserrat text-3xl text-white md:text-4xl">
                {artigo.titulo}
              </h1>

              <p className="text-sm text-gray-400">
                por{" "}
                <span className="font-semibold text-red-200">
                  {artigo.autor.nomeCompleto}
                </span>
              </p>

              <div className="flex justify-between text-xs uppercase tracking-[0.2em] text-gray-400">
                <span>
                  {artigo.tipoEstudo} · {artigo.ano}
                </span>
                <span>{artigo.minutosLeitura} min</span>
              </div>

              <div className="h-px bg-gray-700"></div>

              <p className="text-lg leading-relaxed text-gray-300">{artigo.resumo}</p>

              {paragrafos.map((paragrafo, indice) => (
                <p key={indice} className="text-base leading-relaxed text-gray-300">
                  {paragrafo}
                </p>
              ))}

              {mostrarValidacao && (
                <ValidacaoArtigo artigo={artigo} aoAlterarStatus={setArtigo} />
              )}
            </Cartao>
          )}
        </EstadoRequisicao>
      </div>
    </div>
  );
}

export default ArticlePages;
