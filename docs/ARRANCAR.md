# Cómo arrancar el proyecto

## Requisitos previos

1. **Node.js** 20+ → https://nodejs.org
2. **PostgreSQL** 15+ → https://www.postgresql.org/download/windows/
3. **Redis** → https://github.com/microsoftarchive/redis/releases (Windows) o via Docker

## Opción rápida con Docker (recomendado)

```bash
# En la raíz del proyecto
docker run --name pg-democracia -e POSTGRES_PASSWORD=secret -e POSTGRES_DB=democracia_directa -p 5432:5432 -d postgres:15
docker run --name redis-democracia -p 6379:6379 -d redis:7
```

## Backend

```bash
cd backend

# 1. Copia las variables de entorno
cp .env.example .env
# Edita .env con tu configuración de base de datos

# 2. Instala dependencias
npm install

# 3. Genera el cliente Prisma y crea las tablas
npx prisma generate
npx prisma migrate dev --name init

# 4. Arranca en modo desarrollo
npm run dev
```

El backend estará en: http://localhost:3001

## Frontend

```bash
cd frontend

# 1. Variables de entorno
cp .env.local.example .env.local

# 2. Instala dependencias
npm install

# 3. Arranca
npm run dev
```

El frontend estará en: http://localhost:3000

## Verificar que funciona

- Abre http://localhost:3000
- Ve a /auth/registro y crea una cuenta
- Verifica el email (en desarrollo, el token aparece en los logs del backend)
- Inicia sesión y verifica que tu wallet address aparece en la navbar
- Ve a /explorador para ver el bloque génesis
