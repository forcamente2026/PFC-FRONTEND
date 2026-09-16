import { useState } from "react";
import Modal from "../Modal";
import ForcaSenha from "./ForcaSenha";
import TermosDeUso from "./TermosDeUso";
import { avaliarSenha } from "./senhaRegras";

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
  const [termosAbertos, setTermosAbertos] = useState(false);

  const formularioValido =
    aceitouTermos && avaliacaoSenha.valida && senhasCoincidem;

  function fecharTermos() {
    setTermosAbertos(false);
  }

  function aceitarTermos() {
    setAceitouTermos(true);
    setTermosAbertos(false);
  }

  function enviarCadastro(evento) {
    evento.preventDefault();
  }

  const formatCpf = (value) => {
    return value
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  return (
    <>
      <form onSubmit={enviarCadastro}>
        <div className="font-montserrat text-5xl text-red-200 text-center p-3 ">
          <h1>Cadastro</h1>
        </div>
        <div className="text-white text-2xl space-y-2">
          <div className="">
            <label htmlFor="nome_completo" className={styleLabel}>
              Nome completo *
            </label>
            <input
              type="text"
              id="nome_completo"
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
                className={styleInput}
                placeholder="nome@example.com"
              />
            </div>

            <div>
              <label htmlFor="cpf" className={styleLabel}>
                CPF *
              </label>
              <input
                type="text"
                maxLength={14}
                id="cpf"
                value={cpf}
                className={styleInput}
                onChange={(e) => setCpf(formatCpf(e.target.value))}
                placeholder="000.000.000-00"
                required
              />
            </div>
          </div>
          <div className="flex gap-3">
            <div>
              <label htmlFor="username" className={styleLabel}>
                Nome de usuario*
              </label>
              <input
                type="text"
                id="username"
                className={styleInput}
                placeholder="Nome do usuário"
              />
            </div>
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

          <div className="font-montserrat text-5xl text-center text-red-200 m-11">
            <h2>Endereço</h2>
          </div>
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
                className={styleInput}
                placeholder="Ex: Cidade"
              />
            </div>

            <div>
              <label htmlFor="estado" className={styleLabel}>
                Estado
              </label>
              <select
                name="estado"
                id="estado"
                className={`${styleInput} bg-slate-800`}
              >
                {estados.map((estado) => (
                  <option key={estado.uf} value={estado.uf}>
                    {estado.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-2 text-lg text-gray-300">
            <input
              type="checkbox"
              id="aceitouTermos"
              checked={aceitouTermos}
              onChange={(e) => setAceitouTermos(e.target.checked)}
              aria-labelledby="aceitouTermos-rotulo aceitouTermos-link"
              required
              className="h-5 w-5 accent-red-500"
            />
            <label id="aceitouTermos-rotulo" htmlFor="aceitouTermos">
              Li e aceito os
            </label>
            <button
              type="button"
              id="aceitouTermos-link"
              onClick={() => setTermosAbertos(true)}
              className="text-red-200 underline hover:text-white cursor-pointer"
            >
              Termos de Uso
            </button>
          </div>

          <button
            type="submit"
            disabled={!formularioValido}
            className={`mt-6 w-full rounded-md bg-red-500 py-2 px-2 text-white transition-shadow duration-200 hover:bg-red-900 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${formularioValido ? "neon-red-500" : ""}`}
          >
            Cadastrar
          </button>
        </div>
      </form>

      <Modal isOpen={termosAbertos} setCloseModal={fecharTermos}>
        <TermosDeUso aoFechar={fecharTermos} aoAceitar={aceitarTermos} />
      </Modal>
    </>
  );
}

export default FormCadastro;
