import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../hooks/auth-context';
import { storage } from '../lib/localStorage';
import { User } from '../lib/schema';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { BackgroundMusic } from '../components/ui/background-music';

type LeaderboardUser = Pick<User, "id" | "username" | "points">;

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [leaderboardUsers, setLeaderboardUsers] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar usuarios para el ranking
  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setIsLoading(true);
        const topUsers = await storage.getTopUsers(20); // Obtener los 20 mejores
        setLeaderboardUsers(topUsers);
      } catch (error) {
        console.error('Error loading leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-cyberdark text-white p-6">
      <BackgroundMusic src="/sounds/cyberpunk-ambient.mp3" volume={0.2} />
      
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-cyberprimary">Tabla de Clasificación</h1>
          <Button variant="cyberOutline" onClick={() => navigate("/")}>
            Volver al menú
          </Button>
        </div>

        <Card className="bg-cyberdark-lighter border border-cyberprimary/30 shadow-lg shadow-cyberprimary/10 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-cyberprimary">
              Top Hackers Matemáticos
            </CardTitle>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="text-cyberprimary animate-pulse">Cargando clasificación...</div>
              </div>
            ) : leaderboardUsers.length > 0 ? (
              <div className="divide-y divide-gray-700">
                {leaderboardUsers.map((leaderboardUser, index) => (
                  <div 
                    key={leaderboardUser.id}
                    className={`py-4 flex items-center ${user?.id === leaderboardUser.id ? 'bg-cyberprimary/10' : ''}`}
                  >
                    <div className="w-12 text-center">
                      {index === 0 ? (
                        <span className="text-2xl">🏆</span>
                      ) : index === 1 ? (
                        <span className="text-2xl">🥈</span>
                      ) : index === 2 ? (
                        <span className="text-2xl">🥉</span>
                      ) : (
                        <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1 ml-4">
                      <div className="flex items-center">
                        <span className="font-bold text-lg">
                          {leaderboardUser.username}
                        </span>
                        {user?.id === leaderboardUser.id && (
                          <Badge variant="cyberSecondary" className="ml-3">Tú</Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="cyber" className="text-lg py-1 px-3">
                        {leaderboardUser.points} pts
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-300">
                No hay datos de ranking disponibles. ¡Sé el primero en conseguir puntos!
              </div>
            )}
          </CardContent>
        </Card>

        {user && (
          <div className="bg-cyberdark-lighter border border-cyberprimary/30 shadow-lg shadow-cyberprimary/10 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-cyberprimary mb-4">Tu progreso</h2>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="bg-cyberdark p-4 rounded-lg border border-gray-700">
                <div className="text-gray-400 mb-2">Puntos Totales</div>
                <div className="text-3xl font-bold text-cyberaccent">{user.points}</div>
              </div>
              
              <div className="bg-cyberdark p-4 rounded-lg border border-gray-700">
                <div className="text-gray-400 mb-2">Vidas Restantes</div>
                <div className="text-3xl font-bold flex items-center">
                  {[...Array(3)].map((_, i) => (
                    <span key={i} className="mr-2">
                      {i < (user.lives || 0) ? "❤️" : "🖤"}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-center">
              <Button variant="cyber" onClick={() => navigate("/game")}>
                Jugar para ganar más puntos
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}