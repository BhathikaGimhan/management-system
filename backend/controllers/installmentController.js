const dbService = require("../services/installmentDBService");
const paymentDetailsDBService = require("../services/branchDBService");

const getInstallmentsByDates = async (req, res) => {
  try {
    const {
      Branch_idBranch,
      from_date,
      to_date,
      customer,
      date_type,
      current_date,
    } = req.params;
    const installments = await dbService.getInstallment(
      date_type,
      from_date,
      to_date,
      Branch_idBranch,
      customer
    );

    const paymentDetails = await paymentDetailsDBService.fetchPaymentDetails(
      Branch_idBranch
    );

    let penalty_percentage = paymentDetails[0].Penalty_Percentage;
    let data = [];

      installments.forEach((installment) => {
        let Penalty_Amount = installment.Penalty_Amount;
        let Total_Pending_Amount = installment.Total_Pending_Amount;
        let Balance_Amount = installment.Balance_Amount;
        let Due = 0;

        const installmentDate = new Date(installment.Date)
          .toISOString()
          .split("T")[0];
        if (
          new Date(current_date) > new Date(installmentDate) &&
          installment.Status === 0
        ) {
          Penalty_Amount =
            installment.Balance_Amount * (penalty_percentage / 100);
          Total_Pending_Amount = installment.Balance_Amount + Penalty_Amount;
          Balance_Amount = Total_Pending_Amount;
          Due = 1;
        }
        let updatedInstallment = {
          ...installment,
          Penalty_Amount: Penalty_Amount, // Example value for Penalty_Amount
          Total_Pending_Amount: Total_Pending_Amount, // Example value for Total_Pending_Amount
          Balance_Amount: Balance_Amount, // Example value for Balance_Amount
          Due: Due,
        };
        data.push(updatedInstallment);
      });
   

    res.json(data);
  } catch (err) {
    console.error("Error fetching installments:", err);
    res
      .status(500)
      .json({ message: "Error fetching installments", error: err.message });
  }
};

const processInstallment = async (req, res) => {
  try {
    const { idInstallment_Payment } = req.params;
    const { Penalty_Amount, Paid_Date, Paid_Amount, Amount } = req.body;

    const installmentData = await dbService.fetchInstallment(
      idInstallment_Payment
    );
    if (installmentData.length === 0) {
      return res.status(404).json({ message: "installment not found" });
    }

    const installment = installmentData[0];
    let Total_Pending_Amount = installment.Total_Pending_Amount;
    let Balance_Amount = 0;
    let Status = 1;
    let New_Paid_Amount =
      parseFloat(installment.Paid_Amount) + parseFloat(Paid_Amount);

    if (Penalty_Amount > 0 && New_Paid_Amount < installment.Balance_Amount) {
      Total_Pending_Amount = installment.Amount + Penalty_Amount;
      Balance_Amount = installment.Balance_Amount - New_Paid_Amount;
      Status = 0;
    } else if (New_Paid_Amount < installment.Balance_Amount) {
      Balance_Amount = installment.Balance_Amount - New_Paid_Amount;
      Status = 0;
    }

    await dbService.processInstallment(
      idInstallment_Payment,
      Penalty_Amount,
      Total_Pending_Amount,
      Paid_Date,
      New_Paid_Amount,
      Balance_Amount,
      Status
    );

    const updatedInstallmentData = await dbService.fetchInstallment(
      idInstallment_Payment
    );
    if (updatedInstallmentData.length === 0) {
      return res.status(404).json({ message: "installment not found" });
    }
    const updatedInstallment = updatedInstallmentData[0];

    let data = {
      ...updatedInstallment,
     Invoice_Paid_Amount : Paid_Amount,
    };

    res.json({
      message: "Installment has been processed successfully",
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error updating installment status",
      error: err.message,
    });
  }
};

module.exports = {
  getInstallmentsByDates,
  processInstallment,
};
