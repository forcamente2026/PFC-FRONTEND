const CHAVE = "forcamente:consumo-agua";

export function dataDeHoje() {
  const agora = new Date();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");
  return `${agora.getFullYear()}-${mes}-${dia}`;
}

export function lerCacheConsumo(data) {
  try {
    const bruto = localStorage.getItem(CHAVE);
    if (!bruto) return null;

    const cache = JSON.parse(bruto);
    return cache.data === data ? cache.resumo : null;
  } catch {
    return null;
  }
}

export function gravarCacheConsumo(data, resumo) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify({ data, resumo }));
    return true;
  } catch {
    return false;
  }
}
