const dbService = require("../services/productDBService");
const userLogDbService = require("../services/userLogDBService");
const { currentDate } = require("../utils/currentData");

// Function to create a new product
const createProduct = async (req, res) => {
  try {
    const {
      Type,
      Item_Category_idItem_Category,
      Description,
      Long_Description,
      Cost,
      Rate,
      Qty_Type,
      User_idUser,
      Item_Has_Serial,
      Branch_idBranch,
    } = req.body;

    const product = await dbService.insertProduct(
      Type,
      Item_Category_idItem_Category,
      Description,
      Long_Description,
      Cost,
      Rate,
      Qty_Type,
      Item_Has_Serial,
      Branch_idBranch
    );

    const idItem = product.insertId;

    await userLogDbService.insertLog(
      User_idUser,
      currentDate(),
      "Item",
      idItem,
      "create",
      Branch_idBranch
    );

    res.json({
      message: "item added successfully",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating item", error: err.message });
  }
};

// Function to create a new category
const createCategory = async (req, res) => {
  try {
    const { Description, Branch_idBranch, Type } = req.body;
    await dbService.insertCategory(Description, Branch_idBranch, Type);
    res.json({
      message: "Category added successfully",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating item", error: err.message });
  }
};

// Function to get category by branch ID
const getCategory = async (req, res) => {
  try {
    const { Branch_idBranch } = req.params;

    const category = await dbService.fetchCategory(Branch_idBranch);
    res.json(category);
  } catch (err) {
    console.error("Error fetching category:", err);
    res
      .status(500)
      .json({ message: "Error fetching category", error: err.message });
  }
};

// Function to update a category by ID
const updateCategoryById = async (req, res) => {
  try {
    const { idItem_Category } = req.params;
    const { Description, Type, Branch_idBranch } = req.body;
    await dbService.updateCategory(
      idItem_Category,
      Description,
      Type,
      Branch_idBranch
    );

    res.json({ message: "Category updated successfully" });
  } catch (err) {
    console.error("Error updating Category:", err);
    res
      .status(500)
      .json({ message: "Error updating Category", error: err.message });
  }
};

// Function to get items by branch ID
const getItems = async (req, res) => {
  try {
    const { Branch_idBranch } = req.params;
    const items = await dbService.fetchItems(Branch_idBranch);
    if (items.length === 0) {
      return res.status(404).json({ message: "Items not found" });
    }
    res.json(items);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching items",
      error: err.message,
    });
  }
};

// Function to get services by branch ID
const getServices = async (req, res) => {
  try {
    const { Branch_idBranch } = req.params;
    const items = await dbService.fetchServices(Branch_idBranch);
    if (items.length === 0) {
      return res.status(404).json({ message: "Services not found" });
    }
    res.json(items);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching services",
      error: err.message,
    });
  }
};

// Function to get products by branch ID
const getProducts = async (req, res) => {
  try {
    const { Branch_idBranch } = req.params;
    const products = await dbService.fetchProducts(Branch_idBranch);
    if (products.length === 0) {
      return res.status(404).json({ message: "Products not found" });
    }
    res.json(products);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching products",
      error: err.message,
    });
  }
};

// Function to get a product by its ID
const getProductById = async (req, res) => {
  try {
    const { idProduct } = req.params;
    const product = await dbService.fetchProductById(idProduct);
    if (product.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product[0]);
  } catch (err) {
    console.error("Error fetching product by ID:", err);
    res
      .status(500)
      .json({ message: "Error fetching product by ID", error: err.message });
  }
};

// Function to update a product by ID
const updateProduct = async (req, res) => {
  try {
    const { idItem } = req.params;
    const {
      Item_Category_idItem_Category,
      Description,
      Long_Description,
      Cost,
      Rate,
      Qty_Type,
      User_idUser,
      Item_Has_Serial,
      Branch_idBranch,
    } = req.body;
    await dbService.updateProduct(
      Item_Category_idItem_Category,
      Description,
      Long_Description,
      Cost,
      Rate,
      Qty_Type,
      Item_Has_Serial,
      idItem
    );

    await userLogDbService.insertLog(
      User_idUser,
      currentDate(),
      "Item",
      idItem,
      "edit",
      Branch_idBranch
    );
    res.json({ message: "Item updated successfully" });
  } catch (err) {
    console.error("Error updating Item:", err);
    res
      .status(500)
      .json({ message: "Error updating Item", error: err.message });
  }
};

// Function to delete a category by ID
const deleteCategoryById = async (req, res) => {
  try {
    const { idItem_Category } = req.params;

    const checkItemsInCategory = await dbService.getCategoryItems(
      idItem_Category
    );

    if (checkItemsInCategory.length === 0) {
      await dbService.deleteCategory(idItem_Category);

      res.json({ message: "Category deleted successfully" });
    } else {
      res.status(404).json({ message: "Category has Items" });
    }
  } catch (err) {
    console.error("Error deleting Category:", err);
    res
      .status(500)
      .json({ message: "Error deleting Category", error: err.message });
  }
};

const deleteProductById = async (req, res) => {
  try {
    const { idItem } = req.params;
    const checkConflictsWithProduct = await dbService.getProductConflicts(
      idItem
    );
    if (checkConflictsWithProduct.length === 0) {
      await dbService.deleteProduct(idItem);
      res.json({ message: "Product deleted successfully" });
    } else {
      res.status(404).json({ message: "Product has Invoices or GRNs" });
    }
  } catch (err) {
    console.error("Error deleting Product:", err);
    res
      .status(500)
      .json({ message: "Error deleting Product", error: err.message });
  }
};

module.exports = {
  createProduct,
  getItems,
  updateProduct,
  createCategory,
  getCategory,
  updateCategoryById,
  getServices,
  getProducts,
  getProductById,
  deleteCategoryById,
  deleteProductById,
};
