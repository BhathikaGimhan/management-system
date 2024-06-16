const db = require("../db/db");

// Function to insert a new product into the 'item' table
const insertProduct = (
  Type,
  Item_Category_idItem_Category,
  Description,
  Long_Description,
  Cost,
  Rate,
  Qty_Type,
  Item_Has_Serial,
  Branch_idBranch
) => {
  const query =
    "INSERT INTO item (Type, Item_Category_idItem_Category, Description, Long_Description, Cost, Real_Cost, Rate, Qty_Type, Qty, Status, Item_Has_Serial, Branch_idBranch) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  return new Promise((resolve, reject) => {
    db.query(
      query,
      [
        Type,
        Item_Category_idItem_Category,
        Description,
        Long_Description,
        Cost,
        Cost,
        Rate,
        Qty_Type,
        0,
        1,
        Item_Has_Serial,
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

// Function to insert a new category into the 'item_category' table

const insertCategory = (Description, Branch_idBranch, Type) => {
  const query =
    "INSERT INTO item_category (Description, Branch_idBranch,Type) VALUES (?, ?, ?)";

  return new Promise((resolve, reject) => {
    db.query(query, [Description, Branch_idBranch, Type], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

// Function to fetch all categories for a specific branch from the 'item_category' table
const fetchCategory = (Branch_idBranch) => {
  const query =
    "SELECT * FROM item_category WHERE Branch_idBranch = ? ORDER BY idItem_Category DESC";
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

// Function to fetch all items for a specific category from the 'item' table
const getCategoryItems = (idItem_Category) => {
  const query = "SELECT * FROM item WHERE Item_Category_idItem_Category = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [idItem_Category], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

// Function to update details of a specific category in the database based on its ID
const updateCategory = (
  idItem_Category,
  Description,
  Type,
  Branch_idBranch
) => {
  const query = `UPDATE item_category SET Description=?, Type=?, Branch_idBranch=? WHERE idItem_Category=?`;

  return db.query(query, [Description, Type, Branch_idBranch, idItem_Category]);
};

// Function to delete a category from the 'item_category' table
const deleteCategory = (idItem_Category) => {
  const query = `DELETE FROM item_category WHERE idItem_Category=?`;
  return db.query(query, [idItem_Category]);
};

// Function to fetch all items for a specific branch and type from the 'item' table
const fetchItems = (Branch_idBranch) => {
  const query =
    "SELECT i.*, ic.Description AS Item_Category, qt.Description AS Quantity_Type FROM item i INNER JOIN quantity_type qt ON i.Qty_Type = qt.idQuantity_Type INNER JOIN item_category ic ON ic.idItem_Category = i.Item_Category_idItem_Category WHERE i.Branch_idBranch = ? AND i.Type = ? ORDER BY i.idItem DESC";
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

// Function to fetch all services for a specific branch from the 'item' table
const fetchServices = (Branch_idBranch) => {
  const query =
    "SELECT i.*, ic.Description AS Item_Category FROM item i INNER JOIN item_category ic ON ic.idItem_Category = i.Item_Category_idItem_Category WHERE i.Branch_idBranch = ? AND i.Type = ? ORDER BY i.idItem DESC";
  return new Promise((resolve, reject) => {
    db.query(query, [Branch_idBranch, 2], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

// Function to fetch all products for a specific branch from the 'item' table
const fetchProducts = (Branch_idBranch) => {
  const query =
    "SELECT i.*, ic.Description AS Item_Category FROM item i INNER JOIN item_category ic ON ic.idItem_Category = i.Item_Category_idItem_Category WHERE i.Branch_idBranch = ? ORDER BY i.idItem DESC";
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

// Function to update details of a specific product in the 'item' table
const updateProduct = (
  Item_Category_idItem_Category,
  Description,
  Long_Description,
  Cost,
  Rate,
  Qty_Type,
  Item_Has_Serial,
  idItem
) => {
  const query =
    "UPDATE item SET Item_Category_idItem_Category=?, Description=?, Long_Description=?, Cost=?, Rate=?, Qty_Type=?, Item_Has_Serial=? WHERE idItem=?";
  return new Promise((resolve, reject) => {
    return db.query(
      query,
      [
        Item_Category_idItem_Category,
        Description,
        Long_Description,
        Cost,
        Rate,
        Qty_Type,
        Item_Has_Serial,
        idItem,
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

// Function to fetch details of a specific item from the 'item' table
const fetchItem = (idItem) => {
  const query = "SELECt * FROM item WHERE idItem=?";
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

// Function to update the cost, real cost, and quantity of a specific item in the 'item' table
const itemProcess = (Cost, Real_Cost, Qty, idItem) => {
  const query = "UPDATE item SET Cost=?, Real_Cost=?, Qty=? WHERE idItem=?";
  return new Promise((resolve, reject) => {
    db.query(query, [Cost, Real_Cost, Qty, idItem], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

// Function to fetch a product by its ID from the 'item' table
const fetchProductById = (idProduct) => {
  const query = "SELECT * FROM item WHERE idItem = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [idProduct], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

const getProductConflicts = (idItem) => {
  const query = `
    SELECT ID FROM invoice_has_item WHERE Item_idItem = ? UNION SELECT ID FROM grn_has_item WHERE Item_idItem = ?`;
  return new Promise((resolve, reject) => {
    db.query(query, [idItem, idItem], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

const deleteProduct = (idProduct) => {
  const query = "DELETE FROM item WHERE idItem=?";
  return db.query(query, [idProduct]);
};

module.exports = {
  insertProduct,
  fetchItems,
  updateProduct,
  insertCategory,
  fetchCategory,
  updateCategory,
  fetchServices,
  fetchItem,
  itemProcess,
  fetchProducts,
  getCategoryItems,
  deleteCategory,
  fetchProductById,
  getProductConflicts,
  deleteProduct,
};
