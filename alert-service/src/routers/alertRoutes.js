const { Router } = require("express");
const expiredAlertController = require("../controllers/expiredAlertController");
const lowStockAlertController = require("../controllers/lowStockAlertController");

const router = Router();

router.get("/api/alerts/expired", expiredAlertController.getExpiredAlerts);
router.get("/api/alerts/low-stock", lowStockAlertController.getLowStockAlerts);

module.exports = router;
