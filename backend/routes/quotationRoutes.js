const express = require("express");
const router = express.Router();
const {
  createQuotation,
  getNextQuotationId,
  getAllQuotations,
  getQuotationById,
  quotationDelete,
  getQuotationByCustomerId,
} = require("../controllers/quotationController");

router.post("/", createQuotation);
router.get("/get-quotation-id/:Branch_idBranch", getNextQuotationId);
router.get("/:Branch_idBranch", getAllQuotations);
router.get("/single/:idQuotation", getQuotationById);
router.delete("/:idQuotation", quotationDelete);
router.get("/customer/:Customer_idCustomer", getQuotationByCustomerId);

module.exports = router;
