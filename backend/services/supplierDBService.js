const db = require("../db/db");

// Function to insert a new supplier into the database
const insertSupplier = (
  Company_Name,
  Agent_Name,
  Contact_No,
  Email,
  Address1,
  Address2,
  Address3,
  Branch_idBranch
) => {
  const query =
    "INSERT INTO supplier (Company_Name, Agent_Name, Contact_No, Email, Address1, Address2, Address3, Status, Branch_idBranch) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  return new Promise((resolve, reject) => {
    db.query(
      query,
      [
        Company_Name,
        Agent_Name,
        Contact_No,
        Email,
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

// Function to fetch all suppliers associated with a specific branch ID from the database
const fetchSupplier = (Branch_idBranch) => {
  const query = "SELECT * FROM supplier WHERE Branch_idBranch = ?";
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

// Function to fetch a specific supplier from the database based on its ID
const fetchSupplierById = (idSupplier) => {
  const query = "SELECT * FROM supplier WHERE idSupplier = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [idSupplier], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

// Function to update details of a specific supplier in the database based on its ID
const updateSupplier = (
  idSupplier,
  Company_Name,
  Agent_Name,
  Contact_No,
  Email,
  Address1,
  Address2,
  Address3
) => {
  const query =
    "UPDATE supplier SET Company_Name=?, Agent_Name=?, Contact_No=?, Email=?, Address1=?, Address2=?, Address3=? WHERE idSupplier=?";

  return db.query(query, [
    Company_Name,
    Agent_Name,
    Contact_No,
    Email,
    Address1,
    Address2,
    Address3,
    idSupplier,
  ]);
};

const getSupplierGRNs = (idSupplier) => {
  const query = "SELECT * FROM grn WHERE Supplier_idSupplier = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [idSupplier], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

// Function to delete a specific supplier from the database based on its ID
const deleteSupplier = (idSupplier) => {
  const query = "DELETE FROM supplier WHERE idSupplier=?";
  return db.query(query, [idSupplier]);
};

const updateStatus = (idSupplier) => {
  const query =
    "UPDATE supplier SET Status = CASE WHEN Status = 1 THEN 0 ELSE 1 END WHERE idSupplier = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [idSupplier], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = {
  insertSupplier,
  fetchSupplier,
  fetchSupplierById,
  updateSupplier,
  getSupplierGRNs,
  deleteSupplier,
  updateStatus,
};
