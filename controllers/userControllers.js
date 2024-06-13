const { auth, db } = require('../store/firebase')

const { doc, setDoc } = require('firebase/firestore')

const getUser = async (req, res) => {
  try {
    
    res
    .status(201)
    .send({ message: 'Get User Success!'})
  } catch (e) {
    console.log(e.message)
  }
}

module.exports = {
  getUser,

}