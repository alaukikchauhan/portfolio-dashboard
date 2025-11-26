import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  investments: [{
    type: { type: String, enum: ['stock', 'mutualfund'], required: true },
    symbol: { type: String, required: true },
    quantity: { type: Number, required: true },
    purchasePrice: { type: Number, required: true },
    currentPrice: { type: Number, default: 0 },
    purchaseDate: { type: Date, default: Date.now },
    dividends: { type: Number, default: 0 },
  }],
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

export default Portfolio;
