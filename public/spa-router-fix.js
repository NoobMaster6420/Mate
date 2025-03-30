// Script para manejar el enrutamiento SPA en GitHub Pages
(function() {
  // Este script se ejecuta en el index.html para manejar rutas SPA en GitHub Pages
  
  // Función para verificar si la URL tiene un formato de hash route
  function isHashRoute() {
    return window.location.hash.indexOf('#/') === 0;
  }
  
  // Si no estamos usando hash routing y no es la página principal, convertir a hash route
  if (!isHashRoute() && window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
    const path = window.location.pathname.replace(/^\//, ''); // Remover la barra inicial si existe
    window.location.replace(window.location.origin + '/#/' + path);
  }
  
  // Si estamos en la raíz y sin hash, asegurarse de que estamos en '/'
  if (window.location.pathname !== '/' && window.location.hash === '') {
    window.location.replace(window.location.origin + '/');
  }
})();