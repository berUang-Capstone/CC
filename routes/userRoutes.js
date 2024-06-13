const express = require('express');

const { verifyIsLoggedIn } = require("../middleware/authMiddleware");
const {
    getUserWallet
} = require('../controllers/userControllers')

const router = express.Router()

router.get('/wallet', verifyIsLoggedIn, getUserWallet)

module.exports = router