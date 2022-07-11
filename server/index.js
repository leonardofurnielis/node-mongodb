/* eslint-disable global-require */

'use strict';

// Import dependencies
const express = require('express');
const errorHandler = require('node-error-handler');

// Import config dependencies
const app = express();
const environmentLoader = require('./config/environment');
const logLoader = require('./config/log');
const httpLoader = require('./config/http');
const securityLoader = require('./config/security');

// Import routes dependencies
const healthcheckRoute = require('./routes/healthcheck');
const authenticateRoutes = require('./routes/authenticate');
const usersRoutes = require('./routes/v1/users');

environmentLoader();

logLoader();

httpLoader(app);

// Routes and api calls
app.use('/api/authenticate', authenticateRoutes());
app.use('/api/healthcheck', healthcheckRoute());
app.use('/api/v1/users', usersRoutes());

// 404 handler
app.use((req, res, next) => {
  const error = new Error(`Cannot found '${req.url}' on this server`);
  error.code = 404;
  return next(error);
});

// Error handler
const debug = process.env.LOGGER_LEVEL.toLowerCase() === 'debug' ? true : false;
app.use(errorHandler({ debug }));

if (!process.env.NODE_ENV === 'test') {
  securityLoader();
}

module.exports = app;
