const express = require("express")
const authController = require("../controllers/authController")
const requestsLimiter = require("../controllers/requestsLimiter")
const router = express.Router()


router.get("/user", authController.auth_user)
router.post("/login",requestsLimiter(40, 9), authController.auth_login)
router.post("/register",requestsLimiter(30, 2) ,authController.auth_register )

module.exports = router