const express = require("express");
const router = express.Router();
const { getLog } = require("../controllers/userLogController");

router.get("/:Branch_idBranch/:from/:to", getLog);

module.exports = router;
