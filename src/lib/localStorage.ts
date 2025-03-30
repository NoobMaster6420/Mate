// Interfaces para los datos
export interface User {
  id: number;
  username: string;
  password: string; // Nota: En producción, nunca almacenar contraseñas en localStorage
  points: number;
  lives: number;
}

export interface Quiz {
  id: number;
  userId: number;
  score: number;
  date: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Challenge {
  id: number;
  userId: number;
  score: number;
  completed: boolean;
  date: string;
}

export interface Question {
  id: number;
  question: string;
  formula: string;
  options: {
    id: string;
    formula: string;
  }[];
  correctOptionId: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface UserProgress {
  userId: number;
  points: number;
  lives: number;
}

// Clase para manejar el localStorage
class LocalStorageService {
  private readonly USER_KEY = 'cybercalc_users';
  private readonly QUIZ_KEY = 'cybercalc_quizzes';
  private readonly CHALLENGE_KEY = 'cybercalc_challenges';
  private readonly CURRENT_USER_KEY = 'cybercalc_current_user';

  // Métodos auxiliares para obtener y guardar datos
  private getItem<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private setItem<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Gestión de usuarios
  getUsers(): User[] {
    return this.getItem<User>(this.USER_KEY);
  }

  getUserById(id: number): User | undefined {
    return this.getUsers().find(user => user.id === id);
  }

  getUserByUsername(username: string): User | undefined {
    return this.getUsers().find(user => user.username === username);
  }

  createUser(userData: Omit<User, 'id' | 'points' | 'lives'>): User {
    const users = this.getUsers();
    const id = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    
    const newUser: User = {
      ...userData,
      id,
      points: 0,
      lives: 3
    };
    
    users.push(newUser);
    this.setItem(this.USER_KEY, users);
    return newUser;
  }

  updateUser(user: User): User {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    
    if (index !== -1) {
      users[index] = user;
      this.setItem(this.USER_KEY, users);
    }
    
    return user;
  }

  updateUserPoints(userId: number, points: number): User | undefined {
    const user = this.getUserById(userId);
    
    if (user) {
      user.points += points;
      return this.updateUser(user);
    }
    
    return undefined;
  }

  updateUserLives(userId: number, lives: number): User | undefined {
    const user = this.getUserById(userId);
    
    if (user) {
      user.lives = lives;
      return this.updateUser(user);
    }
    
    return undefined;
  }

  // Gestión del usuario actual
  getCurrentUser(): User | null {
    const userId = localStorage.getItem(this.CURRENT_USER_KEY);
    return userId ? this.getUserById(parseInt(userId, 10)) || null : null;
  }

  setCurrentUser(userId: number | null): void {
    if (userId) {
      localStorage.setItem(this.CURRENT_USER_KEY, userId.toString());
    } else {
      localStorage.removeItem(this.CURRENT_USER_KEY);
    }
  }

  // Gestión de quizzes
  getQuizzes(): Quiz[] {
    return this.getItem<Quiz>(this.QUIZ_KEY);
  }

  getQuizzesByUserId(userId: number): Quiz[] {
    return this.getQuizzes().filter(quiz => quiz.userId === userId);
  }

  createQuiz(quizData: Omit<Quiz, 'id'>): Quiz {
    const quizzes = this.getQuizzes();
    const id = quizzes.length > 0 ? Math.max(...quizzes.map(q => q.id)) + 1 : 1;
    
    const newQuiz: Quiz = {
      ...quizData,
      id
    };
    
    quizzes.push(newQuiz);
    this.setItem(this.QUIZ_KEY, quizzes);
    return newQuiz;
  }

  // Gestión de desafíos
  getChallenges(): Challenge[] {
    return this.getItem<Challenge>(this.CHALLENGE_KEY);
  }

  getChallengesByUserId(userId: number): Challenge[] {
    return this.getChallenges().filter(challenge => challenge.userId === userId);
  }

  createChallenge(challengeData: Omit<Challenge, 'id'>): Challenge {
    const challenges = this.getChallenges();
    const id = challenges.length > 0 ? Math.max(...challenges.map(c => c.id)) + 1 : 1;
    
    const newChallenge: Challenge = {
      ...challengeData,
      id
    };
    
    challenges.push(newChallenge);
    this.setItem(this.CHALLENGE_KEY, challenges);
    return newChallenge;
  }

  // Obtener el progreso del usuario
  getUserProgress(userId: number): UserProgress | undefined {
    const user = this.getUserById(userId);
    
    if (user) {
      return {
        userId: user.id,
        points: user.points,
        lives: user.lives
      };
    }
    
    return undefined;
  }

  // Obtener los mejores usuarios (leaderboard)
  getTopUsers(limit: number): User[] {
    return this.getUsers()
      .sort((a, b) => b.points - a.points)
      .slice(0, limit)
      .map(({ password, ...rest }) => rest as User); // Eliminar la contraseña por seguridad
  }

  // Limpiar todos los datos (para pruebas)
  clearAll(): void {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.QUIZ_KEY);
    localStorage.removeItem(this.CHALLENGE_KEY);
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }
}

// Exportar una única instancia del servicio
export const storageService = new LocalStorageService();