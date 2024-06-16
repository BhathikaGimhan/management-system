const express = require("express");
const router = express.Router();

const {
  createPurchaseReturn,
  getProcessReturns,
  getPurchaseById,
  updatePurchaseReturn,
  processPurchaseReturn,
  checkReturnSerial,
} = require("../controllers/purchaseReturnController");

router.post("/", createPurchaseReturn);
router.post("/process", processPurchaseReturn);
router.post("/check-serials", checkReturnSerial);
router.get("/:Branch_idBranch", getProcessReturns);
router.get("/single/:idPurchase_Return", getPurchaseById);
router.put("/:idPurchase_Return", updatePurchaseReturn);

module.exports = router;
