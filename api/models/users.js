'use strict';

const bcrypt = require('bcryptjs');
const db = require('./dao/cloudant');
const schema = require('../schemas/users');

const dbName = 'users';

const list = () =>
  db.find(dbName, {
    selector: {},
    fields: ['_id', '_rev', 'createdAt', 'username', 'name', 'email', 'active'],
  });

const find = (id) =>
  db.find(dbName, {
    selector: { _id: id },
    fields: ['_id', '_rev', 'createdAt', 'username', 'name', 'email', 'active'],
  });

const findByCredentials = (username, password) => {
  return db
    .find(dbName, {
      selector: { $or: [{ username }, { email: username }] },
      fields: ['_id', '_rev', 'username', 'password', 'name', 'email', 'active'],
    })
    .then((doc) => {
      if (doc.docs.length < 0) {
        return Promise.reject(new Error("The requested 'user' was not found"));
      }

      return new Promise((resolve, reject) => {
        bcrypt.compare(password, doc.docs[0].password, (err, isMatch) => {
          if (!isMatch || err) {
            reject(new Error("The requested 'password' was wrong"));
          }
          resolve(doc);
        });
      });
    });
};

const insert = (doc) => {
  return new Promise((resolve, reject) => {
    const docValidate = schema.validate(doc);

    if (docValidate.error) {
      return reject(docValidate.error);
    }
    doc = docValidate.value;
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(doc.password, salt, (error, hash) => {
        doc.password = hash;
      });
    });

    return resolve(db.insert(dbName, doc));
  });
};

const update = (doc) => {
  return new Promise((resolve, reject) => {
    const docValidate = schema.validate(doc);

    if (docValidate.error) {
      return reject(docValidate.error);
    }
    doc = docValidate.value;
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(doc.password, salt, (error, hash) => {
        doc.password = hash;
      });
    });

    return resolve(db.update(dbName, doc));
  });
};

const remove = (id) => db.remove(dbName, id);

module.exports = {
  list,
  find,
  findByCredentials,
  insert,
  update,
  remove,
};
