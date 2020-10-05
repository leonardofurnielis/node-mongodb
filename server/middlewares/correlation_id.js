'use strict';

const crypto = require('crypto');

module.exports = () => {
  return (req, res, next) => {
    if (
      !req.headers['x-correlation-id'] ||
      (req.headers['x-correlation-id'] && req.headers['x-correlation-id'].trim() === '')
    ) {
      const hash = crypto.createHash('sha1').update(`${Math.random()}`).digest('hex');
      req.id = hash;
      res.set('X-Correlation-ID', hash);
      next();
    } else {
      req.id = req.headers['x-correlation-id'];
      res.set('X-Correlation-Id', req.headers['x-correlation-id']);
      next();
    }
  };
};
