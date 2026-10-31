import { useEffect, useState } from "react";
import Modal from "../Modal";
import EstadoRequisicao from "../progress/EstadoRequisicao";
import DecidirVerificacaoCref from "./DecidirVerificacaoCref";
import {
  decidirVerificacaoCref,
  listarFormacoes,
  listarVerificacoesPendentes,
} from "../../services/usuarioService";
import { formatarDataCurta } from "../../utils/formatar";

const ESTILO_CABECALHO = "py-2 pr-4 font-semibold text-red-200 whitespace-nowrap";
const ESTILO_CELULA = "py-2 pr-4 text-gray-300 align-top";
const ESTILO_ACAO =
  "rounded-md border border-gray-600 px-3 py-1 text-xs text-red-200 hover:bg-white/10 cursor-pointer whitespace-nowrap";

function descricaoDaFormacao(codigo, formacoes) {
  if (!codigo) return null;
  return formacoes.find((opcao) => opcao.codigo === codigo)?.descricao ?? codigo;
}

function VerificacoesCref() {
  const [professores, setProfessores] = useState([]);
  const [formacoes, setFormacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [aviso, setAviso] = useState(null);
  const [professorEmVerificacao, setProfessorEmVerificacao] = useState(null);

  useEffect(() => {
    let ativo = true;

    listarFormacoes()
      .then((opcoes) => {
        if (ativo) setFormacoes(opcoes);
      })
      .catch(() => {});

    listarVerificacoesPendentes()
      .then((lista) => {
        if (!ativo) return;
        setProfessores(lista);
        setErro(null);
      })
      .catch((err) => {
        if (!ativo) return;
        setErro(
          err.mensagem || "Não foi possível carregar os professores aguardando verificação.",
        );
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  async function decidir(professor, status, motivo) {
    await decidirVerificacaoCref(professor.id, status, motivo);
    setProfessores((atuais) => atuais.filter((item) => item.id !== professor.id));
    setProfessorEmVerificacao(null);
    setAviso(
      status === "APROVADO"
        ? `O CREF de ${professor.nomeCompleto} foi aprovado.`
        : `O CREF de ${professor.nomeCompleto} foi rejeitado.`,
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-semibold tracking-[0.25em] text-red-200 uppercase">
          Professores aguardando verificação
          {!carregando && !erro && ` (${professores.length})`}
        </h3>
        <p className="mt-1 text-sm text-gray-400">
          Contas de professor com o CREF ainda não conferido. Até a aprovação, elas
          têm as permissões de aluno.
        </p>
      </div>

      {aviso && (
        <p role="status" className="text-sm text-green-400">
          {aviso}
        </p>
      )}

      <EstadoRequisicao
        carregando={carregando}
        mensagemCarregando="Carregando professores..."
        erro={erro}
        vazio={professores.length === 0}
        mensagemVazio="Nenhum professor aguardando verificação."
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className={ESTILO_CABECALHO}>Professor</th>
                <th className={ESTILO_CABECALHO}>CREF</th>
                <th className={ESTILO_CABECALHO}>Formação</th>
                <th className={ESTILO_CABECALHO}>Cadastro em</th>
                <th className={ESTILO_CABECALHO}>Ação</th>
              </tr>
            </thead>
            <tbody>
              {professores.map((professor) => (
                <tr key={professor.id} className="border-b border-gray-700">
                  <td className={ESTILO_CELULA}>
                    <span className="block text-white">{professor.nomeCompleto}</span>
                    <span className="block text-xs text-gray-400">{professor.email}</span>
                  </td>
                  <td className={`${ESTILO_CELULA} whitespace-nowrap`}>{professor.cref}</td>
                  <td className={ESTILO_CELULA}>
                    {descricaoDaFormacao(professor.formacao, formacoes)}
                  </td>
                  <td className={`${ESTILO_CELULA} whitespace-nowrap`}>
                    {formatarDataCurta(professor.criadoEm)}
                  </td>
                  <td className={ESTILO_CELULA}>
                    <button
                      type="button"
                      onClick={() => setProfessorEmVerificacao(professor)}
                      className={ESTILO_ACAO}
                    >
                      Verificar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </EstadoRequisicao>

      <Modal
        isOpen={professorEmVerificacao !== null}
        setCloseModal={() => setProfessorEmVerificacao(null)}
      >
        {professorEmVerificacao && (
          <DecidirVerificacaoCref
            key={professorEmVerificacao.id}
            professor={professorEmVerificacao}
            formacao={descricaoDaFormacao(professorEmVerificacao.formacao, formacoes)}
            aoDecidir={(status, motivo) =>
              decidir(professorEmVerificacao, status, motivo)
            }
            aoCancelar={() => setProfessorEmVerificacao(null)}
          />
        )}
      </Modal>
    </section>
  );
}

export default VerificacoesCref;