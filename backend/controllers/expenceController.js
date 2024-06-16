const dbService = require("../services/expencesDBService");

const createExpenses = async (req, res) => {
  try {
    const { branch_id, date, reason, amount } = req.body;
    await dbService.insertExpenses(branch_id, date, reason, amount);

    res.json({
      message: "Expense added successfully",
    });
  } catch (err) {
    console.error("Error creating expense:", err);
    res
      .status(500)
      .json({ message: "Error creating expense", error: err.message });
  }
};

const getExpenses = async (req, res) => {
  try {
    const { branch_id } = req.params;

    const expenses = await dbService.fetchExpenses(branch_id);

    res.json(expenses);
  } catch (err) {
    console.error("Error fetching expenses:", err);
    res
      .status(500)
      .json({ message: "Error fetching expenses", error: err.message });
  }
};

const getExpensesByDate = async (req, res) => {
  const { date } = req.params;
  try {
    const expenses = await dbService.fetchExpensesbyDate(date);
    res.json(expenses);
  } catch (err) {
    console.error("Error fetching expenses:", err);
    res
      .status(500)
      .json({ message: "Error fetching expenses", error: err.message });
  }
};

const deleteExpenses = async (req, res) => {
  try {
    const { ex_id } = req.params;
    await dbService.deleteExpenses(ex_id);
    res.json({ message: "expences deleted successfully" });
  } catch (err) {
    console.error("Error deleting expences:", err);
    res
      .status(500)
      .json({ message: "Error deleting expences", error: err.message });
  }
};

module.exports = {
  createExpenses,
  getExpenses,
  deleteExpenses,
  getExpensesByDate,
};
