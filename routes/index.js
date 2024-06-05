const express = require('express')
const authRoutes = require('./authRoutes')
const transactionRoutes = require('./transactionRoutes')

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/transaction', transactionRoutes)

module.exports = router