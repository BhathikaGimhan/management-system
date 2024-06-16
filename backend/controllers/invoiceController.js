const dbService = require("../services/invoiceDBService");
const rulesDbService = require("../services/rulesDBService");
const serviceDatesDbService = require("../services/serviceDatesDBService");
const itemDbService = require("../services/productDBService");
const customerLogDbService = require("../services/customerCreditLogDBService");
const stockCardDbService = require("../services/stockCardDBService");
const quotationDbService = require("../services/quotaionDBService");
const userLogDbService = require("../services/userLogDBService");
const installmentLogDbService = require("../services/installmentDBService");
const { currentDate } = require("../utils/currentData");

const createInvoice = async (req, res) => {
  try {
    const {
      Quotation_idQuotation,
      Invoice_Date,
      Customer_idCustomer,
      Employee_idEmployee,
      Total,
      Discount_Presentage,
      Discount_Amount,
      Discount_Type,
      Net_Amount,
      Note,
      Payment_Type,
      Payment_Option,
      Paid_Amount,
      Balance_Amount,
      Credit_Balance,
      Branch_idBranch,
      User_idUser,
      items,
      Installment_Count,
      Invoice_Type,
      Status,
    } = req.body;

    const rules = await rulesDbService.getInvoiceNumberDetails(Branch_idBranch);

    const letter_part = rules[0].Invoice_No_Start_With;
    const starting_number = rules[0].Invoice_No_Strat_From;

    let next_invoice_number = `${letter_part}${starting_number}`;

    const last_invoice = await dbService.getLastInvoice(Branch_idBranch);

    if (last_invoice.length !== 0) {
      const last_invoice_number = last_invoice[0].Invoice_Number;

      const match = last_invoice_number.match(/\d/);
      if (match) {
        const digitPosition = match.index;
        const nonNumericPart = last_invoice_number.slice(0, digitPosition);
        const numericPart = parseInt(last_invoice_number.slice(digitPosition));

        const nextNumericPart = numericPart + 1;

        next_invoice_number = `${nonNumericPart}${nextNumericPart}`;
      }
    }

    const lastCustomerLog = await customerLogDbService.fetchLastLog(
      Customer_idCustomer
    );

    const Total_Credit_Balance =
      (lastCustomerLog.length === 0
        ? 0
        : parseFloat(lastCustomerLog[0].Total_Credit_Balance)) +
      parseFloat(Credit_Balance);

    const invoice = await dbService.insertInvoice(
      next_invoice_number,
      Quotation_idQuotation,
      Invoice_Date,
      Customer_idCustomer,
      Employee_idEmployee,
      Total,
      Discount_Type,
      Discount_Presentage,
      Discount_Amount,
      Net_Amount,
      items.Item_Count,
      Note,
      Payment_Type,
      Payment_Option,
      Paid_Amount,
      Balance_Amount,
      Credit_Balance,
      Total_Credit_Balance,
      Invoice_Type,
      Status,
      Branch_idBranch
    );

    if (Quotation_idQuotation !== 0) {
      await quotationDbService.statusUpdate(Quotation_idQuotation);
    }

    const Invoice_idInvoice = invoice.insertId;

    if (Payment_Type === 2) {
      let installment_amount = Net_Amount - Paid_Amount;
      const current_invoice_Date = new Date(Invoice_Date)
        .toISOString()
        .split("T")[0];
      let single_installment_amount = installment_amount / Installment_Count;
      for (let i = 1; i <= Installment_Count; i++) {
        const [year, month, day] = current_invoice_Date.split("-").map(Number);
        const date = new Date(year, month - 1 + i, day);
        const add_date = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

        await installmentLogDbService.insertInstallment(
          Invoice_idInvoice,
          Customer_idCustomer,
          add_date,
          i,
          parseFloat(single_installment_amount), //amount
          0, //Pentaly Amount
          parseFloat(single_installment_amount), // Total Pending Amount
          0, //Paid Amount
          parseFloat(single_installment_amount), // Balance Amount
          0, //Status
          Branch_idBranch
        );
      }
    }

    if (Credit_Balance !== 0) {
      await customerLogDbService.insertCustomerCreditLog(
        Customer_idCustomer,
        "INVOICE",
        Invoice_idInvoice,
        Credit_Balance,
        0,
        Total_Credit_Balance,
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        Branch_idBranch
      );
    }

    await Promise.all(
      items.map(async (invItem) => {
        const item = await itemDbService.fetchItem(invItem.Item_idItem);

        if (invItem.Serial_No === 1 && invItem.SelectedSerials.length > 0) {
          const serial_discount =
            invItem.Discount / invItem.SelectedSerials.length;
          invItem.SelectedSerials.map(async (serial_number) => {
            let serial_no_id = 0;

            switch (serial_number.exists) {
              case 1:
                serial_no_id = await dbService.updateSerials(
                  serial_number.Serial_No
                );
                serial_no_id = serial_no_id.ID;
                break;
              case 0:
                const insertSerial = await dbService.insertSerialNumbers(
                  0,
                  invItem.Item_idItem,
                  0,
                  serial_number.Serial_No,
                  Branch_idBranch
                );
                serial_no_id = insertSerial.insertId;
                break;
            }

            await dbService.insertInvoiceItem(
              Invoice_idInvoice,
              invItem.Item_idItem,
              1,
              serial_no_id,
              item[0].Description,
              item[0].Long_Description,
              item[0].Qty_Type,
              1,
              invItem.Rate,
              invItem.Amount,
              invItem.Discount_Type,
              serial_discount,
              invItem.Total_Amount,
              // invItem.Item_Service,
              Branch_idBranch
            );
          });
        } else {
          await dbService.insertInvoiceItem(
            Invoice_idInvoice,
            invItem.Item_idItem,
            0,
            0,
            item[0].Description,
            item[0].Long_Description,
            item[0].Qty_Type,
            invItem.Qty,
            invItem.Rate,
            invItem.Amount,
            invItem.Discount_Type,
            invItem.Discount,
            invItem.Total_Amount,
            Branch_idBranch
          );
        }
      })
    );

    await Promise.all(
      items
        .filter((invItem) => invItem.Invoice_Item_Type !== "customer_return")
        .map(async (invItem) => {
          const item = await itemDbService.fetchItem(invItem.Item_idItem);
          if (item[0].Type === "1") {
            const Qty = parseFloat(item[0].Qty) - parseFloat(invItem.Qty);
            await itemDbService.itemProcess(
              item[0].Cost,
              item[0].Real_Cost,
              Qty,
              invItem.Item_idItem
            );

            await stockCardDbService.insertStockCard(
              item[0].Description,
              "INVOICE",
              Invoice_idInvoice,
              item[0].Cost,
              item[0].Real_Cost,
              item[0].Rate,
              0,
              invItem.Qty,
              Qty,
              Branch_idBranch
            );
          }
        })
    );

    await userLogDbService.insertLog(
      User_idUser,
      currentDate(),
      "Invoice",
      Invoice_idInvoice,
      "create",
      Branch_idBranch
    );

    res.json({
      message: "Invoice added successfully",
      invoice_id: Invoice_idInvoice,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating invoice", error: err.message });
  }
};

const getNextInvoiceId = async (req, res) => {
  try {
    const { Branch_idBranch } = req.params;

    const rules = await rulesDbService.getInvoiceNumberDetails(Branch_idBranch);

    const letter_part = rules[0].Invoice_No_Start_With;
    const starting_number = rules[0].Invoice_No_Strat_From;

    let next_invoice_number = `${letter_part}${starting_number}`;

    const last_invoice = await dbService.getLastInvoice(Branch_idBranch);

    if (last_invoice.length !== 0) {
      const last_invoice_number = last_invoice[0].Invoice_Number;

      const match = last_invoice_number.match(/\d/);
      if (match) {
        const digitPosition = match.index;
        const nonNumericPart = last_invoice_number.slice(0, digitPosition);
        const numericPart = parseInt(last_invoice_number.slice(digitPosition));

        const nextNumericPart = numericPart + 1;

        next_invoice_number = `${nonNumericPart}${nextNumericPart}`;
      }
    }

    res.json(next_invoice_number);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error getting invoice number", error: err.message });
  }
};

const getAllInvoices = async (req, res) => {
  try {
    const { Branch_idBranch } = req.params;

    const invoices = await dbService.fetchInvoices(Branch_idBranch);

    if (invoices.length === 0) {
      return res.status(404).json({ message: "Invoices not found" });
    }

    res.json(invoices);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching invoices",
      error: err.message,
    });
  }
};

