function Footer() {
  return (
    <footer className="relative bg-slate-950 text-rose-200">
      <div className="h-px w-full bg-gray-300"></div>

      <div className="font-montserrat grid grid-cols-1 items-center gap-6 px-5 py-10 text-center lp:grid-cols-[1fr_auto_1fr] lp:text-left">
        <p className="text-2xl lg:text-3xl">FORÇAMENTE</p>

        <ul className="flex flex-col items-center gap-3 text-xl md:flex-row md:justify-center md:gap-8 md:text-2xl">
          <li>Termos de Uso</li>
          <li>Metodologia</li>
          <li>Contato</li>
        </ul>
      </div>

      <p className="absolute bottom-3 right-5 text-xs text-gray-500">
        &copy; 2026 ForçaMente.
      </p>
    </footer>
  );
}

export default Footer;
