import { useState } from "react";
import Modal from "../Modal";
import ArtigoForm from "./ArtigoForm";
import { validarArtigo } from "./artigoCampos";
import { editarArtigo } from "../../services/artigoService";

function valoresDoArtigo(artigo) {
  return {
    titulo: artigo.titulo,
    categoria: artigo.categoria.codigo,
    resumo: artigo.resumo,
    fonte: artigo.fonte,
    autoria: artigo.autoria ?? "",
    tipoEstudo: artigo.tipoEstudo,
    ano: String(artigo.ano),
    minutosLeitura: String(artigo.minutosLeitura),
  };
}

function EditarArtigo({ artigo, categorias, carregandoOpcoes, usuario, aoEditar }) {
  const [modalAberto, setModalAberto] = useState(false);
  const [form, setForm] = useState(() => valoresDoArtigo(artigo));
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  function abrirModal() {
    setForm(valoresDoArtigo(artigo));
    setErro(null);
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setErro(null);
  }

  function handleChange(evento) {
    const { name, value } = evento.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(evento) {
    evento.preventDefault();

    const mensagemInvalida = validarArtigo(form);
    if (mensagemInvalida) {
      setErro(mensagemInvalida);
      return;
    }

    setEnviando(true);
    setErro(null);

    try {
      const atualizado = await editarArtigo(artigo.id, form, usuario);
      aoEditar(atualizado);
      fecharModal();
      alert(
        atualizado.status === "PENDENTE"
          ? "Artigo atualizado! Ele aparece no site depois de aprovado."
          : "Artigo atualizado!",
      );
    } catch (err) {
      setErro(err.mensagem || "Não foi possível salvar o artigo.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={abrirModal}
        className="rounded-md border border-gray-700 py-2 px-4 font-bold text-red-200 hover:bg-white/10 cursor-pointer"
      >
        Editar
      </button>

      <Modal isOpen={modalAberto} setCloseModal={fecharModal}>
        <ArtigoForm
          titulo="EDITAR ARTIGO"
          valores={form}
          aoAlterar={handleChange}
          aoEnviar={handleSubmit}
          categorias={categorias}
          carregandoOpcoes={carregandoOpcoes}
          enviando={enviando}
          erro={erro}
          textoBotao="Salvar alterações"
          textoBotaoEnviando="Salvando..."
        />
      </Modal>
    </>
  );
}

export default EditarArtigo;