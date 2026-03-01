const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer '))
    return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(
      authHeader.split(' ')[1],
      process.env.JWT_SECRET || 'kartavya_secret_change_me'
    );
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ message: 'Token invalid or expired' });
  }
};