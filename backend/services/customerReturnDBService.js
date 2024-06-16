const db = require("../db/db");

const createCustomerReturn = (
  Date,
  Customer_idCustomer,
  Total_Amount,
  Items_Count,
  Branch_idBranch,
  Reason
) => {
  const query =
    "INSERT INTO customer_return (Date, Customer_idCustomer, Reason, Item_Count, Total_Amount, Status, Branch_idBranch) VALUES (?, ?, ?, ?, ?, ?, ?)";

  return new Promise((resolve, reject) => {
    db.query(
      query,
      [
        Date,
        Customer_idCustomer,
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

const updateCustomerReturn = (
  Date,
  Item_Count,
  Total_Amount,
  idCustomer_Return,
  Reason
) => {
  const query =
    "UPDATE customer_return SET Date=?, Reason=?, Item_Count=?, Total_Amount=? WHERE idCustomer_Return=?";
  return new Promise((resolve, reject) => {
    db.query(
      query,
      [Date, Reason, Item_Count, Total_Amount, idCustomer_Return],
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
  idCustomer_Return,
  Item_idItem,
  Item_Description,
  Cost,
  Qty_Type,
  Qty,
  Total,
  Branch_idBranch
) => {
  const query =
    "INSERT INTO customer_return_has_item (Customer_Return_idCustomer_Return, Item_idItem, Item_Description, Cost, Qty_Type, Qty, Total, Branch_idBranch) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  return new Promise((resolve, reject) => {
    db.query(
      query,
      [
        idCustomer_Return,
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

const fetchCustomerItems = (Branch_idBranch) => {
  const query =
    "SELECT p.*, s.Name FROM customer_return p INNER JOIN customer s ON p.Customer_idCustomer = s.idCustomer WHERE p.Branch_idBranch = ? ORDER BY idCustomer_Return DESC";
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

const fetchItems = (Customer_Return_idCustomer_Return) => {
  const query =
    "SELECT * FROM customer_return_has_item WHERE Customer_Return_idCustomer_Return = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [Customer_Return_idCustomer_Return], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

const fetchCustomerReturn = (idCustomer_Return) => {
  const query =
    "SELECT p.*, s.Name, s.Tp FROM customer_return p INNER JOIN customer s ON p.Customer_idCustomer = s.idCustomer WHERE p.idCustomer_Return = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [idCustomer_Return], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

const deleteItems = (idCustomer_Return) => {
  const query =
    "DELETE FROM customer_return_has_item WHERE Customer_Return_idCustomer_Return = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [idCustomer_Return], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

const processCustomerReturn = (idCustomer_Return) => {
  const query = "UPDATE customer_return SET Status=? WHERE idCustomer_Return=?";
  return new Promise((resolve, reject) => {
    db.query(query, [1, idCustomer_Return], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
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
const deleteCustomerRetrunSerials = async (idCustomer_Return) => {
  try {
    const selectQuery =
      "DELETE FROM customer_return_has_item_serial_no WHERE Customer_Return_idCustomer_Return = ?";
    return new Promise((resolve, reject) => {
      db.query(selectQuery, [idCustomer_Return], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
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

const insertCustomerReturnSerials = (
  Customer_Return_idCustomer_Return,
  Item_Serial_No_id
) => {
  try {
    const query =
      "INSERT INTO customer_return_has_item_serial_no (Customer_Return_idCustomer_Return, Item_Serial_No_id) VALUES (?,?)";
    return new Promise((resolve, reject) => {
      db.query(
        query,
        [Customer_Return_idCustomer_Return, Item_Serial_No_id],
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

const fetchSerialNoForItem = (Customer_Return_idCustomer_Return) => {
  const query =
    "SELECT cr.*, i.Serial_No FROM customer_return_has_item_serial_no cr INNER JOIN item_has_serial_no i ON cr.Item_Serial_No_id = i.ID  WHERE Customer_Return_idCustomer_Return = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [Customer_Return_idCustomer_Return], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

module.exports = {
  createCustomerReturn,
  insertItems,
  fetchCustomerItems,
  fetchItems,
  fetchCustomerReturn,
  deleteItems,
  updateCustomerReturn,
  processCustomerReturn,
  checkReturnSerial,
  updateSerials,
  insertCustomerReturnSerials,
  fetchSerialNoForItem,
  getSerials,
  deleteCustomerRetrunSerials,
};
