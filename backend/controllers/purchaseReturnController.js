const dbService = require("../services/purchaseReturnDBService");
const itemDbService = require("../services/productDBService");
const supplierLogDbService = require("../services/supplierCreditLogDBService");
const stockCardDbService = require("../services/stockCardDBService");
const userLogDbService = require("../services/userLogDBService");
const { currentDate } = require("../utils/currentData");

const createPurchaseReturn = async (req, res) => {
  try {
    const {
      Date,
      Supplier_idSupplier,
      Total_Amount,
      Branch_idBranch,
      items,
      Reason,
      User_idUser,
    } = req.body;

    const purchaseReturn = await dbService.createPurchaseReturn(
      Date,
      Supplier_idSupplier,
      Total_Amount,
      items.length,
      Branch_idBranch,
      Reason
    );

    const idPurchase_Return = purchaseReturn.insertId;

    await Promise.all(
      items.map(async (item) => {
        await dbService.insertItems(
          idPurchase_Return,
          item.Item_idItem,
          item.Item_Description,
          item.Cost,
          item.Qty_Type,
          item.Qty,
          item.Total,
          Branch_idBranch
        );

        if (item.Item_Has_Serial === 1) {
          item.Serial_No.map(async (serial_number) => {
            serial_no_id = await dbService.getSerials(serial_number);
            await dbService.insertPurchaseReturnSerials(
              idPurchase_Return,
              serial_no_id.ID
            );
          });
        }
      })
    );

    await userLogDbService.insertLog(
      User_idUser,
      currentDate(),
      "Purchase Return",
      idPurchase_Return,
      "create",
      Branch_idBranch
    );

    res.json({
      message: "Purchase Return is added successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Error creating grn", error: err.message });
  }
};

const getProcessReturns = async (req, res) => {
  try {
    const { Branch_idBranch } = req.params;
    const purchaseReturns = await dbService.fetchPurchaseItems(Branch_idBranch);

    if (purchaseReturns.length === 0) {
      return res.status(404).json({ message: "Purchase Returns not found" });
    }

    await Promise.all(
      purchaseReturns.map(async (purchaseReturn) => {
        const items = await dbService.fetchItems(
          purchaseReturn.idPurchase_Return
        );
        for (const item of items) {
          if (item.Item_Has_Serial === 1) {
            const serialNumbers = await dbService.fetchSerialNoForItem(
              purchaseReturn.idPurchase_Return
            );
            item.Serial_No = serialNumbers;
          }
        }
        purchaseReturn.items = items;
      })
    );

    res.json(purchaseReturns);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching items",
      error: err.message,
    });
  }
};

const getPurchaseById = async (req, res) => {
  try {
    const { idPurchase_Return } = req.params;
    const purchaseRetrurn = await dbService.fetchPurchaseReturn(
      idPurchase_Return
    );

    const items = await dbService.fetchItems(
      purchaseRetrurn[0].idPurchase_Return
    );

    for (const item of items) {
      const serialNumbers = await dbService.fetchSerialNoForItem(
        idPurchase_Return
      );
      item.Serial_No = serialNumbers;
    }
    purchaseRetrurn[0].items = items;

    res.json(purchaseRetrurn[0]);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching items",
      error: err.message,
    });
  }
};

