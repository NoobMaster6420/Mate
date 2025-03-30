import React, { useEffect } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface LatexProps {
  formula: string;
  displayMode?: boolean;
  className?: string;
}

/**
 * Componente para renderizar fórmulas matemáticas usando KaTeX
 */
export default function Latex({ formula, displayMode = true, className = '' }: LatexProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(formula, containerRef.current, {
          displayMode,
          throwOnError: false
        });
      } catch (e) {
        console.error('Error al renderizar fórmula LaTeX:', e);
        if (containerRef.current) {
          containerRef.current.innerHTML = `<span class="text-red-500">Error: ${formula}</span>`;
        }
      }
    }
  }, [formula, displayMode]);

  return (
    <div 
      ref={containerRef}
      className={`latex-formula ${className}`}
      data-testid="latex-formula"
    />
  );
}