'use strict';

const bcrypt = require('bcryptjs');
const db = require('../dao/cloudant');

const dbName = 'users';

const findByCredentials = (username, password) =>
  db
    .find(dbName, {
      selector: { $or: [{ username }, { email: username }] },
      fields: ['_id', '_rev', 'username', 'password', 'name', 'email', 'active'],
    })
    .then((doc) => {
      if (doc.docs.length < 0 || doc.docs[0].active === false) {
        return Promise.reject(new Error("The requested 'user' was not found"));
      }

      return new Promise((resolve, reject) => {
        bcrypt.compare(password, doc.docs[0].password, (err, isMatch) => {
          if (!isMatch || err) {
            reject(new Error("The requested 'password' was wrong"));
          }
          resolve(doc.docs[0]);
        });
      });
    })
    .catch((err) => Promise.reject(err));

module.exports = findByCredentials;
