const express = require('express')
const { verifyToken } = require('../middleware/authMiddleware')

const {
  getAllTransaction,
  getSingleTransaction,
  createNewTransaction,
  editTransaction,
  deleteTransaction
} = require('../controllers/transactionControllers')

const router = express.Router()

router.get('/', verifyToken, getAllTransaction)
router.get('/single', verifyToken, getSingleTransaction)
router.post('/', verifyToken, createNewTransaction)
router.put('/edit', verifyToken, editTransaction)
router.delete('/delete', verifyToken, deleteTransaction)

module.exports = router
