# ForçaMente — Frontend

Plataforma web voltada à informação e capacitação de iniciantes na musculação, conectando alunos, professores e administradores em um ambiente único de gestão de treinos, conteúdo educacional e acompanhamento de desempenho.

Projeto Final de Curso (PFC) — Bacharelado em Sistemas de Informação, Universidade de Mogi das Cruzes (UMC), 2026.

Repositório do back-end: [PFC-BACKEND](https://github.com/ofelpys/PFC-BACKEND)

## Tecnologias utilizadas

| Categoria | Tecnologia | Uso no projeto |
|---|---|---|
| Biblioteca de UI | [React 19](https://react.dev/) | Construção da interface em componentes, com JSX |
| Compilador | [React Compiler](https://react.dev/learn/react-compiler) (via `babel-plugin-react-compiler`) | Otimização automática de memoização em tempo de build |
| Roteamento | [React Router DOM 7](https://reactrouter.com/) | Navegação entre páginas (`/`, `/login`, `/about`, `/library`, `/progress`) via `createBrowserRouter` |
| Estilização | [Tailwind CSS 4](https://tailwindcss.com/) (`@tailwindcss/vite`) | Utility classes, responsividade (Flexbox/Grid) e design system da aplicação |
| Ícones | [Lucide React](https://lucide.dev/) | Ícones SVG usados na interface |
| Tipografia | [Fontsource — Montserrat](https://fontsource.org/fonts/montserrat) | Fonte principal carregada localmente (sem dependência de CDN externo) |
| Build tool | [Vite 8](https://vite.dev/) | Dev server com HMR e bundling para produção (motor Rolldown) |
| Qualidade de código | [ESLint 10](https://eslint.org/) + `eslint-plugin-react-hooks` + `eslint-plugin-react-refresh` | Padronização e lint de regras de Hooks/Fast Refresh |
| Linguagem | JavaScript (JSX) | Código do projeto; `@types/react` e `@types/react-dom` incluídos apenas para suporte de autocomplete no editor |

### Planejadas (conforme ficha de caracterização do PFC)

Tecnologias previstas para as próximas etapas de implementação, ainda não presentes no `package.json`:

- **Axios** — cliente HTTP para consumo da API REST do back-end (Spring Boot)
- **CSS Modules** — escopo de estilos por componente, quando necessário
- **ViaCEP** — integração para preenchimento automático de endereço no cadastro


## Estrutura do projeto

```
src/
├── assets/         # imagens e ícones estáticos
├── components/      # componentes reutilizáveis (ex.: NavBar)
├── Layout/          # layout global da aplicação (Header/Footer)
├── pages/           # páginas roteadas (Login, About, Library, Progress)
├── App.jsx          # componente raiz
├── main.jsx         # bootstrap da aplicação e definição das rotas
└── index.css         # estilos globais / import do Tailwind
```

## Integração com o back-end

A comunicação com o back-end (Java + Spring Boot) é feita via **API REST sobre HTTPS**, com troca de dados em **JSON** e autenticação via **JWT**.
