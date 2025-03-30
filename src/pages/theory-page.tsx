import { useLocation } from 'wouter';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Latex } from '../components/ui/latex';
import { BackgroundMusic } from '../components/ui/background-music';

export default function TheoryPage() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-cyberdark text-white p-6">
      <BackgroundMusic src="/sounds/cyberpunk-ambient.mp3" volume={0.2} />
      
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-cyberprimary">Teoría</h1>
          <Button variant="cyberOutline" onClick={() => navigate("/")}>
            Volver al menú
          </Button>
        </div>
        
        <Tabs defaultValue="derivatives" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="derivatives">Derivadas</TabsTrigger>
            <TabsTrigger value="rules">Reglas</TabsTrigger>
            <TabsTrigger value="applications">Aplicaciones</TabsTrigger>
          </TabsList>
          
          <TabsContent value="derivatives">
            <Card className="bg-cyberdark-lighter border border-cyberprimary/30 shadow-lg shadow-cyberprimary/10">
              <CardHeader>
                <CardTitle className="text-2xl text-cyberprimary">
                  Conceptos Básicos de Derivadas
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium text-cyberprimary mb-3">Definición</h3>
                  <p className="text-gray-300 mb-4">
                    La derivada de una función en un punto representa la tasa de cambio instantánea de 
                    la función en ese punto. Geométricamente, es la pendiente de la recta tangente a 
                    la gráfica de la función en el punto dado.
                  </p>
                  
                  <div className="bg-cyberdark p-4 rounded-lg border border-cyberprimary/40 my-4">
                    <Latex formula="f'(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}" displayMode={true} />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium text-cyberprimary mb-3">Notaciones</h3>
                  <p className="text-gray-300 mb-4">
                    Existen varias notaciones para representar la derivada de una función:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-cyberdark p-4 rounded-lg border border-gray-700">
                      <h4 className="text-lg font-medium text-cyberprimary mb-2">Notación de Lagrange</h4>
                      <Latex formula="f'(x), f''(x), f^{(n)}(x)" displayMode={true} />
                    </div>
                    
                    <div className="bg-cyberdark p-4 rounded-lg border border-gray-700">
                      <h4 className="text-lg font-medium text-cyberprimary mb-2">Notación de Leibniz</h4>
                      <Latex formula="\frac{dy}{dx}, \frac{d^2y}{dx^2}, \frac{d^ny}{dx^n}" displayMode={true} />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium text-cyberprimary mb-3">Ejemplos Básicos</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DerivativeExample 
                      original="f(x) = x^2" 
                      derivative="f'(x) = 2x" 
                      explanation="Para la función potencia x^n, la derivada es nx^{n-1}" 
                    />
                    
                    <DerivativeExample 
                      original="f(x) = \sin(x)" 
                      derivative="f'(x) = \cos(x)" 
                      explanation="La derivada del seno es el coseno" 
                    />
                    
                    <DerivativeExample 
                      original="f(x) = e^x" 
                      derivative="f'(x) = e^x" 
                      explanation="La función exponencial e^x es su propia derivada" 
                    />
                    
                    <DerivativeExample 
                      original="f(x) = \ln(x)" 
                      derivative="f'(x) = \frac{1}{x}" 
                      explanation="La derivada del logaritmo natural es 1/x" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="rules">
            <Card className="bg-cyberdark-lighter border border-cyberprimary/30 shadow-lg shadow-cyberprimary/10">
              <CardHeader>
                <CardTitle className="text-2xl text-cyberprimary">
                  Reglas de Derivación
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium text-cyberprimary mb-3">Reglas Básicas</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <RuleCard 
                      title="Regla de la Suma"
                      formula="\frac{d}{dx}[f(x) + g(x)] = f'(x) + g'(x)"
                      example="Si f(x) = x^2 + \sin(x), entonces f'(x) = 2x + \cos(x)"
                    />
                    
                    <RuleCard 
                      title="Regla del Producto"
                      formula="\frac{d}{dx}[f(x) \cdot g(x)] = f'(x) \cdot g(x) + f(x) \cdot g'(x)"
                      example="Si f(x) = x \cdot \sin(x), entonces f'(x) = 1 \cdot \sin(x) + x \cdot \cos(x)"
                    />
                    
                    <RuleCard 
                      title="Regla del Cociente"
                      formula="\frac{d}{dx}\left[\frac{f(x)}{g(x)}\right] = \frac{f'(x) \cdot g(x) - f(x) \cdot g'(x)}{[g(x)]^2}"
                      example="Si f(x) = \frac{x^2}{\sin(x)}, entonces f'(x) = \frac{2x\sin(x) - x^2\cos(x)}{\sin^2(x)}"
                    />
                    
                    <RuleCard 
                      title="Regla de la Cadena"
                      formula="\frac{d}{dx}[f(g(x))] = f'(g(x)) \cdot g'(x)"
                      example="Si f(x) = \sin(x^2), entonces f'(x) = \cos(x^2) \cdot 2x"
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium text-cyberprimary mb-3">Derivadas de Funciones Compuestas</h3>
                  
                  <p className="text-gray-300 mb-4">
                    La regla de la cadena es fundamental para derivar funciones compuestas. Si tenemos 
                    y = f(g(x)), entonces y' = f'(g(x)) · g'(x).
                  </p>
                  
                  <div className="bg-cyberdark p-4 rounded-lg border border-gray-700 mb-4">
                    <h4 className="text-lg font-medium text-cyberprimary mb-2">Ejemplo</h4>
                    <p className="text-gray-300 mb-2">Para y = \sin(x^2):</p>
                    <Latex formula="y' = \cos(x^2) \cdot \frac{d}{dx}(x^2) = \cos(x^2) \cdot 2x = 2x\cos(x^2)" displayMode={true} />
                  </div>
                  
                  <div className="bg-cyberdark p-4 rounded-lg border border-gray-700">
                    <h4 className="text-lg font-medium text-cyberprimary mb-2">Proceso paso a paso</h4>
                    <ol className="list-decimal list-inside space-y-2 text-gray-300">
                      <li>Identificar la función externa f(u) = \sin(u) y la interna g(x) = x^2</li>
                      <li>Calcular la derivada de la función externa: f'(u) = \cos(u)</li>
                      <li>Calcular la derivada de la función interna: g'(x) = 2x</li>
                      <li>Aplicar la regla de la cadena: f'(g(x)) · g'(x) = \cos(x^2) · 2x</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="applications">
            <Card className="bg-cyberdark-lighter border border-cyberprimary/30 shadow-lg shadow-cyberprimary/10">
              <CardHeader>
                <CardTitle className="text-2xl text-cyberprimary">
                  Aplicaciones de las Derivadas
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium text-cyberprimary mb-3">Interpretación Geométrica</h3>
                  
                  <p className="text-gray-300 mb-4">
                    La derivada f'(a) representa la pendiente de la recta tangente a la gráfica de f 
                    en el punto (a, f(a)). Esto permite entender visualmente el comportamiento de la función.
                  </p>
                  
                  <div className="bg-cyberdark p-4 rounded-lg border border-gray-700 mb-6">
                    <h4 className="text-lg font-medium text-cyberprimary mb-2">Ecuación de la Recta Tangente</h4>
                    <Latex formula="y - f(a) = f'(a)(x - a)" displayMode={true} />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium text-cyberprimary mb-3">Optimización</h3>
                  
                  <p className="text-gray-300 mb-4">
                    Las derivadas son herramientas poderosas para encontrar máximos y mínimos de funciones, 
                    lo que es crucial para resolver problemas de optimización.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-cyberdark p-4 rounded-lg border border-gray-700">
                      <h4 className="text-lg font-medium text-cyberprimary mb-2">Puntos Críticos</h4>
                      <p className="text-gray-300">
                        Los puntos donde f'(x) = 0 o f'(x) no existe son candidatos a extremos (máximos o mínimos).
                      </p>
                    </div>
                    
                    <div className="bg-cyberdark p-4 rounded-lg border border-gray-700">
                      <h4 className="text-lg font-medium text-cyberprimary mb-2">Test de la Segunda Derivada</h4>
                      <p className="text-gray-300">
                        Si f'(c) = 0 y f''(c) {'<'} 0, entonces f tiene un máximo local en c.
                        Si f'(c) = 0 y f''(c) {'>'} 0, entonces f tiene un mínimo local en c.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium text-cyberprimary mb-3">Aplicaciones en Física</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-cyberdark p-4 rounded-lg border border-gray-700">
                      <h4 className="text-lg font-medium text-cyberprimary mb-2">Velocidad y Aceleración</h4>
                      <p className="text-gray-300 mb-2">
                        Si s(t) representa la posición de un objeto en el tiempo t:
                      </p>
                      <Latex formula="v(t) = s'(t) \quad \text{(velocidad)}" displayMode={true} />
                      <Latex formula="a(t) = v'(t) = s''(t) \quad \text{(aceleración)}" displayMode={true} />
                    </div>
                    
                    <div className="bg-cyberdark p-4 rounded-lg border border-gray-700">
                      <h4 className="text-lg font-medium text-cyberprimary mb-2">Tasas Relacionadas</h4>
                      <p className="text-gray-300">
                        Las derivadas permiten relacionar tasas de cambio de variables dependientes, 
                        como el radio y el volumen de una esfera que se expande.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <div className="w-full text-center">
                  <Button variant="cyber" onClick={() => navigate("/quiz")}>
                    Poner en práctica con Quiz
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Componentes auxiliares
function DerivativeExample({ 
  original, 
  derivative, 
  explanation 
}: { 
  original: string; 
  derivative: string; 
  explanation: string;
}) {
  return (
    <div className="bg-cyberdark p-4 rounded-lg border border-gray-700">
      <div className="mb-2">
        <Latex formula={original} displayMode={true} />
      </div>
      <div className="flex items-center mb-2">
        <span className="mr-2 text-lg">➡</span>
        <Latex formula={derivative} displayMode={true} />
      </div>
      <p className="text-gray-400 text-sm">{explanation}</p>
    </div>
  );
}

function RuleCard({ 
  title, 
  formula, 
  example 
}: { 
  title: string; 
  formula: string; 
  example: string;
}) {
  return (
    <div className="bg-cyberdark p-4 rounded-lg border border-gray-700">
      <h4 className="text-lg font-medium text-cyberprimary mb-2">{title}</h4>
      <div className="mb-3">
        <Latex formula={formula} displayMode={true} />
      </div>
      <div className="text-gray-400 text-sm">
        <span className="text-cyberprimary font-medium">Ejemplo: </span>
        <Latex formula={example} displayMode={false} />
      </div>
    </div>
  );
}