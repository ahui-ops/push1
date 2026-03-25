
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { appRoutes } from "./app/router/routes";
import "./styles/index.css";

const router = createBrowserRouter(appRoutes);

createRoot(document.getElementById("root")!).render(<RouterProvider router={router} />);
