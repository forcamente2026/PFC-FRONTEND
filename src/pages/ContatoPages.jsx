import { Link } from "react-router-dom";
import { TriangleAlert } from "lucide-react";
import CabecalhoPagina from "../components/CabecalhoPagina";
import Cartao from "../components/ComponentesHome/Cartao";
import { ICONES_DAS_PAGINAS } from "../utils/iconesDasPaginas";
import { EMAIL_CONTATO } from "../utils/contato";

const ESTILO_TITULO_SECAO = "font-montserrat text-2xl text-white lp:text-3xl";
const ESTILO_PARAGRAFO = "text-base leading-relaxed text-gray-300";
const ESTILO_LINK = "font-semibold text-red-200 underline hover:text-white";

const ASSUNTOS = [
  {
    titulo: "Dúvidas e sugestões",
    texto: "Sobre o uso da plataforma ou ideias para melhorá-la.",
  },
  {
    titulo: "Problemas de acesso",
    texto: "O código de verificação não chegou, ou você não consegue entrar mesmo depois de redefinir a senha.",
  },
  {
    titulo: "Conteúdo com erro",
    texto: "Um artigo, quiz ou exercício que precise de correção. Diga qual é e o que está errado.",
  },
  {
    titulo: "Verificação do CREF",
    texto: "Para professores com dúvida sobre a análise do cadastro.",
  },
  {
    titulo: "Seus dados pessoais",
    texto:
      "Pedidos e dúvidas sobre o tratamento dos seus dados, pela LGPD. O encarregado pelo tratamento é Jonathan Augusto Rodrigues Barbosa.",
  },
];

function ContatoPages() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-10 lp:pb-16">
      <CabecalhoPagina
        titulo="Contato"
        subtitulo="Fale com a equipe do ForçaMente pelo e-mail abaixo. Respondemos em até 15 dias."
        icone={ICONES_DAS_PAGINAS.contato}
      />

      <div className="space-y-12">
        <Cartao className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-200">E-mail</p>
          <a
            href={`mailto:${EMAIL_CONTATO}`}
            className="mt-2 inline-block break-all font-montserrat text-2xl text-white underline hover:text-red-200 md:text-3xl"
          >
            {EMAIL_CONTATO}
          </a>
          <p className="mx-auto mt-4 max-w-xl text-sm text-gray-300">
            Se a mensagem for sobre a sua conta, escreva do e-mail cadastrado nela. Assim conseguimos identificar
            você sem pedir outros dados.
          </p>
        </Cartao>

        <section className="space-y-4">
          <h2 className={ESTILO_TITULO_SECAO}>Sobre o que falar com a gente</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {ASSUNTOS.map((assunto) => (
              <Cartao key={assunto.titulo}>
                <h3 className="font-montserrat text-lg text-white">{assunto.titulo}</h3>
                <p className="mt-1 text-sm text-gray-300">{assunto.texto}</p>
              </Cartao>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className={ESTILO_TITULO_SECAO}>Resolva pela sua conta</h2>
          <p className={ESTILO_PARAGRAFO}>
            Em{" "}
            <Link to="/minha-conta" className={ESTILO_LINK}>
              Minha conta
            </Link>{" "}
            você corrige os seus dados, troca a senha e o e-mail, baixa uma cópia de tudo o que a plataforma
            guarda sobre você e pede a exclusão da conta, sem precisar escrever para a equipe.
          </p>
        </section>

        <div className="flex gap-4 rounded-xl border border-red-500 bg-red-500/10 p-5">
          <TriangleAlert className="shrink-0 text-red-500" size={22} aria-hidden="true" />
          <p className="text-sm text-gray-300">
            <strong className="text-white">A equipe nunca pede a sua senha nem o código de verificação por e-mail.</strong>{" "}
            Esses dados só são digitados nas telas do próprio ForçaMente.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ContatoPages;
