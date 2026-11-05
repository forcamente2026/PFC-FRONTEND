import { useEffect, useId, useRef } from "react";
import { GripHorizontal, X } from "lucide-react";

function limitar(valor, maximo) {
  return Math.min(Math.max(0, valor), Math.max(0, maximo));
}

function posicionarDialogo(elemento, posicaoAtual, destino) {
  const caixa = elemento.getBoundingClientRect();
  const origemX = caixa.left - posicaoAtual.x;
  const origemY = caixa.top - posicaoAtual.y;
  const x = limitar(origemX + destino.x, document.documentElement.clientWidth - caixa.width) - origemX;
  const y = limitar(origemY + destino.y, document.documentElement.clientHeight - caixa.height) - origemY;

  elemento.style.setProperty("--dialogo-x", `${x}px`);
  elemento.style.setProperty("--dialogo-y", `${y}px`);
  return { x, y };
}

export default function Dialogo({ isOpen, children, setCloseModal, className, classeFechar }) {
  const dialogo = useRef(null);
  const posicao = useRef({ x: 0, y: 0 });
  const arraste = useRef(null);
  const tituloId = useId();

  useEffect(() => {
    if (!isOpen) return;
    const elemento = dialogo.current;
    const titulo = elemento.querySelector("h1, h2, h3");
    if (titulo) {
      if (!titulo.id) titulo.id = tituloId;
      elemento.setAttribute("aria-labelledby", titulo.id);
    } else {
      elemento.removeAttribute("aria-labelledby");
    }
  }, [isOpen, children, tituloId]);

  useEffect(() => {
    if (!isOpen) return;
    const elemento = dialogo.current;
    const focoAnterior = document.activeElement;
    posicao.current = { x: 0, y: 0 };
    elemento.showModal();

    function manterNaTela() {
      posicao.current = posicionarDialogo(elemento, posicao.current, posicao.current);
    }

    const observador = new ResizeObserver(manterNaTela);
    observador.observe(elemento);
    window.addEventListener("resize", manterNaTela);
    return () => {
      observador.disconnect();
      window.removeEventListener("resize", manterNaTela);
      arraste.current = null;
      elemento.close();
      queueMicrotask(() => {
        if (focoAnterior?.isConnected && !document.querySelector("dialog[open]")) {
          focoAnterior.focus();
        }
      });
    };
  }, [isOpen]);

  function iniciarArraste(evento) {
    if (!evento.isPrimary || evento.button !== 0) return;
    evento.preventDefault();
    arraste.current = {
      ponteiro: evento.pointerId,
      origemX: evento.clientX - posicao.current.x,
      origemY: evento.clientY - posicao.current.y,
    };
    evento.currentTarget.setPointerCapture(evento.pointerId);
  }

  function arrastar(evento) {
    const inicio = arraste.current;
    if (inicio?.ponteiro !== evento.pointerId) return;
    posicao.current = posicionarDialogo(dialogo.current, posicao.current, {
      x: evento.clientX - inicio.origemX,
      y: evento.clientY - inicio.origemY,
    });
  }

  function encerrarArraste(evento) {
    if (arraste.current?.ponteiro === evento.pointerId) arraste.current = null;
  }

  function conterFoco(evento) {
    if (evento.key !== "Tab") return;
    const elementos = [...dialogo.current.querySelectorAll(
      'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
    )].filter((elemento) => elemento.tabIndex >= 0 && elemento.getClientRects().length > 0);
    const primeiro = elementos[0];
    const ultimo = elementos.at(-1);
    if (evento.shiftKey && document.activeElement === primeiro) {
      evento.preventDefault();
      ultimo?.focus();
    } else if (!evento.shiftKey && document.activeElement === ultimo) {
      evento.preventDefault();
      primeiro?.focus();
    }
  }

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogo}
      role="dialog"
      aria-modal="true"
      aria-label="Janela de diálogo"
      onKeyDown={conterFoco}
      onCancel={(evento) => { evento.preventDefault(); setCloseModal(); }}
      className={`fixed top-1/2 left-1/2 m-0 flex-col overflow-hidden text-inherit backdrop:bg-black/75 open:flex ${className}`}
      style={{ translate: "calc(-50% + var(--dialogo-x, 0px)) calc(-50% + var(--dialogo-y, 0px))" }}
    >
      <div
        aria-hidden="true"
        title="Arraste para mover a janela"
        onPointerDown={iniciarArraste}
        onPointerMove={arrastar}
        onLostPointerCapture={encerrarArraste}
        className="mr-8 flex h-7 shrink-0 touch-none select-none items-center justify-center text-gray-400 cursor-grab hover:text-white active:cursor-grabbing"
      >
        <GripHorizontal size={20} />
      </div>
      <div className="min-h-0 overflow-auto [scrollbar-color:inherit]">{children}</div>
      <button type="button" aria-label="Fechar" onClick={setCloseModal} className={`absolute top-2.5 right-4 ${classeFechar}`}>
        <X />
      </button>
    </dialog>
  );
}
