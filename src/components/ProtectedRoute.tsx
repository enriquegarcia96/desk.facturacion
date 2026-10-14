import { PropsWithChildren } from "react";
import { Navigate } from "react-router";

import { useAuthStore } from "../features/auth/store/auth.store";

export const AdminRoute = ({ children }: PropsWithChildren) => {
  const { hasRole } = useAuthStore();

  //if (authStatus === 'checking') return null;

  //if (authStatus === 'not-authenticated') return <Navigate to="/auth/login" />;
  
  if (!hasRole()) return <Navigate to="/auth" />;

  return children; 
};