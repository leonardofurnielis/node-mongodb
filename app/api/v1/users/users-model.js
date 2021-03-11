/* eslint-disable prettier/prettier */
/* eslint-disable func-names */

'use strict';

const bcrypt = require('bcryptjs');
const _ = require('lodash');

const schema = require('./users-schema');
const connection = require('../../../../config/datastores/mongodb')('database');

schema.methods.toJSON = function () {
  const user = this;
  const doc = user.toObject();

  return _.pick(doc, ['_id', 'createdAt', 'updatedAt', 'username', 'name', 'email', 'active']);
};

schema.pre('save', function (next) {
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

schema.pre('findOneAndUpdate', function (next) {
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

module.exports = () => {
  return connection.model('users', schema);
};
