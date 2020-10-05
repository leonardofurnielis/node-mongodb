/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

'use strict';

const path = require('path');
const readRecursiveDirectory = require('../../common/helpers/read_recursive_directory.js');

// const swaggerUi = require('swagger-ui-express');
// const basicAuth = require('../lib/middlewares/www-basic-auth');
// const swaggerDocument = require('../swagger/swagger.json');

const routesLoader = (app) => {
  const routes = readRecursiveDirectory('/api/routes');

  routes.forEach((file) => {
    const routeFile = require(path.join(process.cwd(), file));
    const fn = file.replace('/api/routes/', '').replace('.js', '');

    app.use(`/api/${fn}`, routeFile());
  });

  // app.use('/explorer', basicAuth(), swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};

module.exports = routesLoader;
