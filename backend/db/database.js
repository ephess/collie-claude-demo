const sqlite3 = require('sqlite3').verbose();
const path = require('path');

let db;

const initializeDatabase = () => {
  const dbPath = path.join(__dirname, 'standup.db');
  
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening database:', err);
    } else {
      console.log('✅ Connected to SQLite database');
      createTables();
    }
  });
};

const createTables = () => {
  db.serialize(() => {
    // Create users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        avatar_url TEXT
      )
    `, (err) => {
      if (err) console.error('Error creating users table:', err);
      else console.log('✅ Users table ready');
    });
    
    // Create standups table
    db.run(`
      CREATE TABLE IF NOT EXISTS standups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        yesterday TEXT NOT NULL,
        today TEXT NOT NULL,
        blockers TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id),
        UNIQUE(user_id, date)
      )
    `, (err) => {
      if (err) console.error('Error creating standups table:', err);
      else console.log('✅ Standups table ready');
    });
    
    // Create index on date for faster queries
    db.run(`
      CREATE INDEX IF NOT EXISTS idx_standups_date 
      ON standups (date)
    `);
    
    // Create index on user_id for faster joins
    db.run(`
      CREATE INDEX IF NOT EXISTS idx_standups_user_id 
      ON standups (user_id)
    `);
  });
};

const getDb = () => {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase first.');
  }
  return db;
};

const closeDatabase = () => {
  if (db) {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
      } else {
        console.log('Database connection closed');
      }
    });
  }
};

module.exports = {
  initializeDatabase,
  getDb,
  closeDatabase
};