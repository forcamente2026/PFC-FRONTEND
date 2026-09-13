import { useState } from "react";

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
  const styleInput = "rounded-xl border border-gray-600 p-1";

  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");

  const formatCpf = (value) => {
    return value
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  return (
    <form>
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
              className={styleInput}
              placeholder="senha"
            />
          </div>
          <div>
            <label htmlFor="senha" className={styleLabel}>
              Confirma senha*
            </label>
            <input
              type="password"
              id="senha"
              className={styleInput}
              placeholder="Confirma senha"
            />
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
      </div>
    </form>
  );
}

export default FormCadastro;
