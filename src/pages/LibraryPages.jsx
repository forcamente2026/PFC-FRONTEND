import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import FilterLibrary from "../components/LibraryComponents/FilterLibrary";
import CardsLibrary from "../components/LibraryComponents/CardsLibrary";
import LibraryHead from "../components/LibraryComponents/LibraryHead";
import {
  listarExercicios,
  listarGruposMusculares,
  listarNiveis,
} from "../services/exercicioService";
import { PAPEIS_EDITORES } from "../utils/papeis";

function LibraryPages() {
  const [grupoSelecionado, setGrupoSelecionado] = useState("");
  const [exercicios, setExercicios] = useState([]);
  const [gruposMusculares, setGruposMusculares] = useState([]);
  const [niveis, setNiveis] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const { usuario, avisar } = useOutletContext();
  const podeEditar = PAPEIS_EDITORES.includes(usuario?.papel);

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
    avisar({
      tipo: "sucesso",
      titulo: "Exercício cadastrado",
      mensagem: "O exercício já aparece na biblioteca.",
    });
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
    avisar({
      tipo: "sucesso",
      titulo: "Exercício alterado",
      mensagem: `"${atualizado.nome}" foi salvo com as alterações.`,
    });
  }

  function removerExercicio(id) {
    const nome = exercicios.find((item) => item.id === id)?.nome;
    setExercicios((prev) => prev.filter((item) => item.id !== id));
    avisar({
      tipo: "sucesso",
      titulo: "Exercício excluído",
      mensagem: nome ? `"${nome}" foi excluído da biblioteca.` : "O exercício foi excluído da biblioteca.",
    });
  }

  return (
    <div>
      <LibraryHead
        gruposMusculares={gruposMusculares}
        niveis={niveis}
        carregandoOpcoes={carregando}
        aoCriar={adicionarExercicio}
        podeEditar={podeEditar}
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
        podeEditar={podeEditar}
      />
    </div>
  );
}

export default LibraryPages;
