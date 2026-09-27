import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ForcaSenha from "./ForcaSenha";
import { avaliarSenha } from "./senhaRegras";
import Cartao from "../ComponentesHome/Cartao";
import CabecalhoSecao from "../ComponentesHome/CabecalhoSecao";
import { formatarCep, formatarCref, somenteDigitos } from "../../utils/formatar";
import { ESTADOS } from "../../utils/estados";
import { criarUsuario } from "../../services/usuarioService";
import { buscarEnderecoPorCep } from "../../services/enderecoService";
import { listarDocumentos } from "../../services/documentoLegalService";

const FORMACOES = [
    { valor: "BACHARELADO", rotulo: "Bacharelado em Educação Física"},
    { valor: "LICENCIATURA", rotulo: "Licenciatura em Educação Física"},
  ];

const FORMACAO_VAZIA = {
  cref: "",
  formacao: "",
};

const CADASTRO_VAZIO = {
  nomeCompleto:"",
  email:"",
};

const ENDERECO_VAZIO = {
  cep: "",
  logradouro: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  estado: "",
};

const IDADE_MINIMA = 18;
  function dataMaximunNascimento() {
    const hoje = new Date();
    hoje.setFullYear(hoje.getFullYear() - IDADE_MINIMA);
    return hoje.toISOString().slice(0, 10);
  }

