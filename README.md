# Administrador de posts

Esta es mi solución al challenge de desarrollador web de TCIT: una pequeña aplicación para crear, listar, filtrar y eliminar posts. Cada post tiene un nombre y una descripción.

- **Frontend:** React 19 con Redux Toolkit, sobre Vite
- **Backend:** API JSON con Node.js y Express 5
- **Base de datos:** PostgreSQL 17, que corre en Docker

## Lo que necesitas

- Node.js y npm (lo probé con Node 24 y npm 11)
- Docker con Docker Compose

También necesitas libres los puertos `5432`, `3000` y `5173`. Si alguno está ocupado, al final hay una sección que te dice qué hacer.

## Cómo levantarlo

Vas a usar dos terminales, porque el backend y el frontend se quedan corriendo. Todos los comandos parten desde la raíz del proyecto.

### 1. Prende la base de datos y crea la tabla

```bash
docker compose up -d --wait
docker compose exec -T db psql -U challenge -d posts_challenge < database/schema.sql
```

La tabla no se crea sola al levantar el contenedor, así que no te saltes el segundo comando. Deberías ver `CREATE TABLE`. Si lo corres más de una vez no pasa nada: no rompe nada ni borra datos.

### 2. Arranca el backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Sabrás que está listo cuando aparezca `API disponible en http://localhost:3000`. El archivo `.env` ya viene con los valores que usa Docker, así que no tienes que cambiar nada.

### 3. Arranca el frontend

En la otra terminal:

```bash
cd frontend
npm install
npm run dev
```

Abre <http://localhost:5173> y ya está. El frontend le pasa las llamadas a `/api` al backend por medio del proxy de Vite, por lo que tampoco hay nada que configurar aquí.

## Cómo se usa

La pantalla tiene tres partes, igual que la propuesta visual del challenge:

- **Filtro:** escribe parte de un nombre y presiona *Buscar*. No distingue mayúsculas de minúsculas y *Limpiar* vuelve a mostrar todo. Filtra sobre lo que ya está en pantalla, sin llamar a la API.
- **Lista:** muestra los posts, del más nuevo al más antiguo, y cada fila tiene su botón *Eliminar*.
- **Formulario:** ingresa nombre (hasta 120 caracteres) y descripción (hasta 2000) y presiona *Crear*.

La lista completa se pide a la API una sola vez por cada carga de la vista, como pide el enunciado. Después de eso, Redux actualiza el estado con la respuesta de cada creación o eliminación, sin volver a pedirla.

## La API

Todas las rutas parten de `http://localhost:3000/api/posts` y responden en JSON.

| Método | Ruta | Qué hace | Respuesta correcta |
| --- | --- | --- | --- |
| `GET` | `/api/posts` | Entrega todos los posts | `200` con la lista |
| `POST` | `/api/posts` | Crea un post | `201` con el post creado |
| `DELETE` | `/api/posts/:id` | Elimina un post | `200` con el post eliminado |

Por ejemplo, para crear un post desde la terminal:

```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"name": "Mi primer post", "description": "Hola, esto es una prueba"}'
```

Y esto es lo que responde:

```json
{ "id": 1, "name": "Mi primer post", "description": "Hola, esto es una prueba" }
```

Cuando algo sale mal, la respuesta trae un mensaje en `error`, con código `400` si los datos no son válidos o `404` si el post no existe:

```json
{ "error": "El post no existe." }
```

## Cómo está organizado

```text
backend/src/
  server.js              arranque de Express y manejo de errores
  postsRouter.js         rutas y validaciones de los posts
  db.js                  conexión a PostgreSQL
database/schema.sql      definición de la tabla posts
frontend/src/
  app/store.js           store de Redux
  services/postsApi.js   llamadas a la API
  features/posts/        estado (postsSlice) y componentes: filtro, lista y formulario
compose.yaml             contenedor de PostgreSQL
```

## Si algo falla

**La pantalla dice "Error interno del servidor".** Lo más probable es que falte la tabla. Vuelve a correr el segundo comando del paso 1.

**El backend dice "No se pudo conectar a PostgreSQL".** La base de datos no está arriba. Corre `docker compose up -d --wait` desde la raíz del proyecto y vuelve a intentarlo.

**El backend dice "Falta DATABASE_URL en backend/.env".** Te faltó copiar el archivo: `cp .env.example .env` dentro de `backend`.

**La pantalla dice "Error HTTP 500" o algo parecido.** El frontend probablemente no está alcanzando al backend. Revisa que la terminal del backend siga corriendo.

**El puerto `5173` está ocupado.** Vite no busca otro por su cuenta, así que elige uno a mano. El proxy sigue funcionando igual:

```bash
npm run dev -- --port 5174
```

**El puerto `3000` está ocupado.** Cambia `PORT` en `backend/.env` y usa el mismo número en `target`, dentro de `frontend/vite.config.js`.

**El puerto `5432` está ocupado.** Cambia el primer número en `compose.yaml` (por ejemplo, `127.0.0.1:5434:5432`) y usa ese mismo puerto en `DATABASE_URL`, dentro de `backend/.env`.

## Para apagarlo

Detén el backend y el frontend con `Ctrl+C` en cada terminal, y luego apaga la base de datos desde la raíz del proyecto:

```bash
docker compose down
```

Tus posts quedan guardados para la próxima vez. Si prefieres partir de cero, este comando borra también los datos, y al volver a levantar el proyecto tendrás que crear la tabla otra vez:

```bash
docker compose down -v
```

