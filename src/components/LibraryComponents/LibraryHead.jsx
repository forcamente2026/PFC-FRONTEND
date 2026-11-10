import { useState } from "react";
import Modal from "../Modal";
import ExercicioForm from "./ExercicioForm";
import { EXERCICIO_VAZIO, exercicioParaEnvio, validarExercicio } from "./exercicioCampos";
import { criarExercicio } from "../../services/exercicioService";
import CabecalhoPagina from "../CabecalhoPagina";
import { ICONES_DAS_PAGINAS } from "../../utils/iconesDasPaginas";
import { subtituloPorPapel } from "../../utils/subtitulosDasPaginas";

function LibraryHead({ gruposMusculares, niveis, carregandoOpcoes, criacaoBloqueada = false, aoCriar, aoConferirLimite, podeEditar, papel }) {
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
      const novo = await criarExercicio(exercicioParaEnvio(form));
      aoCriar(novo);
      fecharModal();
    } catch (err) {
      if (err.itensDoLimite) aoConferirLimite?.(err.itensDoLimite);
      setErro(err.mensagem || "Não foi possível cadastrar o exercício.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <CabecalhoPagina
        titulo="Biblioteca de exercícios"
        subtitulo={subtituloPorPapel("biblioteca", papel)}
        icone={ICONES_DAS_PAGINAS.biblioteca}
      >
        {podeEditar && (
          <div className="gap-2 flex px-2 py-3 font-bold">
            <button
              onClick={() => setOpenModaL(true)}
              disabled={carregandoOpcoes || criacaoBloqueada}
              className=" bg-red-500 text-red-200 rounded-md cursor-pointer hover:bg-red-900 hover:text-white p-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {" "}
              Adicionar exercicio
            </button>
            <Modal isOpen={openModal} setCloseModal={fecharModal} largo>
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
        )}
      </CabecalhoPagina>
    </div>
  );
}

export default LibraryHead;
