function AvisoLogin({ aoFazerLogin }) {
    return (
        <div className="flex flex-col gap-4 items-center text-center">
            <h1 className="font-montserrat text-4xl"> ACESSO RESTRITO</h1>
            <p className="text-2xl font-light">
                Você precisa estar logado para acessar esta área.
            </p>
            <button
                type="button"
                onClick={aoFazerLogin}
                className="hover:text-white p-4 my-2 bg-red-500 text-red-200 rounded-xl hover:bg-red-900 cursor-pointer"
                >
                Fazer Login
            </button>
        </div>
    );
}

export default AvisoLogin;