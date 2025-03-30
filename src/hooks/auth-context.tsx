import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { User, storageService } from '../lib/localStorage';

// Tipo para datos de login
type LoginData = {
  username: string;
  password: string;
};

// Tipo para datos de registro
type RegisterData = {
  username: string;
  password: string;
};

// Tipo para el contexto de autenticación
type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginData) => Promise<User | null>;
  logout: () => void;
  register: (data: RegisterData) => Promise<User | null>;
  clearError: () => void;
};

// Crear el contexto
export const AuthContext = createContext<AuthContextType | null>(null);

// Proveedor del contexto
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar usuario al iniciar
  useEffect(() => {
    const loadUser = () => {
      try {
        // Intentar cargar el usuario actual del localStorage
        const currentUser = storageService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Error al cargar el usuario:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Función para iniciar sesión
  const login = async (credentials: LoginData): Promise<User | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Buscar usuario por nombre de usuario
      const foundUser = storageService.getUserByUsername(credentials.username);
      
      if (!foundUser) {
        throw new Error('Usuario no encontrado');
      }
      
      // Comprobar contraseña (en un sistema real, utilizaríamos bcrypt u otra herramienta)
      if (foundUser.password !== credentials.password) {
        throw new Error('Contraseña incorrecta');
      }
      
      // Guardar el ID del usuario actual en localStorage
      storageService.setCurrentUser(foundUser.id);
      
      // Actualizar el estado
      setUser(foundUser);
      return foundUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    storageService.setCurrentUser(null);
    setUser(null);
  };

  // Función para registrar un nuevo usuario
  const register = async (credentials: RegisterData): Promise<User | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Comprobar si el usuario ya existe
      const existingUser = storageService.getUserByUsername(credentials.username);
      
      if (existingUser) {
        throw new Error('El nombre de usuario ya está en uso');
      }
      
      // Crear un nuevo usuario
      const newUser = storageService.createUser({
        username: credentials.username,
        password: credentials.password
      });
      
      // Guardar el ID del usuario actual en localStorage
      storageService.setCurrentUser(newUser.id);
      
      // Actualizar el estado
      setUser(newUser);
      return newUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para limpiar errores
  const clearError = () => {
    setError(null);
  };

  // Proporcionar el contexto
  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        error, 
        login, 
        logout, 
        register,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar el contexto de autenticación
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  
  return context;
}