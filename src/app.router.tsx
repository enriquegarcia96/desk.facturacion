import {createBrowserRouter} from 'react-router';
import { LoginPage } from './features/auth/pages/login/LoginPage';
import { DashboardPage } from './features/admin/pages/dashboard/DashboardPage';

export const appRouter = createBrowserRouter([
  {
    path: '',
    element: <LoginPage />
  },

  //admin
  {
    path: '/admin',
    element: <DashboardPage />
  }
])
