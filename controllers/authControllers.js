const { admin, db } = require('../firebase/firebaseConfig')
const { firebaseAuth } = require('../firebase/firebaseClientConfig')

const { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} = require('firebase/auth');

const register = async (req, res) => {
  const { email, password, displayName } = req.body
  console.log(email, password, displayName)

  try {
    // Membuat pengguna baru dengan Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    )
    const userRecord = userCredential.user

    // Menambahkan data pengguna ke Firestore
    await db.collection('users').doc(userRecord.uid).set({
      email,
      displayName,
    })

    res
      .status(201)
      .send({ message: 'User registered successfully', user: userRecord })
  } catch (error) {
    console.error(error) // Log error untuk debugging
    res
      .status(400)
      .send({ message: 'Error registering user', error: error.message })
  }
}

const login = async (req,res) => {
  const { email, password } = req.body;

    try {
        // Masuk pengguna dengan Firebase Authentication
        const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
        const user = userCredential.user;
        const token = await user.getIdToken();

        console.log(token);

        res.status(200).send({ message: 'User logged in successfully', user: user });
    } catch (error) {
        console.error(error);  // Log error untuk debugging
        res.status(400).send({ message: 'Error logging in user', error: error.message });
    }
}

const logout = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).send({ message: 'Authorization header missing or incorrect' });
  }

  const token = authHeader.split(' ')[1];

  try {
      // Verifikasi token ID untuk mendapatkan UID pengguna
      const decodedToken = await admin.auth().verifyIdToken(token);
      const uid = decodedToken.uid;

      // Mencabut refresh token untuk pengguna
      await admin.auth().revokeRefreshTokens(uid);

      res.status(200).send({ message: 'User logged out successfully' });
  } catch (error) {
      console.error(error);  // Log error untuk debugging
      res.status(400).send({ message: 'Error logging out user', error: error.message });
  }
}

module.exports = {
  register,
  login,
  logout
}