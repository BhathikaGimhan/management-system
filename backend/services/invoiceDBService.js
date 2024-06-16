const db = require("../db/db");

const getLastInvoice = (Branch_idBranch) => {
  const query =
    "SELECT * FROM invoice WHERE Branch_idBranch = ? ORDER BY idInvoice DESC LIMIT 1";
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

const insertInvoice = (
  Invoice_Number,
  Quotation_idQuotation,
  Date,
  Customer_idCustomer,
  Employee_idEmployee,
  Total,
  Discount_Type,
  Discount_Presentage,
  Discount_Amount,
  Net_Amount,
  Item_Count,
  Note,
  Payment_Type,
  Payment_Option,
  Paid_Amount,
  Balance_Amount,
  Credit_Balance,
  Total_Credit_Balance,
  Invoice_Type,
  Status,
  Branch_idBranch
) => {
  const query = `INSERT INTO invoice 
  (Invoice_Number, Quotation_idQuotation, Date, Customer_idCustomer, Employee_idEmployee, Total, Discount_Type, Discount_Presentage, Discount_Amount, Net_Amount, Item_Count, Note, Payment_Type, Payment_Option, Paid_Amount, Balance_Amount, Credit_Balance, Total_Credit_Balance, Invoice_Type, Status, Branch_idBranch) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  return new Promise((resolve, reject) => {
    db.query(
      query,
      [
        Invoice_Number,
        Quotation_idQuotation,
        Date,
        Customer_idCustomer,
        Employee_idEmployee,
        Total,
        Discount_Type,
        Discount_Presentage,
        Discount_Amount,
        Net_Amount,
        Item_Count,
        Note,
        Payment_Type,
        Payment_Option,
        Paid_Amount,
        Balance_Amount,
        Credit_Balance,
        Total_Credit_Balance,
        Invoice_Type,
        Status,
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

const insertInvoiceItem = (
  Invoice_idInvoice,
  Item_idItem,
  Item_Has_Serial,
  Serial_No_Id,
  Description,
  Long_Description,
  Qty_Type,
  Qty,
  Rate,
  Amount,
  Discount_Type,
  Discount,
  Total_Amount,
  Branch_idBranch
) => {
  const query =
    "INSERT INTO invoice_has_item (Invoice_idInvoice, Item_idItem, Item_Has_Serial, Serial_No_Id, Description, Long_Description, Qty_Type, Qty, Rate, Amount,Discount_Type, Discount, Total_Amount, Branch_idBranch) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  return new Promise((resolve, reject) => {
    db.query(
      query,
      [
        Invoice_idInvoice,
        Item_idItem,
        Item_Has_Serial,
        Serial_No_Id,
        Description,
        Long_Description,
        Qty_Type,
        Qty,
        Rate,
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

const insertInvoiceSerials = (Invoice_idInvoice, Item_Serial_No_id) => {
  try {
    const query =
      "INSERT INTO invoice_has_item_serial_no (Invoice_idInvoice, Item_Serial_No_id) VALUES (?,?)";
    return new Promise((resolve, reject) => {
      db.query(query, [Invoice_idInvoice, Item_Serial_No_id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
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
      "UPDATE item_has_serial_no SET Qty = 0 WHERE Serial_No = ?";
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

const fetchInvoices = (Branch_idBranch) => {
  const query = `SELECT i.*, c.Title, c.Name , em.Employee_Name
    FROM invoice i 
    INNER JOIN customer c ON i.Customer_idCustomer = c.idCustomer 
    LEFT JOIN employee em ON i.Employee_idEmployee = em.idEmployee
    WHERE i.Branch_idBranch = ? ORDER BY idInvoice DESC`;

  return new Promise((resolve, reject) => {
    db.query(query, [Branch_idBranch], (err, results) => {
      if (err) {
        reject(err);
      } else {
        const invoices = JSON.parse(JSON.stringify(results));
        const modifiedInvoices = invoices.map((invoice) => {
          const Payment_Type_Name =
            invoice.Payment_Type === 2 ? "installments" : "full";
          return { ...invoice, Payment_Type_Name };
        });
        resolve(modifiedInvoices);
      }
    });
  });
};

const fetchServiceDateInvoices = (Invoice_idInvoice, Item_idItem) => {
  const query =
    "SELECT Date FROM item_has_service_dates WHERE Invoice_idInvoice = ? AND Item_idItem = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [Invoice_idInvoice, Item_idItem], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

const fetchInvoice = (idInvoice) => {
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

const fetchInvoiceItems = (idInvoice) => {
  const query =
    "SELECT ihi.*, i.Description as Item_Name, si.Serial_No as Serial_Number FROM invoice_has_item ihi INNER JOIN item i ON ihi.Item_idItem = i.idItem LEFT JOIN item_has_serial_no si ON ihi.Serial_No_Id = si.ID  WHERE ihi.Invoice_idInvoice = ?";
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

const insertSerialNumbers = (
  GRN_idGRN,
  Item_idItem,
  Qty,
  Serial_No,
  Branch_idBranch
) => {
  const query =
    "INSERT INTO item_has_serial_no (GRN_idGRN, Item_idItem, Qty, Serial_No, Branch_idBranch) VALUES (? , ? , ? , ? ,?)";
  return new Promise((resolve, reject) => {
    db.query(
      query,
      [GRN_idGRN, Item_idItem, Qty, Serial_No, Branch_idBranch],
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

const updateStatus = (idInvoice) => {
  const query =
    "UPDATE invoice SET Status = CASE WHEN Status = 1 THEN 0 ELSE 1 END WHERE idInvoice = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [idInvoice], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = {
  insertInvoice,
  getLastInvoice,
  insertInvoiceItem,
  fetchInvoices,
  fetchInvoice,
  fetchInvoiceItems,
  fetchSerials,
  updateSerials,
  insertInvoiceSerials,
  insertSerialNumbers,
  fetchServiceDateInvoices,
  updateStatus,
};
