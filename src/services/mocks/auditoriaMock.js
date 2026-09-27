// Mock temporario da trilha de auditoria. Remover quando GET /api/auditoria
// existir no back (ver memoria/contrato-auditoria.md). Gera 120 registros
// espalhados nos ultimos 30 dias, para exercitar filtros e paginacao.

export const acoesMock = [
  { codigo: "LOGIN_REALIZADO", descricao: "Login realizado" },
  { codigo: "LOGIN_FALHOU", descricao: "Falha no login" },
  { codigo: "USUARIO_CADASTRADO", descricao: "Usuário cadastrado" },
  { codigo: "DADOS_ALTERADOS", descricao: "Dados pessoais alterados" },
  { codigo: "CONTA_ANONIMIZADA", descricao: "Conta anonimizada" },
  { codigo: "ARTIGO_CRIADO", descricao: "Artigo criado" },
  { codigo: "ARTIGO_APROVADO", descricao: "Artigo aprovado" },
  { codigo: "ARTIGO_REJEITADO", descricao: "Artigo rejeitado" },
  { codigo: "EXERCICIO_CRIADO", descricao: "Exercício criado" },
  { codigo: "EXERCICIO_ALTERADO", descricao: "Exercício alterado" },
  { codigo: "EXERCICIO_EXCLUIDO", descricao: "Exercício excluído" },
  { codigo: "CREF_VERIFICADO", descricao: "CREF verificado" },
];

const USUARIOS = [
  { id: "u-1", nomeCompleto: "Administrador Teste", email: "admin@forcamente.com" },
  { id: "u-2", nomeCompleto: "Professor Teste", email: "professor@forcamente.com" },
  { id: "u-3", nomeCompleto: "Aluno de Teste", email: "aluno@forcamente.com" },
];

const DETALHES = {
  LOGIN_REALIZADO: "Entrou na plataforma",
  LOGIN_FALHOU: "Código de verificação inválido",
  USUARIO_CADASTRADO: "Conta criada pelo cadastro público",
  DADOS_ALTERADOS: "Telefone atualizado",
  CONTA_ANONIMIZADA: "Exclusão solicitada pelo titular (art. 18)",
  ARTIGO_CRIADO: "Artigo enviado para validação",
  ARTIGO_APROVADO: "Artigo publicado no acervo",
  ARTIGO_REJEITADO: "Artigo devolvido ao autor",
  EXERCICIO_CRIADO: "Exercício adicionado à biblioteca",
  EXERCICIO_ALTERADO: "Descrição de execução revisada",
  EXERCICIO_EXCLUIDO: "Exercício removido da biblioteca",
  CREF_VERIFICADO: "Registro profissional confirmado",
};

function gerarRegistros() {
  const registros = [];
  const agora = Date.now();

  for (let indice = 0; indice < 120; indice += 1) {
    const acao = acoesMock[indice % acoesMock.length];
    const usuario = acao.codigo === "LOGIN_FALHOU" && indice % 7 === 0
      ? null
      : USUARIOS[indice % USUARIOS.length];
    const quando = new Date(agora - indice * 6 * 60 * 60 * 1000);

    registros.push({
      id: `auditoria-${indice}`,
      quando: quando.toISOString().slice(0, 19),
      acao,
      usuario,
      recurso: acao.codigo.startsWith("ARTIGO")
        ? `artigo:mock-${indice}`
        : acao.codigo.startsWith("EXERCICIO")
          ? `exercicio:mock-${indice}`
          : usuario
            ? `usuario:${usuario.id}`
            : null,
      detalhe: DETALHES[acao.codigo],
      enderecoIp: `192.168.0.${10 + (indice % 40)}`,
    });
  }

  return registros;
}

const REGISTROS = gerarRegistros();

export function buscarAuditoriaMock({ pagina, tamanho, de, ate, acao, usuario }) {
  const busca = usuario ? usuario.trim().toLowerCase() : "";

  const filtrados = REGISTROS.filter((registro) => {
    const dia = registro.quando.slice(0, 10);
    if (de && dia < de) return false;
    if (ate && dia > ate) return false;
    if (acao && registro.acao.codigo !== acao) return false;

    if (busca) {
      const alvo = registro.usuario
        ? `${registro.usuario.nomeCompleto} ${registro.usuario.email}`.toLowerCase()
        : "";
      if (!alvo.includes(busca)) return false;
    }

    return true;
  });

  const inicio = pagina * tamanho;

  return {
    conteudo: filtrados.slice(inicio, inicio + tamanho),
    pagina,
    tamanho,
    totalElementos: filtrados.length,
    totalPaginas: Math.max(1, Math.ceil(filtrados.length / tamanho)),
  };
}
