const { db } = require("../store/firebase");
const {
  collection,
  doc,
  addDoc,
  query,
  where,
  getDoc,
  updateDoc,
  getDocs,
} = require("firebase/firestore");
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const getAllTransaction = async (req, res) => {
  try {
    const userUid = req.userUid;

    const transactionsRef = collection(db, "transactions");
    const q = query(transactionsRef, where("userId", "==", userUid));
    const querySnapshot = await getDocs(q);

    const transactions = [];
    querySnapshot.forEach((doc) => {
      transactions.push({ id: doc.id, ...doc.data() });
    });

    const userDocRef = doc(db, "users", userUid);
    let userData = (await getDoc(userDocRef)).data();

    res.status(200).json({ current_balance: userData.balance, transactions });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to get transactions", message: error.message });
  }
};

const createNewTransaction = async (req, res) => {
  try {
    const userUid = req.userUid;
    const { type, category, amount, name } = req.body;

    const dateCreated = new Date();

    const docRef = await addDoc(collection(db, "transactions"), {
      type,
      category,
      amount,
      name,
      createdAt: dateCreated.toISOString(),
      userId: userUid,
    });

    const userDocRef = doc(db, "users", userUid);
    let userData = (await getDoc(userDocRef)).data();
    if (type === "Income") {
      userData.balance += amount;
    } else if (type === "Expense") {
      userData.balance -= amount;
    }

    await updateDoc(userDocRef, userData);

    res
      .status(201)
      .json({ message: "Transaction created successfully", id: docRef.id });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create transaction", message: error.message });
  }
};

const createNewTransactionWithOcr = async (req, res) => {
  try {
    const userUid = req.userUid; 
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const formData = new FormData();
    formData.append('file', fs.createReadStream(file.path));

    // const ocrResponse = await axios.post('api/predict', formData, {
    //   headers: {
    //     ...formData.getHeaders()
    //   }
    // });

    // const items = ocrResponse.data;

    // let totalAmount = 0;
    // const transactions = [];

    // for (const item of items) {
    //   const { name, amount } = item;

    //   const transaction = {
    //     name,
    //     amount,
    //     userId: userUid,
    //     type: "Expense",
    //     category: 'OCR',
    //     createdAt: new Date().toISOString(),
    //   };

    //   const transactionRef = await addDoc(collection(db, 'transactions'), transaction);

    //   transactions.push({ id: transactionRef.id, ...transaction });
    //   totalAmount += amount;
    // }

    res
      .status(201)
      .json({ message: "Transaction created successfully"});
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create transaction", message: error.message });
  }
};

const getSingleTransaction = async (req, res) => {
  res.status(200).json({ message: "get single transaction api" });
};

const getTransactionByType = async (req, res) => {
  try {
    const userUid = req.userUid;
    const { type } = req.body;

    const transactionsRef = collection(db, "transactions");
    const q = query(
      transactionsRef,
      where("userId", "==", userUid),
      where("type", "==", type)
    );
    const querySnapshot = await getDocs(q);

    const transactions = [];
    let totalAmount = 0;
    querySnapshot.forEach((doc) => {
      const transaction = { id: doc.id, ...doc.data() };
      transactions.push(transaction);
      totalAmount += transaction.amount
    });

    res.status(200).json({total_amount: totalAmount, transactions: transactions});
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Failed to get transactions by type",
        message: error.message,
      });
  }
};

const getTransactionByCategory = async (req, res) => {
  try {
    const userUid = req.userUid;
    const { category } = req.body;

    const transactionsRef = collection(db, "transactions");
    const q = query(
      transactionsRef,
      where("userId", "==", userUid),
      where("category", "==", category)
    );
    const querySnapshot = await getDocs(q);

    const transactions = [];
    let totalAmount = 0;
    querySnapshot.forEach((doc) => {
      const transaction = { id: doc.id, ...doc.data() };
      transactions.push(transaction);
      totalAmount += transaction.amount;
    });

    res.status(200).json({total_amount: totalAmount, transactions: transactions});
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Failed to get transactions by category",
        message: error.message,
      });
  }
};

const getTransactionByDate = async (req, res) => {
  try {
    const userUid = req.userUid;
    const { startDate, endDate } = req.body;

    const start = new Date(`${startDate}T00:00:00Z`);
    const end = new Date(`${endDate}T23:59:59Z`);

    const transactionsRef = collection(db, "transactions");
    const q = query(
      transactionsRef,
      where("userId", "==", userUid),
      where("createdAt", ">=", start.toISOString()),
      where("createdAt", "<=", end.toISOString())
    );
    const querySnapshot = await getDocs(q);

    const transactions = [];
    let totalAmount = 0;
    querySnapshot.forEach((doc) => {
      const transaction = { id: doc.id, ...doc.data() };
      transactions.push(transaction);
      if(transaction.type === "Expense"){
        totalAmount -= transaction.amount;
      } else if (transaction.type === "Income") {
        totalAmount += transaction.amount;
      }
    });

    res.status(200).json({total_amount: totalAmount, transactions: transactions});
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Failed to get transactions by date",
        message: error.message,
      });
  }
};

const editTransaction = async (req, res) => {
  res.status(200).json({ message: "edit transaction api" });
};

const deleteTransaction = async (req, res) => {
  res.status(200).json({ message: "delete transaction api" });
};

module.exports = {
  getAllTransaction,
  getSingleTransaction,
  createNewTransaction,
  createNewTransactionWithOcr,
  getTransactionByType,
  getTransactionByCategory,
  getTransactionByDate,
  editTransaction,
  deleteTransaction,
};
