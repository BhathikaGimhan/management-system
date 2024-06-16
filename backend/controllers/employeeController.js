const dbService = require("../services/employeeDBService");

const createEmployee = async (req, res) => {
  try {
    const {
      Branch_idBranch,
      Employee_Name,
      Employee_NIC,
      Employee_Number,
      ETF_No,
      Contact_No,
    } = req.body;
    await dbService.insertEmployee(
      Employee_Name,
      Employee_NIC,
      Employee_Number,
      ETF_No,
      Contact_No,
      Branch_idBranch
    );

    res.json({
      message: "Salesman added successfully",
    });
  } catch (err) {
    console.error("Error creating salesman:", err);
    res
      .status(500)
      .json({ message: "Error creating salesman", error: err.message });
  }
};

const updateEmployeeById = async (req, res) => {
  try {
    console.log(req.params);
    const { idEmployee } = req.params;
    const { Employee_Name, Employee_NIC, Employee_Number, ETF_No, Contact_No } =
      req.body;
    await dbService.updateEmployee(
      idEmployee,
      Employee_Name,
      Employee_NIC,
      Employee_Number,
      ETF_No,
      Contact_No
    );
    res.json({ message: "Salesman updated successfully" });
  } catch (err) {
    console.error("Error updating salesman:", err);
    res
      .status(500)
      .json({ message: "Error updating salesman", error: err.message });
  }
};

const getEmployees = async (req, res) => {
  try {
    const { Branch_idBranch } = req.params;

    const employees = await dbService.fetchEmployees(Branch_idBranch);
    res.json(employees);
  } catch (err) {
    console.error("Error fetching salesman:", err);
    res
      .status(500)
      .json({ message: "Error fetching salesman", error: err.message });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const { idEmployee } = req.params;
    const employee = await dbService.fetchEmployeeById(idEmployee);
    if (employee.length === 0) {
      return res.status(404).json({ message: "Salesman not found" });
    }
    res.json(employee[0]);
  } catch (err) {
    console.error("Error fetching salesman by ID:", err);
    res
      .status(500)
      .json({ message: "Error fetching salesman by ID", error: err.message });
  }
};

// Function to delete a salesman by ID
const deleteEmployeeById = async (req, res) => {
  try {
    const { idEmployee } = req.params;
    const checkInvoiceWithEmployee = await dbService.getEmployeeInvoices(
      idEmployee
    );
    if (checkInvoiceWithEmployee.length === 0) {
      await dbService.deleteEmployee(idEmployee);
      res.json({ message: "Salesman deleted successfully" });
    } else {
      res.status(409).json({ message: "Salesman has Invoice(s)" });
    }
  } catch (err) {
    console.error("Error deleting Salesman:", err);
    res
      .status(500)
      .json({ message: "Error deleting Salesman", error: err.message });
  }
};

module.exports = {
  createEmployee,
  getEmployees,
  updateEmployeeById,
  getEmployeeById,
  deleteEmployeeById,
};
