const dbService = require("../services/rulesDBService");

const getRules = async (req, res) => {
  try {
    const { Branch_idBranch } = req.params;
    const rules = await dbService.getRules(Branch_idBranch);
    res.json(rules);
  } catch (err) {
    console.error("Error fetching rules:", err);
    res
      .status(500)
      .json({ message: "Error fetching rules", error: err.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    const { idRules } = req.params;
    const {
      Invoice_PrintType,
      Salesman,
      Invoice_No_Start_With,
      Invoice_No_Strat_From,
      Order_No_Start_With,
      Order_No_Strat_From,
    } = req.body;
    await dbService.updateSettings(
      idRules,
      Invoice_PrintType,
      Salesman,
      Invoice_No_Start_With,
      Invoice_No_Strat_From,
      Order_No_Start_With,
      Order_No_Strat_From
    );
    res.json({ message: "Settings updated successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Error updating Settings",
      error: err.message,
    });
  }
};

module.exports = {
  getRules,
  updateSettings,
};
