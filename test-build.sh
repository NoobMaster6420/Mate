#!/bin/bash
# Este script compila la aplicación y la sirve localmente para pruebas

echo "Compilando la aplicación..."
npm run build

echo "Copiando 404.html al directorio dist..."
cp ./public/404.html ./dist/

echo "Sirviendo la aplicación en http://localhost:4173..."
npm run preview