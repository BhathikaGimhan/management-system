const dbService = require("../services/branchDBService");
const authController = require("../controllers/authController");

const getBranchAddress = async (req, res) => {
  try {
    const { Branch_idBranch } = req.params;
    const address = await dbService.fetchBranch(Branch_idBranch);
    if (address.length === 0) {
      return res.status(404).json({ message: "Branch not found" });
    }
    res.json(address[0]);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching branch by ID", error: err.message });
  }
};

const getBranchPaymentDetails = async (req, res) => {
  try {
    const { Branch_idBranch } = req.params;
    const paymentDetails = await dbService.fetchPaymentDetails(Branch_idBranch);
    if (paymentDetails.length === 0) {
      return res.status(404).json({ message: "Payment Details not found" });
    }
    res.json(paymentDetails[0]);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching branch by ID", error: err.message });
  }
};

const getAccountDetails = async (req, res) => {
  try {
    const { Branch_idBranch } = req.params;
    const branch = await dbService.fetchBranch(Branch_idBranch);
    if (branch.length === 0) {
      return res.status(404).json({ message: "Branch not found" });
    }
    const company = await dbService.fetchCompany(branch[0].Company_idCompany);
    if (company.length === 0) {
      return res.status(404).json({ message: "Company not found" });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}/uploads/${
      company[0].Logo
    }`;
    let returnData = {
      Name: branch[0].Name,
      Address1: branch[0].Address1,
      Address2: branch[0].Address2,
      Address3: branch[0].Address3,
      Contact_No: branch[0].Contact_No,
      Print_Size: branch[0].Print_Size,
      Logo: baseUrl,
    };
    res.json(returnData);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching branch by ID", error: err.message });
  }
};

const createBranch = async (req, res) => {
  try {
    const {
      Name,
      Address1,
      Address2,
      Address3,
      Contact_No,
      Company_idCompany,
    } = req.body;

    const branch = await dbService.insertBranch(
      Name,
      Address1,
      Address2,
      Address3,
      Contact_No,
      Company_idCompany
    );

    const Branch_idBranch = branch.insertId;

    await dbService.insertPaymentDetails(Branch_idBranch);

    res.status(200).json({ message: "Branch added successfully" });
  } catch (err) {
    console.error("Error creating branch:", err);
    res
      .status(500)
      .json({ message: "Error creating branch", error: err.message });
  }
};

const updateBranch = async (req, res) => {
  const { idBranch } = req.params;
  try {
    const {
      Address1,
      Address2,
      Address3,
      Contact_No,
      First_Name,
      Last_Name,
      Email,
      user,
    } = req.body;
    if (
      !Address1 ||
      !Address2 ||
      !Address3 ||
      !Contact_No ||
      !First_Name ||
      !Last_Name ||
      !Email ||
      !user
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    await dbService.updateBranch(
      idBranch,
      Address1,
      Address2,
      Address3,
      Contact_No
    );
    await authController.updateUser(First_Name, Last_Name, Email, user);
    res.status(200).json({ message: "Branch updated successfully" });
  } catch (err) {
    console.error("Error updating branch:", err);
    res
      .status(500)
      .json({ message: "Error updating branch", error: err.message });
  }
};

const changeBranchLogo = async (req, res) => {
  try {
    const { Branch_idBranch, img } = req.body;
    const { filename } = req.file;
    const branch = await dbService.fetchBranch(Branch_idBranch);
    await dbService.updateCompanyImage(branch[0].Company_idCompany, filename);
    res.status(200).json({ message: "Logo has been successfully" });
  } catch (err) {
    console.error("Error creating branch:", err);
    res
      .status(500)
      .json({ message: "Error creating branch", error: err.message });
  }
};

const updatePaymentDetails = async (req, res) => {
  const { Branch_idBranch } = req.params;
  try {
    const { Penalty_Percentage, Interest_Rate } = req.body;

    await dbService.updatePaymentDatails(
      Branch_idBranch,
      Penalty_Percentage,
      Interest_Rate
    );
    res.status(200).json({ message: "Payment Details updated successfully" });
  } catch (err) {
    console.error("Error updating payment details:", err);
    res
      .status(500)
      .json({ message: "Error updating payment details", error: err.message });
  }
};

module.exports = {
  getBranchAddress,
  createBranch,
  updateBranch,
  changeBranchLogo,
  getAccountDetails,
  updatePaymentDetails,
  getBranchPaymentDetails,
};
