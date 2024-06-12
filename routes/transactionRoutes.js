const express = require('express');
const multer = require('multer');
const { verifyIsLoggedIn } = require('../middleware/authMiddleware');

const {
  getAllTransaction,
  getSingleTransaction,
  createNewTransaction,
  createNewTransactionWithOcr,
  getTransactionByType,
  getTransactionByCategory,
  getTransactionByDate,
  editTransaction,
  deleteTransaction
} = require('../controllers/transactionControllers');

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.get('/', verifyIsLoggedIn, getAllTransaction);
router.post('/', verifyIsLoggedIn, createNewTransaction);
router.post('/ocr',  verifyIsLoggedIn, upload.single('file'), createNewTransactionWithOcr);
router.get('/single', verifyIsLoggedIn, getSingleTransaction);
router.post('/type', verifyIsLoggedIn, getTransactionByType);
router.post('/category', verifyIsLoggedIn, getTransactionByCategory);
router.post('/date', verifyIsLoggedIn, getTransactionByDate);
router.put('/edit', verifyIsLoggedIn, editTransaction);
router.delete('/delete', verifyIsLoggedIn, deleteTransaction);

module.exports = router;
