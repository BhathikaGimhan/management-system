const dbService = require("../services/grnDBService");
const itemDbService = require("../services/productDBService");
const supplierLogDbService = require("../services/supplierCreditLogDBService");
const stockCardDbService = require("../services/stockCardDBService");
const userLogDbService = require("../services/userLogDBService");
const passport = require("passport");

const createGrn = async (req, res) => {
  try {
    const {
      Date,
      Supplier_idSupplier,
      Bill_no,
      Total_Amount,
      Bill_Discount,
      Discount_Amount,
      Discount_Type,
      Net_Total,
      Branch_idBranch,
      items,
      User_idUser,
    } = req.body;
    const grn = await dbService.insertGrn(
      Date,
      Supplier_idSupplier,
      Bill_no,
      items.length,
      Total_Amount,
      Bill_Discount,
      Discount_Amount,
      Discount_Type,
      Net_Total,
      Branch_idBranch
    );

    const GRN_idGRN = grn.insertId;

    await Promise.all(
      items.map(async (item) => {
        await dbService.insertItems(
          GRN_idGRN,
          item.Item_idItem,
          item.Item_Description,
          item.Cost,
          item.Qty_Type,
          item.Qty,
          item.Total,
          item.Discount,
          item.Discount_Type,
          item.Sub_Total,
          item.Item_idItem,
          Branch_idBranch
        );
      })
    );

    await Promise.all(
      items.map(async (item) => {
        await dbService.insertSerialNumbers(
          GRN_idGRN,
          item.Item_idItem,
          1,
          item.Serial_No,
          Branch_idBranch
        );
      })
    );

    await userLogDbService.insertLog(
      User_idUser,
      currentDate(),
      "GRN",
      GRN_idGRN,
      "create",
      Branch_idBranch
    );

    res.json({
      message: "GRN added successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Error creating grn", error: err.message });
  }
};

const currentDate = () => {
  let currentDate = new Date();
  let year = currentDate.getFullYear();
  let month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed, so add 1
  let day = String(currentDate.getDate()).padStart(2, "0");
  let hours = String(currentDate.getHours()).padStart(2, "0");
  let minutes = String(currentDate.getMinutes()).padStart(2, "0");
  let DateTime = `${year}-${month}-${day} ${hours}:${minutes}`;

  return DateTime;
};
const getGrns = async (req, res) => {
  try {
    const { Branch_idBranch } = req.params;
    const grns = await dbService.fetchGrns(Branch_idBranch);

    if (grns.length === 0) {
      return res.status(404).json({ message: "Grns not found" });
    }

    await Promise.all(
      grns.map(async (grn) => {
        const items = await dbService.fetchItems(grn.idGRN);
        grn.items = items;
      })
    );

    res.json(grns);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching items",
      error: err.message,
    });
  }
};

const getGrnById = async (req, res) => {
  try {
    const { idGRN } = req.params;
    const grn = await dbService.fetchGrn(idGRN);

    const items = await dbService.fetchItems(grn[0].idGRN);
    for (const item of items) {
      const serialNumbers = await dbService.fetchSerialNoForItem(
        item.Item_idItem,
        idGRN
      );
      item.Serial_No = serialNumbers;
    }
    grn[0].items = items;

    res.json(grn[0]);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching items",
      error: err.message,
    });
  }
};

const updateGrn = async (req, res) => {
  try {
    const { idGRN } = req.params;
    const {
      Date,
      Bill_no,
      Total_Amount,
      Bill_Discount,
      Discount_Amount,
      Net_Total,
      Branch_idBranch,
      items,
      User_idUser,
    } = req.body;

    await dbService.updateGrn(
      Date,
      Bill_no,
      items.length,
      Total_Amount,
      Bill_Discount,
      Discount_Amount,
      Net_Total,
      idGRN
    );

    await Promise.all(
      items.map(async (item) => {
        await dbService.deleteItems(idGRN);
        await dbService.deleteSerialNumbers(idGRN);
        await dbService.insertItems(
          idGRN,
          item.Item_idItem,
          item.Item_Description,
          item.Cost,
          item.Qty_Type,
          item.Qty,
          item.Total,
          item.Discount,
          item.Sub_Total,
          item.Item_idItem,
          Branch_idBranch
        );
        await dbService.insertSerialNumbers(
          idGRN,
          item.Item_idItem,
          item.Qty,
          item.Serial_No,
          Branch_idBranch
        );
      })
    );

    await userLogDbService.insertLog(
      User_idUser,
      currentDate(),
      "GRN",
      idGRN,
      "edit",
      Branch_idBranch
    );

    res.json({
      message: "GRN updated successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating grn", error: err.message });
  }
};

