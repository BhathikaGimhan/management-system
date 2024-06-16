const dbService = require("../services/supplierCreditLogDBService");

const createSupplierLog = async (req, res) => {
  try {
    const {
      Supplier_idSupplier,
      Total_Credit_Balance,
      Paid_Amount,
      Payment_Type,
      Payment_Method,
      Cheque_Type,
      Cheque_No,
      Cheque_Date,
      Cheque_Name,
      Branch_idBranch,
    } = req.body;

    await dbService.insertSupplierCreditLog(
      Supplier_idSupplier,
      "PAYMENT",
      0,
      0,
      Paid_Amount,
      parseFloat(Total_Credit_Balance) - parseFloat(Paid_Amount),
      Payment_Type,
      Payment_Method,
      Cheque_Type,
      Cheque_No,
      Cheque_Date,
      Cheque_Name,
      Branch_idBranch
    );
    res.status(200).json({ message: "Supplier Log added successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating supplier log", error: err.message });
  }
};

const getSupplierLog = async (req, res) => {
  try {
    const { Supplier_idSupplier } = req.params;

    const supplierLog = await dbService.fetchLogs(Supplier_idSupplier);

    if (supplierLog.length === 0) {
      return res.status(404).json({ message: "Supplier Log not found" });
    }
    res.json(supplierLog);
  } catch (err) {
    console.error("Error fetching customer:", err);
    res
      .status(500)
      .json({ message: "Error fetching supplier log", error: err.message });
  }
};

module.exports = {
  getSupplierLog,
  createSupplierLog,
};
