const dbService = require("../services/walletDBService");

const createWallet = async (req, res) => {
  try {
    const {
      Date,
      Type,
      Wallet_Category_idWallet_Category,
      Amount,
      Note,
      Branch_idBranch,
    } = req.body;
    await dbService.insertWallet(
      Date,
      Type,
      Wallet_Category_idWallet_Category,
      Amount,
      Note,
      Branch_idBranch
    );
    res.json({
      message: "Wallet added successfully",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating wallet", error: err.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { Type, Description, Branch_idBranch } = req.body;
    await dbService.insertCategory(Type, Description, Branch_idBranch);
    res.json({
      message: "Category added successfully",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating wallet", error: err.message });
  }
};

// Function to get category by branch ID
const getCategory = async (req, res) => {
  try {
    const { Branch_idBranch } = req.params;

    const category = await dbService.fetchCategory(Branch_idBranch);
    res.json(category);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching category", error: err.message });
  }
};

// Function to update a category by ID
const updateCategory = async (req, res) => {
  try {
    const { idWallet_Category } = req.params;
    const { Type, Description } = req.body;
    await dbService.updateCategory(Type, Description, idWallet_Category);
    res.json({ message: "Category updated successfully" });
  } catch (err) {
    console.error("Error updating Category:", err);
    res
      .status(500)
      .json({ message: "Error updating Category", error: err.message });
  }
};

const getWallet = async (req, res) => {
  try {
    const { Branch_idBranch } = req.params;
    const wallet = await dbService.fetchWallet(Branch_idBranch);
    if (wallet.length === 0) {
      return res.status(404).json({ message: "Wallet is empty" });
    }
    res.json(wallet);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching wallet",
      error: err.message,
    });
  }
};

const updateWallet = async (req, res) => {
  try {
    const { idWallet } = req.params;
    const { Date, Type, Wallet_Category_idWallet_Category, Amount, Note } =
      req.body;
    await dbService.updateWallet(
      Date,
      Type,
      Wallet_Category_idWallet_Category,
      Amount,
      Note,
      idWallet
    );
    res.json({ message: "Wallet updated successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating wallet", error: err.message });
  }
};

module.exports = {
  createWallet,
  createCategory,
  getCategory,
  updateCategory,
  getWallet,
  updateWallet,
};
