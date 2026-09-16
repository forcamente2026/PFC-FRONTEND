import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/montserrat/900.css";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePages from "./pages/HomePages.jsx";
import AboutPages from "./pages/AboutPages.jsx";
import LibraryPages from "./pages/LibraryPages.jsx";
import ProgressPages from "./pages/ProgressPages.jsx";
import Layout from "./Layout/Layout.jsx";
import Cadastro from "./pages/Cadastro.jsx";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <HomePages /> },
      { path: "/cadastro", element: <Cadastro /> },
      { path: "/about", element: <AboutPages /> },
      { path: "/library", element: <LibraryPages /> },
      { path: "/progress", element: <ProgressPages /> },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
