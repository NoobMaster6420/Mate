import { Question } from './localStorage';

// Función para obtener un número aleatorio en un rango
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Función para generar un ID único
function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Función para generar problemas matemáticos básicos
export function generateBasicMathProblem(): Question {
  const operations = ['+', '-', '×', '÷'];
  const operation = operations[getRandomInt(0, 3)];
  let a: number, b: number, result: number, formula: string;

  switch (operation) {
    case '+':
      a = getRandomInt(1, 100);
      b = getRandomInt(1, 100);
      result = a + b;
      formula = `${a} + ${b}`;
      break;
    case '-':
      a = getRandomInt(10, 100);
      b = getRandomInt(1, a);
      result = a - b;
      formula = `${a} - ${b}`;
      break;
    case '×':
      a = getRandomInt(1, 12);
      b = getRandomInt(1, 12);
      result = a * b;
      formula = `${a} \\times ${b}`;
      break;
    case '÷':
      b = getRandomInt(1, 12);
      result = getRandomInt(1, 10);
      a = b * result;
      formula = `${a} \\div ${b}`;
      break;
    default:
      a = getRandomInt(1, 100);
      b = getRandomInt(1, 100);
      result = a + b;
      formula = `${a} + ${b}`;
  }

  // Generar opciones incorrectas
  const incorrectOptions: number[] = [];
  while (incorrectOptions.length < 3) {
    const offset = getRandomInt(-10, 10);
    if (offset !== 0 && !incorrectOptions.includes(result + offset) && (result + offset) > 0) {
      incorrectOptions.push(result + offset);
    }
  }

  // Crear las opciones
  const options = [
    { id: 'A', formula: `${result}` },
    { id: 'B', formula: `${incorrectOptions[0]}` },
    { id: 'C', formula: `${incorrectOptions[1]}` },
    { id: 'D', formula: `${incorrectOptions[2]}` }
  ];

  // Mezclar las opciones
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  // Encontrar la opción correcta después de mezclar
  const correctOption = options.find(option => option.formula === `${result}`);
  const correctOptionId = correctOption ? correctOption.id : 'A';

  return {
    id: getRandomInt(1000, 9999),
    question: `Calcula el resultado de la operación:`,
    formula,
    options,
    correctOptionId,
    explanation: `La respuesta correcta es ${result} porque ${formula} = ${result}`,
    difficulty: 'easy'
  };
}

