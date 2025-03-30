import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../hooks/auth-context';
import { storage } from '../lib/localStorage';
import { generateQuizQuestion } from '../lib/math-utils';
import { ProtectedRoute } from '../lib/protected-route';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Latex } from '../components/ui/latex';
import { Progress } from '../components/ui/progress';
import { BackgroundMusic } from '../components/ui/background-music';

type GameState = 'intro' | 'playing' | 'question' | 'paused' | 'gameOver';

export default function GamePage() {
  return (
    <ProtectedRoute>
      <GameContent />
    </ProtectedRoute>
  );
}

function GameContent() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [gameState, setGameState] = useState<GameState>('intro');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(user?.lives || 3);
  const [currentQuestion, setCurrentQuestion] = useState(generateQuizQuestion('easy'));
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPaused, setIsPaused] = useState(false);

  // Manejar el tiempo del juego
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (gameState === 'playing' && !isPaused) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameState('question');
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameState, isPaused]);

  // Actualizar vidas en el localStorage cuando cambien
  useEffect(() => {
    if (user && lives !== user.lives) {
      storage.updateUserLives(user.id, lives);
    }
  }, [lives, user]);

  // Actualizar puntos en el localStorage cuando cambien
  useEffect(() => {
    if (user && score > 0 && score !== user.points) {
      storage.updateUserPoints(user.id, user.points + score);
    }
  }, [score, user]);

  const startGame = () => {
    setGameState('playing');
    setLevel(1);
    setScore(0);
    setLives(3);
    setTimeLeft(30);
    setCurrentQuestion(generateQuizQuestion('easy'));
  };

  const pauseGame = () => {
    setIsPaused(!isPaused);
  };

  const handleSelectOption = (optionId: string) => {
    setSelectedOption(optionId);
    const isAnswerCorrect = optionId === currentQuestion.correctOptionId;
    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      // Sumar puntos basados en el nivel y tiempo restante
      const pointsEarned = level * 10 + Math.floor(timeLeft * 0.5);
      setScore((prev) => prev + pointsEarned);
      
      // Preparar para siguiente nivel
      setTimeout(() => {
        setShowExplanation(true);
      }, 1000);
    } else {
      // Restar una vida
      setLives((prev) => prev - 1);
      
      if (lives <= 1) {
        // Game over si no quedan vidas
        setTimeout(() => {
          setGameState('gameOver');
        }, 1000);
      } else {
        // Mostrar explicación tras respuesta incorrecta
        setTimeout(() => {
          setShowExplanation(true);
        }, 1000);
      }
    }
  };

  const handleNextQuestion = () => {
    setShowExplanation(false);
    setSelectedOption(null);
    setIsCorrect(null);
    
    if (isCorrect) {
      // Subir de nivel y generar nueva pregunta
      const newLevel = level + 1;
      setLevel(newLevel);
      
      // Determinar dificultad basada en nivel
      let difficulty: 'easy' | 'medium' | 'hard' = 'easy';
      if (newLevel >= 8) {
        difficulty = 'hard';
      } else if (newLevel >= 4) {
        difficulty = 'medium';
      }
      
      setCurrentQuestion(generateQuizQuestion(difficulty));
      setTimeLeft(30); // Reiniciar tiempo
      setGameState('playing');
    } else {
      // Mantener nivel pero nueva pregunta
      
      // Determinar dificultad basada en nivel actual
      let difficulty: 'easy' | 'medium' | 'hard' = 'easy';
      if (level >= 8) {
        difficulty = 'hard';
      } else if (level >= 4) {
        difficulty = 'medium';
      }
      
      setCurrentQuestion(generateQuizQuestion(difficulty));
      setTimeLeft(30); // Reiniciar tiempo
      setGameState('playing');
    }
  };

  return (
    <div className="min-h-screen bg-cyberdark text-white flex flex-col">
      <BackgroundMusic src="/sounds/cyberpunk-game.mp3" volume={0.2} />
      
      <div className="flex-1 p-4 md:p-8 flex flex-col">
        {/* Game Header */}
        {gameState !== 'intro' && gameState !== 'gameOver' && (
          <div className="mb-6 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Badge variant="cyber">Nivel {level}</Badge>
              <Badge variant="cyberSecondary">Puntos: {score}</Badge>
              <div className="flex items-center">
                {[...Array(3)].map((_, i) => (
                  <span key={i} className="mx-1 text-xl">
                    {i < lives ? "❤️" : "🖤"}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge variant="cyberAccent" className="text-lg">
                {timeLeft}s
              </Badge>
              <Button 
                variant="cyberOutline" 
                size="sm" 
                onClick={pauseGame}
              >
                {isPaused ? "Reanudar" : "Pausa"}
              </Button>
            </div>
          </div>
        )}

        {/* Game Content */}
        <div className="flex-1 flex items-center justify-center">
          {gameState === 'intro' && (
            <IntroScreen onStart={startGame} />
          )}
          
          {gameState === 'playing' && !isPaused && (
            <GameplayScreen 
              question={currentQuestion}
              selectedOption={selectedOption}
              isCorrect={isCorrect}
              onSelectOption={handleSelectOption}
              timeLeft={timeLeft}
            />
          )}
          
          {gameState === 'question' || showExplanation && (
            <ExplanationScreen 
              question={currentQuestion}
              selectedOption={selectedOption}
              isCorrect={isCorrect}
              onNext={handleNextQuestion}
            />
          )}
          
          {isPaused && (
            <PauseScreen onResume={pauseGame} onQuit={() => navigate('/')} />
          )}
          
          {gameState === 'gameOver' && (
            <GameOverScreen 
              score={score} 
              level={level} 
              onRestart={startGame} 
              onQuit={() => navigate('/')} 
            />
          )}
        </div>
      </div>
    </div>
  );
}

function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <Card className="w-full max-w-3xl p-8 bg-cyberdark-lighter border border-cyberprimary/30 shadow-lg shadow-cyberprimary/10">
      <h1 className="text-4xl font-bold text-cyberprimary mb-6">Modo Historia</h1>
      
      <div className="space-y-4 mb-8">
        <p className="text-lg">
          Bienvenido al año 2077. La corporación NetCalc controla toda la información matemática del mundo.
          Tu misión como hacker es infiltrarte en su sistema y demostrar tu dominio de las matemáticas.
        </p>
        <p className="text-lg">
          Responde correctamente a las preguntas matemáticas para avanzar de nivel, 
          ganar puntos y desbloquear nuevos desafíos.
        </p>
        <p className="text-lg">
          Tienes 3 vidas. Cada vez que falles una pregunta, perderás una vida.
          Si pierdes todas tus vidas, el juego terminará.
        </p>
      </div>
      
      <div className="flex justify-center">
        <Button variant="cyber" size="lg" onClick={onStart}>
          Iniciar Misión
        </Button>
      </div>
    </Card>
  );
}

