import express from 'express';
import Portfolio from '../models/Portfolio';
import Transaction from '../models/Transaction';
import auth from '../middleware/auth';

const router = express.Router();

router.get('/', auth, async (req: any, res) => {
  try {
    const portfolios = await Portfolio.find({ user: req.user.id });
    res.json(portfolios);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching portfolios' });
  }
});

router.post('/create', auth, async (req: any, res) => {
  const { name } = req.body;
  try {
    const portfolio = new Portfolio({ user: req.user.id, name, investments: [] });
    await portfolio.save();
    res.status(201).json(portfolio);
  } catch (error) {
    res.status(400).json({ message: 'Error creating portfolio' });
  }
});

router.post('/add-investment', auth, async (req: any, res) => {
  const { portfolioId, type, symbol, quantity, purchasePrice } = req.body;
  try {
    const portfolio = await Portfolio.findById(portfolioId);
    if (!portfolio || portfolio.user.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    portfolio.investments.push({
      type,
      symbol,
      quantity,
      purchasePrice,
      purchaseDate: new Date(),
      currentPrice: purchasePrice, // Start with purchase price as current
    });
    await portfolio.save();

    const transaction = new Transaction({
      user: req.user.id,
      portfolio: portfolioId,
      type: 'buy',
      symbol,
      quantity,
      price: purchasePrice,
    });
    await transaction.save();

    res.json(portfolio);
  } catch (error) {
    res.status(400).json({ message: 'Error adding investment' });
  }
});

router.put('/update-investment', auth, async (req: any, res) => {
  const { portfolioId, investmentIndex, quantity, currentPrice } = req.body;
  try {
    const portfolio = await Portfolio.findById(portfolioId);
    if (!portfolio || portfolio.user.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    if (investmentIndex < 0 || investmentIndex >= portfolio.investments.length) {
      return res.status(400).json({ message: 'Invalid investment index' });
    }

    portfolio.investments[investmentIndex].quantity = quantity;
    portfolio.investments[investmentIndex].currentPrice = currentPrice;
    await portfolio.save();

    res.json(portfolio);
  } catch (error) {
    res.status(400).json({ message: 'Error updating investment' });
  }
});

router.delete('/remove-investment/:portfolioId/:investmentIndex', auth, async (req: any, res) => {
  const { portfolioId, investmentIndex } = req.params;
  try {
    const portfolio = await Portfolio.findById(portfolioId);
    if (!portfolio || portfolio.user.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    const idx = parseInt(investmentIndex);
    if (idx < 0 || idx >= portfolio.investments.length) {
      return res.status(400).json({ message: 'Invalid investment index' });
    }

    portfolio.investments.splice(idx, 1);
    await portfolio.save();

    res.json(portfolio);
  } catch (error) {
    res.status(400).json({ message: 'Error removing investment' });
  }

});

export default router;
