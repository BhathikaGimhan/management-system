const express = require("express");
const router = express.Router();
const {
  createEmployee,
  getEmployees,
  updateEmployeeById,
  getEmployeeById,
  deleteEmployeeById,
} = require("../controllers/employeeController");

router.get("/:Branch_idBranch", getEmployees).post("/", createEmployee);
router.put("/:idEmployee", updateEmployeeById);
router.get("/single/:idEmployee", getEmployeeById);
router.delete("/:idEmployee", deleteEmployeeById);

module.exports = router;
