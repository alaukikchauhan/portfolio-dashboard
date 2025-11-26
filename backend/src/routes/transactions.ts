import express from 'express';
import Transaction from '../models/Transaction';
import auth from '../middleware/auth';

const router = express.Router();

router.get('/', auth, async (req: any, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions' });
  }
});

export default router;