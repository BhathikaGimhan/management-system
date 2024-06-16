const db = require("../db/db");

const getQuotationNumberDetails = (Branch_idBranch) => {
  const query =
    "SELECT Order_No_Start_With, Order_No_Strat_From FROM rules WHERE Branch_idBranch = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [Branch_idBranch], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

const getInvoiceNumberDetails = (Branch_idBranch) => {
  const query =
    "SELECT Invoice_No_Start_With, Invoice_No_Strat_From FROM rules WHERE Branch_idBranch = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [Branch_idBranch], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

const getRules = (Branch_idBranch) => {
  const query = "SELECT * FROM rules WHERE Branch_idBranch = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [Branch_idBranch], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

const updateSettings = (
  idRules,
  Invoice_PrintType,
  Salesman,
  Invoice_No_Start_With,
  Invoice_No_Strat_From,
  Order_No_Start_With,
  Order_No_Strat_From
) => {
  const query =
    "UPDATE rules SET Invoice_PrintType = ?, Salesman = ?, Invoice_No_Start_With = ?, Invoice_No_Strat_From = ?, Order_No_Start_With = ?, Order_No_Strat_From = ? WHERE idRules = ?";
  return new Promise((resolve, reject) => {
    db.query(
      query,
      [
        Invoice_PrintType,
        Salesman,
        Invoice_No_Start_With,
        Invoice_No_Strat_From,
        Order_No_Start_With,
        Order_No_Strat_From,
        idRules,
      ],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(JSON.stringify(results)));
        }
      }
    );
  });
};

module.exports = {
  getQuotationNumberDetails,
  getInvoiceNumberDetails,
  getRules,
  updateSettings,
};
