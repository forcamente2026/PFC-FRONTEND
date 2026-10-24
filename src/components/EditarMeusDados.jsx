import { useRef, useState } from "react";
import { buscarEnderecoPorCep } from "../services/enderecoService";
import { formatarCep, somenteDigitos } from "../utils/formatar";
import { ESTADOS } from "../utils/estados";

const ESTILO_ROTULO = "text-sm text-gray-300";
const ESTILO_CAMPO =
  "w-full rounded-xl border border-gray-600 bg-slate-800 p-2 text-white neon-suave-red-500 focus:border-red-500 focus:neon-red-500 focus:outline-none";
const ESTILO_BOTAO_PRIMARIO =
  "rounded-md bg-red-500 py-2 px-4 font-bold text-white hover:bg-red-900 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
const ESTILO_BOTAO_SECUNDARIO =
  "rounded-md border border-gray-600 px-4 py-2 text-red-200 hover:bg-white/10 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";

const CAMPOS_DE_TEXTO = [
  { nome: "logradouro", rotulo: "Logradouro", autoComplete: "address-line1" },
  { nome: "numero", rotulo: "Número" },
  { nome: "complemento", rotulo: "Complemento (opcional)", autoComplete: "address-line2" },
  { nome: "bairro", rotulo: "Bairro" },
  { nome: "cidade", rotulo: "Cidade", autoComplete: "address-level2" },
];

function texto(valor) {
  return valor ?? "";
}

function Campo({ id, rotulo, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className={ESTILO_ROTULO}>
        {rotulo}
      </label>
      {children}
    </div>
  );
}

function EditarMeusDados({ conta, aoSalvar, aoCancelar }) {
  const professor = conta.papel === "PROFESSOR";
  const [nomeCompleto, setNomeCompleto] = useState(texto(conta.nomeCompleto));
  const [endereco, setEndereco] = useState({
    cep: formatarCep(texto(conta.cep)),
    logradouro: texto(conta.logradouro),
    numero: texto(conta.numero),
    complemento: texto(conta.complemento),
    bairro: texto(conta.bairro),
    cidade: texto(conta.cidade),
    estado: texto(conta.estado),
  });
  const ultimoCepBuscado = useRef(somenteDigitos(texto(conta.cep)));
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [erroCep, setErroCep] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);
  const [camposComErro, setCamposComErro] = useState([]);

  async function buscarCep(cepLimpo) {
    if (ultimoCepBuscado.current === cepLimpo) return;
    ultimoCepBuscado.current = cepLimpo;

    setBuscandoCep(true);
    setErroCep(null);

    try {
      const dados = await buscarEnderecoPorCep(cepLimpo);
      setEndereco((anterior) => ({
        ...anterior,
        logradouro: dados.logradouro ?? "",
        bairro: dados.bairro ?? "",
        cidade: dados.cidade ?? "",
        estado: dados.estado ?? "",
      }));
    } catch (err) {
      setErroCep(err.mensagem || "Não foi possível buscar este CEP.");
    } finally {
      setBuscandoCep(false);
    }
  }

  function alterarCep(evento) {
    const mascarado = formatarCep(evento.target.value);
    setEndereco((anterior) => ({ ...anterior, cep: mascarado }));

    const limpo = somenteDigitos(mascarado);
    if (limpo.length === 8) {
      buscarCep(limpo);
      return;
    }

    ultimoCepBuscado.current = "";
    setErroCep(null);
  }

  function alterarEndereco(evento) {
    const { name, value } = evento.target;
    setEndereco((anterior) => ({ ...anterior, [name]: value }));
  }

  async function enviar(evento) {
    evento.preventDefault();
    setEnviando(true);
    setErro(null);
    setCamposComErro([]);

    const dados = professor
      ? { nomeCompleto, ...endereco, cep: somenteDigitos(endereco.cep) }
      : { nomeCompleto };

    try {
      await aoSalvar(dados);
    } catch (err) {
      setErro(err.mensagem || "Não foi possível salvar os seus dados.");
      setCamposComErro(err.campos ?? []);
    } finally {
      setEnviando(false);
    }
  }

  let mensagemCep = "Ao digitar os 8 dígitos, o endereço é preenchido sozinho.";
  if (buscandoCep) mensagemCep = "Buscando endereço...";
  else if (erroCep) mensagemCep = `${erroCep} Preencha o endereço à mão.`;

  return (
    <form onSubmit={enviar} className="w-full max-w-2xl pr-8">
      <h2 className="mb-1 text-xl font-bold text-white">Editar meus dados</h2>
      <p className="mb-5 text-sm text-gray-400">
        O e-mail tem um botão próprio. A data de nascimento e o perfil não podem ser
        alterados.
      </p>

      <Campo id="meus-dados-nome" rotulo="Nome completo">
        <input
          type="text"
          id="meus-dados-nome"
          value={nomeCompleto}
          onChange={(evento) => setNomeCompleto(evento.target.value)}
          autoComplete="name"
          className={ESTILO_CAMPO}
        />
      </Campo>

      {professor && (
        <>
          <h3 className="mt-6 mb-3 text-sm font-semibold tracking-[0.25em] text-red-200 uppercase">
            Endereço profissional
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            <Campo id="meus-dados-cep" rotulo="CEP">
              <input
                type="text"
                id="meus-dados-cep"
                name="cep"
                value={endereco.cep}
                onChange={alterarCep}
                maxLength={9}
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="00000-000"
                aria-describedby="meus-dados-cep-mensagem"
                className={ESTILO_CAMPO}
              />
              <p
                id="meus-dados-cep-mensagem"
                aria-live="polite"
                className={`text-xs ${erroCep ? "text-red-400" : "text-gray-400"}`}
              >
                {mensagemCep}
              </p>
            </Campo>

            {CAMPOS_DE_TEXTO.map((campo) => (
              <Campo key={campo.nome} id={`meus-dados-${campo.nome}`} rotulo={campo.rotulo}>
                <input
                  type="text"
                  id={`meus-dados-${campo.nome}`}
                  name={campo.nome}
                  value={endereco[campo.nome]}
                  onChange={alterarEndereco}
                  autoComplete={campo.autoComplete}
                  className={ESTILO_CAMPO}
                />
              </Campo>
            ))}

            <Campo id="meus-dados-estado" rotulo="Estado">
              <select
                id="meus-dados-estado"
                name="estado"
                value={endereco.estado}
                onChange={alterarEndereco}
                className={ESTILO_CAMPO}
              >
                <option value="">Selecione um estado</option>
                {ESTADOS.map((estado) => (
                  <option key={estado.uf} value={estado.uf}>
                    {estado.nome}
                  </option>
                ))}
              </select>
            </Campo>
          </div>
        </>
      )}

      {erro && (
        <p role="alert" className="mt-4 text-sm text-red-400">
          {erro}
        </p>
      )}
      {camposComErro.length > 0 && (
        <ul className="mt-1 list-disc pl-6 text-sm text-red-400">
          {camposComErro.map((campo) => (
            <li key={`${campo.campo}-${campo.mensagem}`}>{campo.mensagem}</li>
          ))}
        </ul>
      )}

      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <button
          type="button"
          onClick={aoCancelar}
          disabled={enviando}
          className={ESTILO_BOTAO_SECUNDARIO}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={enviando || buscandoCep}
          className={ESTILO_BOTAO_PRIMARIO}
        >
          {enviando ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
}

export default EditarMeusDados;