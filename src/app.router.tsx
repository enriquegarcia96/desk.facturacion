import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router";

import { AdminRoute } from "./components/ProtectedRoute";
import { SalesPage } from "./features/cart/pages/SalesPage";
import { UsersPage } from "./features/users/pages/UsersPage";
import { LoginPage } from "./features/auth/pages/login/LoginPage";
import { DashboardPage } from "./features/dashboard/DashboardPage";
import { InventoryPage } from "./features/inventory/pages/home/InventoryPage";

const DashboardLayout = lazy(() => import("./layouts/DashboardLayout"));

export const appRouter = createBrowserRouter([
  {
    path: '/auth',
    element: <LoginPage />,
  },
  {
    path: '/panel',
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
        element: <InventoryPage />
      },
      {
        path:  'usuarios',
        element: <UsersPage />
      },
      {
        path: 'ventas',
        element: <SalesPage />
      }
    ],
  },
  {
    path: '*',
    element: <Navigate to='/auth' />
  }
]);
