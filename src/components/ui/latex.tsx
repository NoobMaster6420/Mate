import React, { useEffect } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface LatexProps {
  formula: string;
  displayMode?: boolean;
  className?: string;
}

function Latex({ formula, displayMode = true, className = '' }: LatexProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      katex.render(formula, containerRef.current, {
        displayMode,
        throwOnError: false,
      });
    }
  }, [formula, displayMode]);

  return <div ref={containerRef} className={className} />;
}

export { Latex }