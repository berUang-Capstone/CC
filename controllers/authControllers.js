const { auth, db } = require('../store/firebase')

const { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } = require('firebase/auth')
const { doc, setDoc } = require('firebase/firestore')

const register = async (req, res) => {
  try {
    const { email, password } = req.body
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const userData = {
      email: email,
      balance: 0
    };

    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, userData);

    res
    .status(201)
    .send({ message: 'User registered successfully'})
  } catch (e) {
    console.log(e.message)
  }
}

const login = async (req,res) => {
  try {
    const { email, password } = req.body;
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    res.status(200).send({ 
      message: 'Login successful', 
      user: { email: user.email, uid: user.uid } 
    });
  } catch (error) {
    res.status(401).send({ error: 'Login failed. Please check your email and password.', message: error.message });
  }
}

const logout = async (req, res) => {
  try {
    await signOut(auth);
    res.status(200).send({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).send({ error: 'Logout failed. Please try again.', message: error.message});
  }
}

module.exports = {
  register,
  login,
  logout
}