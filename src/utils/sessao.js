const CHAVE_TOKEN = "token";
const CHAVE_USUARIO = "forcamente:usuario";

export function lerSessao() {
    try {
    const bruto = localStorage.getItem(CHAVE_USUARIO);
    if (!bruto) return null;
    return JSON.parse(bruto);
    } catch {
    return null;
    }
}

export function gravarSessao({ id, token, nomeCompleto, papel }) {
    try {
        localStorage.setItem(CHAVE_TOKEN, token);
        localStorage.setItem(CHAVE_USUARIO, JSON.stringify({ id, nomeCompleto, papel }));
        return true;
    } catch {
        return false;
    }
}

export function limparSessao() {
    localStorage.removeItem(CHAVE_TOKEN);
    localStorage.removeItem(CHAVE_USUARIO);
}