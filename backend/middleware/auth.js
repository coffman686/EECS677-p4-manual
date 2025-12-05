// middleware for authentication using JWT tokens

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'DEV_SECRET'; // use env var if available, else default (must set in production)

// function to authenticate JWT token from Authorization header
// If valid, attaches user info to req.user
function authenticateToken(req, res, next) {
 
  const authHeader = req.headers['authorization']; // get Authorization header
  const token = authHeader && authHeader.split(' ')[1]; // extract token from "Bearer <token>" format

  if (!token) { // check if token is available
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => { // verify the token
    // verification failed
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    // token is valid, attach user info to request object
    req.user = user;

    next();
  });
}

// middleware to check if user is admin
function requireAdmin(req, res, next) {
  // if no user info or user is not admin
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' }); // deny admin access
  }

  next();
}

module.exports = { authenticateToken, requireAdmin, JWT_SECRET };
