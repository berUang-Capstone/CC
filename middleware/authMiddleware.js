const { auth } = require('../store/firebase')

const verifyIsLoggedIn = async (req, res, next) => {
    if(auth.currentUser){
        console.log(auth.currentUser.uid)
        req.userUid = auth.currentUser.uid
        next()
    } else {
        res.status(401).send({ error: 'Unauthorized. User not logged in.' });
    }
};

module.exports = {
    verifyIsLoggedIn
};
