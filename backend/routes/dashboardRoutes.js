const express = require("express");
const router = express.Router();
const { getDashboardData } = require("../controllers/dashboardController");

router.get("/:Branch_idBranch", getDashboardData);

module.exports = router;
