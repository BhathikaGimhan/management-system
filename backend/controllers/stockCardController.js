const dbService = require("../services/stockCardDBService");

const getStockCardReport = async (req, res) => {
  try {
    const { from, to, Branch_idBranch, category } = req.params;
    const items = await dbService.fetchItemsSIN(
      `${from} 00:00:00`,
      `${to} 23:59:59`,
      Branch_idBranch,
      category
    );

    res.json(items);
  } catch (err) {
    console.error("Error creating expense:", err);
    res
      .status(500)
      .json({ message: "Error creating expense", error: err.message });
  }
};

const getStockCard = async (req, res) => {
  try {
    const { from, to, idItem } = req.params;

    const stockCard = await dbService.fetchStockCard(
      `${from} 00:00:00`,
      `${to} 23:59:59`,
      idItem
    );
    res.json(stockCard);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching stock card", error: err.message });
  }
};

module.exports = {
  getStockCardReport,
  getStockCard,
};
