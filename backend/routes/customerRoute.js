const express = require("express");
const router = express.Router();
const {
  createCustomer,
  getCustomer,
  getCustomerById,
  updateCustomerById,
  deleteCustomerById,
  updateCustomerStatus,
} = require("../controllers/customerController");

router.post("/", createCustomer);
router.get("/:Branch_idBranch", getCustomer);
router.get("/single/:idCustomer", getCustomerById);
router.put("/:idCustomer", updateCustomerById);
router.post("/status/:idCustomer", updateCustomerStatus);
router.delete("/:idCustomer", deleteCustomerById);

module.exports = router;
