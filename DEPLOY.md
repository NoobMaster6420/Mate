# Guía para Desplegar en GitHub Pages

Esta versión de CyberCalc está optimizada para ser desplegada en GitHub Pages con enrutamiento hash. Sigue estos pasos para realizar el despliegue:

## Preparativos

1. Asegúrate de tener una cuenta de GitHub y haber creado un repositorio para tu proyecto.
2. Ya hemos configurado `vite.config.ts` con `base: './'` para usar rutas relativas independientes del nombre del repositorio.

## Compilación y Despliegue

### Opción 1: Despliegue manual

1. Compila la aplicación con:
```bash
npm run build
```

2. Esto generará una carpeta `dist` con los archivos estáticos.

3. Copia el archivo `404.html` a la carpeta `dist`:
```bash
cp ./public/404.html ./dist/
```

4. Crea una rama `gh-pages` en tu repositorio:
```bash
git checkout -b gh-pages
```

5. Copia el contenido de la carpeta `dist` a la raíz de esta rama.

6. Añade los archivos, haz commit y push:
```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
```

7. En la configuración de tu repositorio en GitHub, configura GitHub Pages para usar la rama `gh-pages`.

### Opción 2: Usando GitHub Actions (Recomendado)

Esta opción está ya configurada en `.github/workflows/deploy.yml`. Simplemente:

1. Haz push de la versión actual a la rama principal.
2. GitHub Actions se encargará automáticamente del despliegue.
3. Asegúrate de tener habilitado GitHub Pages en la configuración de tu repositorio y configurado para usar la acción de GitHub Pages.

## Verificación

Una vez desplegado, tu aplicación estará disponible en:
`https://[tu-usuario-github].github.io/[nombre-repositorio]/`

## Cómo funciona el enrutamiento hash en esta aplicación

1. La aplicación ahora usa enrutamiento con hash (`/#/ruta` en lugar de `/ruta`).
2. Hemos modificado la configuración de Wouter para usar hash routing.
3. El archivo `404.html` redirige todas las rutas no encontradas a la aplicación principal con el hash correspondiente.
4. El script `spa-router-fix.js` asegura la correcta navegación dentro de la aplicación.

## Solución de problemas comunes

### Rutas incorrectas o página en blanco

Si ves una página en blanco o errores 404, verifica:
- Que todos los recursos (JS, CSS) se están cargando correctamente (revisar la consola del navegador).
- Que los paths en `index.html` usan rutas relativas (`./`) y no absolutas (`/`).
- Que el archivo `spa-router-fix.js` se está cargando correctamente.
- Que el archivo `404.html` está presente en el directorio raíz de tu sitio publicado.

### Problemas de enrutamiento

Si la navegación no funciona correctamente:
- Asegúrate de que todas las rutas en la aplicación usan el hook modificado para hash routing.
- Verifica que el componente `Link` de Wouter esté siendo usado correctamente en toda la aplicación.
- Comprueba la consola del navegador para ver si hay errores relacionados con la navegación.

## Notas adicionales

- Esta aplicación usa localStorage para almacenar datos de usuario, puntuaciones y progreso.
- Las imágenes y recursos estáticos se sirven directamente desde el directorio `public`.
- GitHub Pages es ideal para aplicaciones estáticas como ésta que no necesitan backend.
- El enrutamiento hash (`/#/ruta`) es compatible con GitHub Pages sin necesidad de configuraciones especiales en el servidor.