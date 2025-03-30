# CyberCalc - Versión GitHub Pages

Esta es la versión estática para GitHub Pages de CyberCalc, una plataforma educativa inmersiva que transforma el aprendizaje del cálculo diferencial en una experiencia cyberpunk.

## Características

- Interfaz de usuario cyberpunk inmersiva
- Sistema de autenticación basado en localStorage
- Sección de teoría con explicaciones interactivas
- Quizzes y desafíos para poner a prueba tus conocimientos
- Modo historia gamificado
- Tablas de clasificación (leaderboard)
- Completamente funcional como Single Page Application en GitHub Pages

## Tecnologías

- React 18
- TypeScript
- Tailwind CSS
- Wouter (enrutamiento ligero)
- React Query
- KaTeX (renderizado de fórmulas matemáticas)
- LocalStorage API

## Despliegue

Esta versión está específicamente optimizada para GitHub Pages, utilizando técnicas de Single Page Application para manejar correctamente las rutas en un entorno de alojamiento estático.

### Instrucciones para el despliegue manual

1. Clona este repositorio
2. Instala las dependencias: `npm install`
3. Construye la aplicación: `npm run build`
4. El directorio `dist` contiene la aplicación lista para ser desplegada en GitHub Pages

### Despliegue automático

Este proyecto incluye un flujo de trabajo de GitHub Actions configurado para el despliegue automático. Cada vez que se hace un push a la rama principal, la aplicación se construye y se despliega automáticamente en GitHub Pages.

## Diferencias con la versión completa

A diferencia de la versión completa que utiliza un backend Express con una base de datos PostgreSQL, esta versión:

- Utiliza localStorage para almacenar datos del usuario, puntuaciones y progreso
- No requiere servidor ni base de datos
- Funciona completamente en el navegador del cliente
- Puede ser desplegada en cualquier alojamiento de archivos estáticos

## Desarrollo local

Para ejecutar el proyecto localmente:

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173/cybercalc/`

## Licencia

Este proyecto es de código abierto bajo la licencia MIT.