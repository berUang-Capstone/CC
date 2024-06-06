const { admin } = require('../firebase/firebaseConfig');

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send({ message: 'Authorization header missing or incorrect' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error(error);
        res.status(403).send({ message: 'Unauthorized', error: error.message });
    }
};

module.exports = {
    verifyToken
};
