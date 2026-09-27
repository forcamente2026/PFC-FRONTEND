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