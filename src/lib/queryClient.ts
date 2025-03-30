import { QueryClient } from '@tanstack/react-query';

// Cliente de consulta estático para la versión GitHub Pages
// En esta versión, no realizamos peticiones al backend
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minuto
      gcTime: 60 * 60 * 1000, // 1 hora (antes se llamaba cacheTime)
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});