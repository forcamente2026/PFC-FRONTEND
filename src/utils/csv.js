// Separador ponto e virgula e BOM no inicio: e o que o Excel em portugues
// espera. Com virgula ele joga tudo numa coluna so; sem BOM, come os acentos.
const SEPARADOR = ";";
const BOM = "﻿";

function escapar(valor) {
  const texto = valor === null || valor === undefined ? "" : String(valor);

  if (texto.includes('"') || texto.includes(SEPARADOR) || /[\r\n]/.test(texto)) {
    return `"${texto.replace(/"/g, '""')}"`;
  }

  return texto;
}

export function gerarCsv(cabecalho, linhas) {
  const tudo = [cabecalho, ...linhas];
  return BOM + tudo.map((linha) => linha.map(escapar).join(SEPARADOR)).join("\r\n");
}

export function baixarArquivo(nomeArquivo, conteudo) {
  const blob = new Blob([conteudo], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = nomeArquivo;
  link.click();

  URL.revokeObjectURL(url);
}
