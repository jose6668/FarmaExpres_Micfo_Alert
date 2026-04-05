# FarmaExpres_Micro_Alert

## Alert Service

### Descripcion
`alert-service` es el microservicio encargado de consultar productos y lotes desde PostgreSQL para generar alertas operativas y reportes de inventario para FarmaExpres.

Actualmente expone:
- alertas de bajo stock
- alertas sin stock
- alertas de productos vencidos
- alertas de productos proximos a vencer
- alertas por rangos de vencimiento (`16-30` y `31-60` dias)
- reportes de productos proximos a vencer
- alertas y reportes por lotes
- endpoint de estado del servicio

### Tecnologias utilizadas
- **Node.js** 18 o superior
- **Express** para la API REST
- **PostgreSQL** como origen de datos
- **pg** para la conexion a base de datos
- **dotenv** para variables de entorno
- **nodemon** para desarrollo local
- **Docker** para empaquetado y despliegue

### Arquitectura
El servicio sigue una arquitectura en capas:
- **Controllers**: reciben la peticion HTTP y construyen la respuesta
- **Services**: aplican la logica de negocio
- **Repositories**: consultan la base de datos
- **Models**: normalizan productos, alertas, lotes y estado del servicio
- **Config**: centraliza entorno, constantes y base de datos
- **Utils**: fechas, severidades y reglas de clasificacion
- **Middlewares**: errores, rutas no encontradas y control de acceso para reportes

### Endpoints

#### Estado
- `GET /status`
  - Verifica que el servicio y la base de datos esten disponibles.

Respuesta ejemplo:
```json
{
  "status": "UP",
  "service": "FarmaExpres_Micro_Alert",
  "timestamp": "2026-03-31T14:54:17.592Z",
  "database": "UP"
}
```

#### Alertas generales de productos
- `GET /api/alerts`
  - Devuelve el consolidado general de alertas de productos.

- `GET /api/alerts/low-stock`
  - Devuelve productos activos con stock menor al stock minimo.

- `GET /api/alerts/out-of-stock`
  - Devuelve productos activos con stock igual a cero.

- `GET /api/alerts/expired`
  - Devuelve productos activos cuya fecha de expiracion ya paso.

- `GET /api/alerts/expiring-soon`
  - Devuelve productos activos cuya fecha de expiracion esta dentro de la ventana configurada por `EXPIRING_SOON_DAYS`.

- `GET /api/alerts/expiring-half-month`
  - Devuelve productos activos con vencimiento entre 16 y 30 dias.

- `GET /api/alerts/expiring-month`
  - Devuelve productos activos con vencimiento entre 31 y 60 dias.

Respuesta ejemplo de `GET /api/alerts`:
```json
{
  "generatedAt": "2026-03-31T15:20:00.000Z",
  "summary": {
    "totalAlerts": 4,
    "outOfStock": 1,
    "expired": 1,
    "lowStock": 1,
    "expiringSoon": 1
  },
  "alerts": []
}
```

#### Reporte de productos por vencimiento
- `GET /api/alerts/expiring-report`
  - Devuelve un reporte de productos con vencimiento hasta 60 dias.
  - Soporta el query param `range` con estos valores:
    - `all`
    - `expired`
    - `0-15`
    - `16-30`
    - `31-60`

Respuesta ejemplo:
```json
{
  "generatedAt": "2026-04-05T18:30:00.000Z",
  "total": 3,
  "filters": {
    "appliedRange": "16-30",
    "availableRanges": ["all", "expired", "0-15", "16-30", "31-60"]
  },
  "summary": {
    "expired": 0,
    "range0To15": 0,
    "range16To30": 3,
    "range31To60": 0
  },
  "reports": []
}
```

#### Alertas y reportes por lotes
Estas rutas requieren el header `Authorization: Bearer <token>` y el rol `ADMIN`, `AUDITOR` o `FARMACEUTICO`.

- `GET /api/alerts/expired-batches`
  - Lotes vencidos.

- `GET /api/alerts/expiring-batches`
  - Lotes por vencer.
  - Soporta `includeExpired=true` para incluir lotes vencidos.

- `GET /api/alerts/expiring-batches/report`
  - Reporte de lotes por vencer incluyendo vencidos y lotes con stock.

- `GET /api/alerts/low-stock-batches`
  - Lotes con stock bajo.
  - Soporta `level=critico` o `level=alerta`.

- `GET /api/alerts/low-stock-batches/critical`
  - Lotes con nivel critico.

- `GET /api/alerts/low-stock-batches/alert`
  - Lotes con nivel alerta.

- `GET /api/alerts/out-of-stock-batches`
  - Lotes sin stock.

- `GET /api/reports/alerts-batches`
  - Consolidado general de alertas por lotes.

Respuesta ejemplo de `GET /api/reports/alerts-batches`:
```json
{
  "generatedAt": "2026-04-05T18:30:00.000Z",
  "total": 12,
  "summary": {
    "expiredBatches": 2,
    "expiringBatches": 4,
    "lowStockBatches": 5,
    "outOfStockBatches": 1
  },
  "reports": {
    "expired": [],
    "expiring": [],
    "lowStock": [],
    "outOfStock": []
  }
}
```

