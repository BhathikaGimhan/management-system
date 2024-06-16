const db = require("../db/db");

const createPurchaseReturn = (
  Date,
  Supplier_idSupplier,
  Total_Amount,
  Items_Count,
  Branch_idBranch,
  Reason
) => {
  const query =
    "INSERT INTO purchase_return (Date, Supplier_idSupplier, Reason, Item_Count, Total_Amount, Status, Branch_idBranch) VALUES (?, ?, ?, ?, ?, ?, ?)";

  return new Promise((resolve, reject) => {
    db.query(
      query,
      [
        Date,
        Supplier_idSupplier,
        Reason,
        Items_Count,
        Total_Amount,
        0,
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

const updatePurchaseReturn = (
  Date,
  Item_Count,
  Total_Amount,
  idPurchase_Return,
  Reason
) => {
  const query =
    "UPDATE purchase_return SET Date=?, Reason=?, Item_Count=?, Total_Amount=? WHERE idPurchase_Return=?";
  return new Promise((resolve, reject) => {
    db.query(
      query,
      [Date, Reason, Item_Count, Total_Amount, idPurchase_Return],
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

const insertItems = (
  idPurchase_Return,
  Item_idItem,
  Item_Description,
  Cost,
  Qty_Type,
  Qty,
  Total,
  Branch_idBranch
) => {
  const query =
    "INSERT INTO purchase_return_has_item (Purchase_Return_idPurchase_Return, Item_idItem, Item_Description, Cost, Qty_Type, Qty, Total, Branch_idBranch) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  return new Promise((resolve, reject) => {
    db.query(
      query,
      [
        idPurchase_Return,
        Item_idItem,
        Item_Description,
        Cost,
        Qty_Type,
        Qty,
        Total,
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

const fetchPurchaseItems = (Branch_idBranch) => {
  const query =
    "SELECT p.*, s.Company_Name FROM purchase_return p INNER JOIN supplier s ON p.Supplier_idSupplier = s.idSupplier WHERE p.Branch_idBranch = ? ORDER BY idPurchase_Return DESC";
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

const fetchItems = (Purchase_Return_idPurchase_Return) => {
  const query =
    "SELECT * FROM purchase_return_has_item WHERE Purchase_Return_idPurchase_Return = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [Purchase_Return_idPurchase_Return], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

const fetchPurchaseReturn = (idPurchase_Return) => {
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

const deleteItems = (idPurchase_Return) => {
  const query =
    "DELETE FROM purchase_return_has_item WHERE Purchase_Return_idPurchase_Return = ?";
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

const processPurchaseReturn = (idPurchase_Return) => {
  const query = "UPDATE purchase_return SET Status=? WHERE idPurchase_Return=?";
  return new Promise((resolve, reject) => {
    db.query(query, [1, idPurchase_Return], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const fetchSerials = (Item_idItem) => {
  const query =
    "SELECT * FROM item_has_serial_no WHERE Qty = 1 AND Item_idItem = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [Item_idItem], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

const checkReturnSerial = async (serial_numbers) => {
  try {
    const query =
      "SELECT Serial_No FROM item_has_serial_no WHERE Serial_No IN (?) AND Qty = 0";
    return new Promise((resolve, reject) => {
      db.query(query, [serial_numbers], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(JSON.stringify(results)));
        }
      });
    });
  } catch (error) {
    throw error;
  }
};

const insertPurchaseSerials = (
  Purchase_Return_idPurchase_Return,
  Item_Serial_No_id
) => {
  try {
    const query =
      "INSERT INTO purchase_return_has_item_serial_no (Purchase_Return_idPurchase_Return, Item_Serial_No_id) VALUES (?,?)";
    return new Promise((resolve, reject) => {
      db.query(
        query,
        [Purchase_Return_idPurchase_Return, Item_Serial_No_id],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  } catch (error) {
    throw error;
  }
};

const getSerials = async (serial_numbers) => {
  try {
    const selectQuery = "SELECT * FROM item_has_serial_no WHERE Serial_No = ?";
    return new Promise((resolve, reject) => {
      db.query(selectQuery, [serial_numbers], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0]);
        }
      });
    });
  } catch (error) {
    throw error;
  }
};

const deletePurchaseRetrunSerials = async (
  Purchase_Return_idPurchase_Return
) => {
  try {
    const selectQuery =
      "DELETE FROM purchase_return_has_item_serial_no WHERE Purchase_Return_idPurchase_Return = ?";
    return new Promise((resolve, reject) => {
      db.query(
        selectQuery,
        [Purchase_Return_idPurchase_Return],
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });
  } catch (error) {
    throw error;
  }
};

const updateSerials = (serial_number) => {
  try {
    const updateQuery =
      "UPDATE item_has_serial_no SET Qty = 1 WHERE Serial_No = ?";
    const selectQuery = "SELECT * FROM item_has_serial_no WHERE Serial_No = ?";

    return new Promise((resolve, reject) => {
      db.query(updateQuery, [serial_number], (err, result) => {
        if (err) {
          reject(err);
        } else {
          // After updating, select the updated row
          db.query(selectQuery, [serial_number], (err, updatedResult) => {
            if (err) {
              reject(err);
            } else {
              if (updatedResult.length > 0) {
                resolve(updatedResult[0]); // Return the first item from the array
              } else {
                resolve(null); // No row found with the provided serial number
              }
            }
          });
        }
      });
    });
  } catch (error) {
    throw error;
  }
};

const insertPurchaseReturnSerials = (
  Purchase_Return_idPurchase_Return,
  Item_Serial_No_id
) => {
  try {
    const query =
      "INSERT INTO purchase_return_has_item_serial_no (Purchase_Return_idPurchase_Return, Item_Serial_No_id) VALUES (?,?)";
    return new Promise((resolve, reject) => {
      db.query(
        query,
        [Purchase_Return_idPurchase_Return, Item_Serial_No_id],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  } catch (error) {
    throw error;
  }
};

const fetchSerialNoForItem = (Purchase_Return_idPurchase_Return) => {
  const query =
    "SELECT cr.*, i.Serial_No FROM purchase_return_has_item_serial_no cr INNER JOIN item_has_serial_no i ON cr.Item_Serial_No_id = i.ID  WHERE Purchase_Return_idPurchase_Return = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [Purchase_Return_idPurchase_Return], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

module.exports = {
  createPurchaseReturn,
  insertItems,
  fetchPurchaseItems,
  fetchItems,
  fetchPurchaseReturn,
  deleteItems,
  updatePurchaseReturn,
  processPurchaseReturn,
  fetchSerials,
  insertPurchaseSerials,
  checkReturnSerial,
  getSerials,
  deletePurchaseRetrunSerials,
  updateSerials,
  insertPurchaseReturnSerials,
  fetchSerialNoForItem,
};
