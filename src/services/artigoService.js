import api from "./api";
import {
  artigosMock,
  categoriasMock,
  filtrarPorPapel,
  criarArtigoMock,
  alterarStatusMock,
} from "./mocks/artigosMock";

const usarMock = import.meta.env.VITE_ARTIGOS_MOCK === "true";

function responderMock(dados) {
    return new Promise((resolve) => setTimeout(() => resolve(dados),400));
}

export async function listarArtigos(papel) {
    if (usarMock) return responderMock(filtrarPorPapel(artigosMock, papel));
    const { data } = await api.get("/artigos");
    return data;
}

export async function buscarArtigoPorId(id, papel) {
    if (usarMock) {
        const artigo = filtrarPorPapel(artigosMock, papel).find((item) => item.id === id);
        if (!artigo) return Promise.reject({ status: 404, mensagem: "Artigo não encontrado."});
        return responderMock(artigo);
    }
    const { data } = await api.get(`/artigos/${id}`);
    return data;
}

export async function listarCategorias() {
    if (usarMock) return responderMock(categoriasMock);
    const { data } = await api.get("/artigos/categorias");
    return data;
}

// `usuario` existe só para o mock; o back real tira o autor do token.
export async function criarArtigo(dados, usuario) {
    if (usarMock) return responderMock(criarArtigoMock(dados, usuario));
    const { data } = await api.post("/artigos", dados);
    return data;
}

// Rodada C (administrador): status é "APROVADO" ou "REJEITADO".
export async function alterarStatusArtigo(id, status) {
    if (usarMock) {
        const artigo = alterarStatusMock(id, status);
        if (!artigo) return Promise.reject({ status: 404, mensagem: "Artigo não encontrado." });
        return responderMock(artigo);
    }
    const { data } = await api.patch(`/artigos/${id}/status`, { status });
    return data;
}
