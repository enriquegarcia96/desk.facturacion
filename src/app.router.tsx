import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router";

import { AdminRoute } from "./components/ProtectedRoute";
import { LoginPage } from "./features/auth/pages/login/LoginPage";
import { DashboardPage } from "./features/dashboard/DashboardPage";

const DashboardLayout = lazy(() => import("./layouts/DashboardLayout"));

export const appRouter = createBrowserRouter([
  {
    path: "/auth",
    element: <LoginPage />,
  },
  {
    path: "/panel",
    element: (
      <AdminRoute>
        <DashboardLayout />
      </AdminRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />
      },
      {
        path: 'inventario',
        element: <h1>hola desde inventario</h1>
      },
      {
        path:  'inventario/productos',
        element: <h1>hhola desde pantalla de productos</h1>
      },
      {
        path: 'inventario/categorias',
        element: <h1>hgola desde la pantalla de categorias</h1>
      }
    ],
  },
  {
    path: "*",
    element: <Navigate to="/auth" />
  }
]);
