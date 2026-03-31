const { Router } = require("express");
const lowStockAlertController = require("../controllers/lowStockAlertController");

const router = Router();

router.get("/api/alerts/low-stock", lowStockAlertController.getLowStockAlerts);

module.exports = router;
