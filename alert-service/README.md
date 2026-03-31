# Alert Service

Microservicio `alert-service` de FarmaExpres.

## Requisitos

- Node.js 20 o superior
- npm 10 o superior

## Ejecucion local

1. Copiar `.env.example` a `.env`
2. Instalar dependencias con `npm install`
3. Ejecutar `npm run dev`

## Endpoint inicial

- `GET /status`
- Puerto por defecto: `8083`

### Respuesta esperada

```json
{
  "status": "UP",
  "service": "FarmaExpres_Micro_Alert",
  "timestamp": "2026-03-31T14:54:17.592Z"
}
```

## Docker

### Construir imagen

```bash
docker build -t alert-service .
```

### Ejecutar contenedor

```bash
docker run --rm -p 8083:8083 --env-file .env alert-service
```