function FormCadastro() {

  const styleLabel = "text-2xl text-slate-500 flex flex-col m-1";
  const styleInputBase =
    "rounded-xl border p-1 transition-shadow duration-200 focus:outline-none";
  const styleInput = `${styleInputBase} border-gray-600 neon-suave-red-500 focus:border-red-500 focus:neon-red-500`;
  const styleInputBloqueado = `${styleInputBase} border-gray-700 text-gray-500 opacity-60 cursor-not-allowed`;

  const [dataNascimento, setDataNascimento] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaFocada, setSenhaFocada] = useState(false);
  const [confirmaSenha, setConfirmaSenha] = useState("");

  const avaliacaoSenha = avaliarSenha(senha);
  const mostrarForcaSenha = senhaFocada || senha.length > 0;

  const confirmacaoPreenchida = confirmaSenha.length > 0;
  const senhasCoincidem = confirmacaoPreenchida && confirmaSenha === senha;
  const senhasDiferem = confirmacaoPreenchida && !senhasCoincidem;
  const estiloSenha = senha
    ? `${styleInputBase} ${avaliacaoSenha.borda} ${avaliacaoSenha.brilho}`
    : styleInput;
  const estiloConfirmacao = senhasDiferem
    ? `${styleInputBase} border-red-500 neon-red-500`
    : senhasCoincidem
      ? `${styleInputBase} border-green-500 neon-green-500`
      : styleInput;

  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [aceitouPolitica, setAceitouPolitica] = useState(false);

  const [profissional, setProfissional] = useState(false);
  const [formacao, setFormacao] = useState(FORMACAO_VAZIA);
  const [form, setForm] = useState(CADASTRO_VAZIO);
  const [endereco, setEndereco] = useState(ENDERECO_VAZIO);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [erroCep, setErroCep] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);
  const [camposComErro, setCamposComErro] = useState([]);
  const [versoes, setVersoes] = useState(null);

  const ultimoCepBuscado = useRef("");

  const campoNumero = useRef(null);

  useEffect(() => {
    let ativo = true;
  
  listarDocumentos()
    .then((lista) => {
      if (!ativo) return;
      setVersoes({
        termos: lista.find((doc) => doc.tipo === "TERMOS_USO")?.versao ?? "",
        politicas: lista.find((doc) => doc.tipo === "POLITICA_PRIVACIDADE")?.versao ?? "",
      });
    })
    .catch(() => {
      if (ativo) {
        setErro("Não foi possivel carregar os termos. Recarregue a página.")
      }
    });

    return () => {
      ativo = false;
    };
  }, []);

  
  const enderecoLiberado = somenteDigitos(endereco.cep).length === 8;

  const enderecoEncontrado =
    enderecoLiberado && !buscandoCep && !erroCep && endereco.logradouro !== "";

  const formularioValido =
    aceitouTermos &&
    aceitouPolitica &&
    avaliacaoSenha.valida &&
    senhasCoincidem &&
    versoes !== null;

  function handleFormacaoChange(evento) {
    const {name,value} = evento.target;
    setFormacao((anterior) => ({ ...anterior, [name]:value}));
  }

  function handleChange(evento) {
    const { name,value } = evento.target;
    setForm((anterior) => ({ ...anterior, [name]: value }));
  }

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

      campoNumero.current?.focus();
    } catch (err) {
      setErroCep(err.mensagem || "Não foi possível buscar este CEP. Preencha o endereço à mão.");
    } finally {
      setBuscandoCep(false);
    }
  }

  function handleCepChange(evento) {
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

  function handleEnderecoChange(evento) {
    const { name, value } = evento.target;
    setEndereco((anterior) => ({ ...anterior, [name]: value }));
  }

  function limparFormulario() {
    setForm(CADASTRO_VAZIO);
    setEndereco(ENDERECO_VAZIO);
    setFormacao(FORMACAO_VAZIA);
    setErroCep(null);
    ultimoCepBuscado.current = "";
    setDataNascimento("");
    setSenha("");
    setConfirmaSenha("");
    setProfissional(false);
    setAceitouTermos(false);
    setAceitouPolitica(false);
  }

  async function enviarCadastro(evento) {
    evento.preventDefault();

    const dadosProfissionais = profissional
      ? {
        cref: formacao.cref,
        formacao: formacao.formacao,
        cep: somenteDigitos(endereco.cep),
        logradouro: endereco.logradouro,
        numero: endereco.numero,
        complemento: endereco.complemento,
        bairro: endereco.bairro,
        cidade: endereco.cidade,
        estado: endereco.estado
      }
      : {};

    const usuario = {
      nomeCompleto: form.nomeCompleto,
      email: form.email,
      senha,
      dataNascimento,
      papel: profissional ? "PROFESSOR" : "ALUNO",
      aceitouTermosUso: aceitouTermos,
      aceitouPoliticaPrivacidade: aceitouPolitica,
      versaoTermosUso: versoes.termos,
      versaoPoliticaPrivacidade: versoes.politicas,
      ...dadosProfissionais,
    };

    setEnviando(true);
    setErro(null);
    setCamposComErro([]);

    try {
      await criarUsuario(usuario);
      alert("Cadastro realizado com sucesso");
      limparFormulario();
    } catch (err) {
      setErro(err.mensagem || "Erro ao realizar cadastro. Tente novamente mais tarde.");
      setCamposComErro(err.campos ?? []);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <form onSubmit={enviarCadastro} className="text-white text-2xl">
        <section className="py-6">
          <CabecalhoSecao rotulo="Conta" titulo="Cadastro" />
          <Cartao className="space-y-2">
          <div className="">
            <label htmlFor="nome_completo" className={styleLabel}>
              Nome completo *
            </label>
            <input
              type="text"
              id="nome_completo"
              name="nomeCompleto"
              value={form.nomeCompleto}
              onChange={handleChange}
              required
              placeholder="Ex: Alexander Turian"
              className={styleInput}
            />
          </div>
          <div className=" flex gap-2">
            <div>
              <label htmlFor="dataNasc" className={styleLabel}>
                Data de Nascimento*
              </label>
              <input
                type="date"
                id="dataNasc"
                name="dataNasc"
                max={dataMaximunNascimento()}
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
                required
                className={styleInput}
              />
            </div>
            <div>
              <label htmlFor="email" className={styleLabel}>
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className={styleInput}
                placeholder="nome@example.com"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <div>
              <label htmlFor="senha" className={styleLabel}>
                Senha*
              </label>
              <input
                type="password"
                id="senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                onFocus={() => setSenhaFocada(true)}
                onBlur={() => setSenhaFocada(false)}
                className={estiloSenha}
                placeholder="senha"
              />
              {mostrarForcaSenha && <ForcaSenha avaliacao={avaliacaoSenha} />}
            </div>
            <div>
              <label htmlFor="confirmaSenha" className={styleLabel}>
                Confirma senha*
              </label>
              <input
                type="password"
                id="confirmaSenha"
                value={confirmaSenha}
                onChange={(e) => setConfirmaSenha(e.target.value)}
                aria-invalid={senhasDiferem}
                aria-describedby="confirmaSenha-mensagem"
                className={estiloConfirmacao}
                placeholder="Confirma senha"
              />
              <p
                id="confirmaSenha-mensagem"
                aria-live="polite"
                className={`mt-2 text-sm ${senhasDiferem ? "text-red-400" : "text-green-400"}`}
              >
                {senhasDiferem && "As senhas não coincidem"}
                {senhasCoincidem && "Senhas coincidem"}
              </p>
            </div>
          </div>
            </Cartao>
          </section>
          
          <div className="mt-10 flex flex-wrap items-center gap-2 text-lg text-gray-300">
            <input
              type="checkbox"
              id="profissional"
              checked={profissional}
              onChange={(evento) => setProfissional(evento.target.checked)}
              className="h-5 w-5 accent-red-500" />
              <label htmlFor="profissional">Sou profissional de Educação Física</label>
          </div>
          
          {profissional && (
            <>
            <section className="py-6">
              <CabecalhoSecao rotulo="Profissional" titulo="Formação" />
              <Cartao className="space-y-2">
                <div className="flex gap-3">
                  <div>
                    <label htmlFor="cref" className={styleLabel}>
                      CREF *
                    </label>
                    <input
                      type="text"
                      id="cref"
                      name="cref"
                      value={formacao.cref}
                      onChange={(evento) => setFormacao((anterior) => ({
                        ...anterior,
                        cref: formatarCref(evento.target.value),
                      }))
                    }
                      maxLength={11}
                      placeholder="000000-G/UF"
                      className={styleInput}
                      />
                      </div>
                      <div>
                        <label htmlFor="formacao" className={styleLabel}>
                          Formação *
                          </label>
                          <select
                            id="formacao"
                            name="formacao"
                            value={formacao.formacao}
                            onChange={handleFormacaoChange}
                            className={`${styleInput} bg-slate-800`}
                            >
                              <option value ="">Selecione uma formação:</option>
                              {FORMACOES.map((opcao) => (
                                <option key={opcao.valor} value={opcao.valor}>
                                  {opcao.rotulo}
                                  </option>
                                ))}
                            </select>
                      </div>
                    </div>
                    </Cartao>
                    </section>
            <section className="py-6">
              <CabecalhoSecao rotulo="Localização" titulo="Endereço profissional" />
              <Cartao className="space-y-4">
                <p className="text-lg text-gray-300">
                  Comece pelo <strong className="text-red-200">CEP</strong>: o
                  restante do endereço é preenchido sozinho.
                </p>

                <div className="max-w-xs">
                  <label htmlFor="cep" className={styleLabel}>
                    CEP *
                  </label>
                  <input
                    type="text"
                    id="cep"
                    className={`${styleInput} w-full`}
                    maxLength={9}
                    name="cep"
                    value={endereco.cep}
                    onChange={handleCepChange}
                    required
                    autoComplete="postal-code"
                    inputMode="numeric"
                    placeholder="00000-000"
                    aria-describedby="cep-mensagem"
                  />
                  <p
                    id="cep-mensagem"
                    aria-live="polite"
                    className={`mt-2 text-sm ${
                      erroCep ? "text-red-400" : enderecoEncontrado ? "text-green-400" : "text-gray-400"
                    }`}
                  >
                    {buscandoCep && "Buscando endereço..."}
                    {erroCep && `${erroCep} Preencha o endereço à mão.`}
                    {enderecoEncontrado && "Endereço encontrado. Confira e informe o número."}
                    {!buscandoCep && !erroCep && !enderecoEncontrado && "Digite os 8 dígitos do CEP."}
                  </p>
                </div>

                <fieldset disabled={!enderecoLiberado} className="contents">
                  <div className="grid gap-3 md:grid-cols-2 lp:grid-cols-3">
                    <div>
                      <label htmlFor="logradouro" className={styleLabel}>
                        Logradouro *
                      </label>
                      <input
                        type="text"
                        id="logradouro"
                        name="logradouro"
                        value={endereco.logradouro}
                        onChange={handleEnderecoChange}
                        required
                        className={enderecoLiberado ? `${styleInput} w-full` : `${styleInputBloqueado} w-full`}
                        placeholder="Ex: Rua nome da rua"
                      />
                    </div>

                    <div>
                      <label htmlFor="numero" className={styleLabel}>
                        Número *
                      </label>
                      <input
                        type="text"
                        id="numero"
                        ref={campoNumero}
                        name="numero"
                        value={endereco.numero}
                        onChange={handleEnderecoChange}
                        required
                        className={enderecoLiberado ? `${styleInput} w-full` : `${styleInputBloqueado} w-full`}
                        placeholder="Ex: 123"
                      />
                    </div>

                    <div>
                      <label htmlFor="complemento" className={styleLabel}>
                        Complemento
                      </label>
                      <input
                        type="text"
                        id="complemento"
                        name="complemento"
                        value={endereco.complemento}
                        onChange={handleEnderecoChange}
                        className={enderecoLiberado ? `${styleInput} w-full` : `${styleInputBloqueado} w-full`}
                        placeholder="Ex: Apto 123"
                      />
                    </div>

                    <div>
                      <label htmlFor="bairro" className={styleLabel}>
                        Bairro *
                      </label>
                      <input
                        type="text"
                        id="bairro"
                        name="bairro"
                        value={endereco.bairro}
                        onChange={handleEnderecoChange}
                        required
                        className={enderecoLiberado ? `${styleInput} w-full` : `${styleInputBloqueado} w-full`}
                        placeholder="Ex: Bairro"
                      />
                    </div>

                    <div>
                      <label htmlFor="cidade" className={styleLabel}>
                        Cidade *
                      </label>
                      <input
                        type="text"
                        id="cidade"
                        name="cidade"
                        value={endereco.cidade}
                        onChange={handleEnderecoChange}
                        required
                        className={enderecoLiberado ? `${styleInput} w-full` : `${styleInputBloqueado} w-full`}
                        placeholder="Ex: Cidade"
                      />
                    </div>

                    <div>
                      <label htmlFor="estado" className={styleLabel}>
                        Estado *
                      </label>
                      <select
                        name="estado"
                        id="estado"
                        value={endereco.estado}
                        onChange={handleEnderecoChange}
                        required
                        className={`${enderecoLiberado ? styleInput : styleInputBloqueado} w-full bg-slate-800`}
                      >
                        <option value="">Selecione um estado</option>
                        {ESTADOS.map((estado) => (
                          <option key={estado.uf} value={estado.uf}>
                            {estado.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </fieldset>
              </Cartao>
            </section>
              </>
      )}
          
          <div className="mt-10 flex flex-wrap items-center gap-2 text-lg text-gray-300">
            <input
              type="checkbox"
              id="aceitouTermos"
              checked={aceitouTermos}
              onChange={(evento) => setAceitouTermos(evento.target.checked)}
              required
              className="h-5 w-5 accent-red-500"
            />
            <label htmlFor="aceitouTermos">Li e aceito os</label>
            <Link
              to="/termos-de-uso"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-200 underline hover:text-white"
            >
              Termos de Uso
            </Link>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-lg text-gray-300">
            <input
              type="checkbox"
              id="aceitouPolitica"
              checked={aceitouPolitica}
              onChange={(evento) => setAceitouPolitica(evento.target.checked)}
              required
              className="h-5 w-5 accent-red-500"
            />
            <label htmlFor="aceitouPolitica">Li e aceito a</label>
            <Link
              to="/politica-de-privacidade"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-200 underline hover:text-white"
            >
              Política de Privacidade
            </Link>
          </div>
          {erro && (
            <p className="mt-4 text-sm text-center text-red-500">{erro}</p>
          )}
          {camposComErro.length > 0 && (
            <ul className="mt-2 list-disc pl-6 text-sm text-red-500">
              {camposComErro.map((campo) => (
                <li key={campo.campo}>{campo.mensagem}</li>
              ))}
            </ul> 
          )}
          <button
            type="submit"
            disabled={!formularioValido || enviando}
            className={`mt-6 w-full rounded-md bg-red-500 py-2 px-2 text-white transition-shadow duration-200 hover:bg-red-900 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${formularioValido ? "neon-red-500" : ""}`}
          >
            {enviando ? "Cadastrando..." : "Cadastrar"}
          </button>
      </form>
    </>
  );
}

export default FormCadastro;
