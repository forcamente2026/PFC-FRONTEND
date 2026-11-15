import { useEffect, useState } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import FilterLibrary from "../components/LibraryComponents/FilterLibrary";
import CardsLibrary from "../components/LibraryComponents/CardsLibrary";
import LibraryHead from "../components/LibraryComponents/LibraryHead";
import AvisoDeSimulacao from "../components/LibraryComponents/AvisoDeSimulacao";
import LimiteDeCriacao from "../components/LimiteDeCriacao";
import FiltroParaAprovar from "../components/FiltroParaAprovar";
import {
  listarExercicios,
  listarGruposMusculares,
  listarNiveis,
  MODERACAO_DE_EXERCICIOS_SIMULADA,
} from "../services/exercicioService";
import { PAPEIS_EDITORES } from "../utils/papeis";
import { limiteDeCriacao } from "../utils/limiteCriacao";

function avisoAoCriar(exercicio) {
  if (exercicio?.status === "PENDENTE") {
    return {
      tipo: "sucesso",
      titulo: "Exercício enviado",
      mensagem: `"${exercicio.nome}" aparece no site depois de aprovado.`,
    };
  }
  return {
    tipo: "sucesso",
    titulo: "Exercício cadastrado",
    mensagem: "O exercício já aparece na biblioteca.",
  };
}

function avisoAoAlterar(exercicio) {
  if (exercicio.status === "PENDENTE") {
    return {
      tipo: "sucesso",
      titulo: "Exercício alterado",
      mensagem: "As alterações foram salvas. O exercício aparece no site depois de aprovado.",
    };
  }
  return {
    tipo: "sucesso",
    titulo: "Exercício alterado",
    mensagem: `"${exercicio.nome}" foi salvo com as alterações.`,
  };
}

function LibraryPages() {
  const [grupoSelecionado, setGrupoSelecionado] = useState("");
  const [soParaAprovar, setSoParaAprovar] = useState(false);
  const [exercicios, setExercicios] = useState([]);
  const [gruposMusculares, setGruposMusculares] = useState([]);
  const [niveis, setNiveis] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const { usuario, avisar } = useOutletContext();
  const [parametros, setParametros] = useSearchParams();
  const exercicioNoEndereco = parametros.get("exercicio");
  const podeEditar = PAPEIS_EDITORES.includes(usuario?.papel);

  function limparExercicioDoEndereco() {
    if (exercicioNoEndereco) setParametros({}, { replace: true });
  }

  const criacaoBloqueada = MODERACAO_DE_EXERCICIOS_SIMULADA && limiteDeCriacao(exercicios, usuario).bloqueado;

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
    avisar(avisoAoCriar(novo));
    if (!novo?.id) {
      recarregarLista();
      return;
    }
    setExercicios((prev) => [...prev, novo]);
  }

  function trocarNaLista(atualizado) {
    setExercicios((prev) =>
      prev.map((item) => (item.id === atualizado.id ? atualizado : item)),
    );
  }

  function substituirExercicio(atualizado) {
    trocarNaLista(atualizado);
    avisar(avisoAoAlterar(atualizado));
  }

  function registrarAprovacao(atualizado) {
    trocarNaLista(atualizado);
    avisar({
      tipo: "sucesso",
      titulo: "Aprovação registrada",
      mensagem:
        atualizado.status === "APROVADO_PELOS_PROFESSORES"
          ? "Com a sua aprovação, o exercício entrou no site."
          : `O exercício tem agora ${atualizado.aprovacoesDeProfessores} de ${atualizado.aprovacoesNecessarias} aprovações.`,
    });
  }

  function registrarDecisao(atualizado) {
    trocarNaLista(atualizado);
    avisar({
      tipo: "sucesso",
      titulo: atualizado.status === "APROVADO" ? "Exercício aprovado" : "Exercício rejeitado",
      mensagem:
        atualizado.status === "APROVADO"
          ? `"${atualizado.nome}" está publicado no site.`
          : `"${atualizado.nome}" foi rejeitado, e o autor vê o motivo.`,
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
        carregandoOpcoes={carregando || Boolean(erro)}
        criacaoBloqueada={criacaoBloqueada}
        aoCriar={adicionarExercicio}
        aoConferirLimite={setExercicios}
        podeEditar={podeEditar}
        papel={usuario?.papel}
      />
      {MODERACAO_DE_EXERCICIOS_SIMULADA && !carregando && !erro && (
        <div className="px-4">
          <LimiteDeCriacao itens={exercicios} usuario={usuario} tipo="exercícios" />
        </div>
      )}
      {MODERACAO_DE_EXERCICIOS_SIMULADA && (
        <div className="mb-4 px-4">
          <AvisoDeSimulacao />
        </div>
      )}
      {usuario?.papel === "PROFESSOR" && (
        <FiltroParaAprovar
          ativo={soParaAprovar}
          aoAlternar={setSoParaAprovar}
          quantidade={exercicios.filter((item) => item.podeAprovar).length}
        />
      )}

      <FilterLibrary
        grupoSelecionado={grupoSelecionado}
        aoSelecionar={setGrupoSelecionado}
      />
      <CardsLibrary
        soParaAprovar={soParaAprovar}
        idParaAbrir={exercicioNoEndereco}
        aoFecharDetalhe={limparExercicioDoEndereco}
        exercicios={exercicios}
        gruposMusculares={gruposMusculares}
        niveis={niveis}
        carregando={carregando}
        erro={erro}
        grupoSelecionado={grupoSelecionado}
        aoAtualizar={substituirExercicio}
        aoExcluir={removerExercicio}
        aoAprovar={registrarAprovacao}
        aoDecidir={registrarDecisao}
        podeEditar={podeEditar}
      />
    </div>
  );
}

export default LibraryPages;
