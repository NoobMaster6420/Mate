import { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface LatexFormulaProps {
  formula: string;
  displayMode?: boolean;
  className?: string;
}

export default function LatexFormula({ 
  formula, 
  displayMode = true, 
  className = '' 
}: LatexFormulaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(formula, containerRef.current, {
          displayMode: displayMode,
          throwOnError: false,
          strict: false
        });
      } catch (e) {
        console.error('Error rendering LaTeX formula:', e);
        if (containerRef.current) {
          containerRef.current.innerHTML = `<span class="text-red-500">Error: ${formula}</span>`;
        }
      }
    }
  }, [formula, displayMode]);
  
  return (
    <div 
      ref={containerRef} 
      className={`katex-container ${className}`} 
      aria-label={`Formula matemática: ${formula}`}
    />
  );
}