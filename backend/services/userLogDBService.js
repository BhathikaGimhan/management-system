const db = require("../db/db");

const insertLog = (
  User_idUser,
  Date_Time,
  Task_Type,
  Task_ID,
  Task_Category,
  Branch_idBranch
) => {
  const query =
    "INSERT INTO user_log (User_idUser, Date_Time, Task_Type, Task_ID, Task_Category, Branch_idBranch) VALUES (?, ?, ?, ?, ?, ?)";
  return new Promise((resolve, reject) => {
    db.query(
      query,
      [
        User_idUser,
        Date_Time,
        Task_Type,
        Task_ID,
        Task_Category,
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

const fetchLog = (Branch_idBranch, from, to) => {
  const query =
    "SELECT * FROM user_log WHERE Date_Time BETWEEN (?) AND (?) AND Branch_idBranch = ? ORDER BY idUser_Log DESC ";
  return new Promise((resolve, reject) => {
    db.query(query, [from, to, Branch_idBranch], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

const fetchCustomerById = (idCustomer) => {
  const query = "SELECT Name FROM customer WHERE idCustomer = ?";
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

const fetchUserById = (idUser) => {
  const query = "SELECT * FROM user WHERE idUser = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [idUser], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

const fetchSupplierById = (idSupplier) => {
  const query = "SELECT Company_Name FROM supplier WHERE idSupplier = ?";
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

const fetchItemById = (idItem) => {
  const query = "SELECT Description FROM item WHERE idItem = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [idItem], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

const fetchPurchaseReturnById = (idPurchase_Return) => {
  const query =
    "SELECT p.*, s.Company_Name, s.Contact_No FROM purchase_return p INNER JOIN supplier s ON p.Supplier_idSupplier = s.idSupplier WHERE p.idPurchase_Return = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [idPurchase_Return], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

const fetchGrnById = (idGRN) => {
  const query =
    "SELECT g.*, s.Company_Name, s.Contact_No FROM grn g INNER JOIN supplier s ON g.Supplier_idSupplier = s.idSupplier WHERE g.idGRN = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [idGRN], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

const fetchInvoicebyId = (idInvoice) => {
  const query =
    "SELECT i.*, c.Title, c.First_Name, c.Name, c.Address1, c.Address2, c.Address3, c.Tp FROM invoice i INNER JOIN customer c ON i.Customer_idCustomer = c.idCustomer WHERE i.idInvoice = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [idInvoice], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

const fetchQuotationById = (idQuotation) => {
  const query =
    "SELECT q.*, c.Title, c.Name, c.Email, c.Tp FROM quotation q INNER JOIN customer c ON q.Customer_idCustomer = c.idCustomer WHERE q.idQuotation = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [idQuotation], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

module.exports = {
  insertLog,
  fetchLog,
  fetchCustomerById,
  fetchSupplierById,
  fetchItemById,
  fetchPurchaseReturnById,
  fetchGrnById,
  fetchInvoicebyId,
  fetchQuotationById,
  fetchUserById
};