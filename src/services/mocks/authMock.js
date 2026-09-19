// Mock temporário para teste de login. Remover quando tiver post de login no back.

const SENHA_MOCK = "12345678";

export function loginMock(email, senha) {
    if(senha !== SENHA_MOCK)    {
        return Promise.reject({
            status:401,
            mensagem: "E-mail ou senha inválidos",
        });
    }

    // Regra do mock: e-mail começando com "admin" é ADMINISTRADOR, com "professor" é PROFESSOR, o resto é ALUNO.
    const papel = email.startsWith("admin")
        ? "ADMINISTRADOR"
        : email.startsWith("professor")
            ? "PROFESSOR"
            : "ALUNO";
    const NOMES = {
        ADMINISTRADOR: "Administrador de teste",
        PROFESSOR: "Professor de teste",
        ALUNO: "Aluno de Teste",
    };

    return Promise.resolve({
        token: "token-falso-do-mock",
        nomeCompleto: NOMES[papel],
        papel,
    });
}