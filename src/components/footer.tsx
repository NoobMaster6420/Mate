import { Link } from 'wouter';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo y Descripción */}
          <div className="flex flex-col space-y-3">
            <Link href="/">
              <a className="text-xl font-bold text-primary">CyberCalc</a>
            </Link>
            <p className="text-sm text-foreground/80">
              Una experiencia educativa inmersiva para aprender cálculo de derivadas mediante elementos interactivos y gamificados en un entorno cyberpunk.
            </p>
          </div>

          {/* Enlaces Rápidos */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-lg font-medium text-foreground">Enlaces Rápidos</h3>
            <div className="flex flex-col space-y-2">
              <Link href="/">
                <a className="text-foreground/80 hover:text-primary transition-colors">Inicio</a>
              </Link>
              <Link href="/quiz">
                <a className="text-foreground/80 hover:text-primary transition-colors">Quiz</a>
              </Link>
              <Link href="/auth">
                <a className="text-foreground/80 hover:text-primary transition-colors">Acceder</a>
              </Link>
            </div>
          </div>

          {/* Contacto */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-lg font-medium text-foreground">Contacto</h3>
            <p className="text-sm text-foreground/80">
              Si tienes alguna pregunta o sugerencia, no dudes en contactarnos.
            </p>
            <a 
              href="mailto:contact@cybercalc.edu" 
              className="text-primary hover:text-primary-dark transition-colors"
            >
              contact@cybercalc.edu
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border mt-8 pt-6 text-center text-sm text-foreground/70">
          <p>© {currentYear} CyberCalc. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}