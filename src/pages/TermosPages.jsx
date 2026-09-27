import { useEffect, useState } from "react";
import DocumentoLegal from "../components/ComponentesLegais/DocumentoLegal";
import EstadoRequisicao from "../components/progress/EstadoRequisicao";
import { buscarDocumento } from "../services/documentoLegalService";
import { formatarDataExtenso } from "../utils/formatar";

function TermosPages() {
  const [documento, setDocumento] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let ativo = true;

    buscarDocumento("TERMOS_USO")
      .then((dados) => {
        if (ativo) setDocumento(dados);
      })
      .catch((err) => {
        if (ativo) {
          setErro(err.mensagem || "Não foi possível carregar os Termos de Uso.");
        }
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-10 lp:py-16">
      <EstadoRequisicao
        carregando={carregando}
        mensagemCarregando="Carregando documento..."
        erro={erro}
        vazio={!documento}
        mensagemVazio="Documento não encontrado."
      >
        {documento && (
          <DocumentoLegal
            rotulo="Jurídico"
            titulo="Termos de Uso"
            versao={documento.versao}
            vigencia={formatarDataExtenso(documento.vigenteDesde)}
            secoes={documento.secoes}
          />
        )}
      </EstadoRequisicao>
    </div>
  );
}

export default TermosPages;