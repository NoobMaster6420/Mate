import { useState, useEffect } from 'react';
import { Button, Card, Badge } from '../components/ui-core';
import { useAuth } from '../hooks/auth-context';
import { LocalStorageService, Quiz } from '../lib/localStorage';
import { generateMathQuestion } from '../lib/math-utils';
import Latex from '../components/latex';

type Difficulty = 'easy' | 'medium' | 'hard' | null;

export default function QuizPage() {
  const { user } = useAuth();
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(null);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  // Manejar la selección de dificultad
  const handleSelectDifficulty = (difficulty: Difficulty) => {
    if (!user) return;
    
    setSelectedDifficulty(difficulty);
    
    // Crear un nuevo quiz
    const newQuiz = LocalStorageService.createQuiz(user.id, difficulty!);
    setCurrentQuiz(newQuiz);
    
    // Generar preguntas según la dificultad
    const difficultyLevel = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 5 : 8;
    
    // Generar 5 preguntas
    const generatedQuestions = Array.from({ length: 5 }, (_, index) => {
      // Incrementar el nivel de dificultad gradualmente
      const questionLevel = difficultyLevel + Math.floor(index / 2);
      return generateMathQuestion(questionLevel);
    });
    
    setQuestions(generatedQuestions);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setIsCorrect(null);
    setQuizCompleted(false);
    setScore(0);
  };

  // Manejar la selección de una opción
  const handleSelectOption = (optionId: string) => {
    if (selectedOption || showExplanation) return;
    
    setSelectedOption(optionId);
    
    const currentQuestion = questions[currentQuestionIndex];
    const isAnswerCorrect = optionId === currentQuestion.correctOptionId;
    
    setIsCorrect(isAnswerCorrect);
    
    if (isAnswerCorrect) {
      // Incrementar la puntuación
      const questionPoints = currentQuestion.difficulty === 'easy' ? 10 : 
                            currentQuestion.difficulty === 'medium' ? 20 : 30;
      setScore(prevScore => prevScore + questionPoints);
    }
  };

  // Mostrar la explicación de la respuesta
  const handleShowExplanation = () => {
    setShowExplanation(true);
  };

  // Pasar a la siguiente pregunta
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedOption(null);
      setShowExplanation(false);
      setIsCorrect(null);
    } else {
      // Quiz completado
      setQuizCompleted(true);
      
      // Actualizar el quiz en localStorage
      if (currentQuiz && user) {
        const updatedQuiz = {
          ...currentQuiz,
          score,
          completed: true
        };
        
        LocalStorageService.updateQuiz(updatedQuiz);
        
        // Actualizar los puntos del usuario
        LocalStorageService.updateUserPoints(user.id, score);
      }
    }
  };

  // Reiniciar el quiz
  const handleRestart = () => {
    setSelectedDifficulty(null);
    setCurrentQuiz(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setIsCorrect(null);
    setQuizCompleted(false);
    setScore(0);
  };

  if (!selectedDifficulty) {
    return (
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center gradient-text">Quiz Matemático</h1>
        
        <div className="max-w-2xl mx-auto">
          <Card className="p-6">
            <h2 className="text-xl font-medium mb-6 text-center">Selecciona una dificultad para comenzar</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline"
                className="p-4 h-auto flex flex-col items-center cyberpunk-border"
                onClick={() => handleSelectDifficulty('easy')}
              >
                <span className="text-lg font-medium mb-2">Fácil</span>
                <Badge variant="success" className="mb-2">5 Preguntas</Badge>
                <span className="text-sm text-foreground/70">Operaciones básicas y ecuaciones simples</span>
              </Button>
              
              <Button 
                variant="outline"
                className="p-4 h-auto flex flex-col items-center cyberpunk-border"
                onClick={() => handleSelectDifficulty('medium')}
              >
                <span className="text-lg font-medium mb-2">Medio</span>
                <Badge variant="primary" className="mb-2">5 Preguntas</Badge>
                <span className="text-sm text-foreground/70">Probabilidad y estadística básica</span>
              </Button>
              
              <Button 
                variant="outline"
                className="p-4 h-auto flex flex-col items-center cyberpunk-border"
                onClick={() => handleSelectDifficulty('hard')}
              >
                <span className="text-lg font-medium mb-2">Difícil</span>
                <Badge variant="danger" className="mb-2">5 Preguntas</Badge>
                <span className="text-sm text-foreground/70">Cálculo diferencial</span>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-2xl mx-auto p-6 text-center">
          <h2 className="text-2xl font-bold mb-4 gradient-text">¡Quiz Completado!</h2>
          
          <div className="my-8">
            <p className="text-lg mb-4">Tu puntuación final:</p>
            <div className="text-4xl font-bold text-primary">{score} puntos</div>
            
            <div className="mt-4">
              <Badge 
                variant={score >= 75 ? "success" : score >= 50 ? "primary" : "danger"}
                className="text-base px-3 py-1"
              >
                {score >= 75 ? "¡Excelente!" : score >= 50 ? "¡Buen trabajo!" : "Sigue practicando"}
              </Badge>
            </div>
          </div>
          
          <Button 
            variant="primary"
            size="lg"
            onClick={handleRestart}
            className="mt-6"
          >
            Volver a Empezar
          </Button>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <Badge 
              variant={
                selectedDifficulty === 'easy' ? "success" : 
                selectedDifficulty === 'medium' ? "primary" : 
                "danger"
              }
              className="mb-2"
            >
              {selectedDifficulty === 'easy' ? "Fácil" : 
               selectedDifficulty === 'medium' ? "Medio" : 
               "Difícil"}
            </Badge>
            <h1 className="text-2xl font-bold">Pregunta {currentQuestionIndex + 1} de {questions.length}</h1>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-foreground/70 mb-1">Puntuación</div>
            <div className="text-xl font-medium text-primary">{score}</div>
          </div>
        </div>
        
        {/* Question Card */}
        <Card className="mb-6 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-medium mb-4">{currentQuestion?.question}</h2>
            <div className="flex justify-center my-4">
              <Latex formula={currentQuestion?.formula} className="text-2xl py-2" />
            </div>
          </div>
          
          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion?.options.map((option: any) => (
              <Button
                key={option.id}
                variant={
                  selectedOption === option.id
                    ? option.id === currentQuestion.correctOptionId
                      ? "success"
                      : "danger"
                    : "outline"
                }
                className={`p-4 h-auto transition-all duration-300 ${
                  selectedOption && option.id === currentQuestion.correctOptionId
                    ? "ring-2 ring-green-500 shadow-lg"
                    : ""
                }`}
                onClick={() => handleSelectOption(option.id)}
                disabled={!!selectedOption}
              >
                <Latex formula={option.formula} />
              </Button>
            ))}
          </div>
        </Card>
        
        {/* Explanation and Navigation */}
        <div className="flex flex-col">
          {selectedOption && !showExplanation && (
            <Button
              variant="outline"
              onClick={handleShowExplanation}
              className="mb-4"
            >
              Ver Explicación
            </Button>
          )}
          
          {showExplanation && (
            <Card className="mb-4 p-4 bg-card/50">
              <h3 className="font-medium mb-2">Explicación:</h3>
              <p>{currentQuestion?.explanation}</p>
            </Card>
          )}
          
          {selectedOption && (
            <Button
              variant="primary"
              onClick={handleNextQuestion}
            >
              {currentQuestionIndex < questions.length - 1 ? "Siguiente Pregunta" : "Finalizar Quiz"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}