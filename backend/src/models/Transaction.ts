import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  portfolio: { type: mongoose.Schema.Types.ObjectId, ref: 'Portfolio', required: true },
  type: { type: String, enum: ['buy', 'sell'], required: true },
  symbol: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
