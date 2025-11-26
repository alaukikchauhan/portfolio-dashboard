import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Portfolio from '../models/Portfolio';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    const defaultPortfolio = new Portfolio({
      user: user._id,
      name: 'My Portfolio',
      investments: []
    });
    await defaultPortfolio.save();

    res.status(201).json({ message: 'User registered successfully'} );
  } catch (error) {
    res.status(400).json({ message: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
});

export default router;
