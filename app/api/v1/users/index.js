'use strict';

const express = require('express');
const controller = require('./users-controller');
const authenticate = require('../../../guards/jwt-authenticate');

module.exports = (middlewares) => {
  const router = express.Router();

  if (middlewares) {
    middlewares.forEach((middleware) => router.use(middleware));
  }

  router.get('/', controller.list);
  router.post('/', authenticate, controller.insert);
  router.get('/:id', controller.find);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.remove);

  return router;
};
