import FormCadastro from "../components/formCadastro";


function Cadastro() {
  return (
    <div className="w-full h-full my-10">
      <main className="flex-1 fl items-center justify-center flex flex-col border bg-white/5 backdrop-blur-xl border-gray-700 rounded-xl shadow-lg shadow-black/20" >
        <div className=" ">
          
          <div>
            <FormCadastro />
          </div>
          
        </div>
      </main>
    </div>
  );
}

export default Cadastro;
