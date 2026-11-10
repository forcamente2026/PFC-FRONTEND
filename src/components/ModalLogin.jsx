import Dialogo from "./Dialogo";

function ModalLogin({ isOpen, children, setCloseModal }) {
  return (
    <Dialogo
      isOpen={isOpen}
      setCloseModal={setCloseModal}
      className="rounded-md bg-gray-400-50 px-5 py-2 bg-white/5 backdrop-blur-xl border-gray-700 rounded-xl shadow-lg shadow-black/20 border"
      classeFechar="hover:text-white hover:bg-red-200 cursor-pointer text-4xl"
    >
      {children}
    </Dialogo>
  );
}

export default ModalLogin;
