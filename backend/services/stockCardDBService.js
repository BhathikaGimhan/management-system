const db = require("../db/db");

const insertStockCard = (
  Description,
  Transaction_Type,
  Transaction_ID,
  Cost,
  Real_Cost,
  Sell_Price,
  IN_Stock,
  Out_Stock,
  SIH,
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
    "INSERT INTO stock_card (Date, Description, Transaction_Type, Transaction_ID, Cost, Real_Cost, Sell_Price, IN_Stock, Out_Stock, SIH, Branch_idBranch) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  return new Promise((resolve, reject) => {
    db.query(
      query,
      [
        Date_Time,
        Description,
        Transaction_Type,
        Transaction_ID,
        Cost,
        Real_Cost,
        Sell_Price,
        IN_Stock,
        Out_Stock,
        SIH,
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

const fetchItemsSIN = (from, to, Branch_idBranch, category) => {
  let query;
  if (category === "all") {
    query =
      "SELECT i.Real_Cost, i.Cost, i.Rate, i.Item_Category_idItem_Category, i.Qty AS Stock_In_Hand, ic.Description AS Item_Category, sc.Description, qt.Description AS Quantity_Type, SUM(sc.IN_Stock) AS Total_In_Stock, SUM(sc.Out_Stock) AS Total_Out_Stock FROM stock_card sc INNER JOIN item i ON sc.Description = i.Description INNER JOIN quantity_type qt ON qt.idQuantity_Type = i.Qty_Type INNER JOIN item_category ic ON ic.idItem_Category = i.Item_Category_idItem_Category WHERE Date BETWEEN (?) AND (?) AND sc.Branch_idBranch = (?) GROUP BY Description";
    return new Promise((resolve, reject) => {
      db.query(query, [from, to, Branch_idBranch], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  } else {
    query =
      "SELECT i.Real_Cost, i.Cost, i.Rate, i.Item_Category_idItem_Category, i.Qty AS Stock_In_Hand, ic.Description AS Item_Category, sc.Description, qt.Description AS Quantity_Type, SUM(sc.IN_Stock) AS Total_In_Stock, SUM(sc.Out_Stock) AS Total_Out_Stock FROM stock_card sc INNER JOIN item i ON sc.Description = i.Description INNER JOIN quantity_type qt ON qt.idQuantity_Type = i.Qty_Type INNER JOIN item_category ic ON ic.idItem_Category = i.Item_Category_idItem_Category WHERE Date BETWEEN (?) AND (?) AND sc.Branch_idBranch = (?) AND i.Item_Category_idItem_Category = (?) GROUP BY Description";
    return new Promise((resolve, reject) => {
      db.query(query, [from, to, Branch_idBranch, category], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }
};

const fetchStockCard = (from, to, idItem) => {
  query =
    "SELECT s.* FROM stock_card s INNER JOIN item i ON s.Description = i.Description WHERE s.Date BETWEEN (?) AND (?) AND i.idItem = (?) ORDER BY idStock_Card DESC";
  return new Promise((resolve, reject) => {
    db.query(query, [from, to, idItem], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const fetchItemCurrentStock = (Item_Description) => {
  const query =
    "SELECT * FROM stock_card WHERE Description = ? ORDER BY idStock_Card DESC LIMIT 1";
  return new Promise((resolve, reject) => {
    db.query(query, [Item_Description], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = {
  insertStockCard,
  fetchItemsSIN,
  fetchStockCard,
  fetchItemCurrentStock,
};
