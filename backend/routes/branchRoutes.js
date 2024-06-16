const express = require("express");
const router = express.Router();

const upload = require("./../utils/multerConfig");
const {
  getBranchAddress,
  createBranch,
  changeBranchLogo,
  getAccountDetails,
  updateBranch,
  updatePaymentDetails,
  getBranchPaymentDetails,
} = require("../controllers/branchController");

router.post("/", createBranch);
router.get("/get-account-details/:Branch_idBranch", getAccountDetails);
router.get("/:Branch_idBranch", getBranchAddress);
router.put("/:idBranch", updateBranch);
router.post("/change-logo", upload.single("img"), changeBranchLogo);
router.get("/get-payment-details/:Branch_idBranch", getBranchPaymentDetails);
router.post("/update-payment-details/:Branch_idBranch", updatePaymentDetails);

module.exports = router;
