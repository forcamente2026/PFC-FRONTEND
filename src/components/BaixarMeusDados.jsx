import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { buscarMinhaConta } from "../services/usuarioService";
import { listarQuizzes } from "../services/quizService";
import { listarArtigos } from "../services/artigoService";
import { baixarArquivo } from "../utils/csv";
import { rotuloDoPapel } from "../utils/papeis";
import { rotuloDaSituacaoCref } from "../utils/cref";
import { STATUS_ARTIGO } from "./ArticlesComponents/artigoCampos";

function situacao(codigo) {
  return STATUS_ARTIGO[codigo]?.descricao ?? codigo;
}

function dadosDaConta(conta, formacoes) {
  const dados = {
    nomeCompleto: conta.nomeCompleto,
    email: conta.email,
    perfil: rotuloDoPapel(conta.papel),
    dataNascimento: conta.dataNascimento,
    cadastradoEm: conta.criadoEm,
    situacao: conta.ativo ? "Ativa" : "Inativa",
    exclusaoSolicitadaEm: conta.anonimizacaoSolicitadaEm,
  };

  if (conta.papel !== "PROFESSOR") return dados;

  return {
    ...dados,
    habilitacao: {
      cref: conta.cref,
      formacao: formacoes.find((opcao) => opcao.codigo === conta.formacao)?.descricao ?? conta.formacao,
      verificacaoDoCref: conta.situacaoCref ? rotuloDaSituacaoCref(conta.situacaoCref) : null,
      motivoDaRejeicao: conta.motivoRejeicaoCref,
    },
    enderecoProfissional: {
      cep: conta.cep,
      logradouro: conta.logradouro,
      numero: conta.numero,
      complemento: conta.complemento,
      bairro: conta.bairro,
      cidade: conta.cidade,
      estado: conta.estado,
    },
  };
}

function resultadosDeQuiz(quizzes) {
  return quizzes
    .filter((quiz) => quiz.melhorTentativa)
    .map((quiz) => ({
      quiz: quiz.titulo,
      categoria: quiz.categoria?.descricao,
      nivel: quiz.nivel?.descricao,
      acertos: quiz.melhorTentativa.acertos,
      total: quiz.melhorTentativa.total,
      percentual: quiz.melhorTentativa.percentual,
      concluido: quiz.melhorTentativa.concluido,
    }));
}

function artigosEnviados(artigos) {
  return artigos
    .filter((artigo) => artigo.podeEditar)
    .map((artigo) => ({
      titulo: artigo.titulo,
      categoria: artigo.categoria?.descricao,
      resumo: artigo.resumo,
      fonte: artigo.fonte,
      autoria: artigo.autoria,
      tipoEstudo: artigo.tipoEstudo,
      ano: artigo.ano,
      situacao: situacao(artigo.status),
      enviadoEm: artigo.criadoEm,
    }));
}

function quizzesEnviados(quizzes) {
  return quizzes
    .filter((quiz) => quiz.podeEditar)
    .map((quiz) => ({
      titulo: quiz.titulo,
      descricao: quiz.descricao,
      categoria: quiz.categoria?.descricao,
      nivel: quiz.nivel?.descricao,
      situacao: situacao(quiz.status),
      enviadoEm: quiz.criadoEm,
    }));
}

function BaixarMeusDados({ formacoes, className }) {
  const { avisar } = useOutletContext();
  const [gerando, setGerando] = useState(false);

  async function baixar() {
    setGerando(true);

    try {
      const conta = await buscarMinhaConta();
      const professor = conta.papel === "PROFESSOR";
      const [quizzes, artigos] = await Promise.all([
        listarQuizzes(),
        professor ? listarArtigos() : Promise.resolve([]),
      ]);

      const copia = {
        documento: "Cópia dos seus dados na ForçaMente",
        baseLegal: "Lei nº 13.709/2018 (LGPD), art. 18, inciso V: portabilidade dos dados",
        geradoEm: new Date().toISOString(),
        conta: dadosDaConta(conta, formacoes),
        resultadosDeQuiz: resultadosDeQuiz(quizzes),
        ...(professor && {
          artigosEnviados: artigosEnviados(artigos),
          quizzesEnviados: quizzesEnviados(quizzes),
        }),
      };

      const nomeArquivo = `forcamente-meus-dados-${new Date().toISOString().slice(0, 10)}.json`;
      baixarArquivo(
        nomeArquivo,
        new Blob([JSON.stringify(copia, null, 2)], { type: "application/json;charset=utf-8" }),
      );

      avisar({
        tipo: "sucesso",
        titulo: "Seus dados foram baixados",
        mensagem: `O arquivo ${nomeArquivo} está na pasta de downloads do navegador. Ele está em JSON, um formato aberto que outros serviços conseguem ler.`,
      });
    } catch (err) {
      avisar({
        tipo: "erro",
        titulo: "Arquivo não gerado",
        mensagem: err.mensagem || "Não foi possível reunir os seus dados. Tente de novo em instantes.",
      });
    } finally {
      setGerando(false);
    }
  }

  return (
    <button type="button" onClick={baixar} disabled={gerando} className={className}>
      {gerando ? "Gerando arquivo..." : "Baixar meus dados"}
    </button>
  );
}

export default BaixarMeusDados;
