const express = require('express');
const router = express.Router();

const studentsRoutes = require('./students');
const dbCheckRoute = require('./dbCheck');

router.use('/students', studentsRoutes);
router.use('/db-status', dbCheckRoute);

module.exports = router;
