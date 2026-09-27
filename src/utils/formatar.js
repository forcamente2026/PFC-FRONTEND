const formatador = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 20,
});

export function formatarNumero(valor) {
  if (valor === null || valor === undefined || valor === "") return "--";

  const numero = Number(valor);
  if (Number.isNaN(numero)) return "--";

  return formatador.format(numero);
}

export function somenteDigitos(valor) {
  if (valor === null || valor === undefined) return "";
  return String(valor).replace(/\D/g, "");
}

export function formatarCep(valor) {
  const limpo = somenteDigitos(valor).slice(0, 8);
  if (limpo.length <= 5) return limpo;
  return `${limpo.slice(0, 5)}-${limpo.slice(5)}`;
}

export function formatarCref(valor) {
  const limpo = String(valor ?? "")
    .toUpperCase()
    .replace(/[^0-9A-Z]/g, "")
    .slice(0, 9);

  const numeros = limpo.slice(0, 6);
  const categoria = limpo.slice(6, 7);
  const uf = limpo.slice(7, 9);

  let saida = numeros;
  if (categoria) saida += `-${categoria}`;
  if (uf) saida += `/${uf}`;

  return saida;
}

export function formatarDataCurta(valor) {
  if (!valor) return "—";

  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return "—";

  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatarDataExtenso(valor) {
  if (!valor) return "";

  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return "";

  return data.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}