const dbService = require("../services/customerDBService");
const userLogDbService = require("../services/userLogDBService");
const { currentDate } = require("../utils/currentData");

const createCustomer = async (req, res) => {
  try {
    const {
      Title,
      First_Name,
      Name,
      Tp,
      Email,
      NIC,
      Birthday,
      Address1,
      Address2,
      Address3,
      Branch_idBranch,
      User_idUser,
    } = req.body;

    const check = await dbService.checkCustomerExist(Tp, Branch_idBranch);

    if (check.length > 0) {
      res.status(409).json({
        message: "Customer already exist",
      });
      return;
    }
    const customer = await dbService.insertCustomer(
      Title,
      First_Name,
      Name,
      Tp,
      Email,
      NIC,
      Birthday,
      Address1,
      Address2,
      Address3,
      Branch_idBranch
    );

    const customer_id = customer.insertId;
    await userLogDbService.insertLog(
      User_idUser,
      currentDate(),
      "Customer",
      customer_id,
      "create",
      Branch_idBranch
    );
    res.status(200).json({ message: "Customer added successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating customer", error: err.message });
  }
};

const getCustomer = async (req, res) => {
  try {
    const { Branch_idBranch } = req.params;

    const customer = await dbService.fetchCustomer(Branch_idBranch);
    res.json(customer);
  } catch (err) {
    console.error("Error fetching customer:", err);
    res
      .status(500)
      .json({ message: "Error fetching customer", error: err.message });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const { idCustomer } = req.params;
    const customer = await dbService.fetchCustomerById(idCustomer);
    if (customer.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json(customer[0]);
  } catch (err) {
    console.error("Error fetching customer by ID:", err);
    res
      .status(500)
      .json({ message: "Error fetching customer by ID", error: err.message });
  }
};

const updateCustomerById = async (req, res) => {
  try {
    const { idCustomer } = req.params;
    const {
      Title,
      First_Name,
      Name,
      Tp,
      Email,
      NIC,
      Birthday,
      Address1,
      Address2,
      Address3,
      Branch_idBranch,
      User_idUser,
    } = req.body;
    await dbService.updateCustomer(
      idCustomer,
      Title,
      First_Name,
      Name,
      Tp,
      Email,
      NIC,
      Birthday,
      Address1,
      Address2,
      Address3
    );

    await userLogDbService.insertLog(
      User_idUser,
      currentDate(),
      "Customer",
      idCustomer,
      "edit",
      Branch_idBranch
    );
    res.json({ message: "Customer updated successfully" });
  } catch (err) {
    console.error("Error updating customer:", err);
    res
      .status(500)
      .json({ message: "Error updating customer", error: err.message });
  }
};

const deleteCustomerById = async (req, res) => {
  try {
    const { idCustomer } = req.params;
    const checkInvoiceWithCustomer = await dbService.getCustomerInvoices(
      idCustomer
    );
    if (checkInvoiceWithCustomer.length === 0) {
      await dbService.deleteCustomer(idCustomer);
      res.json({ message: "Customer deleted successfully" });
    } else {
      res.status(404).json({ message: "Customer has Invoices" });
    }
  } catch (err) {
    console.error("Error deleting Customer:", err);
    res
      .status(500)
      .json({ message: "Error deleting Customer", error: err.message });
  }
};

const updateCustomerStatus = async (req, res) => {
  try {
    const { idCustomer } = req.params;
    const { Branch_idBranch, User_idUser } = req.body;

    await dbService.updateStatus(idCustomer);
    await userLogDbService.insertLog(
      User_idUser,
      currentDate(),
      "Customer",
      idCustomer,
      "change status",
      Branch_idBranch
    );
    res.json({ message: "Customer status updated successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating customer status", error: err.message });
  }
};

module.exports = {
  createCustomer,
  getCustomer,
  getCustomerById,
  updateCustomerById,
  deleteCustomerById,
  updateCustomerStatus,
};
