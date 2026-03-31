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

## Endpoints

- `GET /status`
- `GET /api/alerts/low-stock`
- `GET /api/alerts/expired`

### Respuesta esperada

```json
{
  "status": "UP",
  "service": "FarmaExpres_Micro_Alert",
  "timestamp": "2026-03-31T14:54:17.592Z"
}
```

### Respuesta esperada de alertas

```json
{
  "generatedAt": "2026-03-31T15:12:43.021Z",
  "total": 1,
  "alerts": [
    {
      "type": "LOW_STOCK",
      "severity": "MEDIUM",
      "message": "Producto bajo stock minimo: Acetaminofen 500mg",
      "product": {
        "id": "12",
        "code": "MED-001",
        "name": "Acetaminofen 500mg",
        "stock": 7,
        "minimumStock": 8,
        "expirationDate": "2027-06-15",
        "active": true
      }
    }
  ]
}
```

### Respuesta esperada de productos vencidos

```json
{
  "generatedAt": "2026-03-31T15:13:16.316Z",
  "total": 2,
  "alerts": [
    {
      "type": "EXPIRED",
      "severity": "HIGH",
      "message": "Producto vencido: Acetaminofén 500mg",
      "product": {
        "id": "13",
        "code": "M-001",
        "name": "Acetaminofén 500mg",
        "stock": 7,
        "minimumStock": 8,
        "expirationDate": "2026-01-15",
        "active": true
      }
    }
  ]
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
