const express = require("express");
const router = express.Router();
// Importing controller functions for handling supplier operations
const {
  createSupplier,
  getSupplier,
  getSupplierById,
  updateSupplierById,
  deleteSupplierById,
  updateSupplierStatus,
} = require("../controllers/supplierController");

router.post("/", createSupplier); // Route for creating a new supplier
router.get("/:Branch_idBranch", getSupplier); // Route for getting suppliers by branch ID
router.get("/single/:idSupplier", getSupplierById); // Route for getting a single supplier by ID
router.put("/:idSupplier", updateSupplierById); // Route for updating a supplier by ID
router.delete("/:idSupplier", deleteSupplierById); // Route for deleting a supplier by ID
router.post("/status/:idSupplier", updateSupplierStatus);

module.exports = router;
