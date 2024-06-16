const express = require("express");
const router = express.Router();
const { getRules, updateSettings } = require("../controllers/ruleController");

router.get("/:Branch_idBranch", getRules);
router.put("/:idRules", updateSettings);

module.exports = router;
