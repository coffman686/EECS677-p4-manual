// backend/initDB.js

const Database = require('better-sqlite3'); // import better-sqlite3 module
const bcrypt = require('bcrypt'); // use bcrypt for password hashing
const path = require('path'); // import path module for file path manipulations
const DB_PATH = path.join(__dirname, 'database.sqlite'); // path to SQLite database file

// initialize the database
// this function creates tables and an admin user if they don't exist
async function initDatabase() {
  const db = new Database(DB_PATH);
  db.pragma('foreign_keys = ON');

  // create users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      is_admin INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // create articles table
  db.exec(`
    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      url TEXT NOT NULL,
      title TEXT,
      user_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // check if admin user exists
  const adminExists = db.prepare('SELECT id FROM users WHERE username = ?').get('admin');

  // if not, create admin user with hashed password
  if (!adminExists) {
    const saltRounds = 12; // number of salt rounds for bcrypt
    const hashedPassword = await bcrypt.hash('admin', saltRounds); // hash the password 'admin'

    // insert admin user into users table
    db.prepare('INSERT INTO users (username, password_hash, is_admin) VALUES (?, ?, 1)')
      .run('admin', hashedPassword);

    console.log('Admin user created successfully');
  } else {
    console.log('Admin user already exists');
  }

  // close the database connection
  db.close();

  console.log('Database initialized successfully');
}

initDatabase().catch(console.error);
