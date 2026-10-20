const jwt = require('jsonwebtoken');

// Verifies the incoming Bearer token
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer <TOKEN>"

  if (!token) {
    return res.status(401).json({ error: 'Access denied: Please log in' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Enforces role-based permissions for Manager accounts
const requireManager = (req, res, next) => {
  if (req.user && req.user.role === 'Manager') {
    next();
  } else {
    res.status(403).json({ error: 'Forbidden: Manager access required' });
  }
};

module.exports = { authenticate, requireManager };