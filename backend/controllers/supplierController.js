const dbService = require("../services/supplierDBService");
const userLogDbService = require("../services/userLogDBService");
const { currentDate } = require("../utils/currentData");

// Function to create a new supplier
const createSupplier = async (req, res) => {
  try {
    const {
      Company_Name,
      Agent_Name,
      Contact_No,
      Email,
      Address1,
      Address2,
      Address3,
      Branch_idBranch,
      User_idUser,
    } = req.body;

    const supplier = await dbService.insertSupplier(
      Company_Name,
      Agent_Name,
      Contact_No,
      Email,
      Address1,
      Address2,
      Address3,
      Branch_idBranch
    );
    const supplier_id = supplier.insertId;
    await userLogDbService.insertLog(
      User_idUser,
      currentDate(),
      "Supplier",
      supplier_id,
      "create",
      Branch_idBranch
    );
    res.status(200).json({ message: "Supplier added successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating supplier", error: err.message });
  }
};

// Function to get suppliers by branch ID
const getSupplier = async (req, res) => {
  try {
    const { Branch_idBranch } = req.params;

    const supplier = await dbService.fetchSupplier(Branch_idBranch);
    res.json(supplier);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching supplier", error: err.message });
  }
};

// Function to get a supplier by ID
const getSupplierById = async (req, res) => {
  try {
    const { idSupplier } = req.params;
    const supplier = await dbService.fetchSupplierById(idSupplier);
    if (supplier.length === 0) {
      return res.status(404).json({ message: "supplier not found" });
    }
    res.json(supplier[0]);
  } catch (err) {
    console.error("Error fetching supplier by ID:", err);
    res
      .status(500)
      .json({ message: "Error fetching supplier by ID", error: err.message });
  }
};

// Function to update a supplier by ID
const updateSupplierById = async (req, res) => {
  try {
    const { idSupplier } = req.params;
    const {
      Company_Name,
      Agent_Name,
      Contact_No,
      Email,
      Address1,
      Address2,
      Address3,
      User_idUser,
      Branch_idBranch,
    } = req.body;
    await dbService.updateSupplier(
      idSupplier,
      Company_Name,
      Agent_Name,
      Contact_No,
      Email,
      Address1,
      Address2,
      Address3
    );
    await userLogDbService.insertLog(
      User_idUser,
      currentDate(),
      "Supplier",
      idSupplier,
      "edit",
      Branch_idBranch
    );
    res.json({ message: "Supplier updated successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating Supplier", error: err.message });
  }
};

// Function to delete a supplier by ID  try {
const deleteSupplierById = async (req, res) => {
  try {
    const { idSupplier } = req.params;
    const checkGRNWithSupplier = await dbService.getSupplierGRNs(idSupplier);
    if (checkGRNWithSupplier.length === 0) {
      await dbService.deleteSupplier(idSupplier);
      res.json({ message: "Supplier deleted successfully" });
    } else {
      res.status(409).json({ message: "Supplier has Invoices" });
    }
  } catch (err) {
    console.error("Error deleting Supplier:", err);
    res
      .status(500)
      .json({ message: "Error deleting Supplier", error: err.message });
  }
};

const updateSupplierStatus = async (req, res) => {
  try {
    const { idSupplier } = req.params;
    const { Branch_idBranch, User_idUser } = req.body;
    await dbService.updateStatus(idSupplier);

    await userLogDbService.insertLog(
      User_idUser,
      currentDate(),
      "Supplier",
      idSupplier,
      "change status",
      Branch_idBranch
    );
    res.json({ message: "Supplier status updated successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating supplier status", error: err.message });
  }
};

module.exports = {
  createSupplier,
  getSupplier,
  getSupplierById,
  updateSupplierById,
  deleteSupplierById,
  updateSupplierStatus,
};
