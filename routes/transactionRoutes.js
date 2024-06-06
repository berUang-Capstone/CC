const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');

const {
  getAllTransaction,
  getSingleTransaction,
  createNewTransaction,
  editTransaction,
  deleteTransaction,
  getTransactionsByWeek
} = require('../controllers/transactionControllers');

const router = express.Router();

router.get('/', verifyToken, getAllTransaction);
router.get('/single', verifyToken, getSingleTransaction);
router.post('/', verifyToken, createNewTransaction);
router.put('/edit', verifyToken, editTransaction);
router.delete('/delete', verifyToken, deleteTransaction);
router.get('/week', verifyToken, getTransactionsByWeek);

module.exports = router;