const updatePurchaseReturn = async (req, res) => {
  try {
    const { idPurchase_Return } = req.params;
    const { Date, Total_Amount, Branch_idBranch, items, Reason, User_idUser } =
      req.body;

    await dbService.updatePurchaseReturn(
      Date,
      items.length,
      Total_Amount,
      idPurchase_Return,
      Reason
    );

    await dbService.deleteItems(idPurchase_Return);
    await Promise.all(
      items.map(async (item) => {
        await dbService.insertItems(
          idPurchase_Return,
          item.Item_idItem,
          item.Item_Description,
          item.Cost,
          item.Qty_Type,
          item.Qty,
          item.Total,
          Branch_idBranch
        );

        await dbService.deletePurchaseRetrunSerials(idPurchase_Return);
        if (item.Item_Has_Serial === 1) {
          item.Serial_No.map(async (serial_number) => {
            serial_no_id = await dbService.getSerials(serial_number);
            await dbService.insertPurchaseReturnSerials(
              idPurchase_Return,
              serial_no_id.ID
            );
          });
        }
      })
    );

    await userLogDbService.insertLog(
      User_idUser,
      currentDate(),
      "Purchase Return",
      idPurchase_Return,
      "edit",
      Branch_idBranch
    );

    res.json({
      message: "Purchase Return has been updated successfully",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating purchase return", error: err.message });
  }
};

const processPurchaseReturn = async (req, res) => {
  try {
    const { idPurchase_Return, Branch_idBranch, User_idUser } = req.body;

    await dbService.processPurchaseReturn(idPurchase_Return);

    const purchaseReturn = await dbService.fetchPurchaseReturn(
      idPurchase_Return
    );
    const purchaseReturnItems = await dbService.fetchItems(idPurchase_Return);

    const lastSupplierLog = await supplierLogDbService.fetchLastLog(
      purchaseReturn[0].Supplier_idSupplier
    );

    const Total_Credit_Balance =
      parseFloat(
        lastSupplierLog.length === 0
          ? 0
          : lastSupplierLog[0].Total_Credit_Balance
      ) -
      parseFloat(
        purchaseReturn[0].Total_Amount === ""
          ? 0
          : purchaseReturn[0].Total_Amount
      );

    await supplierLogDbService.insertSupplierCreditLog(
      purchaseReturn[0].Supplier_idSupplier,
      "PURCHASE RETURN",
      idPurchase_Return,
      "-",
      purchaseReturn[0].Total_Amount,
      Total_Credit_Balance,
      "-",
      "-",
      "-",
      "-",
      "-",
      "-",
      Branch_idBranch
    );

    await Promise.all(
      purchaseReturnItems.map(async (returnItem) => {
        const item = await itemDbService.fetchItem(returnItem.Item_idItem);

        const Qty = parseFloat(item[0].Qty) - parseFloat(returnItem.Qty);

        if (item[0].Item_Has_Serial === 1) {
          serial_items = await dbService.fetchSerialNoForItem(
            idPurchase_Return
          );

          serial_items.map(async (serial_number) => {
            serial_no_id = await dbService.updateSerials(
              serial_number.Serial_No
            );
          });
        }

        await itemDbService.itemProcess(
          item[0].Cost,
          item[0].Real_Cost,
          Qty,
          returnItem.Item_idItem
        );

        await stockCardDbService.insertStockCard(
          item[0].Description,
          "PURCHASE RETURN",
          idPurchase_Return,
          returnItem.Cost,
          item[0].Real_Cost,
          item[0].Rate,
          0,
          returnItem.Qty,
          Qty,
          Branch_idBranch
        );
      })
    );

    await userLogDbService.insertLog(
      User_idUser,
      currentDate(),
      "Purchase Return",
      idPurchase_Return,
      "process",
      Branch_idBranch
    );

    res.json({
      message: "Purchase Return Processed successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Error processing purchase return",
      error: err.message,
    });
  }
};

const checkReturnSerial = async (req, res) => {
  try {
    const { serial_numbers } = req.body;

    const checkSerials = await dbService.checkReturnSerial(serial_numbers);

    if (checkSerials.length === 0) {
      res
        .status(200)
        .json({ message: "The item is not found or not in stock" });
    } else {
      // If matching serial numbers found, send the list of existing serial numbers
      res.status(200).json({ existing_serial_numbers: checkSerials });
    }
  } catch (err) {
    res.status(500).json({
      message: "Error checking serials",
      error: err.message,
    });
  }
};

module.exports = {
  createPurchaseReturn,
  getProcessReturns,
  getPurchaseById,
  updatePurchaseReturn,
  processPurchaseReturn,
  checkReturnSerial,
  // getGrns,
  // getGrnById,
  // updateGrn,
};
