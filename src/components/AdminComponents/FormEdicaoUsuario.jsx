import { useState } from "react";
import { formatarCep, formatarCref, formatarDataCurta, somenteDigitos } from "../../utils/formatar";
import { ESTADOS } from "../../utils/estados";
import { rotuloDoPapel } from "../../utils/papeis";

const ESTILO_ROTULO = "text-sm text-gray-300";
const ESTILO_CAMPO =
  "w-full rounded-xl border border-gray-600 bg-slate-800 p-2 text-white neon-suave-red-500 focus:border-red-500 focus:neon-red-500 focus:outline-none";
const ESTILO_BOTAO_PRIMARIO =
  "rounded-md bg-red-500 py-2 px-4 font-bold text-white hover:bg-red-900 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
const ESTILO_BOTAO_SECUNDARIO =
  "rounded-md border border-gray-600 px-4 py-2 text-red-200 hover:bg-white/10 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";

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

function Leitura({ rotulo, valor }) {
  return (
    <div>
      <span className="block text-xs text-gray-400">{rotulo}</span>
      <span className="block text-sm text-white">{valor}</span>
    </div>
  );
}

function FormEdicaoUsuario({ usuario, formacoes, aoSalvar, aoCancelar }) {
  const professor = usuario.papel === "PROFESSOR";

  const [dados, setDados] = useState({
    nomeCompleto: texto(usuario.nomeCompleto),
    email: texto(usuario.email),
    cref: texto(usuario.cref),
    formacao: texto(usuario.formacao),
    cep: formatarCep(texto(usuario.cep)),
    logradouro: texto(usuario.logradouro),
    numero: texto(usuario.numero),
    complemento: texto(usuario.complemento),
    bairro: texto(usuario.bairro),
    cidade: texto(usuario.cidade),
    estado: texto(usuario.estado),
  });

  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);
  const [camposComErro, setCamposComErro] = useState([]);

  function alterar(evento) {
    const { name, value } = evento.target;
    setDados((anterior) => ({ ...anterior, [name]: value }));
  }

  async function enviar(evento) {
    evento.preventDefault();

    const corpo = professor
      ? {
          nomeCompleto: dados.nomeCompleto,
          email: dados.email,
          cref: dados.cref,
          formacao: dados.formacao,
          cep: somenteDigitos(dados.cep),
          logradouro: dados.logradouro,
          numero: dados.numero,
          complemento: dados.complemento,
          bairro: dados.bairro,
          cidade: dados.cidade,
          estado: dados.estado,
        }
      : {
          nomeCompleto: dados.nomeCompleto,
          email: dados.email,
        };

    setSalvando(true);
    setErro(null);
    setCamposComErro([]);

    try {
      await aoSalvar(corpo);
    } catch (err) {
      setErro(err.mensagem || "Não foi possível salvar. Tente novamente.");
      setCamposComErro(err.campos ?? []);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <form onSubmit={enviar} className="w-full max-w-2xl pr-8">
      <h2 className="mb-1 text-xl font-bold text-white">Editar usuário</h2>
      <p className="mb-5 text-sm text-gray-400">
        Alterações entram na trilha de auditoria.
      </p>

      <div className="mb-5 grid grid-cols-2 gap-4 rounded-xl border border-gray-700 p-4 lp:grid-cols-4">
        <Leitura rotulo="Perfil" valor={rotuloDoPapel(usuario.papel)} />
        <Leitura
          rotulo="Nascimento"
          valor={formatarDataCurta(usuario.dataNascimento)}
        />
        <Leitura rotulo="Cadastrado em" valor={formatarDataCurta(usuario.criadoEm)} />
        <Leitura rotulo="Situação" valor={usuario.ativo ? "Ativo" : "Inativo"} />
      </div>

      <div className="mb-4 grid gap-4 md:grid-cols-2">
        <Campo id="edicao-nome" rotulo="Nome completo *">
          <input
            type="text"
            id="edicao-nome"
            name="nomeCompleto"
            value={dados.nomeCompleto}
            onChange={alterar}
            required
            className={ESTILO_CAMPO}
          />
        </Campo>

        <Campo id="edicao-email" rotulo="E-mail *">
          <input
            type="email"
            id="edicao-email"
            name="email"
            value={dados.email}
            onChange={alterar}
            required
            className={ESTILO_CAMPO}
          />
        </Campo>
      </div>

      {professor && (
        <>
          <h3 className="mt-6 mb-3 text-sm font-semibold tracking-[0.25em] text-red-200 uppercase">
            Habilitação
          </h3>

          <div className="mb-4 grid gap-4 md:grid-cols-2">
            <Campo id="edicao-cref" rotulo="CREF *">
              <input
                type="text"
                id="edicao-cref"
                name="cref"
                value={dados.cref}
                onChange={(evento) =>
                  setDados((anterior) => ({
                    ...anterior,
                    cref: formatarCref(evento.target.value),
                  }))
                }
                maxLength={11}
                placeholder="000000-G/UF"
                className={ESTILO_CAMPO}
              />
            </Campo>

            <Campo id="edicao-formacao" rotulo="Formação *">
              <select
                id="edicao-formacao"
                name="formacao"
                value={dados.formacao}
                onChange={alterar}
                className={ESTILO_CAMPO}
              >
                <option value="">Selecione uma formação</option>
                {formacoes.map((opcao) => (
                  <option key={opcao.codigo} value={opcao.codigo}>
                    {opcao.descricao}
                  </option>
                ))}
              </select>
            </Campo>
          </div>

          <h3 className="mt-6 mb-3 text-sm font-semibold tracking-[0.25em] text-red-200 uppercase">
            Endereço profissional
          </h3>

          <div className="mb-4 grid gap-4 md:grid-cols-2 lp:grid-cols-3">
            <Campo id="edicao-cep" rotulo="CEP *">
              <input
                type="text"
                id="edicao-cep"
                name="cep"
                value={dados.cep}
                onChange={(evento) =>
                  setDados((anterior) => ({
                    ...anterior,
                    cep: formatarCep(evento.target.value),
                  }))
                }
                maxLength={9}
                placeholder="00000-000"
                className={ESTILO_CAMPO}
              />
            </Campo>

            <Campo id="edicao-logradouro" rotulo="Logradouro *">
              <input
                type="text"
                id="edicao-logradouro"
                name="logradouro"
                value={dados.logradouro}
                onChange={alterar}
                className={ESTILO_CAMPO}
              />
            </Campo>

            <Campo id="edicao-numero" rotulo="Número *">
              <input
                type="text"
                id="edicao-numero"
                name="numero"
                value={dados.numero}
                onChange={alterar}
                className={ESTILO_CAMPO}
              />
            </Campo>

            <Campo id="edicao-complemento" rotulo="Complemento">
              <input
                type="text"
                id="edicao-complemento"
                name="complemento"
                value={dados.complemento}
                onChange={alterar}
                className={ESTILO_CAMPO}
              />
            </Campo>

            <Campo id="edicao-bairro" rotulo="Bairro *">
              <input
                type="text"
                id="edicao-bairro"
                name="bairro"
                value={dados.bairro}
                onChange={alterar}
                className={ESTILO_CAMPO}
              />
            </Campo>

            <Campo id="edicao-cidade" rotulo="Cidade *">
              <input
                type="text"
                id="edicao-cidade"
                name="cidade"
                value={dados.cidade}
                onChange={alterar}
                className={ESTILO_CAMPO}
              />
            </Campo>

            <Campo id="edicao-estado" rotulo="Estado *">
              <select
                id="edicao-estado"
                name="estado"
                value={dados.estado}
                onChange={alterar}
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

      {erro && <p className="mt-4 text-sm text-red-400">{erro}</p>}

      {camposComErro.length > 0 && (
        <ul className="mt-2 list-disc pl-6 text-sm text-red-400">
          {camposComErro.map((campo) => (
            <li key={campo.campo}>{campo.mensagem}</li>
          ))}
        </ul>
      )}

      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <button
          type="button"
          onClick={aoCancelar}
          disabled={salvando}
          className={ESTILO_BOTAO_SECUNDARIO}
        >
          Cancelar
        </button>
        <button type="submit" disabled={salvando} className={ESTILO_BOTAO_PRIMARIO}>
          {salvando ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
}

export default FormEdicaoUsuario;
