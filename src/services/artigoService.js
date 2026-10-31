import api from "./api";
import {
  categoriasMock,
  listarArtigosMock,
  buscarArtigoMock,
  criarArtigoMock,
  editarArtigoMock,
  excluirArtigoMock,
  aprovarArtigoMock,
  alterarStatusMock,
  listarPendentesMock,
} from "./mocks/artigosMock";

const usarMock = import.meta.env.VITE_ARTIGOS_MOCK === "true";

function responderMock(executar) {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      try {
        resolve(executar());
      } catch (falha) {
        reject(falha);
      }
    }, 400),
  );
}

export async function listarArtigos(usuario) {
  if (usarMock) return responderMock(() => listarArtigosMock(usuario));
  const { data } = await api.get("/artigos");
  return data;
}

export async function buscarArtigoPorId(id, usuario) {
  if (usarMock) return responderMock(() => buscarArtigoMock(id, usuario));
  const { data } = await api.get(`/artigos/${id}`);
  return data;
}

export async function listarCategorias() {
  if (usarMock) return responderMock(() => categoriasMock);
  const { data } = await api.get("/artigos/categorias");
  return data;
}

export async function criarArtigo(dados, usuario) {
  if (usarMock) return responderMock(() => criarArtigoMock(dados, usuario));
  const { data } = await api.post("/artigos", dados);
  return data;
}

export async function editarArtigo(id, dados, usuario) {
  if (usarMock) return responderMock(() => editarArtigoMock(id, dados, usuario));
  const { data } = await api.put(`/artigos/${id}`, dados);
  return data;
}

export async function excluirArtigo(id, usuario) {
  if (usarMock) return responderMock(() => excluirArtigoMock(id, usuario));
  await api.delete(`/artigos/${id}`);
}

export async function aprovarArtigo(id, usuario) {
  if (usarMock) return responderMock(() => aprovarArtigoMock(id, usuario));
  const { data } = await api.post(`/artigos/${id}/aprovacoes`);
  return data;
}

export async function alterarStatusArtigo(id, status, motivo, usuario) {
  if (usarMock) return responderMock(() => alterarStatusMock(id, status, motivo, usuario));
  const { data } = await api.patch(`/artigos/${id}/status`, { status, motivo });
  return data;
}

export async function listarArtigosPendentes(usuario) {
  if (usarMock) return responderMock(() => listarPendentesMock(usuario));
  const { data } = await api.get("/artigos/pendentes");
  return data;
}