// Función para generar problemas de probabilidad
export function generateProbabilityProblem(): Question {
  const types = [
    'dice', 'cards', 'balls'
  ];
  
  const type = types[getRandomInt(0, types.length - 1)];
  let question: string, formula: string, result: number, explanation: string;
  
  switch (type) {
    case 'dice':
      const diceCount = getRandomInt(1, 3);
      const targetSum = getRandomInt(diceCount, diceCount * 6);
      
      if (diceCount === 1) {
        const favorableCases = 1;
        const totalCases = 6;
        result = favorableCases / totalCases;
        question = `¿Cuál es la probabilidad de obtener un ${targetSum} al lanzar un dado?`;
        formula = `P(X = ${targetSum}) = \\frac{${favorableCases}}{${totalCases}}`;
        explanation = `La probabilidad de obtener un ${targetSum} al lanzar un dado es ${favorableCases}/${totalCases} = ${result}`;
      } else if (diceCount === 2) {
        // Para simplificar, usamos una aproximación para dos dados
        const favorableCases = Math.max(0, 6 - Math.abs(targetSum - 7));
        const totalCases = 36;
        result = favorableCases / totalCases;
        question = `¿Cuál es la probabilidad de obtener una suma de ${targetSum} al lanzar dos dados?`;
        formula = `P(X = ${targetSum}) = \\frac{${favorableCases}}{${totalCases}}`;
        explanation = `La probabilidad de obtener una suma de ${targetSum} al lanzar dos dados es ${favorableCases}/${totalCases} = ${result.toFixed(4)}`;
      } else {
        // Para tres dados, simplificamos aún más
        const favorableCases = getRandomInt(1, 10);
        const totalCases = 216; // 6^3
        result = favorableCases / totalCases;
        question = `¿Cuál es la probabilidad aproximada de obtener una suma de ${targetSum} al lanzar tres dados?`;
        formula = `P(X = ${targetSum}) \\approx \\frac{${favorableCases}}{${totalCases}}`;
        explanation = `La probabilidad aproximada de obtener una suma de ${targetSum} al lanzar tres dados es ${favorableCases}/${totalCases} = ${result.toFixed(4)}`;
      }
      break;
      
    case 'cards':
      const cardTypes = ['corazones', 'diamantes', 'tréboles', 'picas'];
      const cardType = cardTypes[getRandomInt(0, 3)];
      const isRed = cardType === 'corazones' || cardType === 'diamantes';
      
      if (getRandomInt(0, 1) === 0) {
        // Probabilidad de sacar una carta de un palo específico
        const favorableCases = 13;
        const totalCases = 52;
        result = favorableCases / totalCases;
        question = `¿Cuál es la probabilidad de sacar una carta de ${cardType} de una baraja estándar?`;
        formula = `P(${cardType}) = \\frac{${favorableCases}}{${totalCases}}`;
        explanation = `La probabilidad de sacar una carta de ${cardType} es ${favorableCases}/${totalCases} = ${result.toFixed(4)}`;
      } else {
        // Probabilidad de sacar una carta roja o negra
        const favorableCases = isRed ? 26 : 26;
        const totalCases = 52;
        result = favorableCases / totalCases;
        question = `¿Cuál es la probabilidad de sacar una carta ${isRed ? 'roja' : 'negra'} de una baraja estándar?`;
        formula = `P(${isRed ? 'roja' : 'negra'}) = \\frac{${favorableCases}}{${totalCases}}`;
        explanation = `La probabilidad de sacar una carta ${isRed ? 'roja' : 'negra'} es ${favorableCases}/${totalCases} = ${result.toFixed(4)}`;
      }
      break;
      
    case 'balls':
      const redBalls = getRandomInt(1, 5);
      const blueBalls = getRandomInt(1, 5);
      const greenBalls = getRandomInt(1, 5);
      const totalBalls = redBalls + blueBalls + greenBalls;
      
      const colors = ['roja', 'azul', 'verde'];
      const selectedColor = colors[getRandomInt(0, 2)];
      let favorableCases;
      
      switch (selectedColor) {
        case 'roja':
          favorableCases = redBalls;
          break;
        case 'azul':
          favorableCases = blueBalls;
          break;
        case 'verde':
          favorableCases = greenBalls;
          break;
        default:
          favorableCases = redBalls;
      }
      
      result = favorableCases / totalBalls;
      question = `En una urna hay ${redBalls} bolas rojas, ${blueBalls} bolas azules y ${greenBalls} bolas verdes. ¿Cuál es la probabilidad de sacar una bola ${selectedColor}?`;
      formula = `P(${selectedColor}) = \\frac{${favorableCases}}{${totalBalls}}`;
      explanation = `La probabilidad de sacar una bola ${selectedColor} es ${favorableCases}/${totalBalls} = ${result.toFixed(4)}`;
      break;
      
    default:
      // Caso por defecto
      const defaultFavorable = getRandomInt(1, 5);
      const defaultTotal = getRandomInt(6, 10);
      result = defaultFavorable / defaultTotal;
      question = `¿Cuál es la probabilidad de seleccionar ${defaultFavorable} elementos favorables de un total de ${defaultTotal} elementos?`;
      formula = `P(A) = \\frac{${defaultFavorable}}{${defaultTotal}}`;
      explanation = `La probabilidad es ${defaultFavorable}/${defaultTotal} = ${result.toFixed(4)}`;
  }
  
  // Generar opciones incorrectas
  const incorrectOptions: number[] = [];
  while (incorrectOptions.length < 3) {
    const offset = (Math.random() * 0.3) - 0.15; // Desviación de ±0.15
    const incorrectResult = Math.max(0, Math.min(1, result + offset)); // Mantener entre 0 y 1
    if (Math.abs(incorrectResult - result) > 0.01 && !incorrectOptions.includes(incorrectResult)) {
      incorrectOptions.push(parseFloat(incorrectResult.toFixed(4)));
    }
  }
  
  // Crear las opciones
  const options = [
    { id: 'A', formula: `${result.toFixed(4)}` },
    { id: 'B', formula: `${incorrectOptions[0]}` },
    { id: 'C', formula: `${incorrectOptions[1]}` },
    { id: 'D', formula: `${incorrectOptions[2]}` }
  ];
  
  // Mezclar las opciones
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  // Encontrar la opción correcta después de mezclar
  const correctOption = options.find(option => parseFloat(option.formula) === parseFloat(result.toFixed(4)));
  const correctOptionId = correctOption ? correctOption.id : 'A';
  
  return {
    id: getRandomInt(1000, 9999),
    question,
    formula,
    options,
    correctOptionId,
    explanation,
    difficulty: 'medium'
  };
}

