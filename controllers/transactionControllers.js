const { db } = require('../firebase/firebaseConfig');

const getAllTransaction = async (req, res) => {
    try {
        const snapshot = await db.collection('transactions').where('userId', '==', req.user.uid).get();
        const transactions = [];
        snapshot.forEach(doc => {
            transactions.push({ id: doc.id, createdAt:  new Date((doc.createTime.seconds + doc.createTime.nanoseconds/10000000000)*1000),...doc.data() });
        });
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//kalo mau get satu transaction bisa pake http://localhost:3000/api/v1/transaction/single?id=<transactionId>
const getSingleTransaction = async (req, res) => {
    try {
        const transactionId = req.query.id;
        const doc = await db.collection('transactions').doc(transactionId).get();
        if (!doc.exists || doc.data().userId !== req.user.uid) {
            return res.status(404).json({ message: 'Transaction not found or unauthorized' });
        }
        res.status(200).json({ id: doc.id, ...doc.data() });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const createNewTransaction = async (req, res) => {
    try {
        const data = req.body;
        data.userId = req.user.uid;
        data.dateCreated = new Date()
        const ref = await db.collection('transactions').add(data);
        res.status(201).json({ id: ref.id, ...data });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//bisa kalo pake put http://localhost:3000/api/v1/transaction/edit
//{
// "id": "c10zVCMhtN7oLjDsOLB8",
//  "amount": 150000,
//  "name": "Nasi Goreng Rizki"
// }

const editTransaction = async (req, res) => {
    try {
        const transactionId = req.body.id;
        const data = req.body;
        delete data.id;
        const ref = db.collection('transactions').doc(transactionId);

        const doc = await ref.get();
        if (!doc.exists || doc.data().userId !== req.user.uid) {
            return res.status(404).json({ message: 'Transaction not found or unauthorized' });
        }

        await ref.update(data);
        res.status(200).json({ message: 'Transaction updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//bisa diakses kalo pake http://localhost:3000/api/v1/transaction/delete?id=<transactionId>)
const deleteTransaction = async (req, res) => {
    try {
        const transactionId = req.query.id;
        const ref = db.collection('transactions').doc(transactionId);

        const doc = await ref.get();
        if (!doc.exists || doc.data().userId !== req.user.uid) {
            return res.status(404).json({ message: 'Transaction not found or unauthorized' });
        }

        await ref.delete();
        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// belum kepikiran gimana caranya
const getTransactionsByWeek = async (req, res) => {
    try {
        const { startOfWeek, endOfWeek } = req.query;
        const snapshot = await db.collection('transactions')
            .where('userId', '==', req.user.uid)
            .where('dateCreated', '>=', new Date(startOfWeek))
            .where('dateCreated', '<=', new Date(endOfWeek))
            .get();
        const transactions = [];
        snapshot.forEach(doc => {
            transactions.push({ id: doc.id, ...doc.data() });
        });
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    getAllTransaction,
    getSingleTransaction,
    createNewTransaction,
    editTransaction,
    deleteTransaction,
    getTransactionsByWeek
};
