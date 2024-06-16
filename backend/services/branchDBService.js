const db = require("../db/db");

const fetchBranch = (branch_id) => {
  const query = "SELECT * FROM branch WHERE idBranch = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [branch_id], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

const fetchCompany = (company_id) => {
  const query = "SELECT * FROM company WHERE idCompany = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [company_id], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

const insertBranch = (
  Name,
  Address1,
  Address2,
  Address3,
  Contact_No,
  Company_idCompany
) => {
  const query =
    "INSERT INTO branch (Name, Address1, Address2, Address3, Contact_No, Status, Company_idCompany) VALUES (?, ?, ?, ?, ?, ?, ?)";
  return new Promise((resolve, reject) => {
    db.query(
      query,
      [Name, Address1, Address2, Address3, Contact_No, 1, Company_idCompany],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      }
    );
  });
};

const updateBranch = (idBranch, Address1, Address2, Address3, Contact_No) => {
  console.log(Address1);
  const query =
    "UPDATE branch SET Address1 = ?, Address2 = ?, Address3 = ?, Contact_No = ? WHERE idBranch = ?";
  return new Promise((resolve, reject) => {
    db.query(
      query,
      [Address1, Address2, Address3, Contact_No, idBranch],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      }
    );
  });
};

const insertPaymentDetails = (Branch_idBranch) => {
  const query =
    "INSERT INTO company_payment_details (Branch_idBranch) VALUES (?)";
  return new Promise((resolve, reject) => {
    db.query(query, [Branch_idBranch], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const fetchPaymentDetails = (Branch_idBranch) => {
  const query =
    "SELECT * FROM company_payment_details WHERE Branch_idBranch = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [Branch_idBranch], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

const updatePaymentDatails = (
  Branch_idBranch,
  Penalty_Percentage,
  Interest_Rate
) => {
  const query = `UPDATE company_payment_details 
    SET Penalty_Percentage = ?, Interest_Rate = ? 
    WHERE Branch_idBranch = ?`;
  return new Promise((resolve, reject) => {
    db.query(
      query,
      [Penalty_Percentage, Interest_Rate, Branch_idBranch],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      }
    );
  });
};

const updateCompanyImage = (idCompany, Logo) => {
  const query = `UPDATE company SET Logo = ? WHERE idCompany = ?`;
  return db.query(query, [Logo, idCompany]);
};

module.exports = {
  fetchBranch,
  insertBranch,
  updateCompanyImage,
  fetchCompany,
  updateBranch,
  updatePaymentDatails,
  insertPaymentDetails,
  fetchPaymentDetails,
};
