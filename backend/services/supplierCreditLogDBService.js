const db = require("../db/db");

const insertSupplierCreditLog = (
  Supplier_idSupplier,
  Type,
  Type_Id,
  Credit,
  Debit,
  Total_Credit_Balance,
  Payment_Type,
  Payment_Method,
  Cheque_Type,
  Cheque_No,
  Cheque_Date,
  Cheque_Name,
  Branch_idBranch
) => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const day = currentDate.getDate().toString().padStart(2, "0");
  const hours = currentDate.getHours().toString().padStart(2, "0");
  const minutes = currentDate.getMinutes().toString().padStart(2, "0");
  const seconds = currentDate.getSeconds().toString().padStart(2, "0");

  const Date_Time = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  const query =
    "INSERT INTO supplier_log (Supplier_idSupplier, Date_Time, Type, Type_Id, Credit, Debit, Total_Credit_Balance, Payment_Type, Payment_Method, Cheque_Type, Cheque_No, Cheque_Date, Cheque_Name, Branch_idBranch ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  return new Promise((resolve, reject) => {
    db.query(
      query,
      [
        Supplier_idSupplier,
        Date_Time,
        Type,
        Type_Id,
        Credit,
        Debit,
        Total_Credit_Balance,
        Payment_Type,
        Payment_Method,
        Cheque_Type,
        Cheque_No,
        Cheque_Date,
        Cheque_Name,
        Branch_idBranch,
      ],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      }
    );
  });
};

const fetchLastLog = (Supplier_idSupplier) => {
  const query =
    "SELECT * FROM supplier_log WHERE Supplier_idSupplier = ? ORDER BY idSupplier_Log DESC LIMIT 1";
  return new Promise((resolve, reject) => {
    db.query(query, [Supplier_idSupplier], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

const fetchLogs = (Supplier_idSupplier) => {
  const query = "SELECT * FROM supplier_log WHERE Supplier_idSupplier = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [Supplier_idSupplier], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

module.exports = {
  insertSupplierCreditLog,
  fetchLastLog,
  fetchLogs,
};
