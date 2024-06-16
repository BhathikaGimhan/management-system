const db = require("../db/db");

const insertWallet = (
  Date,
  Type,
  Wallet_Category_idWallet_Category,
  Amount,
  Note,
  Branch_idBranch
) => {
  const query =
    "INSERT INTO wallet (Date, Type, Wallet_Category_idWallet_Category, Amount, Note, Branch_idBranch) VALUES (?, ?, ?, ?, ?, ?)";
  return new Promise((resolve, reject) => {
    db.query(
      query,
      [
        Date,
        Type,
        Wallet_Category_idWallet_Category,
        Amount,
        Note,
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

const insertCategory = (Type, Description, Branch_idBranch) => {
  const query =
    "INSERT INTO wallet_category (Type, Description, Branch_idBranch) VALUES (?, ?, ?)";

  return new Promise((resolve, reject) => {
    db.query(query, [Type, Description, Branch_idBranch], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const fetchCategory = (Branch_idBranch) => {
  const query = "SELECT * FROM wallet_category WHERE Branch_idBranch = ?";
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

const updateCategory = (Type, Description, idWallet_Category) => {
  const query = `UPDATE wallet_category SET Type=?, Description=? WHERE idWallet_Category=?`;

  return new Promise((resolve, reject) => {
    db.query(query, [Type, Description, idWallet_Category], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

const fetchWallet = (Branch_idBranch) => {
  const query =
    "SELECT w.*, wc.Description AS Wallet_Category FROM wallet w INNER JOIN wallet_category wc ON w.Wallet_Category_idWallet_Category = wc.idWallet_Category WHERE w.Branch_idBranch = ? ORDER BY w.idWallet DESC";
  return new Promise((resolve, reject) => {
    db.query(query, [Branch_idBranch, 1], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

const updateWallet = (
  Date,
  Type,
  Wallet_Category_idWallet_Category,
  Amount,
  Note,
  idWallet
) => {
  const query =
    "UPDATE wallet SET Date=?, Type=?, Wallet_Category_idWallet_Category=?, Amount=?, Note=? WHERE idWallet=?";

  return new Promise((resolve, reject) => {
    return db.query(
      query,
      [Date, Type, Wallet_Category_idWallet_Category, Amount, Note, idWallet],
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

module.exports = {
  fetchCategory,
  fetchWallet,
  insertCategory,
  insertWallet,
  updateWallet,
  updateCategory,
};
