import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button, Input, Card } from '../components/ui-core';
import { useAuth } from '../hooks/auth-context';

export default function AuthPage() {
  const { login, register, isLoading, error } = useAuth();
  const [, navigate] = useLocation();
  
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Estado del formulario de login
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });
  
  // Estado del formulario de registro
  const [registerForm, setRegisterForm] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  
  // Estado para errores de validación
  const [validationErrors, setValidationErrors] = useState<{
    username?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  
  // Manejar cambios en el formulario de login
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Manejar cambios en el formulario de registro
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterForm(prev => ({ ...prev, [name]: value }));
    
    // Limpiar errores de validación al escribir
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  // Validar formulario de registro
  const validateRegisterForm = () => {
    const errors: typeof validationErrors = {};
    
    if (!registerForm.username) {
      errors.username = 'El nombre de usuario es obligatorio';
    } else if (registerForm.username.length < 3) {
      errors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
    }
    
    if (!registerForm.password) {
      errors.password = 'La contraseña es obligatoria';
    } else if (registerForm.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (registerForm.password !== registerForm.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Manejar envío del formulario de login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(loginForm.username, loginForm.password);
      navigate('/');
    } catch (err) {
      console.error('Error de inicio de sesión:', err);
    }
  };
  
  // Manejar envío del formulario de registro
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateRegisterForm()) {
      return;
    }
    
    try {
      await register({
        username: registerForm.username,
        password: registerForm.password
      });
      navigate('/');
    } catch (err) {
      console.error('Error de registro:', err);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <div className="flex flex-col p-6">
          {/* Tabs */}
          <div className="flex border-b border-border mb-6">
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === 'login'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-foreground/70 hover:text-primary'
              }`}
              onClick={() => setActiveTab('login')}
            >
              Iniciar Sesión
            </button>
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === 'register'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-foreground/70 hover:text-primary'
              }`}
              onClick={() => setActiveTab('register')}
            >
              Registrarse
            </button>
          </div>
          
          {/* Mensaje de error global */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-md text-red-500 text-sm">
              {error.message}
            </div>
          )}
          
          {/* Formulario de Login */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit}>
              <div className="space-y-4">
                <Input
                  label="Nombre de Usuario"
                  name="username"
                  type="text"
                  value={loginForm.username}
                  onChange={handleLoginChange}
                  fullWidth
                  required
                  autoComplete="username"
                />
                
                <Input
                  label="Contraseña"
                  name="password"
                  type="password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  fullWidth
                  required
                  autoComplete="current-password"
                />
                
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  className="mt-6"
                  disabled={isLoading}
                >
                  {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>
              </div>
            </form>
          )}
          
          {/* Formulario de Registro */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit}>
              <div className="space-y-4">
                <Input
                  label="Nombre de Usuario"
                  name="username"
                  type="text"
                  value={registerForm.username}
                  onChange={handleRegisterChange}
                  error={validationErrors.username}
                  fullWidth
                  required
                  autoComplete="username"
                />
                
                <Input
                  label="Contraseña"
                  name="password"
                  type="password"
                  value={registerForm.password}
                  onChange={handleRegisterChange}
                  error={validationErrors.password}
                  fullWidth
                  required
                  autoComplete="new-password"
                />
                
                <Input
                  label="Confirmar Contraseña"
                  name="confirmPassword"
                  type="password"
                  value={registerForm.confirmPassword}
                  onChange={handleRegisterChange}
                  error={validationErrors.confirmPassword}
                  fullWidth
                  required
                  autoComplete="new-password"
                />
                
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  className="mt-6"
                  disabled={isLoading}
                >
                  {isLoading ? 'Registrando...' : 'Registrarse'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </Card>
    </div>
  );
}