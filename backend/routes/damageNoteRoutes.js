const express = require("express");
const router = express.Router();
const {
  createDamageNote,
  getDamageNotes,
  checkReturnSerial
} = require("../controllers/damageNoteController");

router.get("/:Branch_idBranch", getDamageNotes);
router.post("/", createDamageNote);
router.post("/check-serials", checkReturnSerial);


module.exports = router;
