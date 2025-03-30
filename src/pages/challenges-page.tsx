import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../hooks/auth-context';
import { storage } from '../lib/localStorage';
import { generateChallengeQuestion } from '../lib/math-utils';
import { Challenge } from '../lib/schema';
import { ProtectedRoute } from '../lib/protected-route';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Latex } from '../components/ui/latex';
import { BackgroundMusic } from '../components/ui/background-music';

export default function ChallengesPage() {
  return (
    <ProtectedRoute>
      <ChallengesContent />
    </ProtectedRoute>
  );
}

function ChallengesContent() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<any | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Cargar desafíos del usuario
  useEffect(() => {
    if (user) {
      const loadChallenges = async () => {
        try {
          const userChallenges = await storage.getChallengesByUserId(user.id);
          
          // Si no tiene desafíos, crear desafíos iniciales
          if (userChallenges.length === 0) {
            const newChallenges: Challenge[] = [];
            
            // Crear 10 niveles de desafíos
            for (let i = 1; i <= 10; i++) {
              const challenge = await storage.createChallenge({
                userId: user.id,
                level: i,
                points: 0
              });
              newChallenges.push(challenge);
            }
            
            setChallenges(newChallenges);
          } else {
            setChallenges(userChallenges);
          }
        } catch (error) {
          console.error("Error loading challenges:", error);
        }
      };
      
      loadChallenges();
    }
  }, [user]);

  const handleSelectChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setCurrentQuestion(generateChallengeQuestion(challenge.level));
    setSelectedOption(null);
    setIsCorrect(null);
    setShowExplanation(false);
  };

  const handleSelectOption = (optionId: string) => {
    if (!currentQuestion) return;
    
    setSelectedOption(optionId);
    const isAnswerCorrect = optionId === currentQuestion.correctOptionId;
    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect && selectedChallenge && !selectedChallenge.completed && user) {
      // Completar desafío y añadir puntos
      const updatedChallenge = {
        ...selectedChallenge,
        completed: true,
        completedAt: new Date().toISOString()
      };
      
      // Actualizar en localStorage
      storage.updateUserPoints(user.id, user.points + currentQuestion.points);
      
      // Actualizar estado local
      setChallenges(challenges.map(c => 
        c.id === selectedChallenge.id ? updatedChallenge : c
      ));
      setSelectedChallenge(updatedChallenge);
    }
    
    // Mostrar explicación
    setTimeout(() => {
      setShowExplanation(true);
    }, 1000);
  };

  const handleBack = () => {
    setSelectedChallenge(null);
    setCurrentQuestion(null);
    setSelectedOption(null);
    setIsCorrect(null);
    setShowExplanation(false);
  };

  // Renderizar lista de desafíos
  if (!selectedChallenge) {
    return (
      <div className="min-h-screen bg-cyberdark text-white p-6">
        <BackgroundMusic src="/sounds/cyberpunk-ambient.mp3" volume={0.2} />
        
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-cyberprimary">Desafíos</h1>
            <Button variant="cyberOutline" onClick={() => navigate("/")}>
              Volver al menú
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onClick={() => handleSelectChallenge(challenge)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Renderizar desafío seleccionado
  return (
    <div className="min-h-screen bg-cyberdark text-white p-6">
      <BackgroundMusic src="/sounds/cyberpunk-game.mp3" volume={0.2} />
      
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button variant="cyberOutline" onClick={handleBack} className="mr-4">
              Volver a desafíos
            </Button>
            <Badge variant="cyber" className="text-lg py-1 px-3">
              Nivel {selectedChallenge.level}
            </Badge>
            {selectedChallenge.completed && (
              <Badge variant="cyberAccent" className="ml-3 text-lg py-1 px-3">
                Completado
              </Badge>
            )}
          </div>
          
          <Badge variant="cyberSecondary" className="text-lg">
            Puntos: {currentQuestion?.points || 0}
          </Badge>
        </div>
        
        {currentQuestion && (
          <div>
            {!showExplanation ? (
              <Card className="w-full bg-cyberdark-lighter border border-cyberprimary/30 shadow-lg shadow-cyberprimary/10">
                <CardHeader>
                  <CardTitle className="text-2xl text-cyberprimary">
                    Desafío {selectedChallenge.level}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-xl font-medium text-gray-200 mb-4">
                      {currentQuestion.question}
                    </h3>
                    
                    <div className="flex justify-center my-6">
                      <div className="bg-cyberdark p-4 rounded-lg border border-cyberprimary/40">
                        <Latex formula={currentQuestion.formula} displayMode={true} className="text-2xl" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    {currentQuestion.options.map((option: any) => (
                      <Button
                        key={option.id}
                        variant={
                          selectedOption === option.id
                            ? isCorrect === true
                              ? "cyber"
                              : "destructive"
                            : "cyberOutline"
                        }
                        className="p-4 h-auto text-lg"
                        disabled={selectedOption !== null}
                        onClick={() => handleSelectOption(option.id)}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="mr-3">{option.id}:</span>
                          <Latex formula={option.formula} displayMode={false} />
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="w-full bg-cyberdark-lighter border border-cyberprimary/30 shadow-lg shadow-cyberprimary/10">
                <CardHeader>
                  <div className="text-center">
                    <Badge 
                      variant={isCorrect ? "cyber" : "destructive"} 
                      className="text-lg px-4 py-1"
                    >
                      {isCorrect ? "¡Desafío Superado!" : "Desafío Fallido"}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="bg-cyberdark/50 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-xl font-medium text-cyberprimary mb-4">Explicación:</h3>
                    <p className="text-gray-300 whitespace-pre-line">
                      {currentQuestion.explanation}
                    </p>
                    
                    <div className="mt-4">
                      <h4 className="text-lg font-medium text-cyberprimary mb-2">Fórmula:</h4>
                      <div className="bg-cyberdark p-3 rounded border border-cyberprimary/30">
                        <Latex formula={currentQuestion.formula} displayMode={true} />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="text-lg font-medium text-cyberprimary mb-2">
                        Respuesta Correcta:
                      </h4>
                      <div className="bg-cyberdark p-3 rounded border border-cyberaccent/30">
                        <div className="flex items-center">
                          <span className="mr-3 text-cyberaccent">
                            {currentQuestion.correctOptionId}:
                          </span>
                          <Latex 
                            formula={
                              currentQuestion.options.find(
                                (o: any) => o.id === currentQuestion.correctOptionId
                              ).formula
                            } 
                            displayMode={false} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-center">
                  <Button variant="cyber" onClick={handleBack}>
                    Volver a Desafíos
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ChallengeCard({ 
  challenge, 
  onClick 
}: { 
  challenge: Challenge; 
  onClick: () => void 
}) {
  // Determinar estilo basado en nivel y estado
  let statusText = "Disponible";
  let statusColor = "cyber";
  
  if (challenge.completed) {
    statusText = "Completado";
    statusColor = "cyberAccent";
  }
  
  // Niveles mas altos son más desafiantes
  let difficulty = "Fácil";
  
  if (challenge.level >= 8) {
    difficulty = "Difícil";
  } else if (challenge.level >= 4) {
    difficulty = "Medio";
  }

  return (
    <Card 
      className="bg-cyberdark-lighter border border-cyberprimary/30 hover:border-cyberprimary/60 shadow-lg hover:shadow-cyberprimary/20 transition-all cursor-pointer"
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span className="text-cyberprimary">Nivel {challenge.level}</span>
          <Badge variant={statusColor as any}>
            {statusText}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-gray-400">Dificultad:</div>
          <Badge variant="cyberSecondary">
            {difficulty}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-gray-400">Puntos:</div>
          <div className="text-cyberaccent font-bold">
            {challenge.level * (challenge.level <= 3 ? 10 : challenge.level <= 7 ? 15 : 25)}
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button variant="cyberOutline" className="w-full">
          {challenge.completed ? "Ver detalles" : "Intentar desafío"}
        </Button>
      </CardFooter>
    </Card>
  );
}