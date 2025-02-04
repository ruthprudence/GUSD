// server.js
const express = require('express');
const app = express();
const config = require('./config');
const middleware = require('./middleware');
const pool = require('./db');
const routes = require('../routes');

middleware(app);

app.get('/api/data', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM Student');
    res.json({ status: "online", data: rows }); // Return status and data
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: 'Error fetching data' });
  }
});

app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('Student Data API is running');
});

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
