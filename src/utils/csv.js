export function baixarArquivo(nomeArquivo, conteudo) {
  const blob =
    conteudo instanceof Blob
      ? conteudo
      : new Blob([conteudo], { type: "text/csv;charset=utf-8;" });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = nomeArquivo;
  link.click();

  URL.revokeObjectURL(url);
}
