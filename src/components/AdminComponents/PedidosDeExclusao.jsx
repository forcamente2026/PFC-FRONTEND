import { useEffect, useState } from "react";
import Modal from "../Modal";
import EstadoRequisicao from "../progress/EstadoRequisicao";
import ConfirmarAnonimizacao from "./ConfirmarAnonimizacao";
import {
  anonimizarUsuario,
  listarAnonimizacoesPendentes,
} from "../../services/usuarioService";
import { rotuloDoPapel } from "../../utils/papeis";
import { formatarDataCurta } from "../../utils/formatar";

const ESTILO_CABECALHO = "py-2 pr-4 font-semibold text-red-200 whitespace-nowrap";
const ESTILO_CELULA = "py-2 pr-4 text-gray-300 align-top";

const ESTILO_ACAO_GRAVE =
  "rounded-md border border-red-500 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-300 hover:bg-red-500/25 cursor-pointer";

function PedidosDeExclusao() {
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [pedidoEmAnonimizacao, setPedidoEmAnonimizacao] = useState(null);

  useEffect(() => {
    let ativo = true;

    listarAnonimizacoesPendentes()
      .then((lista) => {
        if (!ativo) return;
        setPedidos(lista);
        setErro(null);
      })
      .catch((err) => {
        if (!ativo) return;
        setErro(err.mensagem || "Não foi possível carregar os pedidos de exclusão.");
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  async function anonimizar(pedidoEscolhido) {
    await anonimizarUsuario(pedidoEscolhido.id);
    setPedidos((atuais) =>
      atuais.filter((pedido) => pedido.id !== pedidoEscolhido.id),
    );
    setPedidoEmAnonimizacao(null);
  }

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-semibold tracking-[0.25em] text-red-200 uppercase">
          Pedidos de exclusão de conta
        </h3>
        <p className="mt-1 text-sm text-gray-400">
          Contas cujo dono pediu a exclusão. Anonimizar apaga os dados pessoais
          e não pode ser desfeito.
        </p>
      </div>

      <EstadoRequisicao
        carregando={carregando}
        mensagemCarregando="Carregando pedidos..."
        erro={erro}
        vazio={pedidos.length === 0}
        mensagemVazio="Nenhum pedido de exclusão aguardando."
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className={ESTILO_CABECALHO}>Usuário</th>
                <th className={ESTILO_CABECALHO}>Perfil</th>
                <th className={ESTILO_CABECALHO}>Pedido em</th>
                <th className={ESTILO_CABECALHO}>Ação</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id} className="border-b border-gray-700">
                  <td className={ESTILO_CELULA}>
                    <span className="block text-white">{pedido.nomeCompleto}</span>
                    <span className="block text-xs text-gray-400">{pedido.email}</span>
                  </td>
                  <td className={ESTILO_CELULA}>{rotuloDoPapel(pedido.papel)}</td>
                  <td className={ESTILO_CELULA}>
                    {formatarDataCurta(pedido.solicitadaEm)}
                  </td>
                  <td className={ESTILO_CELULA}>
                    <button
                      type="button"
                      onClick={() => setPedidoEmAnonimizacao(pedido)}
                      className={ESTILO_ACAO_GRAVE}
                    >
                      Anonimizar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </EstadoRequisicao>

      <Modal
        isOpen={pedidoEmAnonimizacao !== null}
        setCloseModal={() => setPedidoEmAnonimizacao(null)}
      >
        {pedidoEmAnonimizacao && (
          <ConfirmarAnonimizacao
            key={pedidoEmAnonimizacao.id}
            usuario={{
              ...pedidoEmAnonimizacao,
              anonimizacaoSolicitadaEm: pedidoEmAnonimizacao.solicitadaEm,
            }}
            aoConfirmar={() => anonimizar(pedidoEmAnonimizacao)}
            aoCancelar={() => setPedidoEmAnonimizacao(null)}
          />
        )}
      </Modal>
    </section>
  );
}

export default PedidosDeExclusao;