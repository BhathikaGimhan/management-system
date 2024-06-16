const express = require("express");
const router = express.Router();

const {
  createCustomerReturn,
  getProcessReturns,
  getCustomerReturnById,
  updateCustomerReturn,
  processCustomerReturn,
  checkReturnSerial,
} = require("../controllers/customerReturnController");

router.post("/", createCustomerReturn);
router.post("/process", processCustomerReturn);
router.get("/:Branch_idBranch", getProcessReturns);
router.post("/check-serials", checkReturnSerial);
router.get("/single/:idCustomer_Return", getCustomerReturnById);
router.put("/:idCustomer_Return", updateCustomerReturn);

module.exports = router;
