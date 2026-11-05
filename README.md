# ForçaMente — Frontend

Projeto Final de Curso de Sistemas de Informação da UMC (2026), com conteúdo educacional sobre musculação para alunos, professores e administradores.

## Tecnologias e organização

React 19, React Compiler, React Router 7, Tailwind CSS 4, Axios, Recharts, Lucide, Fontsource/Montserrat, Vite 8 e ESLint 10. O compilador cuida da memoização; os componentes não usam `useMemo` ou `useCallback` manualmente.

- `src/main.jsx` e `src/App.jsx`: inicialização e rotas; as páginas secundárias são carregadas sob demanda com `lazy` e `Suspense`.
- `src/Layout/`: navegação, rodapé, sessão e avisos globais.
- `src/pages/`: páginas públicas, conteúdo, calculadoras, conta e administração.
- `src/components/`: formulários e interface reutilizável; `Dialogo` compartilha a base acessível dos modais, com foco, Escape e bloqueio da interação com o fundo pelo diálogo nativo do navegador.
- `src/hooks/`: comportamento compartilhado, como cálculos e consulta de CEP que ignora respostas antigas.
- `src/services/`: toda comunicação HTTP com a API e alternativas locais de simulação existentes.
- `src/utils/`: formatação, sessão, papéis e constantes da interface.
- `public/images/`: imagens servidas diretamente pela aplicação.

## Funcionalidades e acesso

A home (`/`), a apresentação (`/about`), os termos (`/termos-de-uso`), a política (`/politica-de-privacidade`) e o cadastro (`/cadastro`) são públicos. O login abre em um modal da navegação; não existe rota `/login`.

Depois de entrar, o usuário acessa `/inicio`, artigos (`/articles` e `/articles/:id`), quizzes (`/quiz` e `/quiz/:id`), biblioteca de exercícios (`/library`), calculadoras e hidratação (`/progress`) e sua conta (`/minha-conta`). A criação e edição de conteúdo respeitam o papel e as permissões retornadas pela API. Os validadores acessam `/admin/usuarios`, `/admin/auditoria` e `/admin/pendentes`; `/admin` redireciona à gestão de usuários.

Professores têm limite local de três pendências por tipo de conteúdo. A aprovação do administrador libera uma vaga do mesmo tipo; o backend ainda precisa garantir esse limite e a contagem de forma autoritativa. A interface não substitui as permissões e validações do servidor.

## API e sessão

O cliente Axios usa `VITE_API_URL`, autenticação por JWT nas rotas protegidas e tratamento central de erros. Um HTTP 401 fora das rotas de autenticação limpa a sessão e atualiza a interface para pedir novo login. O endereço é consultado por `/enderecos/:cep`; a integração externa é responsabilidade do backend. Somente a resposta da consulta de CEP mais recente pode preencher o formulário.

As regras e os resultados numéricos vêm do backend. Na calculadora de volume, uma linha iniciada precisa estar completa antes do envio; linhas totalmente vazias não entram no cálculo e carga zero é aceita pela interface. Os erros de exportação CSV são apresentados sem ocultar a tabela de auditoria.

## Execução e verificação

Com Node e as dependências disponíveis, use `npm run dev`, `npm run lint` e `npm run build`. Configure a URL da API no ambiente local sem versionar credenciais. `VITE_EXERCICIOS_MOCK=true` e `VITE_GRAFICOS_MOCK=true` habilitam as alternativas locais existentes; os demais endpoints ainda precisam de uma API ou de interceptações no navegador.

Os testes de fluxos desta correção ficam fora do código da aplicação, em `C:/PFC/WORK_PFC/memoria/evidencias/2026-11-05-correcoes-front/`. Eles usam Playwright, perfis fictícios, requisições interceptadas e servidor Vite isolado sem ler arquivos de ambiente. Cadastro, backend e envio de e-mail real ficam excluídos desses testes.
