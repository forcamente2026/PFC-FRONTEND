import { useState } from "react";
import Modal from "../Modal";
import ArtigoForm from "./ArtigoForm";
import { ARTIGO_VAZIO, artigoParaEnvio, validarArtigo } from "./artigoCampos";
import { criarArtigo } from "../../services/artigoService";

function NovoArtigo({ categorias, carregandoOpcoes, criacaoBloqueada = false, aoCriar, aoConferirLimite }) {
  const [modalAberto, setModalAberto] = useState(false);
  const [form, setForm] = useState(ARTIGO_VAZIO);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);
  const [camposComErro, setCamposComErro] = useState([]);

  function fecharModal() {
    setModalAberto(false);
    setForm(ARTIGO_VAZIO);
    setErro(null);
    setCamposComErro([]);
  }

  function handleChange(evento) {
    const { name, value } = evento.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(evento) {
    evento.preventDefault();
    setCamposComErro([]);

    const mensagemInvalida = validarArtigo(form);
    if (mensagemInvalida) {
      setErro(mensagemInvalida);
      return;
    }

    setEnviando(true);
    setErro(null);

    try {
      const novo = await criarArtigo(artigoParaEnvio(form));
      aoCriar(novo);
      fecharModal();
    } catch (err) {
      if (err.itensDoLimite) aoConferirLimite?.(err.itensDoLimite);
      setErro(err.mensagem || "Não foi possível enviar o artigo.");
      setCamposComErro(err.campos ?? []);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="mb-6 flex justify-end">
      <button
        type="button"
        onClick={() => setModalAberto(true)}
        disabled={carregandoOpcoes || criacaoBloqueada}
        className="bg-red-500 rounded-md py-2 px-4 font-bold text-white hover:bg-red-900 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Novo artigo
      </button>

      <Modal isOpen={modalAberto} setCloseModal={fecharModal}>
        <ArtigoForm
          titulo="NOVO ARTIGO"
          valores={form}
          aoAlterar={handleChange}
          aoEnviar={handleSubmit}
          categorias={categorias}
          carregandoOpcoes={carregandoOpcoes}
          enviando={enviando}
          camposComErro={camposComErro}
          erro={erro}
          textoBotao="Enviar artigo"
          textoBotaoEnviando="Enviando..."
        />
      </Modal>
    </div>
  );
}

export default NovoArtigo;
