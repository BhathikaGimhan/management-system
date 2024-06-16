const db = require("../db/db");

const fetchInvoices = (from, to, Branch_idBranch) => {
  const query =
    "SELECT i.*, c.Title, c.Name FROM invoice i INNER JOIN customer c ON i.Customer_idCustomer = c.idCustomer WHERE Date BETWEEN (?) AND (?) AND i.Branch_idBranch = ? ORDER BY idInvoice DESC";
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

const fetchInvoiceItems = (idInvoice) => {
  const query =
    "SELECT ihi.*, i.Description as Item_Name FROM invoice_has_item ihi INNER JOIN item i ON ihi.Item_idItem = i.idItem WHERE ihi.Invoice_idInvoice = ?";
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

const fetchExpenses = (from, to, Branch_idBranch) => {
  const query =
    "SELECT w.*, wc.Description FROM wallet w INNER JOIN wallet_category wc ON w.Wallet_Category_idWallet_Category = wc.idWallet_Category WHERE w.Date BETWEEN ? AND ? AND w.Type = ? AND w.Branch_idBranch = ? ORDER BY w.idWallet DESC";
  return new Promise((resolve, reject) => {
    db.query(query, [from, to, 1, Branch_idBranch], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

const fetchDamages = (from, to, Branch_idBranch) => {
  const query =
    "SELECT * FROM damage_note WHERE Date BETWEEN ? AND ? AND Branch_idBranch = ? ORDER BY idDamage_Note DESC";
  return new Promise((resolve, reject) => {
    db.query(query, [from, to, 1, Branch_idBranch], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

const fetchDamageItems = (Damage_Note_idDamage_Note) => {
  const query =
    "SELECT * FROM damage_note_has_item WHERE Damage_Note_idDamage_Note = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [Damage_Note_idDamage_Note], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

const fetchInvoiceTotal = (from, to, Branch_idBranch) => {
  const query =
    "SELECT SUM(ii.Total_Amount) AS Total FROM invoice i INNER JOIN invoice_has_item ii ON i.idInvoice = ii.Invoice_idInvoice WHERE i.Date BETWEEN (?) AND (?) AND i.Branch_idBranch = (?)";
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

const fetchExpensesTotal = (from, to, Branch_idBranch) => {
  const query =
    "SELECT SUM(Amount) AS Total FROM wallet WHERE Date BETWEEN (?) AND (?) AND Type = (?) AND Branch_idBranch = (?)";
  return new Promise((resolve, reject) => {
    db.query(query, [from, to, 1, Branch_idBranch], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

const fetchDamageTotal = (from, to, Branch_idBranch) => {
  const query =
    "SELECT SUM(Total_Amount) AS Total FROM damage_note WHERE Date BETWEEN (?) AND (?) AND Branch_idBranch = (?)";
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

const fetchInvoiceCost = (from, to, Branch_idBranch) => {
  const query =
    "SELECT SUM(sc.Cost) FROM invoice i INNER JOIN invoice_has_item ii ON i.idInvoice = ii.Invoice_idInvoice INNER JOIN stock_card sc ON ii.Description = sc.Description WHERE i.Date BETWEEN (?) AND (?) AND i.Branch_idBranch = (?)";
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

module.exports = {
  fetchInvoices,
  fetchInvoiceItems,
  fetchExpenses,
  fetchDamages,
  fetchDamageItems,
  fetchInvoiceTotal,
  fetchInvoiceCost,
  fetchExpensesTotal,
  fetchDamageTotal,
};
