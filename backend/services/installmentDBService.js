const db = require("../db/db");

const insertInstallment = (
  Invoice_idInvoice,
  Customer_idCustomer,
  Date,
  Term,
  Amount,
  Penalty_Amount,
  Total_Pending_Amount,
  Paid_Amount,
  Balance_Amount,
  Status,
  Branch_idBranch
) => {
  const query = `INSERT INTO installment_payment 
    (Invoice_idInvoice, Customer_idCustomer, Date, Term, Amount, Penalty_Amount, Total_Pending_Amount, Paid_Amount, Balance_Amount, Status, Branch_idBranch) 
    VALUES (?, ?, ?, ?, ?, ? , ?, ?, ?, ?, ?)`;
  return new Promise((resolve, reject) => {
    db.query(
      query,
      [
        Invoice_idInvoice,
        Customer_idCustomer,
        Date,
        Term,
        Amount,
        Penalty_Amount,
        Total_Pending_Amount,
        Paid_Amount,
        Balance_Amount,
        Status,
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

const getInstallment = (date_type, from, to, Branch_idBranch, customer) => {
  let query;
  let queryParams = [Branch_idBranch];
  if (date_type === "date_range") {
    query = `SELECT ip.*, c.Name AS customer, inv.Invoice_Number AS invoice_number 
      FROM installment_payment ip
      LEFT JOIN customer c ON ip.Customer_idCustomer = c.idCustomer
      LEFT JOIN invoice inv ON ip.Invoice_idInvoice = inv.idInvoice
      WHERE ip.Date BETWEEN (?) AND (?) 
      AND ip.Branch_idBranch = ? `;
    queryParams.unshift(from, to);
  } else {
    query = `SELECT ip.*, c.Name AS customer, inv.Invoice_Number AS invoice_number 
      FROM installment_payment ip
      LEFT JOIN customer c ON ip.Customer_idCustomer = c.idCustomer
      LEFT JOIN invoice inv ON ip.Invoice_idInvoice = inv.idInvoice
      WHERE ip.Branch_idBranch = ? `;
  }

  if (customer !== "all") {
    query += `AND ip.Customer_idCustomer = ?`;
    queryParams.push(customer);
  }

  return new Promise((resolve, reject) => {
    db.query(query, queryParams, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

const processInstallment = (
  idInstallment_Payment,
  Penalty_Amount,
  Total_Pending_Amount,
  Paid_Date,
  Paid_Amount,
  Balance_Amount,
  Status
) => {
  const query = `
    UPDATE installment_payment 
    SET 
    Penalty_Amount=?, 
    Total_Pending_Amount=?, 
    Paid_Date=?, 
    Paid_Amount=?, 
    Balance_Amount=?, 
    Status=?
    WHERE 
    idInstallment_Payment=?
  `;

  return db.query(query, [
    Penalty_Amount,
    Total_Pending_Amount,
    Paid_Date,
    Paid_Amount,
    Balance_Amount,
    Status,
    idInstallment_Payment,
  ]);
};

const fetchInstallment = (idInstallment_Payment) => {
  query = `SELECT ip.*, c.Name AS customer, inv.Invoice_Number AS invoice_number 
  FROM installment_payment ip
  LEFT JOIN customer c ON ip.Customer_idCustomer = c.idCustomer
  LEFT JOIN invoice inv ON ip.Invoice_idInvoice = inv.idInvoice
  WHERE idInstallment_Payment = ?`;
  return new Promise((resolve, reject) => {
    db.query(query, [idInstallment_Payment], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

const fetchInstallmentByInvoice = (Invoice_idInvoice) => {
  query = `SELECT *
   FROM installment_payment 
  WHERE Invoice_idInvoice = ?`;
  return new Promise((resolve, reject) => {
    db.query(query, [Invoice_idInvoice], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

module.exports = {
  insertInstallment,
  getInstallment,
  processInstallment,
  fetchInstallment,
  fetchInstallmentByInvoice,
};
