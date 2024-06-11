const express = require('express');
const { verifyIsLoggedIn } = require('../middleware/authMiddleware');

const {
  getAllTransaction,
  getSingleTransaction,
  createNewTransaction,
  getTransactionByType,
  getTransactionByCategory,
  getTransactionByDate,
  editTransaction,
  deleteTransaction
} = require('../controllers/transactionControllers');

const router = express.Router();

router.get('/', verifyIsLoggedIn, getAllTransaction);
router.post('/', verifyIsLoggedIn, createNewTransaction);
router.get('/single', verifyIsLoggedIn, getSingleTransaction);
router.get('/type', verifyIsLoggedIn, getTransactionByType);
router.get('/category', verifyIsLoggedIn, getTransactionByCategory);
router.get('/date', verifyIsLoggedIn, getTransactionByDate);
router.put('/edit', verifyIsLoggedIn, editTransaction);
router.delete('/delete', verifyIsLoggedIn, deleteTransaction);

module.exports = router;
