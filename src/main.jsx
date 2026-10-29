import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/montserrat/900.css";
import "./index.css";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import HomePages from "./pages/HomePages.jsx";
import AboutPages from "./pages/AboutPages.jsx";
import LibraryPages from "./pages/LibraryPages.jsx";
import ProgressPages from "./pages/ProgressPages.jsx";
import Layout from "./Layout/Layout.jsx";
import Cadastro from "./pages/Cadastro.jsx";
import RotaProtegida from "./components/RotaProtegida.jsx";
import ArticlesPages from "./pages/ArticlesPages.jsx";
import ArticlePages from "./pages/ArticlePages.jsx";
import TermosPages from "./pages/TermosPages.jsx";
import PoliticaPages from "./pages/PoliticaPages.jsx";
import AuditoriaPages from "./pages/AuditoriaPages.jsx";
import UsuariosPages from "./pages/UsuariosPages.jsx";
import ItensPendentesPages from "./pages/ItensPendentesPages.jsx";
import MinhaContaPages from "./pages/MinhaContaPages.jsx";
import QuizzesPages from "./pages/QuizzesPages.jsx";
import QuizPages from "./pages/QuizPages.jsx";
import QuizFormPages from "./pages/QuizFormPages.jsx";
import RotaPorPapel from "./components/RotaPorPapel.jsx";
import { PAPEIS_EDITORES, PAPEIS_VALIDADORES } from "./utils/papeis.js";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <HomePages /> },
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
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