### Variables de entorno
Archivo base: `alert-service/.env.example`

- `PORT`: puerto HTTP del microservicio
- `SERVICE_NAME`: nombre expuesto por `/status`
- `NODE_ENV`: entorno de ejecucion
- `APP_TIME_ZONE`: zona horaria usada por el servicio
- `INVENTORY_PRODUCTS_TABLE`: tabla de productos del microservicio de inventario
- `EXPIRING_SOON_DAYS`: ventana en dias para alertas de proximidad
- `DB_HOST`: host de PostgreSQL
- `DB_PORT`: puerto de PostgreSQL
- `DB_NAME`: nombre de la base de datos
- `DB_USER`: usuario de base de datos
- `DB_PASSWORD`: contrasena de base de datos
- `DB_SSL`: `true` o `false` para conexion segura

Valores de ejemplo:
```env
PORT=8083
SERVICE_NAME=FarmaExpres_Micro_Alert
NODE_ENV=development
APP_TIME_ZONE=America/Bogota
INVENTORY_PRODUCTS_TABLE=product
EXPIRING_SOON_DAYS=15
DB_HOST=postgres
DB_PORT=5432
DB_NAME=farmaexpres_inventory
DB_USER=postgres
DB_PASSWORD=1234
DB_SSL=false
```

### Estructura del proyecto
```text
alert-service/
|-- src/
|   |-- app/
|   |   `-- index.js
|   |-- config/
|   |   |-- constants.js
|   |   |-- database.js
|   |   `-- env.js
|   |-- controllers/
|   |   |-- allAlertsController.js
|   |   |-- batchAlertsController.js
|   |   |-- batchReportsController.js
|   |   |-- expiredAlertController.js
|   |   |-- expiring16To30DaysAlertController.js
|   |   |-- expiring31To60DaysAlertController.js
|   |   |-- expiringProductsReportController.js
|   |   |-- expiringSoonAlertController.js
|   |   |-- lowStockAlertController.js
|   |   |-- outOfStockAlertController.js
|   |   `-- statusController.js
|   |-- middlewares/
|   |   |-- errorHandlerMiddleware.js
|   |   |-- notFoundMiddleware.js
|   |   `-- reportsAccessMiddleware.js
|   |-- models/
|   |   |-- Alert.js
|   |   |-- AlertCollection.js
|   |   |-- BatchAlertItem.js
|   |   |-- HealthStatus.js
|   |   `-- Product.js
|   |-- repositories/
|   |   |-- healthRepository.js
|   |   `-- productRepository.js
|   |-- routers/
|   |   |-- alertRoutes.js
|   |   |-- index.js
|   |   |-- reportRoutes.js
|   |   `-- statusRoutes.js
|   |-- services/
|   |   |-- allAlertsService.js
|   |   |-- batchAlertsService.js
|   |   |-- expiredAlertService.js
|   |   |-- expiring16To30DaysAlertService.js
|   |   |-- expiring31To60DaysAlertService.js
|   |   |-- expiringProductsReportService.js
|   |   |-- expiringSoonAlertService.js
|   |   |-- lowStockAlertService.js
|   |   |-- outOfStockAlertService.js
|   |   `-- statusService.js
|   |-- utils/
|   |   |-- alertUtils.js
|   |   `-- dateUtils.js
|   `-- server.js
|-- tests/
|   |-- allAlerts.test.js
|   |-- dateUtils.test.js
|   |-- expiredAlerts.test.js
|   |-- expiring16To30DaysAlerts.test.js
|   |-- expiring31To60DaysAlerts.test.js
|   |-- expiringProductsReport.test.js
|   |-- expiringSoonAlerts.test.js
|   |-- lowStockAlerts.test.js
|   |-- outOfStockAlerts.test.js
|   `-- status.test.js
|-- .env.example
|-- .dockerignore
|-- Dockerfile
`-- package.json
```

### Modelos principales
- **Product**: producto normalizado con datos de inventario y, cuando aplica, informacion de lote (`batchId`, `batchCode`, `batchStatus`).
- **Alert**: representa una alerta de producto con tipo, severidad, mensaje y producto asociado.
- **BatchAlertItem**: representa una alerta por lote con stock, vencimiento, cobertura y sugerencia de reposicion.
- **HealthStatus**: representa el estado del servicio y de la base de datos.

### Ejecucion local
1. Ubicarse en la carpeta del servicio:
   ```bash
   cd alert-service
   ```
2. Crear el archivo `.env` a partir del ejemplo.
3. Instalar dependencias:
   ```bash
   npm install
   ```
4. Ejecutar en desarrollo:
   ```bash
   npm run dev
   ```
5. Ejecutar en modo normal:
   ```bash
   npm start
   ```

### Docker
```bash
docker build -t alert-service .
docker run -p 8083:8083 --env-file .env alert-service
```

### Pruebas
La suite actual ejecuta validaciones de estado, utilidades de fecha, alertas y reportes:

```bash
npm test
```
