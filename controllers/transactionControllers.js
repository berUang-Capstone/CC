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
const axios = require("axios");
const FormData = require("form-data");

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

    res.status(200).json({
      current_balance: userData.balance,
      total_transactions: transactions.length,
      transactions: transactions,
    });
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

    const walletDocRef = doc(db, "wallets", userUid);
    let walletData = (await getDoc(walletDocRef)).data();

    if (type === "Income") {
      walletData.balance += amount;
      walletData.income += amount;
      if (category === "Salary") {
        walletData.salary += amount;
      } else if (category === "Bonus") {
        walletData.bonus += amount;
      } else if (category === "Invesment") {
        walletData.invesment += amount;
      }
    } else if (type === "Expense") {
      walletData.balance -= amount;
      walletData.expense += amount;
      if (category === "Food") {
        walletData.food += amount;
      } else if (category === "Transportation") {
        walletData.transportation += amount;
      } else if (category === "Shopping") {
        walletData.shopping += amount;
      } else if (category === "Others") {
        walletData.others += amount;
      }
    }

    await updateDoc(userDocRef, userData);
    await updateDoc(walletDocRef, walletData);

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
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imageBlob = await axios.get(file.path, {
      responseType: "arraybuffer",
    });

    const formData = new FormData();
    formData.append("file", imageBlob.data, { filename: file.filename });

    const ocrResponse = await axios.post(
      "https://textrecog2-jligp2udmq-et.a.run.app/",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      }
    );

    const items = ocrResponse.data;

    const transactions = [];

    for (const item of items) {
      const { name, amount } = item;

      const body = {
        text: name,
      };

      const categoryClassifierResponse = await axios.post(
        "https://api2-jligp2udmq-et.a.run.app/predict",
        body,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const transaction = {
        name,
        amount,
        userId: userUid,
        type: "Expense",
        category:
          categoryClassifierResponse.data.class_predicted === "Belanja"
            ? "Shopping"
            : categoryClassifierResponse.data.class_predicted === "other"
            ? "Others"
            : categoryClassifierResponse.data.class_predicted === "Transportasi"
            ? "Transportation" : categoryClassifierResponse.data.class_predicted,
        createdAt: new Date().toISOString(),
      };

      const transactionRef = await addDoc(
        collection(db, "transactions"),
        transaction
      );

      transactions.push({ id: transactionRef.id, ...transaction });

      const userDocRef = doc(db, "users", userUid);
      let userData = (await getDoc(userDocRef)).data();
      if (transaction.type === "Income") {
        userData.balance += amount;
      } else if (transaction.type === "Expense") {
        userData.balance -= amount;
      }

      await updateDoc(userDocRef, userData);

      const walletDocRef = doc(db, "wallets", userUid);
      let walletData = (await getDoc(walletDocRef)).data();

      let type = transaction.type;
      let category = transaction.category;

      if (type === "Income") {
        walletData.balance += amount;
        walletData.income += amount;
        if (category === "Salary") {
          walletData.salary += amount;
        } else if (category === "Bonus") {
          walletData.bonus += amount;
        } else if (category === "Invesment") {
          walletData.invesment += amount;
        }
      } else if (type === "Expense") {
        walletData.balance -= amount;
        walletData.expense += amount;
        if (category === "Food") {
          walletData.food += amount;
        } else if (category === "Transportation") {
          walletData.transportation += amount;
        } else if (category === "Shopping") {
          walletData.shopping += amount;
        } else if (category === "Others") {
          walletData.others += amount;
        }
      }

      await updateDoc(walletDocRef, walletData);
    }

    res.status(201).json({
      message: "Transaction created successfully",
      total_transactions: transactions.length,
      transactions: transactions,
    });
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
      totalAmount += transaction.amount;
    });

    res.status(200).json({
      total_amount: totalAmount,
      total_transactions: transactions.length,
      transactions: transactions,
    });
  } catch (error) {
    res.status(500).json({
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

    res.status(200).json({
      total_amount: totalAmount,
      total_transactions: transactions.length,
      transactions: transactions,
    });
  } catch (error) {
    res.status(500).json({
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
      if (transaction.type === "Expense") {
        totalAmount -= transaction.amount;
      } else if (transaction.type === "Income") {
        totalAmount += transaction.amount;
      }
    });

    res.status(200).json({
      total_amount: totalAmount,
      total_transactions: transactions.length,
      transactions: transactions,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to get transactions by date",
      message: error.message,
    });
  }
};

const editTransaction = async (req, res) => {
  try {
    const userUid = req.userUid;
    const { trxId } = req.params;
    const { category, amount, name } = req.body;

    // Transaction
    const trxDocRef = doc(db, "transactions", trxId);
    let trxData = (await getDoc(trxDocRef)).data();
    console.log(trxData)

    if (trxData.userId != userUid) {
      res
      .status(500)
      .json({ error: "Failed to update transaction", message: "You are not allowed to update this transaction" });

      return
    }

    let amountDiff = trxData.amount - amount

    // User
    const userDocRef = doc(db, "users", userUid);
    let userData = (await getDoc(userDocRef)).data();
    if (trxData.type === "Income") {
      userData.balance -= amountDiff;
    } else if (type === "Expense") {
      userData.balance += amountDiff;
    }

    // Wallet
    const walletDocRef = doc(db, "wallets", userUid);
    let walletData = (await getDoc(walletDocRef)).data();

    if (trxData.type === "Income") {
      walletData.balance -= amountDiff
      walletData.income -= amountDiff

      if (trxData.category == category) {
        if (category === "Salary") {
          walletData.salary -= amountDiff;
        } else if (category === "Bonus") {
          walletData.bonus -= amountDiff;
        } else if (category === "Invesment") {
          walletData.invesment -= amountDiff;
        }
      } 
      else {
        if (trxData.category === "Salary") {
          walletData.salary -= trxData.amount;
        } else if (trxData.category === "Bonus") {
          walletData.bonus -= trxData.amount;
        } else if (trxData.category === "Invesment") {
          walletData.invesment -= trxData.amount;
        }

        if (category === "Salary") {
          walletData.salary += amount;
        } else if (category === "Bonus") {
          walletData.bonus += amount;
        } else if (category === "Invesment") {
          walletData.invesment += amount;
        }
      }
    } else if (trxData.type === "Expense") {
      walletData.balance += amountDiff;
      walletData.expense -= amountDiff;

      if (trxData.category == category) {
        if (category === "Food") {
          walletData.food -= amountDiff;
        } else if (category === "Transportation") {
          walletData.transportation -= amountDiff;
        } else if (category === "Shopping") {
          walletData.shopping -= amountDiff;
        } else if (category === "Others") {
          walletData.others -= amountDiff;
        }
      }
      else {
        if (trxData.category === "Food") {
          walletData.food -= trxData.amount;
        } else if (trxData.category === "Transportation") {
          walletData.transportation -= trxData.amount;
        } else if (trxData.category === "Shopping") {
          walletData.shopping -= trxData.amount;
        } else if (trxData.category === "Others") {
          walletData.others -= trxData.amount;
        }

        if (category === "Food") {
          walletData.food += amount;
        } else if (category === "Transportation") {
          walletData.transportation += amount;
        } else if (category === "Shopping") {
          walletData.shopping += amount;
        } else if (category === "Others") {
          walletData.others += amount;
        }
      }
    }

    trxData.category = category
    trxData.amount = amount
    trxData.name = name

    await updateDoc(trxDocRef, trxData);
    await updateDoc(userDocRef, userData);
    await updateDoc(walletDocRef, walletData);

    res
      .status(200)
      .json({ message: "Transaction updated successfully", id: trxId });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update transaction", message: error.message });
  }

  // res.status(200).json({ message: "edit transaction api" });
};

const deleteTransaction = async (req, res) => {
  try {
    const userUid = req.userUid;
    const { trxId } = req.params;

    // Transaction
    const trxDocRef = doc(db, "transactions", trxId);
    let trxData = (await getDoc(trxDocRef)).data();

    if (trxData.userId != userUid) {
      res
      .status(500)
      .json({ error: "Failed to delete transaction", message: "You are not allowed to delete this transaction" });

      return
    }

    // User
    const userDocRef = doc(db, "users", userUid);
    let userData = (await getDoc(userDocRef)).data();
    if (trxData.type === "Income") {
      userData.balance -= trxData.amount;
    } else if (type === "Expense") {
      userData.balance += trxData.amount;
    }

    // Wallet
    const walletDocRef = doc(db, "wallets", userUid);
    let walletData = (await getDoc(walletDocRef)).data();

    if (trxData.type === "Income") {
      walletData.balance -= trxData.amount
      walletData.income -= trxData.amount

      if (trxData.category === "Salary") {
        walletData.salary -= trxData.amount;
      } else if (trxData.category === "Bonus") {
        walletData.bonus -= trxData.amount;
      } else if (trxData.category === "Invesment") {
        walletData.invesment -= trxData.amount;
      }
    } else if (trxData.type === "Expense") {
      walletData.balance += trxData.amount;
      walletData.expense -= trxData.amount;

      if (trxData.category === "Food") {
        walletData.food -= trxData.amount;
      } else if (trxData.category === "Transportation") {
        walletData.transportation -= trxData.amount;
      } else if (trxData.category === "Shopping") {
        walletData.shopping -= trxData.amount;
      } else if (trxData.category === "Others") {
        walletData.others -= trxData.amount;
      }
    }

    await updateDoc(userDocRef, userData);
    await updateDoc(walletDocRef, walletData);
    await deleteDoc(trxDocRef)

    res
      .status(200)
      .json({ message: "Transaction deleted successfully", id: trxId });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete transaction", message: error.message });
  }

  // res.status(200).json({ message: "delete transaction api" });
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
