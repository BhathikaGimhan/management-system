const express = require("express");
const router = express.Router();
const {
  createGrn,
  getGrns,
  getGrnById,
  updateGrn,
  processGrn,
  checkSerial,
} = require("../controllers/grnController");

router.post("/", createGrn);
router.post("/process", processGrn);
router.post("/check-serials", checkSerial);
router.get("/:Branch_idBranch", getGrns);
router.get("/single/:idGRN", getGrnById);
router.put("/:idGRN", updateGrn);

module.exports = router;
