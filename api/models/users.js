/* eslint-disable prettier/prettier */
/* eslint-disable func-names */

'use strict';

const bcrypt = require('bcryptjs');
const _ = require('lodash');

const schema = require('../schemas/users');
const connection = require('../../server/datastores/mongodb')('database');

schema.methods.toJSON = function() {
  const user = this;
  const user_object = user.toObject();

  return _.pick(user_object, ['_id', 'username', 'name', 'email', 'active']);
};

schema.statics.find_by_credentials = function(username, password) {
  const User = this;

  return User.findOne({ $or: [{ username }, { email: username }] }).then((user) => {
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
};

schema.pre('save', function(next) {
  if (this.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(this.password, salt, (error, hash) => {
        this.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

schema.pre('findOneAndUpdate', function(next) {
  if (this._update.$set.password && this._update.$set.password !== '') {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(this._update.$set.password, salt, (error, hash) => {
        this._update.$set.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

module.exports = connection.model('users', schema);
