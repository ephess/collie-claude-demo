const express = require('express');
const router = express.Router();
const { getDb } = require('../db/database');

// GET all standups (with optional date filter)
router.get('/', async (req, res) => {
  try {
    const { date } = req.query;
    const db = getDb();
    
    let query = `
      SELECT s.*, u.name, u.role, u.avatar_url 
      FROM standups s 
      JOIN users u ON s.user_id = u.id
    `;
    
    const params = [];
    if (date) {
      query += ' WHERE s.date = ?';
      params.push(date);
    }
    
    query += ' ORDER BY s.date DESC, s.created_at DESC';
    
    const standups = await new Promise((resolve, reject) => {
      db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    
    res.json(standups);
  } catch (error) {
    console.error('Error fetching standups:', error);
    res.status(500).json({ error: 'Failed to fetch standups' });
  }
});

// GET standups by date
router.get('/date/:date', async (req, res) => {
  try {
    const db = getDb();
    const standups = await new Promise((resolve, reject) => {
      db.all(
        `SELECT s.*, u.name, u.role, u.avatar_url 
         FROM standups s 
         JOIN users u ON s.user_id = u.id 
         WHERE s.date = ? 
         ORDER BY u.name`,
        [req.params.date],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
    
    res.json(standups);
  } catch (error) {
    console.error('Error fetching standups by date:', error);
    res.status(500).json({ error: 'Failed to fetch standups' });
  }
});

// GET standups for a specific week
router.get('/week/:startDate', async (req, res) => {
  try {
    const db = getDb();
    const startDate = req.params.startDate;
    
    // Calculate end date (7 days from start)
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    const endDate = end.toISOString().split('T')[0];
    
    const standups = await new Promise((resolve, reject) => {
      db.all(
        `SELECT s.date, s.user_id, u.name 
         FROM standups s 
         JOIN users u ON s.user_id = u.id 
         WHERE s.date >= ? AND s.date <= ? 
         ORDER BY s.date, u.name`,
        [startDate, endDate],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
    
    res.json(standups);
  } catch (error) {
    console.error('Error fetching week standups:', error);
    res.status(500).json({ error: 'Failed to fetch week standups' });
  }
});

// POST new standup
router.post('/', async (req, res) => {
  try {
    const { user_id, yesterday, today, blockers } = req.body;
    
    // Validation
    if (!user_id || !yesterday || !today) {
      return res.status(400).json({ 
        error: 'Missing required fields: user_id, yesterday, today' 
      });
    }
    
    const db = getDb();
    const date = new Date().toISOString().split('T')[0]; // Today's date
    const created_at = new Date().toISOString();
    
    // Check if user already submitted today
    const existing = await new Promise((resolve, reject) => {
      db.get(
        'SELECT id FROM standups WHERE user_id = ? AND date = ?',
        [user_id, date],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
    
    if (existing) {
      // Update existing standup
      await new Promise((resolve, reject) => {
        db.run(
          `UPDATE standups 
           SET yesterday = ?, today = ?, blockers = ?, created_at = ?
           WHERE id = ?`,
          [yesterday, today, blockers || '', created_at, existing.id],
          function(err) {
            if (err) reject(err);
            else resolve(this);
          }
        );
      });
      
      const updated = await new Promise((resolve, reject) => {
        db.get(
          `SELECT s.*, u.name, u.role, u.avatar_url 
           FROM standups s 
           JOIN users u ON s.user_id = u.id 
           WHERE s.id = ?`,
          [existing.id],
          (err, row) => {
            if (err) reject(err);
            else resolve(row);
          }
        );
      });
      
      res.json({ message: 'Standup updated', standup: updated });
    } else {
      // Insert new standup
      const result = await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO standups (user_id, date, yesterday, today, blockers, created_at) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [user_id, date, yesterday, today, blockers || '', created_at],
          function(err) {
            if (err) reject(err);
            else resolve(this);
          }
        );
      });
      
      const newStandup = await new Promise((resolve, reject) => {
        db.get(
          `SELECT s.*, u.name, u.role, u.avatar_url 
           FROM standups s 
           JOIN users u ON s.user_id = u.id 
           WHERE s.id = ?`,
          [result.lastID],
          (err, row) => {
            if (err) reject(err);
            else resolve(row);
          }
        );
      });
      
      res.status(201).json({ message: 'Standup created', standup: newStandup });
    }
  } catch (error) {
    console.error('Error creating standup:', error);
    res.status(500).json({ error: 'Failed to create standup' });
  }
});

module.exports = router;