const express = require("express")
const { currentUser, registerUser, loginUser } = require("../handlers/userHandler")
const router = express.Router()
const validateToken = require("../middleware/validateToken");

router.post("/register", registerUser)

router.post("/login", loginUser)

router.get("/current", validateToken, currentUser)

module.exports = router