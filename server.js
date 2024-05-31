const express = require('express');
const bodyParser = require('body-parser');
const { admin, db } = require('./firebaseConfig');
const { firebaseAuth } = require('./firebaseClientConfig'); // Import firebaseAuth instead of firebaseApp
const { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} = require('firebase/auth');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Registration endpoint
app.post('/register', async (req, res) => {
    const { email, password, displayName } = req.body;
    console.log(email, password, displayName);

    try {
        // Create user with Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
        const userRecord = userCredential.user;

        // Add user data to Firestore
        await db.collection('users').doc(userRecord.uid).set({
            email,
            displayName
        });

        res.status(201).send({ message: 'User registered successfully', user: userRecord });
    } catch (error) {
        console.error(error);  // Log the error for debugging
        res.status(400).send({ message: 'Error registering user', error: error.message });
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Sign in user with Firebase Authentication
        const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
        const user = userCredential.user;
        const token = await user.getIdToken();

        console.log(token);

        res.status(200).send({ message: 'User logged in successfully', user: user });
    } catch (error) {
        console.error(error);  // Log the error for debugging
        res.status(400).send({ message: 'Error logging in user', error: error.message });
    }
});

// Logout endpoint
app.post('/logout', async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send({ message: 'Authorization header missing or incorrect' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verify the ID token to get the user's UID
        const decodedToken = await admin.auth().verifyIdToken(token);
        const uid = decodedToken.uid;

        // Revoke refresh tokens for the user
        await admin.auth().revokeRefreshTokens(uid);

        res.status(200).send({ message: 'User logged out successfully' });
    } catch (error) {
        console.error(error);  // Log the error for debugging
        res.status(400).send({ message: 'Error logging out user', error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
