// db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Test the connection pool
async function testConnection() {
  try {
    const [rows] = await pool.execute('SELECT 1');
    console.log('Database connection successful');
  } catch (err) {
    console.error('Error connecting to database:', err);
    process.exit(1);
  }
}

testConnection();

module.exports = pool;
