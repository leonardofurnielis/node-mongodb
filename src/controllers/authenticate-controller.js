'use strict';

const jwt = require('jsonwebtoken');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const findByCredentials = require('../../server/guards/user-authenticate');

const authenticate = async (req, res, next) => {
  try {
    const base64Auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [username, password] = Buffer.from(base64Auth, 'base64').toString().split(':');

    const user = await findByCredentials(username, password);
    const payload = _.pick(user, ['_id', 'username', 'name', 'email', 'active']);

    const privateKEY = fs.readFileSync(path.join(__dirname, '../../private.pem'));
    const token = jwt.sign(payload, privateKEY, {
      expiresIn: '6h',
      algorithm: 'RS256',
    });

    return res.status(200).json({ access_token: `${token}`, token_type: 'JWT', expires_in: 21600 });
  } catch (err) {
    err.status = 401;
    next(err);
  }
};

module.exports = {
  authenticate,
};
