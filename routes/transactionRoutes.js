const express = require('express');
const { verifyIsLoggedIn } = require('../middleware/authMiddleware');

const {
  getAllTransaction,
  getSingleTransaction,
  createNewTransaction,
  editTransaction,
  deleteTransaction,
  getTransactionsByWeek
} = require('../controllers/transactionControllers');

const router = express.Router();

router.get('/', verifyIsLoggedIn, getAllTransaction);
router.get('/single', verifyIsLoggedIn, getSingleTransaction);
router.post('/', verifyIsLoggedIn, createNewTransaction);
router.put('/edit', verifyIsLoggedIn, editTransaction);
router.delete('/delete', verifyIsLoggedIn, deleteTransaction);
router.get('/week', verifyIsLoggedIn, getTransactionsByWeek);

module.exports = router;
