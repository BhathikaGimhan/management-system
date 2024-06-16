const express = require("express");
const router = express.Router();
const controllers = require("../controllers/authController");
const middleware = require("../middlewares/authMiddleware");

router.post("/register", controllers.registerUser);
router.post("/reset-password", controllers.updateUserPassword);
router.post("/login", controllers.loginUser);
router.post("/login/google", controllers.loginThroughGoogle);
router.get("/login/google/auth", controllers.oauthLoginGoogle);
router.post("/login/request/google", controllers.requestLoginGoogle);
router.get("/protected", middleware.verifyToken, controllers.checkToken);
router.get("/:idUser", controllers.getUserById);

module.exports = router;
