const express = require("express");
const router = express.Router();
const {
  createCategory,
  createWallet,
  getCategory,
  getWallet,
  updateCategory,
  updateWallet,
} = require("../controllers/walletController");

router.post("/", createWallet);
router.get("/:Branch_idBranch", getWallet);
router.put("/:idWallet", updateWallet);

router.post("/category", createCategory);
router.get("/category/:Branch_idBranch", getCategory);
router.put("/category/:idWallet_Category", updateCategory);

module.exports = router;