function GameplayScreen({ 
  question, 
  selectedOption, 
  isCorrect,
  onSelectOption,
  timeLeft
}: { 
  question: any; 
  selectedOption: string | null;
  isCorrect: boolean | null;
  onSelectOption: (id: string) => void;
  timeLeft: number;
}) {
  return (
    <Card className="w-full max-w-3xl p-6 bg-cyberdark-lighter border border-cyberprimary/30 shadow-lg shadow-cyberprimary/10">
      <div className="mb-4">
        <Progress value={(timeLeft / 30) * 100} className="h-2" />
      </div>
      
      <h2 className="text-xl font-medium text-gray-200 mb-4">{question.question}</h2>
      
      <div className="flex justify-center my-6">
        <div className="bg-cyberdark p-4 rounded-lg border border-cyberprimary/40">
          <Latex formula={question.formula} displayMode={true} className="text-2xl" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {question.options.map((option: any) => (
          <Button
            key={option.id}
            variant={
              selectedOption === option.id
                ? isCorrect === true
                  ? "cyber"
                  : "cyberDestructive"
                : "cyberOutline"
            }
            className="p-4 h-auto text-lg"
            disabled={selectedOption !== null}
            onClick={() => onSelectOption(option.id)}
          >
            <div className="flex items-center justify-between w-full">
              <span className="mr-3">{option.id}:</span>
              <Latex formula={option.formula} displayMode={false} />
            </div>
          </Button>
        ))}
      </div>
    </Card>
  );
}

