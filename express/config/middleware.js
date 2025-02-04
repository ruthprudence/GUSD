// middleware.js
const express = require('express');
const cors = require('cors');

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 200,
};

const middleware = (app) => {
  app.use(cors(corsOptions));
  app.use(express.json());
};

module.exports = middleware;
