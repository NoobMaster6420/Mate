import { Link } from 'wouter';
import { useAuth } from '../hooks/auth-context';
import { Button } from './ui-core';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-border bg-card py-3">
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link href="/">
            <span className="text-xl font-bold text-primary neon-glow cursor-pointer">CyberCalc</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-foreground hover:text-primary transition-colors">
            Inicio
          </Link>
          <Link href="/quiz" className="text-foreground hover:text-primary transition-colors">
            Quiz
          </Link>
          {/* Agregar más enlaces según sea necesario */}
        </nav>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <div className="hidden md:flex items-center space-x-2">
                <span className="text-foreground">
                  <span className="font-medium text-primary">{user.username}</span>
                </span>
                <span className="text-foreground text-sm">
                  Puntos: <span className="font-medium text-primary">{user.points}</span>
                </span>
              </div>
              <Button
                onClick={() => logout()}
                variant="outline"
                size="sm"
                className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                Cerrar Sesión
              </Button>
            </>
          ) : (
            <Link href="/auth">
              <Button
                variant="primary"
                size="sm"
                className="bg-primary text-white hover:bg-primary-dark"
              >
                Iniciar Sesión
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}