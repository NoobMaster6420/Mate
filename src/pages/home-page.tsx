import { Link } from 'wouter';
import { Button, Card, Badge } from '../components/ui-core';
import { useAuth } from '../hooks/auth-context';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-background to-card">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 cyberpunk-text">
            <span className="gradient-text">Cyber</span>Calc
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-foreground/80">
            Una experiencia educativa inmersiva para aprender cálculo diferencial mediante tecnologías interactivas y gamificadas.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {user ? (
              <Link href="/quiz">
                <Button 
                  variant="primary" 
                  size="lg"
                  className="animate-pulse-slow"
                >
                  Continuar Aprendiendo
                </Button>
              </Link>
            ) : (
              <Link href="/auth">
                <Button 
                  variant="primary" 
                  size="lg"
                  className="animate-pulse-slow"
                >
                  Empezar Ahora
                </Button>
              </Link>
            )}
            <Link href="/quiz">
              <Button variant="outline" size="lg">
                Explorar Desafíos
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 gradient-text">
            Características Principales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="cyberpunk-border">
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <span className="text-primary text-2xl">🎮</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Aprendizaje Gamificado</h3>
                <p className="text-foreground/80">
                  Aprende mientras juegas y completas desafíos con nuestro sistema de gamificación.
                </p>
              </div>
            </Card>
            
            <Card className="cyberpunk-border">
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <span className="text-primary text-2xl">📊</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Seguimiento de Progreso</h3>
                <p className="text-foreground/80">
                  Visualiza tu avance y mejora continua con nuestro sistema de seguimiento personalizado.
                </p>
              </div>
            </Card>
            
            <Card className="cyberpunk-border">
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <span className="text-primary text-2xl">🌐</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Experiencia Inmersiva</h3>
                <p className="text-foreground/80">
                  Sumérgete en un mundo cyberpunk mientras aprendes conceptos matemáticos avanzados.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-t from-background to-card">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 cyberpunk-text">
            ¿Listo para dominar el cálculo?
          </h2>
          <p className="text-lg max-w-2xl mx-auto mb-8 text-foreground/80">
            Únete a miles de estudiantes que ya están mejorando sus habilidades matemáticas con CyberCalc.
          </p>
          <div className="flex justify-center">
            {user ? (
              <Link href="/quiz">
                <Button variant="primary" size="lg">
                  Ir a mis desafíos
                </Button>
              </Link>
            ) : (
              <Link href="/auth">
                <Button variant="primary" size="lg">
                  Crear cuenta gratis
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}