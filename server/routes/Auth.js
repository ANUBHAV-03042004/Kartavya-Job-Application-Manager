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



const express        = require('express');
const router         = express.Router();
const bcrypt         = require('bcryptjs');
const jwt            = require('jsonwebtoken');
const crypto         = require('crypto');
const User           = require('../models/User');
const authMiddleware = require('../middleware/Auth');

const SECRET  = process.env.JWT_SECRET || 'kartavya_secret_change_me';
const sign    = (id) => jwt.sign({ userId: id }, SECRET, { expiresIn: '7d' });
const userDTO = (u)  => ({ id: u.id, name: u.name, email: u.email, createdAt: u.createdAt });

// SIGNUP
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields are required' });
    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });

    if (await User.findOne({ where: { email: email.toLowerCase() } }))
      return res.status(409).json({ message: 'Email already registered' });

    const user = await User.create({
      name,
      email:    email.toLowerCase(),
      password: await bcrypt.hash(password, 12),
    });
    res.status(201).json({ token: sign(user.id), user: userDTO(user) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: email?.toLowerCase() } });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'Invalid email or password' });
    res.json({ token: sign(user.id), user: userDTO(user) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET PROFILE
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, { attributes: ['id','name','email','createdAt'] });
    if (!user) return res.status(404).json({ message: 'Not found' });
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// CHANGE PASSWORD
router.patch('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: 'Both fields required' });
    if (newPassword.length < 6)
      return res.status(400).json({ message: 'Min 6 characters' });
    const user = await User.findByPk(req.userId);
    if (!(await bcrypt.compare(currentPassword, user.password)))
      return res.status(401).json({ message: 'Current password is incorrect' });
    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// FORGOT PASSWORD
router.post('/forgot-password', async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email?.toLowerCase() } });
    if (!user) return res.json({ message: 'If that email exists a reset token was sent.' });
    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken   = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600000);
    await user.save();
    // TODO: send email in production
    res.json({ message: 'Reset token generated.', resetToken: token });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// RESET PASSWORD
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const user = await User.findOne({ where: { resetPasswordToken: token } });
    if (!user || new Date() > user.resetPasswordExpires)
      return res.status(400).json({ message: 'Token invalid or expired' });
    user.password             = await bcrypt.hash(newPassword, 12);
    user.resetPasswordToken   = null;
    user.resetPasswordExpires = null;
    await user.save();
    res.json({ message: 'Password reset. You can now log in.' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE ACCOUNT
router.delete('/account', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ message: 'Not found' });
    if (!(await bcrypt.compare(req.body.password, user.password)))
      return res.status(401).json({ message: 'Password is incorrect' });
    await user.destroy();
    res.json({ message: 'Account deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;