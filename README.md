# Proyecto next.js VoxAgora (ultima revision: 15/08/2025)

# Para el uso del proyecto se recomienda:

### 1) Copiar el proyecto en un entorno limpio.

### 2) Modificar el package.json en caso de usar librerias adicionales 

### 3) En caso de presentar problemas por compatibilidad modificar package.json 
   
### 4) Usar pnpm para ejecucion

# 📝 Instrucciones de uso:

### 1) Hacer git clone del proyecto o hacer un fork en caso de querer copiar el proyecto en github.

### 2) Hacer pnpm install, para instalar las librerias necesarias.
   
### 3) Crear una cuenta en neon.com y alli crear una base de datos PostgreSQL
  
### 4) Con la informacion obtenida del paso anterior colocar en .env el secreto DATABASE_URL_NEON
   
### 5) Correr pnpm dlx prisma migrate dev y colocar el nombre deseado, el default es: --name portafolio

### 6) Correr pnpm run dev, con lo cual se tiene el proyecto corriendo en localhost:3000

