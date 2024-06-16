const db = require("../db/db");

const insertEmployee = (
  Employee_Name,
  Employee_NIC,
  Employee_Number,
  ETF_No,
  Contact_No,
  Branch_idBranch
) => {
  const query = `INSERT INTO employee 
    (Employee_Name, Employee_NIC, Employee_Number, ETF_No, Contact_No, Branch_idBranch) 
    VALUES (?, ?, ?, ?, ?, ?)`;
  return new Promise((resolve, reject) => {
    db.query(
      query,
      [
        Employee_Name,
        Employee_NIC,
        Employee_Number,
        ETF_No,
        Contact_No,
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

const updateEmployee = (
  idEmployee,
  Employee_Name,
  Employee_NIC,
  Employee_Number,
  ETF_No,
  Contact_No
) => {
  const query = `
    UPDATE employee 
    SET 
    Employee_Name=?, 
    Employee_NIC=?, 
    Employee_Number=?, 
    ETF_No=?, 
    Contact_No=?
    WHERE 
    idEmployee=?
  `;

  return db.query(query, [
    Employee_Name,
    Employee_NIC,
    Employee_Number,
    ETF_No,
    Contact_No,
    idEmployee,
  ]);
};

const fetchEmployees = (Branch_idBranch) => {
  const query = `SELECT * FROM employee WHERE Branch_idBranch = ? ORDER BY idEmployee ASC`;
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

const fetchEmployeeById = (idEmployee) => {
  const query = "SELECT * FROM employee WHERE idEmployee = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [idEmployee], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

const getEmployeeInvoices = (idEmployee) => {
  const query = "SELECT * FROM invoice WHERE Employee_idEmployee = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [idEmployee], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

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

// Function to delete a specific employee from the database based on its ID
const deleteEmployee = (idEmployee) => {
  const query = "DELETE FROM employee WHERE idEmployee=?";
  return db.query(query, [idEmployee]);
};

module.exports = {
  insertEmployee,
  fetchEmployees,
  updateEmployee,
  fetchEmployeeById,
  getEmployeeInvoices,
  deleteEmployee,
};
