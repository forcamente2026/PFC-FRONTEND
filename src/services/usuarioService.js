import api from "./api";

export async function criarUsuario(usuario) {
    const { data } = await api.post("/usuarios",usuario);
    return data;
}
