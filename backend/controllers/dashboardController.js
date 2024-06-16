const dbService = require("../services/dashboardDBService");

const getDashboardData = async (req, res) => {
  try {
    const { Branch_idBranch } = req.params;
    const currentDate = new Date();
    const fromDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000); // Subtracting 7 days
    const formattedCurrentDate = currentDate.toISOString().split("T")[0]; // Formatting to YYYY-MM-DD
    const formattedFromDate = fromDate.toISOString().split("T")[0]; // Formatting to YYYY-MM-DD

    const invoiceCount = await dbService.getInvoiceCount(
      formattedCurrentDate,
      Branch_idBranch
    );
    const customerCount = await dbService.getCustomerCount(Branch_idBranch);
    const supplierCount = await dbService.getSupplierCount(Branch_idBranch);

    const customer_credit_logs = await dbService.getCustomerLog(
      Branch_idBranch
    );
    const supllier_credit_logs = await dbService.getSupplierLog(
      Branch_idBranch
    );
    const daliy_sales = await dbService.getDaliySales(
      formattedCurrentDate,
      Branch_idBranch
    );
    const monthly_sales = await dbService.getMonthlySales(
      formattedCurrentDate,
      Branch_idBranch
    );

    let cheques = [];
    const customer_cheques = await dbService.getCustomerCheques(
      formattedCurrentDate,
      Branch_idBranch
    );
    for (const customer_cheque of customer_cheques) {
      let cusData = {
        date: customer_cheque.Date_Time,
        name: customer_cheque.Cheque_Name,
        cheque_type: customer_cheque.Cheque_Type,
        type: customer_cheque.type,
        total: customer_cheque.Total_Credit_Balance,
      };
      cheques.push(cusData);
    }

    const supplier_cheques = await dbService.getSupplierCheques(
      formattedCurrentDate,
      Branch_idBranch
    );

    for (const suppplier_cheque of supplier_cheques) {
      let supData = {
        date: suppplier_cheque.Date_Time,
        name: suppplier_cheque.Cheque_Name,
        cheque_type: suppplier_cheque.Cheque_Type,
        type: suppplier_cheque.type,
        total: suppplier_cheque.Total_Credit_Balance,
      };
      cheques.push(supData);
    }

    const duePayments = await dbService.getDuePayments(
      formattedCurrentDate,
      Branch_idBranch
    );

    const data = {
      customer_count: customerCount[0].customers,
      supplier_count: supplierCount[0].supplier,
      invoice_count: invoiceCount[0].invoices,
      customer_credit_logs: customer_credit_logs,
      supllier_credit_logs: supllier_credit_logs,
      daliy_sales: daliy_sales,
      monthly_sales: monthly_sales,
      near_by_cheques: cheques,
      duePayments: duePayments,
    };
    // console.log(invoiceCount[0]);

    res.json(data);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching branch by ID", error: err.message });
  }
};

module.exports = {
  getDashboardData,
};
