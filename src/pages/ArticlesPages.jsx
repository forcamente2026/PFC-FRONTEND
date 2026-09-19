import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import CabecalhoSecao from "../components/ComponentesHome/CabecalhoSecao";
import EstadoRequisicao from "../components/progress/EstadoRequisicao";
import FilterArticles from "../components/ArticlesComponents/FilterArticles";
import CardArtigo from "../components/ArticlesComponents/CardArtigo";
import NovoArtigo from "../components/ArticlesComponents/NovoArtigo";
import { listarArtigos, listarCategorias } from "../services/artigoService";
import { PAPEIS_EDITORES } from "../utils/papeis";

function ArticlesPages() {
  const { usuario } = useOutletContext();
  const podeEditar = PAPEIS_EDITORES.includes(usuario?.papel);
  const [artigos, setArtigos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let ativo = true;

    Promise.all([listarArtigos(usuario?.papel), listarCategorias()])
      .then(([lista, listaCategorias]) => {
        if (!ativo) return;
        setArtigos(lista);
        setCategorias(listaCategorias);
      })
      .catch((err) => {
        if (!ativo) return;
        setErro(err.mensagem || "Não foi possível carregar os artigos.");
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [usuario?.papel]);

  function adicionarArtigo(novo) {
    setArtigos((prev) => [...prev, novo]);
  }

  const buscaNormalizada = busca.trim().toLowerCase();
  const artigosVisiveis = artigos.filter((artigo) => {
    const daCategoria =
      !categoriaSelecionada || artigo.categoria.codigo === categoriaSelecionada;
    const doTitulo =
      !buscaNormalizada || artigo.titulo.toLowerCase().includes(buscaNormalizada);
    return daCategoria && doTitulo;
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-10 lp:py-16">
      <CabecalhoSecao
        rotulo="Acervo"
        titulo="Artigos e revisões"
        descricao="Cada texto indica o desenho do estudo e o nível de confiança das conclusões apresentadas."
      />

      {podeEditar && (
        <NovoArtigo
          categorias={categorias}
          carregandoOpcoes={carregando}
          usuario={usuario}
          aoCriar={adicionarArtigo}
        />
      )}

      <FilterArticles
        categorias={categorias}
        categoriaSelecionada={categoriaSelecionada}
        aoSelecionar={setCategoriaSelecionada}
        busca={busca}
        aoBuscar={setBusca}
      />

      <EstadoRequisicao
        carregando={carregando}
        mensagemCarregando="Carregando artigos..."
        erro={erro}
        vazio={artigosVisiveis.length === 0}
        mensagemVazio="Nenhum artigo encontrado."
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {artigosVisiveis.map((artigo) => (
            <CardArtigo key={artigo.id} artigo={artigo} />
          ))}
        </div>
      </EstadoRequisicao>
    </div>
  );
}

export default ArticlesPages;
