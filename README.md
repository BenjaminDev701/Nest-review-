# Teslo Shop API

Backend para la gestión de productos y catálogo de tienda virtual, desarrollado con **NestJS**, **TypeORM** y **PostgreSQL**.

---

## Requisitos

- Node.js (v18+)
- pnpm (o npm)
- Docker y Docker Compose

---

## Pasos para ejecutar en local

### 1. Clonar el repositorio e instalar dependencias

```bash
git clone <url-del-repositorio>
cd teslo-shop
pnpm install
```

### 2. Variables de entorno

Crea un archivo `.env` en la raíz del proyecto basado en el siguiente ejemplo:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=TESLO-DB
DB_USER=postgres
DB_PASS=tu_password
DB_PASSWORD=tu_password
```

> **Nota:** `DB_PASSWORD` es utilizado por `docker-compose.yaml` y `DB_PASS` por la conexión de TypeORM en Nest. Ambos deben tener el mismo valor.

### 3. Levantar la base de datos

Inicia el contenedor de PostgreSQL con Docker:

```bash
docker compose up -d
```

### 4. Ejecutar la aplicación

```bash
# Modo desarrollo (con recarga automática)
pnpm run start:dev
```

La aplicación quedará disponible en `http://localhost:3000/api`.

---

## Poblar la base de datos (Seed)

Para limpiar la base de datos e insertar los productos iniciales de prueba, realiza una petición GET al endpoint de seed:

```
GET http://localhost:3000/api/seed
```

---

## Rutas principales

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/seed` | Carga los datos de prueba y resetea la BD |
| `GET` | `/api/products` | Lista productos (paginación con `?limit=10&offset=0`) |
| `GET` | `/api/products/:term` | Busca un producto por ID o por slug/título |
| `POST` | `/api/products` | Crea un producto nuevo con sus imágenes |
| `PATCH` | `/api/products/:id` | Actualiza un producto por su UUID |
| `DELETE` | `/api/products/:id` | Elimina un producto por su UUID |
