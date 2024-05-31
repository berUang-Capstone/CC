const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

// Inisialisasi Firebase Admin SDK
const serviceAccount = require('./firebase/serviceAccountKey.json'); 
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Middleware untuk melakukan auth request
const authenticate = async (req, res, next) => {
    try {
      const { authorization } = req.headers;
      if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
      }
      const token = authorization.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken;
      next();
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(401).json({ error: 'Unauthorized' });
    }
};

// Routes
app.post('/signup', async (req, res) => {
    try {
      const { email, password } = req.body;
      // Buat pengguna baru menggunakan Firebase Authentication
      const userRecord = await admin.auth().createUser({
        email,
        password,
      });
      // Setelah berhasil membuat pengguna, buat token JWT
      const token = await admin.auth().createCustomToken(userRecord.uid);
      // Kirim respons yang berisi token JWT dan informasi pengguna
      res.status(201).json({ message: 'Signup successful', user: userRecord, token: token });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ error: 'Signup failed' });
    }
});

app.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const userRecord = await admin.auth().getUserByEmail(email);
      const token = await admin.auth().createCustomToken(userRecord.uid);
      res.status(200).json({ message: 'Login successful', user: userRecord, token: token });
    } catch (error) {
      console.error('Login error:', error);
      res.status(401).json({ error: 'Login failed' });
    }
});

app.post('/logout', authenticate, async (req, res) => {
    try {
      if (!req.user || !req.user.uid) {
        return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
      }
      await admin.auth().revokeRefreshTokens(req.user.uid);
      res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ error: 'Logout failed' });
    }
});

app.get('/protected', authenticate, (req, res) => {
  res.status(200).json({ message: 'Protected route accessed', user: req.user });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
