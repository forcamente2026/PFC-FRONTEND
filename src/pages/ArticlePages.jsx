import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import Cartao from "../components/ComponentesHome/Cartao";
import EstadoRequisicao from "../components/progress/EstadoRequisicao";
import ValidacaoArtigo from "../components/ArticlesComponents/ValidacaoArtigo";
import EditarArtigo from "../components/ArticlesComponents/EditarArtigo";
import ExcluirArtigo from "../components/ArticlesComponents/ExcluirArtigo";
import AprovarArtigo from "../components/ArticlesComponents/AprovarArtigo";
import { etiquetaDoArtigo } from "../components/ArticlesComponents/artigoCampos";
import { buscarArtigoPorId, listarCategorias } from "../services/artigoService";
import { podeValidar } from "../utils/papeis";

function ArticlePages() {
  const { id } = useParams();
  const { usuario } = useOutletContext();
  const navigate = useNavigate();
  const [artigo, setArtigo] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let ativo = true;

    Promise.all([buscarArtigoPorId(id, usuario), listarCategorias()])
      .then(([dados, listaCategorias]) => {
        if (!ativo) return;
        setArtigo(dados);
        setCategorias(listaCategorias);
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
  }, [id, usuario]);

  
  const etiquetaStatus = artigo ? etiquetaDoArtigo(artigo) : null;
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

              {artigo.autoria ? (
                <div className="flex flex-col gap-1 text-sm text-gray-400">
                  <p>
                    Autoria:{" "}
                    <span className="font-semibold text-red-200">{artigo.autoria}</span>
                  </p>
                  <p>
                    Indicado por{" "}
                    <span className="font-semibold text-red-200">{artigo.autorNome}</span>
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-400">
                  por{" "}
                  <span className="font-semibold text-red-200">{artigo.autorNome}</span>
                </p>
              )}

              <div className="flex justify-between text-xs uppercase tracking-[0.2em] text-gray-400">
                <span>{artigo.tipoEstudo}</span>
                {artigo.ano && <span>Ano de publicação: {artigo.ano}</span>}
              </div>

              <div className="h-px bg-gray-700"></div>

              <p className="text-lg leading-relaxed text-gray-300">{artigo.resumo}</p>
              <a
                href={artigo.fonte}
                target="_blank"
                rel="noopener noreferrer"
                className="self-start inline-flex items-center gap-2 bg-red-500 rounded-md py-2 px-4 font-bold text-white hover:bg-red-900"
              >
                Ler o artigo completo
                <ExternalLink size={16} aria-hidden="true" />
                <span className="sr-only">(abre em nova aba)</span>
              </a>

              {artigo.motivoRejeicao && (
                <div className="rounded-xl border border-red-500 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-500">
                    Motivo da rejeição
                  </p>
                  <p className="mt-1 text-sm text-gray-300">{artigo.motivoRejeicao}</p>
                </div>
              )}

              
              {artigo.podeEditar && (
                <div className="flex flex-wrap gap-3">
                  <EditarArtigo
                    artigo={artigo}
                    categorias={categorias}
                    carregandoOpcoes={carregando}
                    usuario={usuario}
                    aoEditar={setArtigo}
                  />
                  <ExcluirArtigo
                    artigo={artigo}
                    usuario={usuario}
                    aoExcluir={() => navigate("/articles")}
                  />
                </div>
              )}

              {artigo.podeAprovar && (
                <AprovarArtigo artigo={artigo} usuario={usuario} aoAprovar={setArtigo} />
              )}

              {mostrarValidacao && (
                <ValidacaoArtigo artigo={artigo} usuario={usuario} aoAlterarStatus={setArtigo} />
              )}
            </Cartao>
          )}
        </EstadoRequisicao>
      </div>
    </div>
  );
}

export default ArticlePages;
