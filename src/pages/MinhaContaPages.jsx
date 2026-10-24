import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import CabecalhoSecao from "../components/ComponentesHome/CabecalhoSecao";
import Cartao from "../components/ComponentesHome/Cartao";
import EstadoRequisicao from "../components/progress/EstadoRequisicao";
import Modal from "../components/Modal";
import ConfirmarExclusaoConta from "../components/ConfirmarExclusaoConta";
import AvisoCref from "../components/AvisoCref";
import RenovarCref from "../components/RenovarCref";
import EditarMeusDados from "../components/EditarMeusDados";
import AlterarSenha from "../components/AlterarSenha";
import { formatarCep, formatarDataCurta } from "../utils/formatar";
import { rotuloDoPapel } from "../utils/papeis";
import { rotuloDaSituacaoCref } from "../utils/cref";
import { EMAIL_CONTATO } from "../utils/contato";
import { alterarMinhaSenha, atualizarMinhaConta, buscarMinhaConta, cancelarExclusaoDaMinhaConta, listarFormacoes, renovarCref, solicitarExclusaoDaMinhaConta, 
} from "../services/usuarioService";

const ESTILO_ROTULO = "block text-xs text-gray-400";
const ESTILO_VALOR = "block text-white";
const ESTILO_SUBTITULO =
  "text-sm font-semibold tracking-[0.25em] text-red-200 uppercase";
const ESTILO_BOTAO_GRAVE =
  "rounded-md border border-red-500 bg-red-500/10 px-4 py-2 font-medium text-red-300 hover:bg-red-500/25 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";
const ESTILO_BOTAO_SECUNDARIO =
  "rounded-md border border-gray-600 px-4 py-2 text-red-200 hover:bg-white/10 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";

function Dado({ rotulo, valor }) {
  return (
    <div>
      <span className={ESTILO_ROTULO}>{rotulo}</span>
      <span className={ESTILO_VALOR}>{valor || "—"}</span>
    </div>
  );
}