const getAllSerials = async (req, res) => {
  try {
    const { Item_idItem } = req.params;

    const serials = await dbService.fetchSerials(Item_idItem);
    if (serials.length === 0) {
      return res.status(404).json({ message: "No Serial Number are found" });
    }
    res.json(serials);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching serials",
      error: err.message,
    });
  }
};

const getInvoiceById = async (req, res) => {
  try {
    const { idInvoice } = req.params;

    const invoice = await dbService.fetchInvoice(idInvoice);
    if (invoice.length === 0) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    let items = await dbService.fetchInvoiceItems(idInvoice);

    items = await Promise.all(
      items.map(async (item) => {
        if (item.Item_Service === 1) {
          const dates = await dbService.fetchServiceDateInvoices(
            idInvoice,
            item.Item_idItem
          );
          item.dates = dates;
        }
        return item; // Return the modified item
      })
    );
    if (items.length === 0) {
      return res.status(404).json({ message: "Invoice items not found" });
    }
    let installments = [];
    if (invoice[0].Payment_Type === 2) {
      installments = await installmentLogDbService.fetchInstallmentByInvoice(
        idInvoice
      );
    }
    res.json({
      invoice: invoice[0],
      items: items,
      installments,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching invoice",
      error: err.message,
    });
  }
};

const updateInvoiceStatus = async (req, res) => {
  try {
    const { Branch_idBranch, User_idUser, idInvoice } = req.body;

    await dbService.updateStatus(idInvoice);
    await userLogDbService.insertLog(
      User_idUser,
      currentDate(),
      "Invoice",
      idInvoice,
      "complete service",
      Branch_idBranch
    );
    res.json({ message: "Service completed successfully" });
  } catch (err) {
    console.error("Error completing service:", err);
    res
      .status(500)
      .json({ message: "Error completing service", error: err.message });
  }
};

module.exports = {
  createInvoice,
  getNextInvoiceId,
  getAllInvoices,
  getInvoiceById,
  getAllSerials,
  updateInvoiceStatus,
};
