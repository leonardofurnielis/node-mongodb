'use strict';

const bcrypt = require('bcryptjs');
const mongodb = require('../datasources/mongodb-connector')();

const dbName = 'users';

const findByCredentials = (username, password) =>
  mongodb
    .model(dbName)
    .findOne({ $or: [{ username }, { email: username }] })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("The requested 'user' was not found"));
      }

      return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (!isMatch || err) {
            reject(new Error("The requested 'password' was wrong"));
          }
          resolve(user);
        });
      });
    });

module.exports = findByCredentials;
