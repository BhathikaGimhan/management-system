const express = require("express");
const router = express.Router();
const {
  getSupplierLog,
  createSupplierLog,
} = require("../controllers/supplierCreditLogController");

router.get("/:Supplier_idSupplier", getSupplierLog);
router.post("/", createSupplierLog);

module.exports = router;
