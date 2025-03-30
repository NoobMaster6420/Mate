import { Link } from 'wouter';
import { Button } from '../components/ui-core';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-6xl font-bold text-primary mb-4 cyberpunk-text">404</h1>
      <h2 className="text-2xl font-bold mb-6">Página no encontrada</h2>
      
      <p className="text-foreground/80 max-w-md mb-8">
        La página que estás buscando parece haber sido desconectada del CyberEspacio o nunca existió.
      </p>
      
      <div className="w-full max-w-xs cyberpunk-border p-6 mb-8">
        <div className="font-mono text-sm text-primary">
          <p className="mb-2">&gt; error_code: 404</p>
          <p className="mb-2">&gt; location: undefined</p>
          <p>&gt; status: connection_lost</p>
        </div>
      </div>
      
      <Link href="/">
        <a>
          <Button variant="primary">
            Volver al Inicio
          </Button>
        </a>
      </Link>
    </div>
  );
}