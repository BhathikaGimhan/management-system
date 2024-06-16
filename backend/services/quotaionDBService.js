const db = require("../db/db");

const getLastQuotation = (Branch_idBranch) => {
  const query =
    "SELECT * FROM quotation WHERE Branch_idBranch = ? ORDER BY idQuotation DESC LIMIT 1";
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

const insertQuotation = (
  Quotation_Number,
  Customer_idCustomer,
  Date,
  Expire_Date,
  SubTotal,
  Discount_Type,
  Discount,
  Total,
  Note,
  Branch_idBranch
) => {
  const query =
    "INSERT INTO quotation (Quotation_Number, Customer_idCustomer, Date, Expire_Date, SubTotal, Discount_Type,Discount, Total, Note, Status, Branch_idBranch) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  return new Promise((resolve, reject) => {
    db.query(
      query,
      [
        Quotation_Number,
        Customer_idCustomer,
        Date,
        Expire_Date,
        SubTotal,
        Discount_Type,
        Discount,
        Total,
        Note,
        0,
        Branch_idBranch,
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

const insertQuotationItem = (
  Quotation_idQuotation,
  Item_idItem,
  Rate,
  Qty_Type,
  Qty,
  Amount,
  Discount_Type,
  Discount,
  Total_Amount,
  Branch_idBranch
) => {
  const query =
    "INSERT INTO quotation_has_item (Quotation_idQuotation, Item_idItem, Rate, Qty_Type, Qty, Amount, Discount_Type, Discount, Total_Amount, Branch_idBranch) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  return new Promise((resolve, reject) => {
    db.query(
      query,
      [
        Quotation_idQuotation,
        Item_idItem,
        Rate,
        Qty_Type,
        Qty,
        Amount,
        Discount_Type,
        Discount,
        Total_Amount,
        Branch_idBranch,
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

const fetchQuotations = (Branch_idBranch) => {
  const query =
    "SELECT q.*, c.Title, c.Name FROM quotation q INNER JOIN customer c ON q.Customer_idCustomer = c.idCustomer WHERE q.Branch_idBranch = ? ORDER BY idQuotation DESC";
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

const fetchQuotation = (idQuotation) => {
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

const fetchQuotationItems = (idQuotation) => {
  const query =
    "SELECT qi.*, i.Description as Item_Name FROM quotation_has_item qi INNER JOIN item i ON qi.Item_idItem = i.idItem WHERE qi.Quotation_idQuotation = ?";
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

const deleteQuotation = (idQuotation) => {
  const query = "DELETE FROM quotation WHERE idQuotation = ?";
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

const fetchQuotationByCustomerId = (Customer_idCustomer) => {
  const query =
    "SELECT idQuotation, Quotation_Number, Date FROM quotation WHERE Customer_idCustomer = ? AND status = 0 ORDER BY idQuotation DESC";
  return new Promise((resolve, reject) => {
    db.query(query, [Customer_idCustomer], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

const statusUpdate = (idQuotation) => {
  const query = "UPDATE quotation SET Status = 1 WHERE idQuotation = ?";
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
  insertQuotation,
  getLastQuotation,
  insertQuotationItem,
  fetchQuotations,
  fetchQuotation,
  fetchQuotationItems,
  deleteQuotation,
  fetchQuotationByCustomerId,
  statusUpdate,
};
