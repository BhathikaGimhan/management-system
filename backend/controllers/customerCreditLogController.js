const dbService = require("../services/customerCreditLogDBService");

const createCustomerLog = async (req, res) => {
  try {
    const {
      Customer_idCustomer,
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

    await dbService.insertCustomerCreditLog(
      Customer_idCustomer,
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
    res.status(200).json({ message: "Customer Log added successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating customer log", error: err.message });
  }
};

const getCustomerCreditLog = async (req, res) => {
  try {
    const { Customer_idCustomer } = req.params;

    const customerLog = await dbService.fetchLogs(Customer_idCustomer);

    if (customerLog.length === 0) {
      return res.status(404).json({ message: "Customer Log not found" });
    }
    res.json(customerLog);
  } catch (err) {
    console.error("Error fetching customer:", err);
    res.status(500).json({
      message: "Error fetching customer credit log",
      error: err.message,
    });
  }
};

module.exports = {
  getCustomerCreditLog,
  createCustomerLog,
};
