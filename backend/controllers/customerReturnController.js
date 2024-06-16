const dbService = require("../services/customerReturnDBService");
const itemDbService = require("../services/productDBService");
const customerLogDbService = require("../services/customerCreditLogDBService");
const stockCardDbService = require("../services/stockCardDBService");
const userLogDbService = require("../services/userLogDBService");
const { currentDate } = require("../utils/currentData");

const createCustomerReturn = async (req, res) => {
  try {
    const {
      Date,
      Customer_idCustomer,
      Total_Amount,
      Branch_idBranch,
      items,
      Reason,
      User_idUser,
    } = req.body;

    const customerReturn = await dbService.createCustomerReturn(
      Date,
      Customer_idCustomer,
      Total_Amount,
      items.length,
      Branch_idBranch,
      Reason
    );

    const idCustomer_Return = customerReturn.insertId;

    await Promise.all(
      items.map(async (item) => {
        await dbService.insertItems(
          idCustomer_Return,
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
            await dbService.insertCustomerReturnSerials(
              idCustomer_Return,
              serial_no_id.ID
            );
          });
        }
      })
    );

    await userLogDbService.insertLog(
      User_idUser,
      currentDate(),
      "Customer Return",
      idCustomer_Return,
      "create",
      Branch_idBranch
    );

    res.json({
      message: "Customer Return is added successfully",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating Customer Return", error: err.message });
  }
};

const getProcessReturns = async (req, res) => {
  try {
    const { Branch_idBranch } = req.params;
    const customerReturns = await dbService.fetchCustomerItems(Branch_idBranch);

    if (customerReturns.length === 0) {
      return res.status(404).json({ message: "Customer Return not found" });
    }

    await Promise.all(
      customerReturns.map(async (customerReturn) => {
        const items = await dbService.fetchItems(
          customerReturn.idCustomer_Return
        );
        for (const item of items) {
          if (item.Item_Has_Serial === 1) {
            const serialNumbers = await dbService.fetchSerialNoForItem(
              customerReturn.idCustomer_Return
            );
            item.Serial_No = serialNumbers;
          }
        }
        customerReturn.items = items;
      })
    );

    res.json(customerReturns);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching items",
      error: err.message,
    });
  }
};

const getCustomerReturnById = async (req, res) => {
  try {
    const { idCustomer_Return } = req.params;
    const customerReturn = await dbService.fetchCustomerReturn(
      idCustomer_Return
    );

    const items = await dbService.fetchItems(
      customerReturn[0].idCustomer_Return
    );

    for (const item of items) {
      const serialNumbers = await dbService.fetchSerialNoForItem(
        idCustomer_Return
      );
      item.Serial_No = serialNumbers;
    }
    customerReturn[0].items = items;
    res.json(customerReturn[0]);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching items",
      error: err.message,
    });
  }
};

const updateCustomerReturn = async (req, res) => {
  try {
    const { idCustomer_Return } = req.params;
    const { Date, Total_Amount, Branch_idBranch, items, Reason, User_idUser } =
      req.body;

    await dbService.updateCustomerReturn(
      Date,
      items.length,
      Total_Amount,
      idCustomer_Return,
      Reason
    );

    await dbService.deleteItems(idCustomer_Return);
    await Promise.all(
      items.map(async (item) => {
        await dbService.insertItems(
          idCustomer_Return,
          item.Item_idItem,
          item.Item_Description,
          item.Cost,
          item.Qty_Type,
          item.Qty,
          item.Total,
          Branch_idBranch
        );

        await dbService.deleteCustomerRetrunSerials(idCustomer_Return);
        if (item.Item_Has_Serial === 1) {
          item.Serial_No.map(async (serial_number) => {
            serial_no_id = await dbService.getSerials(serial_number);
            await dbService.insertCustomerReturnSerials(
              idCustomer_Return,
              serial_no_id.ID
            );
          });
        }
      })
    );

    await userLogDbService.insertLog(
      User_idUser,
      currentDate(),
      "Customer Return",
      idCustomer_Return,
      "edit",
      Branch_idBranch
    );

    res.json({
      message: "Customer Return has been updated successfully",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating customer return", error: err.message });
  }
};

const processCustomerReturn = async (req, res) => {
  try {
    const { idCustomer_Return, Branch_idBranch, User_idUser } = req.body;

    await dbService.processCustomerReturn(idCustomer_Return);

    const customerReturn = await dbService.fetchCustomerReturn(
      idCustomer_Return
    );
    const customerReturnItems = await dbService.fetchItems(idCustomer_Return);

    const lastCustomerLog = await customerLogDbService.fetchLastLog(
      customerReturn[0].Customer_idCustomer
    );

    const Total_Credit_Balance =
      parseFloat(
        lastCustomerLog.length === 0
          ? 0
          : lastCustomerLog[0].Total_Credit_Balance
      ) +
      parseFloat(
        customerReturn[0].Total_Amount === ""
          ? 0
          : customerReturn[0].Total_Amount
      );

    await customerLogDbService.insertCustomerCreditLog(
      customerReturn[0].Customer_idCustomer,
      "CUSTOMER RETURN",
      idCustomer_Return,
      "-",
      customerReturn[0].Total_Amount,
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
      customerReturnItems.map(async (returnItem) => {
        const item = await itemDbService.fetchItem(returnItem.Item_idItem);

        const Qty = parseFloat(item[0].Qty) + parseFloat(returnItem.Qty);
        if (item[0].Item_Has_Serial === 1) {
          serial_items = await dbService.fetchSerialNoForItem(
            idCustomer_Return
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
          "CUSTOMER RETURN",
          idCustomer_Return,
          returnItem.Cost,
          item[0].Real_Cost,
          item[0].Rate,
          returnItem.Qty,
          0,
          Qty,
          Branch_idBranch
        );
      })
    );

    await userLogDbService.insertLog(
      User_idUser,
      currentDate(),
      "Customer Return",
      idCustomer_Return,
      "process",
      Branch_idBranch
    );

    res.json({
      message: "Customer Return Processed successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Error processing customer return",
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
        .json({ message: "The item is not found or already in stock" });
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
  createCustomerReturn,
  getProcessReturns,
  getCustomerReturnById,
  updateCustomerReturn,
  processCustomerReturn,
  checkReturnSerial,
};
