const express = require('express')
const authRoutes = require('./authRoutes')
const transactionRoutes = require('./transactionRoutes')
const userRoutes = require('./userRoutes')

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/transaction', transactionRoutes)
router.use('/user', userRoutes)

module.exports = router