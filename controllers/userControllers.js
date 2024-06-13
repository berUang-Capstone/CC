const { auth, db } = require("../store/firebase");

const {
  doc,
  getDoc,
} = require("firebase/firestore");

const getUserWallet = async (req, res) => {
  try {
    const userUid = req.userUid;

    const walletDocRef = doc(db, "wallets", userUid);
    let userWalletData = (await getDoc(walletDocRef)).data();

    res
      .status(201)
      .send({ message: "Get User Wallet Success!", wallet: userWalletData });
  } catch (e) {
    console.log(e.message);
  }
};

module.exports = {
  getUserWallet,
};
