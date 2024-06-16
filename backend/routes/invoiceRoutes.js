const express = require("express");
const router = express.Router();
const {
  createInvoice,
  getAllInvoices,
  getNextInvoiceId,
  getInvoiceById,
  getAllSerials,
  updateInvoiceStatus,
} = require("../controllers/invoiceController");

router.post("/", createInvoice);
router.get("/get-invoice-id/:Branch_idBranch", getNextInvoiceId);
router.get("/get-invoice-item-serials/:Item_idItem", getAllSerials);
router.get("/:Branch_idBranch", getAllInvoices);
router.get("/single/:idInvoice", getInvoiceById);
router.post("/status/:idInvoice", updateInvoiceStatus);

module.exports = router;
