const jwt = require("jsonwebtoken");
const db = require("../db/db");
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const employeeDbService = require("../services/employeeDBService");

const saltRounds = 10;

const requestLoginGoogle = (req, res) => {
  const redirectUrl = `${process.env.SERVER_ROOT_URI}/api/user/login/google/auth`;
  const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUrl
  );
  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
    prompt: "consent",
  });

  return res.status(200).json({ url: authorizeUrl });
};
const getUserData = async (access_token) => {
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
  );

  //console.log('response',response);
  const data = await response.json();

  return data.email;
};
const oauthLoginGoogle = async (req, res) => {
  const code = req.query.code;

  try {
    const redirectURL = `https://testbackend.asipiya.lk/api/user/login/google/auth`;
    const oAuth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      redirectURL
    );
    const r = await oAuth2Client.getToken(code);
    // Make sure to set the credentials on the OAuth2 client.
    await oAuth2Client.setCredentials(r.tokens);
    console.info("Tokens acquired.");
    const user = oAuth2Client.credentials;
    console.log("credentials", user);
    const email = await getUserData(oAuth2Client.credentials.access_token);

    const findUserQuery = "SELECT * FROM user WHERE Email = ?";
    db.query(findUserQuery, [email], async (err, rows) => {
      if (err) {
        console.error("Error finding user:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      if (rows.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const user = rows[0];

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, "HTGWEWDWFSDCFSCW");
      const newUserArray = {
        userName: user.User_Name,
        email: user.Email,
        userId: user.idUser,
        branch: user.Branch_idBranch,
      };
      res.redirect(
        303,
        `https://demo.asipiya.lk/?token=${token}&user=${JSON.stringify(
          newUserArray
        )}`
      );
    });
  } catch (err) {
    console.log("Error logging in with OAuth2 user", err);
  }
};
const loginThroughGoogle = (req, res) => {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: `${process.env.SERVER_ROOT_URI}/auth/google`,
    client_id: process.env.GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  console.log(options);
};

const registerUser = async (req, res) => {
  const { First_Name, Last_Name, Password, Email, TP, Branch_idBranch } =
    req.body;

  try {
    const hash = await bcrypt.hash(Password, saltRounds);
    const sql =
      "INSERT INTO user (`First_Name`, `Last_Name`, `User_Name`, `Password`, `Email`, `TP`, `Status`, Branch_idBranch) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [
      First_Name,
      Last_Name,
      Email,
      hash,
      Email,
      TP,
      1,
      Branch_idBranch,
    ];

    db.query(sql, values, async (err, result) => {
      if (err) {
        return res.status(500).json({ err });
      }
      res.status(200).json({ Status: "Success" });
      // try {
      //   await employeeDbService.insertEmployee(
      //     "Owner",
      //     "",
      //     "",
      //     "",
      //     "",
      //     Branch_idBranch
      //   );
      // } catch (err) {
      //   console.error("Error creating employee:", err);
      // }
    });
  } catch (err) {
    return res.status(500).json({ Error: "Error hashing password" });
  }
};

const updateUserPassword = (req, res) => {
  const { idUser, oldPassword, newPassword } = req.body;

  // Fetch the user's current password from the database
  const getPasswordQuery = "SELECT Password FROM user WHERE idUser = ?";
  db.query(getPasswordQuery, [idUser], (err, results) => {
    if (err) {
      return res.status(500).json({ Error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ Error: "User not found" });
    }

    const hashedPassword = results[0].Password;

    // Compare the provided old password with the hashed password from the database
    bcrypt.compare(oldPassword, hashedPassword, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ Error: "Error comparing passwords" });
      }

      if (!isMatch) {
        return res.status(400).json({ Error: "Incorrect old password" });
      }

      // Hash the new password
      bcrypt.hash(newPassword, saltRounds, (err, hash) => {
        if (err) {
          return res.status(500).json({ Error: "Error hashing password" });
        }

        // Update the password in the database
        const updatePasswordQuery =
          "UPDATE user SET Password = ? WHERE idUser = ?";
        db.query(updatePasswordQuery, [hash, idUser], (err, result) => {
          if (err) {
            return res.status(500).json({ Error: "Error updating password" });
          }
          return res
            .status(200)
            .json({ Status: "Password updated successfully" });
        });
      });
    });
  });
};

const secretKey = "HTGWEWDWFSDCFSCW";

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find user by userName
    const findUserQuery = "SELECT * FROM user WHERE Email = ?";
    db.query(findUserQuery, [email], async (err, rows) => {
      if (err) {
        console.error("Error finding user:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
      if (rows.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const user = rows[0];
      // Check password
      const passwordMatch = await bcrypt.compare(password, user.Password);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, "HTGWEWDWFSDCFSCW");
      res.status(200).json({
        token,
        user: {
          userName: user.User_Name,
          email: user.Email,
          userId: user.idUser,
          branch: user.Branch_idBranch,
          First_Name: user.First_Name ? user.First_Name : "",
          Last_Name: user.Last_Name ? user.Last_Name : "",
        },
      });
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const checkToken = (req, res) => {
  if (req.userId) {
    return res.json({
      Status: "Authentication Success .Token is valid. ",
      LoggedUserId: req.userId,
    });
  } else {
    return res
      .status(401)
      .json({ Error: "Authentication failed. Token is not valid." });
  }
};

const getUserById = async (req, res) => {
  const fetchUserById = (idUser) => {
    const query = "SELECT * FROM user WHERE idUser = ?";
    return new Promise((resolve, reject) => {
      db.query(query, [idUser], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(JSON.stringify(results)));
        }
      });
    });
  };
  try {
    const { idUser } = req.params;
    const user = await fetchUserById(idUser);
    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user[0]);
  } catch (err) {
    console.error("Error fetching user by ID:", err);
    res
      .status(500)
      .json({ message: "Error fetching user by ID", error: err.message });
  }
};

const updateUser = (First_Name, Last_Name, Email, user) => {
  const query = `
    UPDATE user 
    SET 
    First_Name=?, 
    Last_Name=?, 
    User_Name=?, 
    Email=?
    WHERE 
    idUser=?
  `;

  return db.query(query, [First_Name, Last_Name, Email, Email, user]);
};

module.exports = {
  registerUser,
  loginUser,
  checkToken,
  updateUserPassword,
  loginThroughGoogle,
  requestLoginGoogle,
  oauthLoginGoogle,
  getUserById,
  updateUser,
};
