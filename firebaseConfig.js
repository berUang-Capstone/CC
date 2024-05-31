const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://beruang-88d9c-default-rtdb.asia-southeast1.firebasedatabase.app/"
});

const db = admin.firestore();

module.exports = { admin, db };
