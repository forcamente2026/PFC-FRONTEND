import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import CabecalhoSecao from "../components/ComponentesHome/CabecalhoSecao";
import Cartao from "../components/ComponentesHome/Cartao";
import EstadoRequisicao from "../components/progress/EstadoRequisicao";
import { etiquetaDoArtigo, STATUS_ARTIGO } from "../components/ArticlesComponents/artigoCampos";
import { listarArtigos } from "../services/artigoService";
import { listarExercicios } from "../services/exercicioService";
import { listarQuizzes } from "../services/quizService";
import { formatarDataCurta } from "../utils/formatar";

const GRUPOS = [
  {
    chave: "pendentes",
    titulo: "Aguardando aprovação",
    status: ["PENDENTE"],
    vazio: "Você não tem nada esperando aprovação.",
  },
  {
    chave: "publicados",
    titulo: "Publicados",
    status: ["APROVADO", "APROVADO_PELOS_PROFESSORES"],
    vazio: "Você ainda não tem conteúdo publicado.",
  },
  {
    chave: "recusados",
    titulo: "Recusados",
    status: ["REJEITADO"],
    vazio: "Nenhum conteúdo seu foi recusado.",
  },
];

function normalizar(lista, usuario, tipo, endereco) {
  return (lista ?? [])
    .filter((item) => item.podeEditar && item.autorNome === usuario?.nomeCompleto)
    .map((item) => ({
      chave: `${tipo}-${item.id}`,
      titulo: item.titulo ?? item.nome,
      tipo,
      endereco: endereco(item),
      status: item.status,
      motivoRejeicao: item.motivoRejeicao,
      aprovacoesDeProfessores: item.aprovacoesDeProfessores,
      aprovacoesNecessarias: item.aprovacoesNecessarias,
      criadoEm: item.criadoEm,
    }));
}

const ESTILO_ETIQUETA = "rounded-md px-2 py-1 text-xs font-medium whitespace-nowrap";

function Item({ item }) {
  return (
    <Cartao className="flex h-full flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className={`${ESTILO_ETIQUETA} bg-red-500 text-white`}>{item.tipo}</span>
        <span className={`${ESTILO_ETIQUETA} bg-gray-700 text-gray-200`}>
          {etiquetaDoArtigo(item) ?? STATUS_ARTIGO[item.status]?.descricao}
        </span>
      </div>

      <p className="font-montserrat text-red-200 wrap-break-word">{item.titulo}</p>

      <p className="text-sm text-gray-400">Criado em {formatarDataCurta(item.criadoEm)}</p>

      {item.motivoRejeicao ? (
        <p className="text-sm text-gray-300 wrap-break-word">
          <span className="font-semibold text-red-200">Motivo da recusa: </span>
          {item.motivoRejeicao}
        </p>
      ) : null}

      <div className="mt-auto pt-2">
        <Link
          to={item.endereco}
          className="inline-block bg-red-500 px-4 py-1 font-medium text-white hover:bg-red-900"
        >
          ABRIR
        </Link>
      </div>
    </Cartao>
  );
}

function Grupo({ grupo, itens }) {
  const doGrupo = itens.filter((item) => grupo.status.includes(item.status));

  return (
    <section>
      <h2 className="font-montserrat text-xl text-red-200">
        {grupo.titulo} ({doGrupo.length})
      </h2>

      {doGrupo.length ? (
        <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {doGrupo.map((item) => (
            <Item key={item.chave} item={item} />
          ))}
        </div>
      ) : (
        <p className="mt-2 text-sm text-gray-400">{grupo.vazio}</p>
      )}
    </section>
  );
}

function MeuAcervoPages() {
  const { usuario } = useOutletContext();
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let ativo = true;

    Promise.all([listarExercicios(), listarArtigos(), listarQuizzes()])
      .then(([exercicios, artigos, quizzes]) => {
        if (ativo) setDados({ exercicios, artigos, quizzes });
      })
      .catch((falha) => {
        if (ativo) setErro(falha?.mensagem ?? "Não foi possível carregar o seu acervo.");
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  const itens = dados
    ? [
        ...normalizar(
          dados.exercicios,
          usuario,
          "Exercício",
          (item) => `/library?exercicio=${item.id}`,
        ),
        ...normalizar(dados.artigos, usuario, "Artigo", (item) => `/articles/${item.id}`),
        ...normalizar(dados.quizzes, usuario, "Quiz", (item) => `/quiz/${item.id}`),
      ]
    : [];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-10 lp:py-16">
      <CabecalhoSecao
        rotulo="Conta"
        titulo="Meu acervo"
        descricao="Tudo o que você criou, separado por situação: o que espera aprovação, o que está publicado e o que foi recusado, com o motivo."
      />

      <EstadoRequisicao
        carregando={carregando}
        mensagemCarregando="Carregando o seu acervo..."
        erro={erro}
      >
        <div className="flex flex-col gap-10">
          {GRUPOS.map((grupo) => (
            <Grupo key={grupo.chave} grupo={grupo} itens={itens} />
          ))}
        </div>
      </EstadoRequisicao>
    </div>
  );
}

export default MeuAcervoPages;
