const db = require("../db/db");

const insertCustomer = (
  Title,
  First_Name,
  Name,
  Tp,
  Email,
  NIC,
  Birthday,
  Address1,
  Address2,
  Address3,
  Branch_idBranch
) => {
  const query =
    "INSERT INTO customer (Title, First_Name, Name, Tp, Email, NIC, Birthday, Address1, Address2, Address3, Status, Branch_idBranch) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  return new Promise((resolve, reject) => {
    db.query(
      query,
      [
        Title,
        First_Name,
        Name,
        Tp,
        Email,
        NIC,
        Birthday,
        Address1,
        Address2,
        Address3,
        1,
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

const fetchCustomer = (Branch_idBranch) => {
  const query =
    "SELECT c.*, SUM(i.Net_Amount) AS Total_Invoice, COUNT(i.idInvoice) AS Invoice_Count FROM customer c LEFT JOIN invoice i ON c.idCustomer = i.Customer_idCustomer WHERE c.Branch_idBranch = ? GROUP BY c.idCustomer ORDER BY c.idCustomer DESC";
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

const fetchCustomerById = (idCustomer) => {
  const query = "SELECT * FROM customer WHERE idCustomer = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [idCustomer], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

// Function to fetch all items for a specific category from the 'item' table
const getCustomerInvoices = (idCustomer) => {
  const query = "SELECT * FROM invoice WHERE Customer_idCustomer = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [idCustomer], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

const updateCustomer = (
  idCustomer,
  Title,
  First_Name,
  Name,
  Tp,
  Email,
  NIC,
  Birthday,
  Address1,
  Address2,
  Address3
) => {
  const query = `
    UPDATE customer 
    SET 
    Title=?, 
    First_Name=?, 
    Name=?, 
    Tp=?, 
    Email=?, 
    NIC=?, 
    Birthday=?, 
    Address1=?, 
    Address2=?, 
    Address3=?
    WHERE 
    idCustomer=?
  `;

  return db.query(query, [
    Title,
    First_Name,
    Name,
    Tp,
    Email,
    NIC,
    Birthday,
    Address1,
    Address2,
    Address3,
    idCustomer,
  ]);
};

const checkCustomerExist = (Tp, Branch_idBranch) => {
  const query = "SELECT * FROM customer WHERE Tp = ? AND Branch_idBranch = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [Tp, Branch_idBranch], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

const deleteCustomer = (idCustomer) => {
  const query = "DELETE FROM customer WHERE idCustomer=?";
  return db.query(query, [idCustomer]);
};

const updateStatus = (idCustomer) => {
  const query =
    "UPDATE customer SET Status = CASE WHEN Status = 1 THEN 0 ELSE 1 END WHERE idCustomer = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [idCustomer], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = {
  insertCustomer,
  fetchCustomer,
  fetchCustomerById,
  updateCustomer,
  deleteCustomer,
  checkCustomerExist,
  updateStatus,
  getCustomerInvoices,
};
