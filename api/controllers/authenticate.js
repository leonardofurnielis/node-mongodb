'use strict';

const jwt = require('jsonwebtoken');
const _ = require('lodash');

const Users = require('../models/users');

const authenticate = async (req, res, next) => {
  try {
    const base64Auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [username, password] = Buffer.from(base64Auth, 'base64').toString().split(':');

    const user = await Users.find_by_credentials(username, password);
    const payload = _.pick(user, ['_id', 'username', 'name', 'email', 'active']);

    const token = jwt.sign(payload, process.env.PW_SECRET, {
      expiresIn: '6h',
    });

    return res.status(200).json({ access_token: `${token}`, token_type: 'JWT', expiresIn: 21600 });
  } catch (err) {
    err.status = 401;
    next(err);
  }
};

module.exports = {
  authenticate,
};
