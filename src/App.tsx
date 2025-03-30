import { Route, Switch, Router } from 'wouter';
import { AuthProvider } from './hooks/auth-context';
import { useAuth } from './hooks/auth-context';
import { useLocation } from 'wouter';
import { ReactNode, useEffect, useState } from 'react';

// Pages
import HomePage from './pages/home-page';
import AuthPage from './pages/auth-page';
import QuizPage from './pages/quiz-page';
import NotFound from './pages/not-found';

// Components
import Navbar from './components/navbar';
import Footer from './components/footer';

// Configuración para usar el modo hash de Wouter
// Esto nos permite usar rutas tipo /#/ruta en lugar de /ruta
const hashBaseLocation = () => {
  // Retorna la porción de la URL después del símbolo #, o / si no hay #
  return window.location.hash.replace(/^#/, '') || '/';
};

const hashNavigate = (to: string) => {
  // Cuando navegamos a una nueva ruta, actualizamos el hash
  window.location.hash = to;
};

// Protected route component
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse-slow text-primary font-bold">Cargando...</div>
    </div>;
  }

  return user ? <>{children}</> : null;
}

// GitHub Pages router - configurado para usar hash routing
function GitHubPagesRouter() {
  // Usamos useState para forzar re-renders cuando cambia el hash
  const [location, setLocation] = useState(hashBaseLocation());
  
  // Listener para cambios en el hash
  useEffect(() => {
    // Cuando cambia el hash, actualizamos el estado
    const handleHashChange = () => {
      setLocation(hashBaseLocation());
    };
    
    // Registramos el event listener
    window.addEventListener('hashchange', handleHashChange);
    
    // Limpieza al desmontar
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);
  
  return (
    <Router base="" hook={() => [location, hashNavigate]}>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/quiz">
          {() => (
            <ProtectedRoute>
              <QuizPage />
            </ProtectedRoute>
          )}
        </Route>
        {/* Agrega aquí otras rutas protegidas */}
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <GitHubPagesRouter />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}