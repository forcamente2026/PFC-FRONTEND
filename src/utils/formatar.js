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
