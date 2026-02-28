// routes/auth.js
// const express = require('express');
// const router = express.Router();
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// // SIGNUP
// router.post('/signup', async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     if (!name || !email || !password)
//       return res.status(400).json({ message: 'All fields are required' });

//     const existing = await User.findOne({ where: { email } });
//     if (existing)
//       return res.status(409).json({ message: 'Email already registered' });

//     const hashed = await bcrypt.hash(password, 10);
//     const user = await User.create({ name, email, password: hashed });

//     const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
//     res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // LOGIN
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ where: { email } });
//     if (!user)
//       return res.status(401).json({ message: 'Invalid email or password' });

//     const match = await bcrypt.compare(password, user.password);
//     if (!match)
//       return res.status(401).json({ message: 'Invalid email or password' });

//     const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
//     res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;





// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

const makeToken = (userId) => {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: TOKEN_TTL_SECONDS });
  // expiresAt in ms — sent to client so it can self-manage expiry
  const expiresAt = Date.now() + TOKEN_TTL_SECONDS * 1000;
  return { token, expiresAt };
};

// SIGNUP
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields are required' });

    const existing = await User.findOne({ where: { email } });
    if (existing)
      return res.status(409).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    const { token, expiresAt } = makeToken(user.id);
    res.status(201).json({
      token,
      expiresAt,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(401).json({ message: 'Invalid email or password' });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ message: 'Invalid email or password' });

    const { token, expiresAt } = makeToken(user.id);
    res.json({
      token,
      expiresAt,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;