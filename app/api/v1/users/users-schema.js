'use strict';

const mongoose = require('mongoose');
const validator = require('validator');

const Schema = new mongoose.Schema(
  {
    created_at: {
      type: Date,
      index: true,
      required: true,
      default: new Date(),
    },
    updated_at: {
      type: Date,
      index: true,
      required: true,
      default: new Date(),
    },
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
  { collection: 'users' }
);

Schema.index({
  createdAt: 1,
});

module.exports = Schema;
