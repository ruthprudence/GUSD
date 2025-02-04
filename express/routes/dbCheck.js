// dbCheck.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT 1');
    res.json({ status: 'Connected' });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ status: 'Error', message: error.message });
  }
});

module.exports = router;
