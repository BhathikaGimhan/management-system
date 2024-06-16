const dbService = require("../services/damageNotesDBService");
const itemDbService = require("../services/productDBService");
const stockCardDbService = require("../services/stockCardDBService");
const userLogDbService = require("../services/userLogDBService");
const { currentDate } = require("../utils/currentData");

const createDamageNote = async (req, res) => {
  try {
    const { Date, Reason, Total_Amount, Branch_idBranch, items, User_idUser } =
      req.body;

    const damage_note = await dbService.insertDamageNote(
      Date,
      Reason,
      Total_Amount,
      items.length,
      Branch_idBranch
    );

    const Damage_Note_idDamage_Note = damage_note.insertId;

    await Promise.all(
      items.map(async (damageItem) => {
        const item = await itemDbService.fetchItem(damageItem.Item_idItem);

        const Qty = parseFloat(item[0].Qty) - parseFloat(damageItem.Qty);
        await dbService.insertItems(
          Damage_Note_idDamage_Note,
          damageItem.Item_idItem,
          damageItem.Item_Description,
          damageItem.Cost,
          damageItem.Qty,
          damageItem.Total,
          Branch_idBranch
        );

        if (damageItem.Item_Has_Serial === 1) {
          damageItem.Serial_No.map(async (serial_number) => {
            serial_no_id = await dbService.updateSerials(serial_number);
            await dbService.insertDamageNoteSerials(
              Damage_Note_idDamage_Note,
              serial_no_id.ID
            );
          });
        }

        await itemDbService.itemProcess(
          item[0].Cost,
          item[0].Real_Cost,
          Qty,
          damageItem.Item_idItem
        );

        await stockCardDbService.insertStockCard(
          damageItem.Item_Description,
          "DAMAGE",
          Damage_Note_idDamage_Note,
          item[0].Cost,
          item[0].Real_Cost,
          item[0].Rate,
          0,
          damageItem.Qty,
          Qty,
          Branch_idBranch
        );
      })
    );

    await userLogDbService.insertLog(
      User_idUser,
      currentDate(),
      "Damage Note",
      Damage_Note_idDamage_Note,
      "create",
      Branch_idBranch
    );

    res.json({
      message: "Damage Note added successfully",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating damage note", error: err.message });
  }
};

const getDamageNotes = async (req, res) => {
  try {
    const { Branch_idBranch } = req.params;
    const damage_notes = await dbService.fetchDamageNotes(Branch_idBranch);

    if (damage_notes.length === 0) {
      return res.status(404).json({ message: "Damage Notes not found" });
    }

    await Promise.all(
      damage_notes.map(async (damage_note) => {
        const items = await dbService.fetchItems(damage_note.idDamage_Note);
        damage_note.items = items;
      })
    );

    res.json(damage_notes);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching items",
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
  createDamageNote,
  getDamageNotes,
  checkReturnSerial,
};
