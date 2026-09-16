import { useEffect, useMemo, useState } from "react";
import CardExercicio from "./CardExercicio";
import CarrosselCards from "./CarrosselCards";
import Modal from "../Modal";
import ExercicioForm from "./ExercicioForm";
import {
  EXERCICIO_VAZIO,
  exercicioParaFormulario,
  validarExercicio,
} from "./exercicioCampos";
import {
  atualizarExercicio,
  excluirExercicio,
} from "../../services/exercicioService";

function montarDicionario(lista) {
  return Object.fromEntries(lista.map((item) => [item.codigo, item.descricao]));
}

function Mensagem({ children, variante }) {
  const estilo =
    variante === "erro"
      ? "rounded-md border border-red-500 p-3 text-red-200"
      : "text-gray-300";

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <p className={`text-center ${estilo}`}>{children}</p>
    </div>
  );
}

function CardsLibrary({
  exercicios,
  gruposMusculares,
  niveis,
  carregando,
  erro,
  grupoSelecionado,
  aoAtualizar,
  aoExcluir,
}) {
  const [menuAbertoId, setMenuAbertoId] = useState(null);
  const [exercicioEmEdicao, setExercicioEmEdicao] = useState(null);
  const [exercicioParaExcluir, setExercicioParaExcluir] = useState(null);
  const [form, setForm] = useState(EXERCICIO_VAZIO);
  const [enviando, setEnviando] = useState(false);
  const [erroAcao, setErroAcao] = useState(null);

  const rotulosGrupos = useMemo(
    () => montarDicionario(gruposMusculares),
    [gruposMusculares],
  );
  const rotulosNiveis = useMemo(() => montarDicionario(niveis), [niveis]);

  useEffect(() => {
    if (menuAbertoId === null) return;

    function fechar() {
      setMenuAbertoId(null);
    }

    function aoTeclar(evento) {
      if (evento.key === "Escape") setMenuAbertoId(null);
    }

    document.addEventListener("mousedown", fechar);
    document.addEventListener("keydown", aoTeclar);

    return () => {
      document.removeEventListener("mousedown", fechar);
      document.removeEventListener("keydown", aoTeclar);
    };
  }, [menuAbertoId]);

  function abrirEdicao(exercicio) {
    setMenuAbertoId(null);
    setErroAcao(null);
    setExercicioEmEdicao(exercicio);
    setForm(exercicioParaFormulario(exercicio));
  }

  function fecharEdicao() {
    setExercicioEmEdicao(null);
    setForm(EXERCICIO_VAZIO);
    setErroAcao(null);
  }

  function abrirExclusao(exercicio) {
    setMenuAbertoId(null);
    setErroAcao(null);
    setExercicioParaExcluir(exercicio);
  }

  function fecharExclusao() {
    setExercicioParaExcluir(null);
    setErroAcao(null);
  }

  function handleChange(evento) {
    const { name, value } = evento.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function salvarEdicao(evento) {
    evento.preventDefault();

    const mensagemInvalida = validarExercicio(form);
    if (mensagemInvalida) {
      setErroAcao(mensagemInvalida);
      return;
    }

    setEnviando(true);
    setErroAcao(null);

    try {
      const resposta = await atualizarExercicio(exercicioEmEdicao.id, form);
      aoAtualizar(resposta?.id ? resposta : { ...exercicioEmEdicao, ...form });
      fecharEdicao();
      alert("Alterado com sucesso!")
    } catch (err) {
      setErroAcao(err.mensagem || "Não foi possível salvar as alterações.");
    } finally {
      setEnviando(false);
    }
  }

  async function confirmarExclusao() {
    setEnviando(true);
    setErroAcao(null);

    try {
      await excluirExercicio(exercicioParaExcluir.id);
      aoExcluir(exercicioParaExcluir.id);
      fecharExclusao();
    } catch (err) {
      setErroAcao(err.mensagem || "Não foi possível excluir o exercício.");
    } finally {
      setEnviando(false);
    }
  }

  if (carregando) return <Mensagem>Carregando exercícios...</Mensagem>;

  if (erro) return <Mensagem variante="erro">{erro}</Mensagem>;

  if (!exercicios.length) {
    return <Mensagem>Nenhum exercício cadastrado ainda.</Mensagem>;
  }

  const exerciciosVisiveis = grupoSelecionado
    ? exercicios.filter((item) => item.grupoMuscular === grupoSelecionado)
    : exercicios;

  if (!exerciciosVisiveis.length) {
    return <Mensagem>Nenhum exercício neste grupo muscular.</Mensagem>;
  }

  return (
    <>
      <CarrosselCards>
        {exerciciosVisiveis.map((item) => (
          <CardExercicio
            key={item.id}
            exercicio={item}
            rotuloGrupo={rotulosGrupos[item.grupoMuscular] ?? item.grupoMuscular}
            rotuloNivel={rotulosNiveis[item.nivel] ?? item.nivel}
            menuAberto={menuAbertoId === item.id}
            aoAlternarMenu={() =>
              setMenuAbertoId((atual) => (atual === item.id ? null : item.id))
            }
            aoEditar={() => abrirEdicao(item)}
            aoExcluir={() => abrirExclusao(item)}
          />
        ))}
      </CarrosselCards>

      <Modal
        isOpen={Boolean(exercicioEmEdicao)}
        setCloseModal={fecharEdicao}
      >
        <ExercicioForm
          titulo="EDITAR EXERCICIO"
          valores={form}
          aoAlterar={handleChange}
          aoEnviar={salvarEdicao}
          gruposMusculares={gruposMusculares}
          niveis={niveis}
          carregandoOpcoes={false}
          grupoMuscularBloqueado
          enviando={enviando}
          erro={erroAcao}
          textoBotao="Salvar alterações"
          textoBotaoEnviando="Salvando..."
        />
      </Modal>

      <Modal
        isOpen={Boolean(exercicioParaExcluir)}
        setCloseModal={fecharExclusao}
      >
        <div className="p-4 max-w-md space-y-4">
          <h1 className="text-red-200 text-center font-montserrat text-2xl">
            EXCLUIR EXERCICIO
          </h1>
          <div className="w-full h-px bg-gray-300"></div>

          <p className="text-white">
            Tem certeza que deseja excluir{" "}
            <span className="text-red-200">{exercicioParaExcluir?.nome}</span>?
            Esta ação não pode ser desfeita.
          </p>

          {erroAcao && (
            <p className="text-red-500 text-sm text-center">{erroAcao}</p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={fecharExclusao}
              disabled={enviando}
              className="flex-1 rounded-md border border-gray-700 py-2 text-red-200 hover:bg-white/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={confirmarExclusao}
              disabled={enviando}
              className="flex-1 rounded-md bg-red-500 py-2 text-white hover:bg-red-900 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {enviando ? "Excluindo..." : "Excluir"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default CardsLibrary;