function MinhaContaPages() {
  const { aoRenomear } = useOutletContext();
  const [conta, setConta] = useState(null);
  const [formacoes, setFormacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [renovacaoAberta, setRenovacaoAberta] = useState(false);
  const [edicaoAberta, setEdicaoAberta] = useState(false);
  const [senhaAberta, setSenhaAberta] = useState(false);
  const [cancelando, setCancelando] = useState(false);
  const [versao, setVersao] = useState(0);

  useEffect(() => {
    let ativo = true;

    listarFormacoes()
      .then((lista) => {
        if (ativo) setFormacoes(lista);
      })
      .catch(() => {
        if (ativo) setFormacoes([]);
      });

    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    let ativo = true;

    buscarMinhaConta()
      .then((dados) => {
        if (!ativo) return;
        setConta(dados);
        setErro(null);
      })
      .catch((err) => {
        if (!ativo) return;
        setConta(null);
        setErro(err.mensagem || "Não foi possível carregar os seus dados.");
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [versao]);

  async function solicitar() {
    await solicitarExclusaoDaMinhaConta();
    setModalAberto(false);
    setVersao((atual) => atual + 1);
  }

    async function renovar(cref, formacao) {
    await renovarCref(cref, formacao);
    setRenovacaoAberta(false);
    setVersao((atual) => atual + 1);
  }

    async function salvarDados(dados) {
    const atualizada = await atualizarMinhaConta(dados, conta);
    setConta(atualizada);
    setEdicaoAberta(false);
    aoRenomear(atualizada.nomeCompleto);
  }

  async function cancelarPedido() {
    setCancelando(true);
    setErro(null);

    try {
      await cancelarExclusaoDaMinhaConta();
      setVersao((atual) => atual + 1);
    } catch (err) {
      setErro(err.mensagem || "Não foi possível cancelar o pedido.");
    } finally {
      setCancelando(false);
    }
  }

  const professor = conta?.papel === "PROFESSOR";
  const administrador = conta?.papel === "ADMINISTRADOR";
  const pedidoPendente = Boolean(conta?.anonimizacaoSolicitadaEm);
  const descricaoFormacao =
    formacoes.find((opcao) => opcao.codigo === conta?.formacao)?.descricao ??
    conta?.formacao;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-10 lp:py-16">
      <CabecalhoSecao
        rotulo="Conta"
        titulo="Minha conta"
        descricao="Os dados que a plataforma guarda sobre você, e o que fazer com eles."
      />

      <EstadoRequisicao
        carregando={carregando}
        mensagemCarregando="Carregando seus dados..."
        erro={carregando ? null : erro}
        vazio={!carregando && !erro && conta === null}
        mensagemVazio="Não encontramos os seus dados."
      >
        {conta && (
          <>
            {professor && (<AvisoCref situacao={conta.situacaoCref}
            motivo={conta.motivoRejeicaoCref}/>
            )}
            <section className="py-4">
              <Cartao className="space-y-5">
                <h2 className={ESTILO_SUBTITULO}>Seus dados</h2>

                <div className="grid gap-4 md:grid-cols-2 lp:grid-cols-3">
                  <Dado rotulo="Nome completo" valor={conta.nomeCompleto} />
                  <Dado rotulo="E-mail" valor={conta.email} />
                  <Dado rotulo="Perfil" valor={rotuloDoPapel(conta.papel)} />
                  <Dado
                    rotulo="Data de nascimento"
                    valor={formatarDataCurta(conta.dataNascimento)}
                  />
                  <Dado
                    rotulo="Cadastrado em"
                    valor={formatarDataCurta(conta.criadoEm)}
                  />
                  <Dado
                    rotulo="Situação"
                    valor={conta.ativo ? "Ativa" : "Inativa"}
                  />
                </div>

                {professor && (
                  <>
                    <h2 className={`${ESTILO_SUBTITULO} pt-2`}>Habilitação</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Dado rotulo="CREF" valor={conta.cref} />
                      <Dado rotulo="Formação" valor={descricaoFormacao} />
                      {conta.situacaoCref && (<Dado rotulo="Verificação do CREF"
                      valor={rotuloDaSituacaoCref(conta.situacaoCref)}/>
                      )}
                    </div>
                      
                    {conta.situacaoCref === "APROVADO" && (
                      <button
                        type="button"
                        onClick={() => setRenovacaoAberta(true)}
                        className={ESTILO_BOTAO_SECUNDARIO}
                      >
                        Atualizar CREF
                      </button>
                    )}

                    <h2 className={`${ESTILO_SUBTITULO} pt-2`}>
                      Endereço profissional
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2 lp:grid-cols-3">
                      <Dado rotulo="CEP" valor={formatarCep(conta.cep ?? "")} />
                      <Dado rotulo="Logradouro" valor={conta.logradouro} />
                      <Dado rotulo="Número" valor={conta.numero} />
                      <Dado rotulo="Complemento" valor={conta.complemento} />
                      <Dado rotulo="Bairro" valor={conta.bairro} />
                      <Dado rotulo="Cidade" valor={conta.cidade} />
                      <Dado rotulo="Estado" valor={conta.estado} />
                    </div>
                  </>
                )}

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEdicaoAberta(true)}
                    className={ESTILO_BOTAO_SECUNDARIO}
                  >
                    Editar meus dados
                  </button>
                  <button
                    type="button"
                    onClick={() => setSenhaAberta(true)}
                    className={ESTILO_BOTAO_SECUNDARIO}
                  >
                    Alterar senha
                  </button>
                </div>

              </Cartao>
            </section>

            {!administrador && (
              <section className="py-4">
                <Cartao className="space-y-4 border-red-900">
                  <h2 className={ESTILO_SUBTITULO}>Excluir minha conta</h2>

                  {pedidoPendente ? (
                    <>
                      <p className="rounded-md border border-red-500 p-3 text-sm text-red-200">
                        Exclusão solicitada em{" "}
                        {formatarDataCurta(conta.anonimizacaoSolicitadaEm)}. Sua
                        conta continua funcionando até um administrador cumprir
                        o pedido.
                      </p>
                      <p className="text-sm text-gray-400">
                        Mudou de ideia? Você pode desistir enquanto o pedido não
                        for cumprido.
                      </p>
                      <button
                        type="button"
                        onClick={cancelarPedido}
                        disabled={cancelando}
                        className={ESTILO_BOTAO_SECUNDARIO}
                      >
                        {cancelando ? "Cancelando..." : "Desistir da exclusão"}
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-gray-300">
                        Você pode pedir que os seus dados pessoais sejam
                        apagados. O pedido fica registrado e um administrador o
                        cumpre; até lá, sua conta continua funcionando e você
                        pode desistir.
                      </p>
                      <p className="text-sm text-gray-400">
                        O registro de que você aceitou os Termos e a Política
                        permanece, sem os seus dados, porque é a prova do
                        consentimento exigida por lei.
                      </p>
                      <button
                        type="button"
                        onClick={() => setModalAberto(true)}
                        className={ESTILO_BOTAO_GRAVE}
                      >
                        Solicitar exclusão da conta
                      </button>
                    </>
                  )}

                  {erro && !carregando && (
                    <p className="text-sm text-red-400">{erro}</p>
                  )}
                </Cartao>
              </section>
            )}
          </>
        )}
      </EstadoRequisicao>

      <p className="mt-6 text-sm text-gray-400">
        Para dúvidas ou pedidos sobre a sua conta, fale com o administrador pelo e-mail{" "}
        <a
          href={`mailto:${EMAIL_CONTATO}`}
          className="text-red-200 underline underline-offset-4 hover:text-red-100"
        >
          {EMAIL_CONTATO}
        </a>
        .
      </p>

      <Modal isOpen={modalAberto} setCloseModal={() => setModalAberto(false)}>
        <ConfirmarExclusaoConta
          aoConfirmar={solicitar}
          aoCancelar={() => setModalAberto(false)}
        />
      </Modal>
            
      <Modal isOpen={renovacaoAberta} setCloseModal={() => setRenovacaoAberta(false)}>
        {conta && (
          <RenovarCref
            crefAtual={conta.cref}
            formacaoAtual={conta.formacao}
            formacoes={formacoes}
            aoRenovar={renovar}
            aoCancelar={() => setRenovacaoAberta(false)}
          />
        )}
      </Modal>
      <Modal isOpen={edicaoAberta} setCloseModal={() => setEdicaoAberta(false)}>
        {conta && (
          <EditarMeusDados
            conta={conta}
            aoSalvar={salvarDados}
            aoCancelar={() => setEdicaoAberta(false)}
          />
        )}
      </Modal>
            <Modal isOpen={senhaAberta} setCloseModal={() => setSenhaAberta(false)}>
        <AlterarSenha
          aoAlterar={alterarMinhaSenha}
          aoFechar={() => setSenhaAberta(false)}
        />
      </Modal>
    </div>
  );
}

export default MinhaContaPages;
