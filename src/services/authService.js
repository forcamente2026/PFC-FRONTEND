import api from "./api";
import { loginMock } from "./mocks/authMock";

const usarMock = import.meta.env.VITE_AUTH_MOCK === "true";

export async function login(email, senha) {
    if (usarMock) return loginMock(email, senha);

    const { data } = await api.post("/auth/login", { email,senha });
    return data;
}
