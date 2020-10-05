'use strict';

const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');
const passport = require('passport');
const errorHandler = require('node-error-handler');
// const swaggerUi = require('swagger-ui-express');

const routesLoader = require('./routes');
const correlationID = require('../middlewares/correlation_id');
const urlNotFound = require('../middlewares/url_not_found');
// const basicAuth = require('../middlewares/www_basic_auth');
// const openApi = require('../../openapi.json');

module.exports = async (app) => {
  // Middlewares
  app.use(cors());
  app.use(helmet());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(compression());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(correlationID());

  // Expose API openapi documentation
  // app.use('/explorer', basicAuth(), swaggerUi.serve, swaggerUi.setup(openApi));

  // Load API routes
  routesLoader(app);

  // HTTP 404 handler
  app.use(urlNotFound());

  // HTTP error handler
  app.use(errorHandler());
};
