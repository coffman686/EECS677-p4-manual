// auth routes: register, login, get current user info

const express = require('express'); // import express module for routing
const router = express.Router(); // create router instance
const bcrypt = require('bcrypt'); // use bcrypt for password hashing
const jwt = require('jsonwebtoken'); // use jsonwebtoken for JWT handling and creating tokens

const { getDatabase } = require('../db/database'); // import database connection function to run queries
const { authenticateToken, JWT_SECRET } = require('../middleware/auth'); // import auth middleware and JWT secret

// register route to create a new user
router.post('/register', async (req, res) => {

  try {
    const { username, password } = req.body;

    if (!username || !password) { // need both username and password
      return res.status(400).json({ error: 'Username and password are required' });
    }

    if (username.length < 5 || username.length > 20) { // username between 5 and 20 characters
      return res.status(400).json({ error: 'Username must be between 3 and 30 characters' });
    }

    if (password.length < 8) { // password at least 8 characters
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const db = getDatabase(); // get database connection
    const existingUser = db.prepare('SELECT id FROM users WHERE username = ?').get(username); 
    
    // check if username already exists
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    // hash the password before storing
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // insert new user into database
    const result = db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').run(username, passwordHash); // use ? placeholders to prevent SQL injection
    res.status(201).json({ message: 'User created successfully', userId: result.lastInsertRowid });

  } catch (error) { // catch any errors
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// login route to authenticate user and return JWT token
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body; // extract username and password from request body

    // require both username and password
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const db = getDatabase(); // get db connection
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username); // fetch user by username

    // make sure user exists
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // compare provided password with stored hashed password
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // create JWT token with user info
    const token = jwt.sign(
      { id: user.id, username: user.username, isAdmin: user.is_admin === 1 },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // return token and user info (excluding password hash)
    res.json({ token, user: { id: user.id, username: user.username, isAdmin: user.is_admin === 1 } });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// route to get current user info based on provided JWT token
router.get('/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
