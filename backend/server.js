// file to start backend server

const express = require('express'); // import express module to create server and handle routing
const helmet = require('helmet'); // import helmet module to enhance security, like setting HTTP headers, hiding tech stack info, etc.
const cors = require('cors'); // import cors module to handle Cross-Origin Resource Sharing
const rateLimit = require('express-rate-limit'); // import rate limiting middleware to prevent abuse

const authRoutes = require('./routes/auth'); // import authentication routes
//onst articleRoutes = require('./routes/articles'); TODO: add article routes later

const app = express(); // create express app instance
const PORT = process.env.PORT || 3001; // use env var PORT if available, else default to 3001

app.use(helmet()); // security middleware to set various HTTP headers for protection

app.use(cors({ origin: 'http://localhost:3000', credentials: true })); // enable CORS for frontend running on localhost:3000

app.use(express.json()); // middleware to parse JSON request bodies

// rate limiter to limit repeated requests to public APIs and endpoints
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use(limiter); //apply rate limiting to all requests

app.use('/api/auth', authRoutes); // mount auth routes at /api/auth

// app.use('/api/articles', articleRoutes); TODO: add article routes later

// health check endpoint to check server status
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// actually start the server and listen on specified PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
