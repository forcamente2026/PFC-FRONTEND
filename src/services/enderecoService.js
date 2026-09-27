import api from "./api";

export async function buscarEnderecoPorCep(cep) {
  const { data } = await api.get(`/enderecos/${cep}`);
  return data;
}
