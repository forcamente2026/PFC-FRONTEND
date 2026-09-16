import { useState } from "react";
import Modal from "../Modal";
import ExercicioForm from "./ExercicioForm";
import { EXERCICIO_VAZIO, validarExercicio } from "./exercicioCampos";
import { criarExercicio } from "../../services/exercicioService";

function LibraryHead({ gruposMusculares, niveis, carregandoOpcoes, aoCriar }) {
  const [openModal, setOpenModaL] = useState(false);
  const [form, setForm] = useState(EXERCICIO_VAZIO);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  function fecharModal() {
    setOpenModaL(false);
    setForm(EXERCICIO_VAZIO);
    setErro(null);
  }

  function handleChange(evento) {
    const { name, value } = evento.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(evento) {
    evento.preventDefault();

    const mensagemInvalida = validarExercicio(form);
    if (mensagemInvalida) {
      setErro(mensagemInvalida);
      return;
    }

    setEnviando(true);
    setErro(null);

    try {
      const novo = await criarExercicio(form);
      aoCriar(novo);
      fecharModal();
      alert("Exercício cadastrado com sucesso!");
    } catch (err) {
      setErro(err.mensagem || "Não foi possível cadastrar o exercício.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="py-4 flex justify-center gap-3">
      <div className="w-px h-8 bg-red-500 mx-6"></div>
      <div>
        <h1 className="font-bold text-4xl text-white">
          BIBLIOTECA DE EXERCÍCIOS
        </h1>
        <p className="font-bold text-red-200">
          Aprenda a executar cada exercício com técnica, consciência e
          segurança.
        </p>
      </div>

      <div className="gap-2 flex px-2 py-3 font-bold">
        <button
          onClick={() => setOpenModaL(true)}
          className=" bg-red-500 text-red-200 rounded-md cursor-pointer hover:bg-red-900 hover:text-white p-2"
        >
          {" "}
          Adicionar exercicio
        </button>
        <Modal isOpen={openModal} setCloseModal={fecharModal}>
          <ExercicioForm
            titulo="CRIAR EXERCICIO"
            valores={form}
            aoAlterar={handleChange}
            aoEnviar={handleSubmit}
            gruposMusculares={gruposMusculares}
            niveis={niveis}
            carregandoOpcoes={carregandoOpcoes}
            enviando={enviando}
            erro={erro}
            textoBotao="Cadastrar"
            textoBotaoEnviando="Cadastrando..."
          />
        </Modal>
      </div>
    </div>
  );
}

export default LibraryHead;
