const express = require("express");
const router = express.Router();
const {
  createCategory,
  createProduct,
  getCategory,
  getItems,
  getServices,
  updateCategoryById,
  updateProduct,
  getProducts,
  getProductById,
  deleteCategoryById,
  deleteProductById,
} = require("../controllers/productController");

router.post("/", createProduct);
router.get("/items/:Branch_idBranch", getItems);
router.get("/services/:Branch_idBranch", getServices);
router.get("/single/:idProduct", getProductById);
router.get("/:Branch_idBranch", getProducts);
router.get("/single/:idProduct", getProductById);
router.put("/:idItem", updateProduct);
router.delete("/:idItem", deleteProductById);

router.post("/category", createCategory);
router.delete("/category/:idItem_Category", deleteCategoryById);
router.get("/category/:Branch_idBranch", getCategory);
router.put("/category/:idItem_Category", updateCategoryById);
module.exports = router;
