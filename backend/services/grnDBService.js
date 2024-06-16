const db = require("../db/db");

const checkSerial = async (serial_numbers) => {
  try {
    // Convert the array of serial numbers into a comma-separated string for the SQL query
    const serialNumbersString = serial_numbers
      .map((serial) => `'${serial}'`)
      .join(",");

    const query =
      "SELECT Serial_No FROM item_has_serial_no WHERE Serial_No IN (?)";
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

const insertGrn = (
  Date,
  Supplier_idSupplier,
  Bill_no,
  Items_Count,
  Total_Amount,
  Bill_Discount,
  Discount_Amount,
  Discount_Type,
  Net_Total,
  Branch_idBranch
) => {
  const query =
    "INSERT INTO grn (Date, Supplier_idSupplier, Bill_no, Items_Count, Total_Amount, Bill_Discount, Discount_Amount, Discount_Type, Net_Total, Paid_Amount, Credit_Balance_Amount, Status, Branch_idBranch) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  return new Promise((resolve, reject) => {
    db.query(
      query,
      [
        Date,
        Supplier_idSupplier,
        Bill_no,
        Items_Count,
        Total_Amount,
        Bill_Discount,
        Discount_Amount,
        Discount_Type,
        Net_Total,
        0,
        Net_Total,
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

const updateGrn = (
  Date,
  Bill_no,
  Items_Count,
  Total_Amount,
  Bill_Discount,
  Discount_Amount,
  Net_Total,
  idGRN
) => {
  const query =
    "UPDATE grn SET Date=?, Bill_no=?, Items_Count=?, Total_Amount=?, Bill_Discount=?, Discount_Amount=?, Net_Total=? WHERE idGRN=?";
  return new Promise((resolve, reject) => {
    db.query(
      query,
      [
        Date,
        Bill_no,
        Items_Count,
        Total_Amount,
        Bill_Discount,
        Discount_Amount,
        Net_Total,
        idGRN,
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

const insertItems = (
  GRN_idGRN,
  Item_idItem,
  Item_Description,
  Cost,
  Qty_Type,
  Qty,
  Total,
  Discount,
  Discount_Type,
  Sub_Total,
  Branch_idBranch
) => {
  const query =
    "INSERT INTO grn_has_item (GRN_idGRN, Item_idItem, Item_Description, Cost, Qty_Type, Qty, Total, Discount, Discount_Type, Sub_Total, Branch_idBranch) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  return new Promise((resolve, reject) => {
    db.query(
      query,
      [
        GRN_idGRN,
        Item_idItem,
        Item_Description,
        Cost,
        Qty_Type,
        Qty,
        Total,
        Discount,
        Discount_Type,
        Sub_Total,
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

const insertSerialNumbers = (
  GRN_idGRN,
  Item_idItem,
  Qty,
  Serial_No,
  Branch_idBranch
) => {
  // Check if Serial_No exists and has at least one element
  if (Serial_No && Serial_No.length > 0) {
    const query =
      "INSERT INTO item_has_serial_no (GRN_idGRN, Item_idItem, Qty, Serial_No, Branch_idBranch) VALUES ?";
    const values = Serial_No.map((serial) => [
      GRN_idGRN,
      Item_idItem,
      Qty,
      serial,
      Branch_idBranch,
    ]); // Map each serial number to an array of values

    return new Promise((resolve, reject) => {
      db.query(query, [values], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  } else {
    // If Serial_No does not exist or is an empty array, resolve with no action
    return Promise.resolve();
  }
};

const fetchGrns = (Branch_idBranch) => {
  const query =
    "SELECT g.*, s.Company_Name FROM grn g INNER JOIN supplier s ON g.Supplier_idSupplier = s.idSupplier WHERE g.Branch_idBranch = ? ORDER BY idGRN DESC";
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

const fetchGrn = (idGRN) => {
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

const fetchItems = (GRN_idGRN) => {
  const query = "SELECT * FROM grn_has_item WHERE GRN_idGRN = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [GRN_idGRN], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

const fetchSerialNoForItem = (Item_idItem, GRN_idGRN) => {
  const query =
    "SELECT Serial_No FROM item_has_serial_no WHERE Item_idItem = ? AND GRN_idGRN = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [Item_idItem, GRN_idGRN], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

const deleteItems = (idGRN) => {
  const query = "DELETE FROM grn_has_item WHERE GRN_idGRN = ?";
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

const deleteSerialNumbers = (idGRN) => {
  const query = "DELETE FROM item_has_serial_no WHERE GRN_idGRN = ?";
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

const processGrn = (Paid_Amount, Credit_Balance_Amount, idGRN) => {
  const query =
    "UPDATE grn SET Paid_Amount=?, Credit_Balance_Amount=?, Status=? WHERE idGRN=?";
  return new Promise((resolve, reject) => {
    db.query(
      query,
      [Paid_Amount, Credit_Balance_Amount, 1, idGRN],
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
  insertGrn,
  insertItems,
  insertSerialNumbers,
  fetchGrns,
  fetchItems,
  fetchSerialNoForItem,
  fetchGrn,
  updateGrn,
  deleteItems,
  deleteSerialNumbers,
  processGrn,
  checkSerial,
};
