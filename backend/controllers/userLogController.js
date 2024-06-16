const dbService = require("../services/userLogDBService");

const getLog = async (req, res) => {
  try {
    const { Branch_idBranch, from, to } = req.params;

    const userLog = await dbService.fetchLog(
      Branch_idBranch,
      `${from} 00:00`,
      `${to} 23:59`
    );

    for (let i = 0; i < userLog.length; i++) {
      if (userLog[i].Task_Type === "Customer") {
        const customer = await dbService.fetchCustomerById(userLog[i].Task_ID);
        const user = await dbService.fetchUserById(userLog[i].User_idUser);
        userLog[i].customer = customer[0].Name;
        userLog[i].User = user[0].User_Name;
      } else if (userLog[i].Task_Type === "Supplier") {
        const supplier = await dbService.fetchSupplierById(userLog[i].Task_ID);
        const user = await dbService.fetchUserById(userLog[i].User_idUser);
        userLog[i].supplier = supplier[0].Company_Name;
        userLog[i].User = user[0].User_Name;
      } else if (userLog[i].Task_Type === "Item") {
        const item = await dbService.fetchItemById(userLog[i].Task_ID);
        const user = await dbService.fetchUserById(userLog[i].User_idUser);
        userLog[i].item = item[0].Description;
        userLog[i].User = user[0].User_Name;
      } else if (userLog[i].Task_Type === "Purchase Return") {
        const purchase_return = await dbService.fetchPurchaseReturnById(
          userLog[i].Task_ID
        );
        const user = await dbService.fetchUserById(userLog[i].User_idUser);
        userLog[i].Company_Name = purchase_return[0].Company_Name;
        userLog[i].Total_Amount = purchase_return[0].Total_Amount;
        userLog[i].User = user[0].User_Name;
      } else if (userLog[i].Task_Type === "GRN") {
        const grn = await dbService.fetchGrnById(userLog[i].Task_ID);
        const user = await dbService.fetchUserById(userLog[i].User_idUser);
        userLog[i].Bill_no = grn[0].Bill_no;
        userLog[i].User = user[0].User_Name;
      } else if (userLog[i].Task_Type === "Invoice") {
        const invoice = await dbService.fetchInvoicebyId(userLog[i].Task_ID);
        const user = await dbService.fetchUserById(userLog[i].User_idUser);
        userLog[i].Invoice_Number = invoice[0].Invoice_Number;
        userLog[i].User = user[0].User_Name;
      } else if (userLog[i].Task_Type === "Quotation") {
        const quotation = await dbService.fetchQuotationById(
          userLog[i].Task_ID
        );
        const user = await dbService.fetchUserById(userLog[i].User_idUser);
        userLog[i].User = user[0].User_Name;
        userLog[i].Quotation_Number = quotation[0].Quotation_Number;
      }
    }
    res.json(userLog);
  } catch (err) {
    console.error("Error fetching user log:", err);
    res
      .status(500)
      .json({ message: "Error fetching user log", error: err.message });
  }
};

module.exports = {
  getLog,
};