const processGrn = async (req, res) => {
  try {
    const {
      idGRN,
      Branch_idBranch,
      Credit_Balance_Amount,
      Payment_Method,
      Payment_Type,
      Paid_Amount,
      Cheque_Type,
      Cheque_No,
      Cheque_Name,
      Cheque_Date,
      User_idUser,
    } = req.body;

    const grn = await dbService.fetchGrn(idGRN);
    const grnItems = await dbService.fetchItems(idGRN);

    const paidAmount = Payment_Type === "full" ? grn[0].Net_Total : Paid_Amount;

    await dbService.processGrn(paidAmount, Credit_Balance_Amount, idGRN);

    if (Credit_Balance_Amount !== 0) {
      const lastSupplierLog = await supplierLogDbService.fetchLastLog(
        grn[0].Supplier_idSupplier
      );

      const Total_Credit_Balance =
        parseFloat(
          lastSupplierLog.length === 0
            ? 0
            : lastSupplierLog[0].Total_Credit_Balance
        ) +
        parseFloat(Credit_Balance_Amount === "" ? 0 : Credit_Balance_Amount);

      await supplierLogDbService.insertSupplierCreditLog(
        grn[0].Supplier_idSupplier,
        "GRN",
        idGRN,
        Credit_Balance_Amount,
        paidAmount,
        Total_Credit_Balance,
        Payment_Type,
        Payment_Method,
        Cheque_Type,
        Cheque_No,
        Cheque_Date,
        Cheque_Name,
        Branch_idBranch
      );
    }

    let totalGrnItems = 0;

    await Promise.all(
      grnItems.map(async (grnItem) => {
        totalGrnItems += parseFloat(grnItem.Qty);
      })
    );

    const discountPerItem =
      parseFloat(grn[0].Discount_Amount) / parseFloat(totalGrnItems);

    await Promise.all(
      grnItems.map(async (grnItem) => {
        const item = await itemDbService.fetchItem(grnItem.Item_idItem);

        const Qty = parseFloat(item[0].Qty) + parseFloat(grnItem.Qty);

        const Net_Total =
          parseFloat(grnItem.Total) - discountPerItem * parseFloat(grnItem.Qty);

        // const Cost =
        //   (parseFloat(grnItem.Total) *
        //     (100 -
        //       parseFloat(
        //         grn[0].Bill_Discount === "" ? 0 : grn[0].Bill_Discount
        //       ))) /
        //   100;

        const Cost = grnItem.Cost;

        const stockCard = await stockCardDbService.fetchItemCurrentStock(
          grnItem.Item_Description
        );

        let Real_Cost = 0;

        stockCard.length <= 0 || parseFloat(stockCard[0].SIH) <= 0
          ? (Real_Cost = Net_Total / parseFloat(grnItem.Qty))
          : (Real_Cost =
              (parseFloat(stockCard[0].SIH) * parseFloat(grnItem.Cost) +
                Net_Total * parseFloat(grnItem.Qty)) /
              (parseFloat(stockCard[0].SIH) + parseFloat(grnItem.Qty)));

        await itemDbService.itemProcess(
          Cost,
          Real_Cost,
          Qty,
          grnItem.Item_idItem
        );

        await stockCardDbService.insertStockCard(
          item[0].Description,
          "GRN",
          idGRN,
          Cost,
          Real_Cost,
          item[0].Rate,
          grnItem.Qty,
          0,
          Qty,
          Branch_idBranch
        );
      })
    );

    await userLogDbService.insertLog(
      User_idUser,
      currentDate(),
      "GRN",
      idGRN,
      "process",
      Branch_idBranch
    );

    res.json({
      message: "GRN Processed successfully",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error processing grn", error: err.message });
  }
};

const checkSerial = async (req, res) => {
  try {
    const { serial_numbers } = req.body;

    const checkSerials = await dbService.checkSerial(serial_numbers);

    if (checkSerials.length === 0) {
      res.status(200).json({ message: "All serial numbers are unique" });
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
  createGrn,
  getGrns,
  getGrnById,
  updateGrn,
  processGrn,
  checkSerial,
};
