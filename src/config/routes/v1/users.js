const express = require('express');
const controller = require('../../../api/controllers/v1/users/users-controller');
// const jwt_authenticate = require('../../authentications/jwt-auth');

module.exports = (middlewares) => {
  const router = express.Router();

  if (middlewares) {
    middlewares.forEach((middleware) => router.use(middleware));
  }

  router.get('/', controller.list);
  router.post('/', controller.insert);
  router.get('/:id', controller.find);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.remove);

  return router;
};
