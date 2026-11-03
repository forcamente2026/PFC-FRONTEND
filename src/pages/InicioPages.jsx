import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import CabecalhoSecao from "../components/ComponentesHome/CabecalhoSecao";
import CardFuncionalidade from "../components/ComponentesInicio/CardFuncionalidade";
import NumeroRapido from "../components/ComponentesInicio/NumeroRapido";
import { FUNCIONALIDADES, SAUDACOES } from "../components/ComponentesInicio/dadosInicio";
import { listarArtigos, listarArtigosPendentes } from "../services/artigoService";
import { listarQuizzes, listarQuizzesPendentes } from "../services/quizService";
import {
  listarAnonimizacoesPendentes,
  listarVerificacoesPendentes,
} from "../services/usuarioService";
import { podeEditar } from "../utils/papeis";

const ESTILO_TITULO_SECAO = "mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-red-200";

function numerosDoAluno(quizzes) {
  const feitos = quizzes.filter((quiz) => quiz.melhorTentativa);
  const concluidos = feitos.filter((quiz) => quiz.melhorTentativa.concluido);
  const media = feitos.length
    ? Math.round(feitos.reduce((soma, quiz) => soma + quiz.melhorTentativa.percentual, 0) / feitos.length)
    : null;

  return [
    { rotulo: "Quizzes feitos", valor: feitos.length, detalhe: `de ${quizzes.length} no site` },
    { rotulo: "Quizzes concluídos", valor: concluidos.length, detalhe: "com a nota mínima atingida" },
    { rotulo: "Nota média", valor: media === null ? "—" : `${media}%`, detalhe: "da melhor tentativa de cada quiz" },
  ];
}

function numerosDoProfessor(artigos, quizzes) {
  const meusArtigos = artigos.filter((artigo) => artigo.podeEditar);
  const meusQuizzes = quizzes.filter((quiz) => quiz.podeEditar);
  const aguardando = [...meusArtigos, ...meusQuizzes].filter((item) => item.status === "PENDENTE");

  return [
    { rotulo: "Artigos enviados", valor: meusArtigos.length },
    { rotulo: "Quizzes enviados", valor: meusQuizzes.length },
    { rotulo: "Aguardando aprovação", valor: aguardando.length, detalhe: "entre os seus artigos e quizzes" },
  ];
}

function numerosDoAdministrador(artigos, quizzes, professores, pedidos) {
  return [
    { rotulo: "Artigos para revisar", valor: artigos.length },
    { rotulo: "Quizzes para revisar", valor: quizzes.length },
    { rotulo: "Professores a verificar", valor: professores.length },
    { rotulo: "Pedidos de exclusão", valor: pedidos.length },
  ];
}

function buscarNumeros(papel) {
  if (papel === "ADMINISTRADOR") {
    return Promise.all([
      listarArtigosPendentes(),
      listarQuizzesPendentes(),
      listarVerificacoesPendentes(),
      listarAnonimizacoesPendentes(),
    ]).then((listas) => numerosDoAdministrador(...listas));
  }

  if (papel === "PROFESSOR") {
    return Promise.all([listarArtigos(), listarQuizzes()]).then(([artigos, quizzes]) =>
      numerosDoProfessor(artigos, quizzes),
    );
  }

  return listarQuizzes().then(numerosDoAluno);
}

function InicioPages() {
  const { usuario } = useOutletContext();
  const papel = usuario?.papel;
  const [numeros, setNumeros] = useState(null);
  const [erroNumeros, setErroNumeros] = useState(false);

  useEffect(() => {
    let ativo = true;

    buscarNumeros(papel)
      .then((lista) => {
        if (ativo) setNumeros(lista);
      })
      .catch(() => {
        if (ativo) setErroNumeros(true);
      });

    return () => {
      ativo = false;
    };
  }, [papel]);

  const primeiroNome = usuario?.nomeCompleto?.trim().split(/\s+/)[0] ?? "";
  const editor = podeEditar(usuario);
  const funcionalidades = FUNCIONALIDADES.filter(
    ({ papeis }) => !papeis || papeis.includes(papel),
  );

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-10 lp:py-16">
      <CabecalhoSecao rotulo="Início" titulo={`Olá, ${primeiroNome}`} descricao={SAUDACOES[papel]} />

      <section className="mb-12">
        <h2 className={ESTILO_TITULO_SECAO}>
          {papel === "ADMINISTRADOR" ? "O que espera a sua decisão" : "Seus números"}
        </h2>
        {numeros ? (
          <div
            className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${numeros.length === 4 ? "lp:grid-cols-4" : "lp:grid-cols-3"}`}
          >
            {numeros.map((numero) => (
              <NumeroRapido key={numero.rotulo} {...numero} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">
            {erroNumeros ? "Não foi possível carregar os seus números agora." : "Carregando os seus números..."}
          </p>
        )}
      </section>

      <section>
        <h2 className={ESTILO_TITULO_SECAO}>O que você pode fazer</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lp:grid-cols-3">
          {funcionalidades.map((funcionalidade) => (
            <CardFuncionalidade
              key={funcionalidade.para}
              para={funcionalidade.para}
              icone={funcionalidade.icone}
              titulo={funcionalidade.titulo}
              texto={editor && funcionalidade.textoEditor ? funcionalidade.textoEditor : funcionalidade.texto}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default InicioPages;
