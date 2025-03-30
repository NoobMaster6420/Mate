import { z } from 'zod';

// Validación para el esquema de usuario
export const insertUserSchema = z.object({
  username: z.string().min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

// Validación para el esquema de quiz
export const insertQuizSchema = z.object({
  userId: z.number(),
  score: z.number(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  completedAt: z.date(),
});

// Validación para el esquema de desafío
export const insertChallengeSchema = z.object({
  userId: z.number(),
  score: z.number(),
  completedAt: z.date(),
});

// Definición de tipos
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertQuiz = z.infer<typeof insertQuizSchema>;
export type InsertChallenge = z.infer<typeof insertChallengeSchema>;

export interface User {
  id: number;
  username: string;
  password: string;
  points: number;
  lives: number;
}

export interface Quiz {
  id: number;
  userId: number;
  score: number;
  difficulty: 'easy' | 'medium' | 'hard';
  completedAt: Date;
}

export interface Challenge {
  id: number;
  userId: number;
  score: number;
  completedAt: Date;
}

export interface QuizQuestion {
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

export interface ChallengeQuestion {
  id: number;
  question: string;
  formula: string;
  options: {
    id: string;
    formula: string;
  }[];
  correctOptionId: string;
  explanation: string;
  points: number;
}

export interface UserProgress {
  userId: number;
  points: number;
  lives: number;
}