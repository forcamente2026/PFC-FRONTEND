// O CSV da auditoria e gerado pelo back (GET /api/auditoria/csv) e chega como
// blob. Aqui so mora o disparo do download: um <a href> comum nao serve porque
// o navegador nao anexa o header Authorization na navegacao.
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
