import { Navigate, type RouteObject } from "react-router-dom";
import App from "../App";
import { ChatWorkspacePage } from "../pages/ChatWorkspacePage";
import AuthPage from "../pages/AuthPage";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("access_token");
  if (!token) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
}


export const appRoutes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/chat-workspace" replace />,
      },
      {
        path: "auth", // <--- 1. Introduce the new unlocked route
        element: <AuthPage />,
      },
      {
        path: "chat-workspace",
        element: (
          // <--- 2. Wrap the chat workspace tightly inside ProtectedRoute
          <ProtectedRoute>
            <ChatWorkspacePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: <Navigate to="/chat-workspace" replace />,
      },
    ],
  },
];