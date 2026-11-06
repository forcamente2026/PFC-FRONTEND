import api from "./api";
import { lerSessao } from "../utils/sessao";
import { exigirVagaParaCriar } from "../utils/limiteCriacao";

export async function listarArtigos() {
  const { data } = await api.get("/artigos");
  return data;
}

export async function buscarArtigoPorId(id) {
  const { data } = await api.get(`/artigos/${id}`);
  return data;
}

export async function listarCategorias() {
  const { data } = await api.get("/artigos/categorias");
  return data;
}

export async function criarArtigo(dados) {
  const usuario = lerSessao();
  if (usuario?.papel === "PROFESSOR") {
    exigirVagaParaCriar(await listarArtigos(), usuario);
  }
  const { data } = await api.post("/artigos", dados);
  return data;
}

export async function editarArtigo(id, dados) {
  const { data } = await api.put(`/artigos/${id}`, dados);
  return data;
}

export async function excluirArtigo(id) {
  await api.delete(`/artigos/${id}`);
}

export async function aprovarArtigo(id) {
  const { data } = await api.post(`/artigos/${id}/aprovacoes`);
  return data;
}

export async function alterarStatusArtigo(id, status, motivo) {
  const { data } = await api.patch(`/artigos/${id}/status`, { status, motivo });
  return data;
}

export async function listarArtigosPendentes() {
  const { data } = await api.get("/artigos/pendentes");
  return data;
}
