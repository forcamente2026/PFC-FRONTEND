import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ForcaSenha from "./ForcaSenha";
import { avaliarSenha } from "./senhaRegras";
import Cartao from "../ComponentesHome/Cartao";
import CabecalhoSecao from "../ComponentesHome/CabecalhoSecao";
import { somenteDigitos } from "../../utils/formatar";
import { criarUsuario } from "../../services/usuarioService";
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
  telefone:"",
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

  const estados = [
    { uf: "AC", nome: "Acre" },
    { uf: "AL", nome: "Alagoas" },
    { uf: "AP", nome: "Amapá" },
    { uf: "AM", nome: "Amazonas" },
    { uf: "BA", nome: "Bahia" },
    { uf: "CE", nome: "Ceará" },
    { uf: "DF", nome: "Distrito Federal" },
    { uf: "ES", nome: "Espírito Santo" },
    { uf: "GO", nome: "Goiás" },
    { uf: "MA", nome: "Maranhão" },
    { uf: "MT", nome: "Mato Grosso" },
    { uf: "MS", nome: "Mato Grosso do Sul" },
    { uf: "MG", nome: "Minas Gerais" },
    { uf: "PA", nome: "Pará" },
    { uf: "PB", nome: "Paraíba" },
    { uf: "PR", nome: "Paraná" },
    { uf: "PE", nome: "Pernambuco" },
    { uf: "PI", nome: "Piauí" },
    { uf: "RJ", nome: "Rio de Janeiro" },
    { uf: "RN", nome: "Rio Grande do Norte" },
    { uf: "RS", nome: "Rio Grande do Sul" },
    { uf: "RO", nome: "Rondônia" },
    { uf: "RR", nome: "Roraima" },
    { uf: "SC", nome: "Santa Catarina" },
    { uf: "SP", nome: "São Paulo" },
    { uf: "SE", nome: "Sergipe" },
    { uf: "TO", nome: "Tocantins" },
  ];
  const styleLabel = "text-2xl text-slate-500 flex flex-col m-1";
  const styleInputBase =
    "rounded-xl border p-1 transition-shadow duration-200 focus:outline-none";
  const styleInput = `${styleInputBase} border-gray-600 neon-suave-red-500 focus:border-red-500 focus:neon-red-500`;

  const [cpf, setCpf] = useState("");
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
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);
  const [camposComErro, setCamposComErro] = useState([]);
  const [versoes, setVersoes] = useState(null);

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

  function handleEnderecoChange(evento) {
    const { name, value } = evento.target;
    setEndereco((anterior) => ({ ...anterior, [name]: value }));
  }

  function limparFormulario() {
    setForm(CADASTRO_VAZIO);
    setEndereco(ENDERECO_VAZIO);
    setFormacao(FORMACAO_VAZIA);
    setCpf("");
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
        cpf: somenteDigitos(cpf),
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
      telefone: somenteDigitos(form.telefone),
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

  const formatCpf = (value) => {
    return value
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const formatCref = (value) => {
    const limpo = value
    .toUpperCase()
    .replace(/[^0-9A-Z]/g, "")
    .slice(0, 9);
    
    const numeros = limpo.slice(0, 6);
    const categoria = limpo.slice(6, 7);
    const uf = limpo.slice(7, 9);

    let saida = numeros;
    if (categoria) saida += `-${categoria}`;
    if (uf) saida += `/${uf}`;

    return saida;
  };

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
              <label htmlFor="tel_celular" className={styleLabel}>
                Telefone *
              </label>
              <input
                type="tel"
                id="tel_celular"
                name="telefone"
                value={form.telefone}
                onChange={handleChange}
                required
                className={styleInput}
                placeholder="(00) 0 0000-0000"
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
                        cref: formatCref(evento.target.value),
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
                      <div>
                        <label htmlFor="cpf" className={styleLabel}>
                          CPF *
                      </label>
                        <input
                          type="text"
                          maxLength={14}
                          id="cpf"
                          name="cpf"  
                          value={cpf}
                          className={styleInput}
                          onChange={(e) => setCpf(formatCpf(e.target.value))}
                          placeholder="000.000.000-00"
                          required
                        />
                    </div>
                    </div>
                    </Cartao>
                    </section>
                    <section className="py-6">
            <CabecalhoSecao rotulo="Localização" titulo="Endereço profissional" />
            <Cartao className="space-y-2">
          <div className="flex gap-3">
            <div>
              <label htmlFor="cep" className={styleLabel}>
                CEP *
              </label>
              <input
                type="text"
                id="cep"
                className={styleInput}
                maxLength={9}
                name="cep"
                value={endereco.cep}
                onChange={handleEnderecoChange}
                required
                placeholder="Ex: 00000-000"
              />
            </div>
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
                className={styleInput}
                placeholder="Ex: Rua nome da rua"
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
                className={styleInput}
                placeholder="Ex: Bairro"
              />
            </div>
          </div>
          <div className="flex gap-3">
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
                className={styleInput}
                placeholder="Ex: Cidade"
              />
            </div>
            <div>
              <label htmlFor="numero" className={styleLabel}>
                Número *
              </label>
              <input
                type="text"
                id="numero"
                name="numero"
                value={endereco.numero}
                onChange={handleEnderecoChange}
                required
                className={styleInput}
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
                className={styleInput}
                placeholder="Ex: Apto 123"
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
                className={`${styleInput} bg-slate-800`}
              >
                <option value="">Selecione um estado</option>
                {estados.map((estado) => (
                  <option key={estado.uf} value={estado.uf}>
                    {estado.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
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
            <ul className="mt-2 list-disc pl-6 yexy-sm text-red-500">
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
