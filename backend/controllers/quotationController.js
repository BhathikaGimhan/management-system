const dbService = require("../services/quotaionDBService");
const rulesDbService = require("../services/rulesDBService");
const userLogDbService = require("../services/userLogDBService");
const { currentDate } = require("../utils/currentData");

const createQuotation = async (req, res) => {
  try {
    const {
      Customer_idCustomer,
      Date,
      Expire_Date,
      SubTotal,
      Discount_Type,
      Discount,
      Total,
      Note,
      User_idUser,
      Branch_idBranch,
      items,
    } = req.body;

    const rules = await rulesDbService.getQuotationNumberDetails(
      Branch_idBranch
    );

    const letter_part = rules[0].Order_No_Start_With;
    const starting_number = rules[0].Order_No_Strat_From;

    let next_quotation_number = `${letter_part}${starting_number}`;

    const last_quotation = await dbService.getLastQuotation(Branch_idBranch);

    if (last_quotation.length !== 0) {
      const last_quotation_number = last_quotation[0].Quotation_Number;

      const match = last_quotation_number.match(/\d/);
      if (match) {
        const digitPosition = match.index;
        const nonNumericPart = last_quotation_number.slice(0, digitPosition);
        const numericPart = parseInt(
          last_quotation_number.slice(digitPosition)
        );

        const nextNumericPart = numericPart + 1;

        next_quotation_number = `${nonNumericPart}${nextNumericPart}`;
      }
    }

    const quotation = await dbService.insertQuotation(
      next_quotation_number,
      Customer_idCustomer,
      Date,
      Expire_Date,
      SubTotal,
      Discount_Type,
      Discount,
      Total,
      Note,
      Branch_idBranch,
      items
    );

    const Quotation_idQuotation = quotation.insertId;

    await Promise.all(
      items.map(async (item) => {
        await dbService.insertQuotationItem(
          Quotation_idQuotation,
          item.Item_idItem,
          item.Rate,
          item.Qty_Type,
          item.Qty,
          item.Amount,
          item.Discount_Type,
          item.Discount,
          item.Total_Amount,
          Branch_idBranch
        );
      })
    );

    await userLogDbService.insertLog(
      User_idUser,
      currentDate(),
      "Quotation",
      Quotation_idQuotation,
      "create",
      Branch_idBranch
    );

    res.json({
      message: "Quotation added successfully",
      quotation_id: Quotation_idQuotation,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating quotation", error: err.message });
  }
};

const getNextQuotationId = async (req, res) => {
  try {
    const { Branch_idBranch } = req.params;

    const rules = await rulesDbService.getQuotationNumberDetails(
      Branch_idBranch
    );

    const letter_part = rules[0].Order_No_Start_With;
    const starting_number = rules[0].Order_No_Strat_From;

    let next_quotation_number = `${letter_part}${starting_number}`;

    const last_quotation = await dbService.getLastQuotation(Branch_idBranch);

    if (last_quotation.length !== 0) {
      const last_quotation_number = last_quotation[0].Quotation_Number;

      const match = last_quotation_number.match(/\d/);
      if (match) {
        const digitPosition = match.index;
        const nonNumericPart = last_quotation_number.slice(0, digitPosition);
        const numericPart = parseInt(
          last_quotation_number.slice(digitPosition)
        );

        const nextNumericPart = numericPart + 1;

        next_quotation_number = `${nonNumericPart}${nextNumericPart}`;
      }
    }

    res.json(next_quotation_number);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error getting quotation number", error: err.message });
  }
};

const getAllQuotations = async (req, res) => {
  try {
    const { Branch_idBranch } = req.params;

    const quotations = await dbService.fetchQuotations(Branch_idBranch);
    if (quotations.length === 0) {
      return res.status(404).json({ message: "Quotations not found" });
    }
    res.json(quotations);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching quotations",
      error: err.message,
    });
  }
};

const getQuotationById = async (req, res) => {
  try {
    const { idQuotation } = req.params;

    const quotation = await dbService.fetchQuotation(idQuotation);
    if (quotation.length === 0) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    const items = await dbService.fetchQuotationItems(idQuotation);
    if (items.length === 0) {
      return res.status(404).json({ message: "Quotation items not found" });
    }

    res.json({
      quotation: quotation[0],
      items: items,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching quotations",
      error: err.message,
    });
  }
};

const quotationDelete = async (req, res) => {
  try {
    const { idQuotation } = req.params;

    await dbService.deleteQuotation(idQuotation);

    res.json({
      message: "Quotation deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Error deleting quotations",
      error: err.message,
    });
  }
};

const getQuotationByCustomerId = async (req, res) => {
  try {
    const { Customer_idCustomer } = req.params;

    const quotations = await dbService.fetchQuotationByCustomerId(
      Customer_idCustomer
    );
    if (quotations.length === 0) {
      return res.status(404).json({ message: "Quotations not found" });
    }
    res.json(quotations);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching quotations",
      error: err.message,
    });
  }
};

module.exports = {
  createQuotation,
  getNextQuotationId,
  getAllQuotations,
  getQuotationById,
  quotationDelete,
  getQuotationByCustomerId,
};
