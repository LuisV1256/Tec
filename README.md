# Gestión de Usuarios e Inmuebles

Aplicación full-stack para publicar y administrar inmuebles: backend en NestJS + PostgreSQL (Prisma), frontend en React + TypeScript (Vite).

## Requisitos previos

- [Node.js](https://nodejs.org/) 22+
- [Docker](https://www.docker.com/) (para PostgreSQL)

## 1. Levantar la base de datos

```bash
docker run -d --name gestion-inmuebles-db -e POSTGRES_PASSWORD=postgres -p 55434:5432 postgres:17-alpine
docker exec gestion-inmuebles-db psql -U postgres -c "CREATE DATABASE gestion_inmuebles;"
```

Si ya tienes un contenedor Postgres corriendo en otro puerto, ajusta `DATABASE_URL` en el paso 3 en consecuencia.

## 2. Instalar dependencias

```bash
npm install --prefix backend
npm install --prefix frontend
```

## 3. Variables de entorno

Copia los `.env.example` y complétalos:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

**`backend/.env`**

| Variable | Descripción | Ejemplo |
|---|---|---|
| `DATABASE_URL` | Cadena de conexión a Postgres | `postgresql://postgres:postgres@localhost:55434/gestion_inmuebles?schema=public` |
| `JWT_SECRET` | Secreto para firmar los JWT — **sin valor por defecto**, debes generarlo | `openssl rand -hex 32` |
| `JWT_EXPIRES_IN` | Vigencia del token | `1d` |
| `PORT` | Puerto del backend | `3000` |

**`frontend/.env`**

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL base del backend | `http://localhost:3000` |

## 4. Migraciones y seed

```bash
cd backend
npm run migrate    # aplica todas las migraciones (prisma migrate deploy)
npm run seed       # siembra catálogos + 3 usuarios + 15 inmuebles
```

## 5. Levantar el proyecto

Con un solo comando desde la raíz (backend + frontend en paralelo):

```bash
npm install   # instala concurrently, solo la primera vez
npm run dev
```

O por separado:

```bash
npm run start:dev --prefix backend   # http://localhost:3000
npm run dev --prefix frontend        # http://localhost:5173
```

## Credenciales de prueba

Sembradas por `npm run seed` (contraseña igual para las tres):

| Email | Password |
|---|---|
| `ana.torres@gestioninmuebles.test` | `Password123` |
| `carlos.ruiz@gestioninmuebles.test` | `Password123` |
| `maria.gomez@gestioninmuebles.test` | `Password123` |

Cada una tiene 5 inmuebles propios, distribuidos entre los 3 estados (disponible/reservado/vendido).

## Estructura del repositorio

```
backend/    NestJS + Prisma — API REST
  src/auth/         login, registro, JWT
  src/usuarios/     CRUD de usuarios (solo propia cuenta)
  src/inmuebles/    CRUD de inmuebles + máquina de estados
  src/catalogos/    catálogo público de tipos de inmueble
  src/prisma/       cliente de Prisma + extensión de borrado lógico
  src/common/       filtro global de excepciones, paginación
  prisma/           schema, migraciones, seed

frontend/   React + Vite
  src/Componentes/  piezas reutilizables (badges, estados de UI, rutas protegidas)
  src/pages/        vistas (Login, InmuebleList, InmuebleDetalle, etc.)
  src/services/     llamadas a la API
  src/hooks/        estado de servidor (loading/error/data)
  src/types/        tipos compartidos con el backend
```

## Documentación adicional

- [DECISIONS.md](./DECISIONS.md) — decisiones de arquitectura y deuda técnica asumida