function ExplanationScreen({ 
  question, 
  selectedOption, 
  isCorrect,
  onNext 
}: { 
  question: any; 
  selectedOption: string | null;
  isCorrect: boolean | null;
  onNext: () => void;
}) {
  return (
    <Card className="w-full max-w-3xl p-8 bg-cyberdark-lighter border border-cyberprimary/30 shadow-lg shadow-cyberprimary/10">
      <div className="text-center mb-6">
        <Badge variant={isCorrect ? "cyber" : "cyberDestructive"} className="text-lg px-4 py-1">
          {isCorrect ? "¡Respuesta Correcta!" : "Respuesta Incorrecta"}
        </Badge>
      </div>
      
      <div className="bg-cyberdark/50 p-6 rounded-lg border border-gray-700 mb-6">
        <h3 className="text-xl font-medium text-cyberprimary mb-4">Explicación:</h3>
        <p className="text-gray-300 whitespace-pre-line">{question.explanation}</p>
        
        <div className="mt-4">
          <h4 className="text-lg font-medium text-cyberprimary mb-2">Fórmula:</h4>
          <div className="bg-cyberdark p-3 rounded border border-cyberprimary/30">
            <Latex formula={question.formula} displayMode={true} />
          </div>
        </div>
        
        <div className="mt-4">
          <h4 className="text-lg font-medium text-cyberprimary mb-2">Respuesta Correcta:</h4>
          <div className="bg-cyberdark p-3 rounded border border-cyberaccent/30">
            <div className="flex items-center">
              <span className="mr-3 text-cyberaccent">{question.correctOptionId}:</span>
              <Latex 
                formula={question.options.find((o: any) => o.id === question.correctOptionId).formula} 
                displayMode={false} 
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center">
        <Button variant="cyber" onClick={onNext}>
          {isCorrect ? "Siguiente Nivel" : "Intentar Otra Vez"}
        </Button>
      </div>
    </Card>
  );
}

function PauseScreen({ onResume, onQuit }: { onResume: () => void; onQuit: () => void }) {
  return (
    <Card className="w-full max-w-md p-8 bg-cyberdark-lighter border border-cyberprimary/30 shadow-lg shadow-cyberprimary/10 text-center">
      <h2 className="text-3xl font-bold text-cyberprimary mb-8">Juego Pausado</h2>
      
      <div className="space-y-4">
        <Button variant="cyber" className="w-full" onClick={onResume}>
          Reanudar Juego
        </Button>
        
        <Button variant="cyberOutline" className="w-full" onClick={onQuit}>
          Salir al Menú Principal
        </Button>
      </div>
    </Card>
  );
}

function GameOverScreen({ 
  score, 
  level,
  onRestart, 
  onQuit 
}: { 
  score: number; 
  level: number;
  onRestart: () => void; 
  onQuit: () => void; 
}) {
  return (
    <Card className="w-full max-w-2xl p-8 bg-cyberdark-lighter border border-cyberprimary/30 shadow-lg shadow-cyberprimary/10 text-center">
      <h2 className="text-4xl font-bold text-cyberdestructive mb-2">GAME OVER</h2>
      <p className="text-gray-400 mb-8">La seguridad de NetCalc te ha detectado</p>
      
      <div className="bg-cyberdark/50 p-6 rounded-lg border border-gray-700 mb-8">
        <div className="text-2xl mb-4">Resultados:</div>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-gray-400">Nivel Alcanzado</div>
            <div className="text-3xl font-bold text-cyberprimary">{level}</div>
          </div>
          <div>
            <div className="text-gray-400">Puntuación Total</div>
            <div className="text-3xl font-bold text-cyberaccent">{score}</div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="cyber" onClick={onRestart}>
          Intentar Otra Vez
        </Button>
        
        <Button variant="cyberOutline" onClick={onQuit}>
          Volver al Menú Principal
        </Button>
      </div>
    </Card>
  );
}