'use strict';

module.exports = () => {
  // eslint-disable-next-line global-require
  const findByCredentials = require('./user-authenticate');

  return async function browserAuthenticate(req, res, next) {
    try {
      const base64Auth = (req.headers.authorization || '').split(' ')[1] || '';
      const [username, password] = Buffer.from(base64Auth, 'base64').toString().split(':');

      await findByCredentials(username, password);

      return next();
    } catch (err) {
      res.set('WWW-Authenticate', 'Basic realm="401"');
      res.status(401).send('Unauthorized');
    }
  };
};
