import React from 'react';

// Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function Button({
  className = '',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  ...props
}: ButtonProps) {
  // Clases base para todos los botones
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none disabled:opacity-50';
  
  // Variantes de color
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600',
    danger: 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800',
    success: 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800',
    outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800'
  };
  
  // Tamaños
  const sizeClasses = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 py-2',
    lg: 'h-12 px-6 text-lg'
  };
  
  // Ancho completo
  const widthClass = fullWidth ? 'w-full' : '';
  
  // Combinación de todas las clases
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`;
  
  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
}

// Input
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export function Input({
  className = '',
  label,
  error,
  fullWidth = false,
  id,
  ...props
}: InputProps) {
  // ID único para asociar el label con el input
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
  
  // Clases base para todos los inputs
  const baseClasses = 'rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200';
  
  // Ancho completo
  const widthClass = fullWidth ? 'w-full' : '';
  
  // Clases de error
  const errorClasses = error ? 'border-red-500 focus:ring-red-500' : '';
  
  // Combinación de todas las clases
  const inputClasses = `${baseClasses} ${widthClass} ${errorClasses} ${className}`;
  
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <input id={inputId} className={inputClasses} {...props} />
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}

// Card
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
  shadow?: boolean;
}

export function Card({
  className = '',
  padding = 'md',
  border = true,
  shadow = true,
  children,
  ...props
}: CardProps) {
  // Clases base para todos los cards
  const baseClasses = 'rounded-lg bg-white dark:bg-gray-800';
  
  // Padding
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-7'
  };
  
  // Border
  const borderClass = border ? 'border border-gray-200 dark:border-gray-700' : '';
  
  // Shadow
  const shadowClass = shadow ? 'shadow-sm' : '';
  
  // Combinación de todas las clases
  const cardClasses = `${baseClasses} ${paddingClasses[padding]} ${borderClass} ${shadowClass} ${className}`;
  
  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
}

// Badge
interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
}

export function Badge({
  className = '',
  variant = 'default',
  children,
  ...props
}: BadgeProps) {
  // Clases base para todos los badges
  const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';
  
  // Variantes de color
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    primary: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
  };
  
  // Combinación de todas las clases
  const badgeClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;
  
  return (
    <div className={badgeClasses} {...props}>
      {children}
    </div>
  );
}