const express        = require('express');
const router         = express.Router();
const bcrypt         = require('bcryptjs');
const jwt            = require('jsonwebtoken');
const crypto         = require('crypto');
const passport       = require('../config/Passport');
const User           = require('../models/User');
const authMiddleware = require('../middleware/Auth');

const SECRET   = process.env.JWT_SECRET || 'kartavya_secret_change_me';
const FRONTEND = process.env.FRONTEND_URL || 'http://localhost:5173';

const sign = (id) => jwt.sign({ userId: id }, SECRET, { expiresIn: '7d' });

const userDTO = (u) => ({
  id:            u.id,
  name:          u.name,
  email:         u.email,
  createdAt:     u.createdAt,
  oauthProvider: u.oauthProvider || null,  // 'google' | 'github' | null
  hasPassword:   !!u.password,             // true = email account, false = OAuth-only
});

// SIGNUP
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, securityQuestion, securityAnswer } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields are required' });
    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    if (await User.findOne({ where: { email: email.toLowerCase() } }))
      return res.status(409).json({ message: 'Email already registered' });

    const user = await User.create({
      name,
      email:            email.toLowerCase(),
      password:         await bcrypt.hash(password, 12),
      securityQuestion: securityQuestion || null,
      securityAnswer:   securityAnswer ? securityAnswer.trim().toLowerCase() : null,
    });

    res.status(201).json({ token: sign(user.id), user: userDTO(user) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: email?.toLowerCase() } });
    if (!user || !user.password)
      return res.status(401).json({ message: 'Invalid email or password' });
    if (!(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'Invalid email or password' });
    res.json({ token: sign(user.id), user: userDTO(user) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET PROFILE — used by Settings.jsx on mount to get fresh oauthProvider from DB
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: ['id', 'name', 'email', 'createdAt', 'oauthProvider', 'password'],
    });
    if (!user) return res.status(404).json({ message: 'Not found' });
    res.json(userDTO(user));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// CHANGE PASSWORD (email users only)
router.patch('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: 'Both fields required' });
    if (newPassword.length < 6)
      return res.status(400).json({ message: 'Min 6 characters' });
    const user = await User.findByPk(req.userId);
    if (!user.password)
      return res.status(400).json({ message: 'OAuth accounts cannot change password here' });
    if (!(await bcrypt.compare(currentPassword, user.password)))
      return res.status(401).json({ message: 'Current password is incorrect' });
    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});


// GET security question for an email (forgot-password step 1)
router.post('/security-question', async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase();
    const user  = await User.findOne({ where: { email } });
    if (!user || !user.securityQuestion)
      return res.status(404).json({ message: 'No security question found for this email.' });
    res.json({ securityQuestion: user.securityQuestion });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// VERIFY security answer → issue a reset token (forgot-password step 2)
router.post('/verify-security-answer', async (req, res) => {
  try {
    const { email, securityAnswer } = req.body;
    const user = await User.findOne({ where: { email: email?.toLowerCase() } });
    if (!user || !user.securityAnswer)
      return res.status(404).json({ message: 'Account not found' });
    if (user.securityAnswer !== securityAnswer?.trim()?.toLowerCase())
      return res.status(401).json({ message: 'Incorrect answer. Please try again.' });

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken   = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();
    res.json({ resetToken: token });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// UPDATE security question from Settings (email users only — requires current password)
router.patch('/security-question', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, securityQuestion, securityAnswer } = req.body;
    if (!securityQuestion || !securityAnswer)
      return res.status(400).json({ message: 'Question and answer are required' });

    const user = await User.findByPk(req.userId);

    // OAuth users have no local password — skip the password verification step
    const isOAuthOnly = !!user.oauthProvider && !user.password;
    if (!isOAuthOnly) {
      if (!currentPassword)
        return res.status(400).json({ message: 'Current password is required' });
      if (!(await bcrypt.compare(currentPassword, user.password)))
        return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.securityQuestion = securityQuestion;
    user.securityAnswer   = securityAnswer.trim().toLowerCase();
    await user.save();
    res.json({ message: 'Security question updated successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// RESET PASSWORD using token
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const user = await User.findOne({ where: { resetPasswordToken: token } });
    if (!user || new Date() > user.resetPasswordExpires)
      return res.status(400).json({ message: 'Token invalid or expired' });
    if (!newPassword || newPassword.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    user.password             = await bcrypt.hash(newPassword, 12);
    user.resetPasswordToken   = null;
    user.resetPasswordExpires = null;
    await user.save();
    res.json({ message: 'Password reset successfully. You can now log in.' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE ACCOUNT
router.delete('/account', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ message: 'Not found' });
    // OAuth users can delete without a password
    const isOAuthOnly = !!user.oauthProvider && !user.password;
    if (!isOAuthOnly) {
      if (!(await bcrypt.compare(req.body.password || '', user.password)))
        return res.status(401).json({ message: 'Password is incorrect' });
    }
    await user.destroy();
    res.json({ message: 'Account deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});


router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${FRONTEND}/?error=google_failed` }),
  (req, res) => {
    const token = sign(req.user.id);
    const user  = userDTO(req.user);  // includes oauthProvider: 'google'
    res.redirect(`${FRONTEND}/?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`);
  }
);


router.get('/github',
  passport.authenticate('github', { scope: ['user:email'], session: false })
);

router.get('/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: `${FRONTEND}/?error=github_failed` }),
  (req, res) => {
    const token = sign(req.user.id);
    const user  = userDTO(req.user);  // includes oauthProvider: 'github'
    res.redirect(`${FRONTEND}/?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`);
  }
);

module.exports = router;