const express = require("express");
const multer = require("multer");
const multerGoogleStorage = require('multer-google-storage')
const { verifyIsLoggedIn } = require("../middleware/authMiddleware");
const path = require("path");

const {
  getAllTransaction,
  getSingleTransaction,
  createNewTransaction,
  createNewTransactionWithOcr,
  getTransactionByType,
  getTransactionByCategory,
  getTransactionByDate,
  editTransaction,
  deleteTransaction,
} = require("../controllers/transactionControllers");

const router = express.Router();

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/')
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname))
//   }

// })


const storage = multerGoogleStorage.storageEngine({
  bucket: 'bucket-image-beruang',
  projectId: 'beruang-application',
  keyFilename:'./key.json',
  filename: (req, file, cb) => {
    const fileName = Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  }
});

const upload = multer({ storage: storage });

router.get("/", verifyIsLoggedIn, getAllTransaction);
router.post("/", verifyIsLoggedIn, createNewTransaction);
router.post(
  "/ocr",
  verifyIsLoggedIn,
  upload.single("file"),
  createNewTransactionWithOcr
);
router.get("/single", verifyIsLoggedIn, getSingleTransaction);
router.post("/type", verifyIsLoggedIn, getTransactionByType);
router.post("/category", verifyIsLoggedIn, getTransactionByCategory);
router.post("/date", verifyIsLoggedIn, getTransactionByDate);
router.put("/edit", verifyIsLoggedIn, editTransaction);
router.delete("/delete", verifyIsLoggedIn, deleteTransaction);

module.exports = router;
