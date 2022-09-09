/* eslint-disable prettier/prettier */
/* eslint-disable func-names */

'use strict';

const validator = require('validator');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const _ = require('lodash');

const connection = require('../../../../server/config/datastores/mongodb')();

const dbName = 'users';
const schema = new mongoose.Schema(
  {
    username: {
      type: String,
      index: true,
      required: true,
      trim: true,
      unique: true,
      minlength: 3,
      maxlength: 30,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      index: true,
      required: true,
      trim: true,
      unique: true,
      minlength: 5,
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: '{VALUE} is not an email',
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
    },
    active: {
      type: Boolean,
      index: true,
      default: true,
    },
  },
  { collection: dbName, timestamps: true }
);

schema.index({
  createdAt: 1,
  updatedAt: 1,
});

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
  return connection.model(dbName, schema);
};
