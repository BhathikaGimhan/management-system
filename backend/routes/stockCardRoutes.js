const express = require("express");
const router = express.Router();
const {
  getStockCardReport,
  getStockCard,
} = require("../controllers/stockCardController");

router.get("/report/:from/:to/:Branch_idBranch/:category", getStockCardReport);
router.get("/:from/:to/:idItem", getStockCard);

module.exports = router;
