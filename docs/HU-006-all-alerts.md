# HU-006 - Centro de alertas consolidado (alert-service)

## 1. Informacion general
- HU: `HU-006`
- Nombre: Consulta consolidada de todas las alertas
- Microservicio: `alert-service`
- Estado: Implementado
- Rama de trabajo: `HU-AC-dev`

## 2. Objetivo de la HU
Exponer un endpoint unico para consultar todas las alertas en un solo payload, incluyendo la nueva categoria de productos proximos a vencer.

## 3. Endpoint funcional
### Consumo oficial (gateway)
- Metodo: `GET`
- URL: `http://localhost:8080/api/alerts`

### Endpoint interno del microservicio
- Metodo: `GET`
- URL: `http://localhost:8083/api/alerts`

## 4. Alcance implementado
- Se agrego endpoint agregado `GET /api/alerts`.
- Se integraron en una sola respuesta las categorias:
  - `outOfStock`
  - `expired`
  - `lowStock`
  - `expiringSoon` (anexada segun solicitud)
- Se incluyo resumen (`summary`) con conteo por categoria y total general.

## 5. Logica de agregacion
El endpoint ejecuta las consultas de alertas por categoria y consolida el resultado en:
- `generatedAt`
- `summary`
  - `totalAlerts`
  - `outOfStock`
  - `expired`
  - `lowStock`
  - `expiringSoon`
- `alerts`

## 6. Archivos modificados
- `alert-service/src/controllers/allAlertsController.js` (nuevo)
- `alert-service/src/services/allAlertsService.js` (nuevo)
- `alert-service/src/routers/alertRoutes.js`
- `alert-service/tests/allAlerts.test.js` (nuevo)
- `alert-service/package.json`

## 7. Contrato de respuesta esperado
```json
{
  "generatedAt": "2026-03-31T15:13:52.511Z",
  "summary": {
    "totalAlerts": 8,
    "outOfStock": 1,
    "expired": 2,
    "lowStock": 4,
    "expiringSoon": 1
  },
  "alerts": [
    {
      "type": "OUT_OF_STOCK",
      "severity": "HIGH",
      "message": "Producto sin stock: Acetaminophen 500mg",
      "product": {
        "id": "16",
        "code": "MASD-001",
        "name": "Acetaminophen 500mg",
        "stock": 0,
        "minimumStock": 8,
        "expirationDate": "2026-03-31",
        "active": true
      }
    }
  ]
}
```

## 8. Criterios de aceptacion cubiertos
1. Existe `GET /api/alerts`.
2. El endpoint responde `200 OK` en ejecucion correcta.
3. Incluye `generatedAt`, `summary` y `alerts`.
4. `summary` incluye `outOfStock`, `expired`, `lowStock`, `expiringSoon` y `totalAlerts`.
5. `alerts` contiene la union de las cuatro categorias.
6. El endpoint es consumible por gateway en `:8080`.

## 9. Evidencia de validacion
Se agrego prueba automatizada:
- `allAlerts.test.js`

El script `npm test` del microservicio fue actualizado para ejecutar tambien esta prueba.
