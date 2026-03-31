const { Router } = require("express");
const statusRoutes = require("./statusRoutes");

const router = Router();

router.use(statusRoutes);

module.exports = router;
