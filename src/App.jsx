import { lazy } from "react";
import { createBrowserRouter, Navigate, redirect, RouterProvider } from "react-router-dom";
import HomePages from "./pages/HomePages.jsx";
import Layout from "./Layout/Layout.jsx";
import RotaProtegida from "./components/RotaProtegida.jsx";
import RotaPorPapel from "./components/RotaPorPapel.jsx";
import { PAPEIS_EDITORES, PAPEIS_VALIDADORES } from "./utils/papeis.js";
import { lerSessao } from "./utils/sessao.js";

const AboutPages = lazy(() => import("./pages/AboutPages.jsx"));
const LibraryPages = lazy(() => import("./pages/LibraryPages.jsx"));
const ProgressPages = lazy(() => import("./pages/ProgressPages.jsx"));
const Cadastro = lazy(() => import("./pages/Cadastro.jsx"));
const ArticlesPages = lazy(() => import("./pages/ArticlesPages.jsx"));
const ArticlePages = lazy(() => import("./pages/ArticlePages.jsx"));
const TermosPages = lazy(() => import("./pages/TermosPages.jsx"));
const PoliticaPages = lazy(() => import("./pages/PoliticaPages.jsx"));
const AuditoriaPages = lazy(() => import("./pages/AuditoriaPages.jsx"));
const UsuariosPages = lazy(() => import("./pages/UsuariosPages.jsx"));
const ItensPendentesPages = lazy(() => import("./pages/ItensPendentesPages.jsx"));
const MinhaContaPages = lazy(() => import("./pages/MinhaContaPages.jsx"));
const QuizzesPages = lazy(() => import("./pages/QuizzesPages.jsx"));
const QuizPages = lazy(() => import("./pages/QuizPages.jsx"));
const QuizFormPages = lazy(() => import("./pages/QuizFormPages.jsx"));
const InicioPages = lazy(() => import("./pages/InicioPages.jsx"));

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <HomePages />, loader: () => (lerSessao() ? redirect("/inicio") : null) },
      { path: "/inicio", element: <RotaProtegida><InicioPages /></RotaProtegida> },
      { path: "/cadastro", element: <Cadastro /> },
      { path: "/termos-de-uso", element: <TermosPages /> },
      { path: "/politica-de-privacidade", element: <PoliticaPages /> },
      { path: "/about", element: <AboutPages /> },
      { path: "/articles", element: <RotaProtegida><ArticlesPages /></RotaProtegida> },
      { path: "/articles/:id", element: <RotaProtegida><ArticlePages /></RotaProtegida> },
      { path: "/quiz", element: <RotaProtegida><QuizzesPages /></RotaProtegida> },
      {
        path: "/quiz/novo",
        element: (
          <RotaPorPapel papeis={PAPEIS_EDITORES}>
            <QuizFormPages />
          </RotaPorPapel>
        ),
      },
      { path: "/quiz/:id", element: <RotaProtegida><QuizPages /></RotaProtegida> },
      { path: "/quiz/:id/editar", element: <RotaProtegida><QuizFormPages /></RotaProtegida> },
      { path: "/library", element: <RotaProtegida><LibraryPages /></RotaProtegida> },
      { path: "/progress", element: <RotaProtegida><ProgressPages /></RotaProtegida> },
      { path: "/minha-conta", element: <RotaProtegida><MinhaContaPages /></RotaProtegida> },
      {
        path: "/admin/auditoria",
        element: (
          <RotaPorPapel papeis={PAPEIS_VALIDADORES}>
            <AuditoriaPages />
          </RotaPorPapel>
        ),
      },
      {
        path: "/admin/usuarios",
        element: (
          <RotaPorPapel papeis={PAPEIS_VALIDADORES}>
            <UsuariosPages />
          </RotaPorPapel>
        ),
      },
            {
        path: "/admin/pendentes",
        element: (
          <RotaPorPapel papeis={PAPEIS_VALIDADORES}>
            <ItensPendentesPages />
          </RotaPorPapel>
        ),
      },
      { path: "/admin", element: <Navigate to="/admin/usuarios" replace /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
