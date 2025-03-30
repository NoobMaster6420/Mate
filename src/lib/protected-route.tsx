import { ReactNode, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../hooks/auth-context";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cyberdark">
        <div className="p-8 rounded-lg border border-cyberprimary/30 bg-cyberdark/90 shadow-lg shadow-cyberprimary/20">
          <p className="text-cyberprimary animate-pulse text-center">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // La redirección ocurrirá en el useEffect
  }

  return <>{children}</>;
};