// Función para generar problemas de derivadas simples
export function generateSimpleDerivativeProblem(): Question {
  // Tipos de funciones para derivar
  const functionTypes = [
    'polynomial', // Polinomios
    'exponential', // Funciones exponenciales
    'trigonometric', // Funciones trigonométricas
  ];
  
  const type = functionTypes[getRandomInt(0, functionTypes.length - 1)];
  let func: string, derivative: string, question: string, formula: string, explanation: string;
  
  switch (type) {
    case 'polynomial':
      const degree = getRandomInt(1, 3); // Grado del polinomio (1-3)
      let coefficients: number[] = [];
      
      // Generar coeficientes aleatorios
      for (let i = 0; i <= degree; i++) {
        coefficients.push(getRandomInt(-5, 5));
        if (i === degree && coefficients[i] === 0) {
          coefficients[i] = getRandomInt(1, 5); // Asegurar que el coeficiente principal no sea cero
        }
      }
      
      // Construir la función y su derivada
      func = '';
      derivative = '';
      
      for (let i = degree; i >= 0; i--) {
        if (coefficients[i] !== 0) {
          const sign = coefficients[i] > 0 ? (i === degree ? '' : '+') : '';
          
          if (i > 1) {
            func += `${sign}${coefficients[i]}x^${i}`;
            derivative += `${sign}${coefficients[i] * i}x^${i - 1}`;
          } else if (i === 1) {
            func += `${sign}${coefficients[i]}x`;
            derivative += `${sign}${coefficients[i]}`;
          } else {
            func += `${sign}${coefficients[i]}`;
            // El término constante desaparece en la derivada
          }
        }
      }
      
      if (func === '') func = '0';
      if (derivative === '') derivative = '0';
      
      formula = `f(x) = ${func}`;
      question = `Calcula la derivada de la función:`;
      explanation = `La derivada de ${func} es ${derivative}`;
      break;
      
    case 'exponential':
      const base = getRandomInt(0, 1) === 0 ? 'e' : getRandomInt(2, 5);
      const coefficient = getRandomInt(1, 5);
      
      if (base === 'e') {
        func = coefficient === 1 ? 'e^x' : `${coefficient}e^x`;
        derivative = coefficient === 1 ? 'e^x' : `${coefficient}e^x`;
        formula = `f(x) = ${func}`;
        explanation = `La derivada de ${func} es ${derivative} porque la derivada de e^x es e^x`;
      } else {
        func = coefficient === 1 ? `${base}^x` : `${coefficient} \\cdot ${base}^x`;
        derivative = `${coefficient} \\cdot \\ln(${base}) \\cdot ${base}^x`;
        formula = `f(x) = ${func}`;
        explanation = `La derivada de ${func} es ${derivative} porque la derivada de a^x es ln(a) · a^x`;
      }
      
      question = `Calcula la derivada de la función:`;
      break;
      
    case 'trigonometric':
      const trigFunctions = ['\\sin', '\\cos', '\\tan'];
      const selectedTrig = trigFunctions[getRandomInt(0, 2)];
      const trigCoef = getRandomInt(1, 5);
      
      func = trigCoef === 1 ? `${selectedTrig}(x)` : `${trigCoef}${selectedTrig}(x)`;
      
      if (selectedTrig === '\\sin') {
        derivative = trigCoef === 1 ? '\\cos(x)' : `${trigCoef}\\cos(x)`;
        explanation = `La derivada de ${func} es ${derivative} porque la derivada de sin(x) es cos(x)`;
      } else if (selectedTrig === '\\cos') {
        derivative = trigCoef === 1 ? '-\\sin(x)' : `-${trigCoef}\\sin(x)`;
        explanation = `La derivada de ${func} es ${derivative} porque la derivada de cos(x) es -sin(x)`;
      } else {
        derivative = trigCoef === 1 ? '\\sec^2(x)' : `${trigCoef}\\sec^2(x)`;
        explanation = `La derivada de ${func} es ${derivative} porque la derivada de tan(x) es sec²(x)`;
      }
      
      formula = `f(x) = ${func}`;
      question = `Calcula la derivada de la función:`;
      break;
      
    default:
      // Caso default (nunca debería llegar aquí)
      func = 'x^2';
      derivative = '2x';
      formula = `f(x) = ${func}`;
      question = `Calcula la derivada de la función:`;
      explanation = `La derivada de x² es 2x`;
  }
  
  // Generar opciones incorrectas para derivadas
  const incorrectDerivatives = [];
  
  // Generamos 3 derivadas incorrectas basadas en errores comunes
  if (type === 'polynomial') {
    // Para polinomios, podemos:
    // 1. Mantener algún exponente igual
    // 2. Cambiar algún signo
    // 3. Cambiar algún coeficiente
    
    const parts = derivative.split(/[+\-]/);
    const modifiedDerivative1 = derivative.replace(/(\d+)x\^(\d+)/, (match, coef, exp) => 
      `${parseInt(coef) + getRandomInt(1, 3)}x^${exp}`);
    
    const modifiedDerivative2 = derivative.replace(/[+\-]/, (match) => 
      match === '+' ? '-' : '+');
    
    const modifiedDerivative3 = derivative.replace(/x\^(\d+)/, (match, exp) => 
      `x^${parseInt(exp) + getRandomInt(1, 2)}`);
    
    incorrectDerivatives.push(modifiedDerivative1, modifiedDerivative2, modifiedDerivative3);
  } else if (type === 'exponential') {
    // Para exponenciales
    if (base === 'e') {
      incorrectDerivatives.push(
        `${coefficient}xe^x`,
        `${coefficient}x \\cdot e^x`,
        `${coefficient + 1}e^x`
      );
    } else {
      incorrectDerivatives.push(
        `${coefficient} \\cdot ${base} \\cdot ${base}^{x-1}`,
        `${coefficient} \\cdot ${base}^x \\cdot x`,
        `${coefficient + 1} \\cdot \\ln(${base}) \\cdot ${base}^x`
      );
    }
  } else if (type === 'trigonometric') {
    // Para trigonométricas
    if (selectedTrig === '\\sin') {
      incorrectDerivatives.push(
        `-${trigCoef}\\cos(x)`,
        `${trigCoef}\\sin(x)`,
        `${trigCoef}\\tan(x)`
      );
    } else if (selectedTrig === '\\cos') {
      incorrectDerivatives.push(
        `${trigCoef}\\sin(x)`,
        `-${trigCoef}\\cos(x)`,
        `-${trigCoef}\\tan(x)`
      );
    } else {
      incorrectDerivatives.push(
        `${trigCoef}\\cos(x)/\\sin^2(x)`,
        `${trigCoef}/\\cos^2(x)`,
        `${trigCoef}\\sec(x)\\tan(x)`
      );
    }
  }
  
  // Crear las opciones
  const options = [
    { id: 'A', formula: derivative },
    { id: 'B', formula: incorrectDerivatives[0] },
    { id: 'C', formula: incorrectDerivatives[1] },
    { id: 'D', formula: incorrectDerivatives[2] }
  ];
  
  // Mezclar las opciones
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  // Encontrar la opción correcta después de mezclar
  const correctOption = options.find(option => option.formula === derivative);
  const correctOptionId = correctOption ? correctOption.id : 'A';
  
  return {
    id: getRandomInt(1000, 9999),
    question,
    formula,
    options,
    correctOptionId,
    explanation,
    difficulty: 'hard'
  };
}

// Función para generar preguntas de acuerdo al nivel
export function generateMathQuestion(level: number): Question {
  switch (level) {
    case 1:
      return generateBasicMathProblem();
    case 2:
      return generateProbabilityProblem();
    case 3:
      return generateSimpleDerivativeProblem();
    default:
      return generateBasicMathProblem();
  }
}