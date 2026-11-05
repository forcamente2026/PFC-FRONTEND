import api from "./api";
import { listarExerciciosPublicados } from "./exercicioService";

export async function listarNiveisAtividade() {
  const { data } = await api.get("/metricas/niveis-atividade");
  return data;
}

export async function listarSexos() {
  const { data } = await api.get("/metricas/sexos");
  return data;
}

export async function calcularGastoEnergetico(dados) {
  const { data } = await api.post("/metricas/gasto-energetico", dados);
  return data;
}

export async function calcularHidratacao(dados) {
  const { data } = await api.post("/metricas/hidratacao", dados);
  return data;
}

export async function listarExerciciosParaVolume() {
  return listarExerciciosPublicados();
}

export async function consultarConsumoAgua(dados) {
  const { data } = await api.post("/metricas/hidratacao/consumo/dia", dados);
  return data;
}

export async function registrarConsumoAgua(dados) {
  const { data } = await api.post("/metricas/hidratacao/consumo", dados);
  return data;
}

export async function calcularVolumeTreino(dados) {
  const { data } = await api.post("/metricas/volume-treino", dados);
  return data;
}
