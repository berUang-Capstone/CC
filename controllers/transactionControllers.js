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

    res.status(200).json({ current_balance: userData.balance, transactions});
  } catch (error) {
    console.error("Error getting transactions:", error);
    res.status(500).json({ error: "Failed to get transactions" });
  }
};

const createNewTransaction = async (req, res) => {
  try {
    const userUid = req.userUid;
    const { type, category, amount, name } = req.body;

    const dateCreated = new Date()

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
    console.error("Error creating transaction:", error);
    res.status(500).json({ error: "Failed to create transaction" });
  }
};

const getSingleTransaction = async (req, res) => {
  res.status(200).json({ message: "get single transaction api" });
};

const getTransactionByType = async (req,res) => {
  try {
    const userUid = req.userUid;
    const { type } = req.body;

    const transactionsRef = collection(db, 'transactions');
    const q = query(transactionsRef, where('userId', '==', userUid), where('type', '==', type));
    const querySnapshot = await getDocs(q);

    const transactions = [];
    querySnapshot.forEach(doc => {
        transactions.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(transactions);
} catch (error) {
    console.error('Error getting transactions by type:', error);
    res.status(500).json({ error: 'Failed to get transactions by type' });
}
}

const getTransactionByCategory = async (req,res) => {
  try {
    const userUid = req.userUid;
    const { category } = req.body;

    const transactionsRef = collection(db, 'transactions');
    const q = query(transactionsRef, where('userId', '==', userUid), where('category', '==', category));
    const querySnapshot = await getDocs(q);

    const transactions = [];
    querySnapshot.forEach(doc => {
        transactions.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(transactions);
} catch (error) {
    console.error('Error getting transactions by category:', error);
    res.status(500).json({ error: 'Failed to get transactions by category' });
}
}

const getTransactionByDate = async (req,res) => {
  try {
    const userUid = req.userUid;
    const { startDate, endDate } = req.body;

    const transactionsRef = collection(db, 'transactions');
    const q = query(transactionsRef, 
        where('userId', '==', userUid), 
        where('createdAt', '>=', new Date(startDate).toISOString()),
        where('createdAt', '<=', new Date(endDate).toISOString())
    );
    const querySnapshot = await getDocs(q);

    const transactions = [];
    querySnapshot.forEach(doc => {
        transactions.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(transactions);
} catch (error) {
    console.error('Error getting transactions by date:', error);
    res.status(500).json({ error: 'Failed to get transactions by date' });
}
}

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
  getTransactionByType,
  getTransactionByCategory,
  getTransactionByDate,
  editTransaction,
  deleteTransaction,
};
