// datebase connection setup file

// import better-sqlite3 module for SQLite database handling
const Database = require('better-sqlite3');
const path = require('path'); // import path module for file path manipulations

const DB_PATH = path.join(__dirname, '..', 'database.sqlite'); // path to SQLite database file

let db = null; // variable to hold the database connection

// function to get the database connection
function getDatabase() {
  if (!db) { // check if we have connection already
    db = new Database(DB_PATH); // create new database connection

    db.pragma('foreign_keys = ON'); // enable foreign key constraints
  }


  return db;
}
module.exports = { getDatabase };
