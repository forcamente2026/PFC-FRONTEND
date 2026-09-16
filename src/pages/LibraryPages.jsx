import { useEffect, useState } from "react";
import FilterLibrary from "../components/LibraryComponents/FilterLibrary";
import CardsLibrary from "../components/LibraryComponents/CardsLibrary";
import LibraryHead from "../components/LibraryComponents/LibraryHead";
import {
  listarExercicios,
  listarGruposMusculares,
  listarNiveis,
} from "../services/exercicioService";

function LibraryPages() {
  const [grupoSelecionado, setGrupoSelecionado] = useState("");
  const [exercicios, setExercicios] = useState([]);
  const [gruposMusculares, setGruposMusculares] = useState([]);
  const [niveis, setNiveis] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let ativo = true;

    Promise.all([listarExercicios(), listarGruposMusculares(), listarNiveis()])
      .then(([lista, grupos, niveisResposta]) => {
        if (!ativo) return;
        if (
          !Array.isArray(lista) ||
          !Array.isArray(grupos) ||
          !Array.isArray(niveisResposta)
        ) {
          throw new Error("Resposta inesperada do servidor.");
        }
        setExercicios(lista);
        setGruposMusculares(grupos);
        setNiveis(niveisResposta);
      })
      .catch((err) => {
        if (!ativo) return;
        setErro(err.mensagem || "Não foi possível carregar os exercícios.");
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  async function recarregarLista() {
    try {
      const lista = await listarExercicios();
      if (Array.isArray(lista)) setExercicios(lista);
    } catch (err) {
      setErro(err.mensagem || "Não foi possível atualizar a lista.");
    }
  }

  function adicionarExercicio(novo) {
    if (!novo?.id) {
      recarregarLista();
      return;
    }
    setExercicios((prev) => [...prev, novo]);
  }

  function substituirExercicio(atualizado) {
    setExercicios((prev) =>
      prev.map((item) => (item.id === atualizado.id ? atualizado : item)),
    );
  }

  function removerExercicio(id) {
    setExercicios((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <div>
      <LibraryHead
        gruposMusculares={gruposMusculares}
        niveis={niveis}
        carregandoOpcoes={carregando}
        aoCriar={adicionarExercicio}
      />
      <FilterLibrary
        grupoSelecionado={grupoSelecionado}
        aoSelecionar={setGrupoSelecionado}
      />
      <CardsLibrary
        exercicios={exercicios}
        gruposMusculares={gruposMusculares}
        niveis={niveis}
        carregando={carregando}
        erro={erro}
        grupoSelecionado={grupoSelecionado}
        aoAtualizar={substituirExercicio}
        aoExcluir={removerExercicio}
      />
    </div>
  );
}

export default LibraryPages;
