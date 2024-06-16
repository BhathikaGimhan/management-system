const express = require("express");
const router = express.Router();
const {
  getCustomerCreditLog,
  createCustomerLog,
} = require("../controllers/customerCreditLogController");

router.get("/:Customer_idCustomer", getCustomerCreditLog);
router.post("/", createCustomerLog);

module.exports = router;
