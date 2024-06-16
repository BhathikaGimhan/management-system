const db = require("../db/db");

const getInvoiceCount = (date, Branch_idBranch) => {
  const query =
    "SELECT COUNT(*) AS invoices FROM invoice WHERE Date = ? AND Branch_idBranch = ?";

  return new Promise((resolve, reject) => {
    db.query(query, [date, Branch_idBranch], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

const getCustomerCount = (Branch_idBranch) => {
  const query =
    "SELECT COUNT(*) AS customers FROM customer WHERE Branch_idBranch = ?";

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
const getSupplierCount = (Branch_idBranch) => {
  const query =
    "SELECT COUNT(*) AS supplier FROM supplier WHERE Branch_idBranch = ?";

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

const getCustomerLog = (Branch_idBranch) => {
  const query = `SELECT l.*, c.Name AS customer FROM customer_credit_log l LEFT JOIN customer c ON c.idCustomer = l.Customer_idCustomer WHERE l.idCustomer_Credit_Log IN (SELECT MAX(l.idCustomer_Credit_Log) FROM customer_credit_log WHERE Branch_idBranch = ? AND l.Total_Credit_Balance != "0" GROUP BY Customer_idCustomer) AND l.Branch_idBranch = ? GROUP BY l.Customer_idCustomer ORDER BY l.idCustomer_Credit_Log DESC`;

  return new Promise((resolve, reject) => {
    db.query(query, [Branch_idBranch, Branch_idBranch], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

const getSupplierLog = (Branch_idBranch) => {
  const query = `SELECT l.*, s.Company_Name AS supplier FROM supplier_log l LEFT JOIN supplier s ON s.idSupplier = l.Supplier_idSupplier WHERE l.idSupplier_Log IN (SELECT MAX(l.idSupplier_Log) FROM supplier_log WHERE Branch_idBranch = ? AND l.Total_Credit_Balance != "0" GROUP BY Supplier_idSupplier) AND l.Branch_idBranch = ? GROUP BY l.Supplier_idSupplier ORDER BY l.idSupplier_Log DESC`;

  return new Promise((resolve, reject) => {
    db.query(query, [Branch_idBranch, Branch_idBranch], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

const getDuePayments = (date, Branch_idBranch) => {
  let query = `SELECT ip.*, c.Name AS customer, inv.Invoice_Number AS invoice_number 
  FROM installment_payment ip
  LEFT JOIN customer c ON ip.Customer_idCustomer = c.idCustomer
  LEFT JOIN invoice inv ON ip.Invoice_idInvoice = inv.idInvoice
  WHERE ip.Date < (?)
  AND ip.Branch_idBranch = ? `;

  return new Promise((resolve, reject) => {
    db.query(query, [date, Branch_idBranch], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

const getDaliySales = (date, Branch_idBranch) => {
  let dates = [];
  let promises = [];
  const startDate = new Date(date);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() - 7);

  // Loop through the dates from endDate to startDate
  while (endDate <= startDate) {
    // Push the current date into the dates array
    let pushDate = endDate.toISOString().split("T")[0];
    dates.push(pushDate);

    const query = `SELECT COUNT(*) AS invoiceCount FROM invoice WHERE Date = ? AND Branch_idBranch = ?`;

    let invoiceDatePromise = new Promise((resolve, reject) => {
      db.query(query, [pushDate, Branch_idBranch], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0].invoiceCount);
        }
      });
    });
    promises.push(invoiceDatePromise);

    // Move to the next day
    endDate.setDate(endDate.getDate() + 1);
  }

  return Promise.all(promises);
};

const getMonthlySales = (date, Branch_idBranch) => {
  let months = [];
  let promises = [];
  const startDate = new Date(date);

  // Loop through the past 7 months
  for (let i = 0; i < 9; i++) {
    let currentDate = new Date(startDate);
    currentDate.setMonth(startDate.getMonth() - i);

    // Extract year and month
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1; // Months are 0 indexed, so adding 1

    // Format month to MM format
    let formattedMonth = month < 10 ? "0" + month : month;

    // Push the current month and year into the months array
    let pushMonth = `${year}-${formattedMonth}`;
    months.push(pushMonth);

    const query = `SELECT COUNT(*) AS invoiceCount FROM invoice WHERE YEAR(Date) = ? AND MONTH(Date) = ? AND Branch_idBranch = ? ORDER BY MONTH(Date) DESC`;

    let invoiceMonthPromise = new Promise((resolve, reject) => {
      db.query(query, [year, month, Branch_idBranch], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0].invoiceCount);
        }
      });
    });
    promises.push(invoiceMonthPromise);
  }

  return Promise.all(promises).then((results) => results.reverse());
};

const getCustomerCheques = (date, Branch_idBranch) => {
  const customerQuery = `SELECT * FROM customer_credit_log WHERE Branch_idBranch = ? AND Payment_Method = 'cheque' AND DATE(Date_Time) >= ?`;

  // const query = `SELECT l.*, s.Company_Name AS supplier FROM supplier_log l LEFT JOIN supplier s ON s.idSupplier = l.Supplier_idSupplier WHERE l.idSupplier_Log IN (SELECT MAX(l.idSupplier_Log) FROM supplier_log WHERE Branch_idBranch = ? AND l.Total_Credit_Balance != "0" GROUP BY Supplier_idSupplier) AND l.Branch_idBranch = ? GROUP BY l.Supplier_idSupplier ORDER BY l.idSupplier_Log DESC`;

  return new Promise((resolve, reject) => {
    db.query(customerQuery, [Branch_idBranch, date], (err, results) => {
      if (err) {
        reject(err);
      } else {
        const modifiedResults = results.map((result) => ({
          ...result,
          type: "recieved",
        }));
        resolve(JSON.parse(JSON.stringify(modifiedResults)));
      }
    });
  });
};

const getSupplierCheques = (date, Branch_idBranch) => {
  const supplierQuery = `SELECT * FROM supplier_log WHERE Branch_idBranch = ? AND Payment_Method = 'cheque' AND DATE(Date_Time) >= ?`;

  // const query = `SELECT l.*, s.Company_Name AS supplier FROM supplier_log l LEFT JOIN supplier s ON s.idSupplier = l.Supplier_idSupplier WHERE l.idSupplier_Log IN (SELECT MAX(l.idSupplier_Log) FROM supplier_log WHERE Branch_idBranch = ? AND l.Total_Credit_Balance != "0" GROUP BY Supplier_idSupplier) AND l.Branch_idBranch = ? GROUP BY l.Supplier_idSupplier ORDER BY l.idSupplier_Log DESC`;

  return new Promise((resolve, reject) => {
    db.query(supplierQuery, [Branch_idBranch, date], (err, results) => {
      if (err) {
        reject(err);
      } else {
        const modifiedResults = results.map((result) => ({
          ...result,
          type: "issued",
        }));
        resolve(JSON.parse(JSON.stringify(modifiedResults)));
      }
    });
  });
};

module.exports = {
  getInvoiceCount,
  getCustomerCount,
  getCustomerLog,
  getSupplierLog,
  getDaliySales,
  getCustomerCheques,
  getSupplierCheques,
  getMonthlySales,
  getSupplierCount,
  getDuePayments,
};
