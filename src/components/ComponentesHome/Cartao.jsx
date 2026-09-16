function Cartao({ children, className = "" }) {
  return (
    <div
      className={`rounded-xl border border-gray-700 bg-white/5 p-6 shadow-lg shadow-black/20 backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}

export default Cartao;
