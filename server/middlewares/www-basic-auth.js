'use strict';

module.exports = () => {
  // eslint-disable-next-line global-require
  const users = require('../../api/models/users');

  return async function wwwBasicAuth(req, res, next) {
    try {
      const base64Auth = (req.headers.authorization || '').split(' ')[1] || '';
      const [username, password] = Buffer.from(base64Auth, 'base64').toString().split(':');

      await users.find_by_credentials(username, password);

      return next();
    } catch (err) {
      res.set('WWW-Authenticate', 'Basic realm="401"');
      res.status(401).send('Unauthorized');
    }
  };
};
