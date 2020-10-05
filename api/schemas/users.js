'use strict';

const Joi = require('joi');

const schema = Joi.object({
  _id: Joi.any(),
  _rev: Joi.any(),
  createdAt: Joi.date().timestamp().default(new Date().getTime()),
  username: Joi.string().alphanum().min(3).max(30).required(),
  name: Joi.string().min(5).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
  active: Joi.boolean().default(true),
});

module.exports = schema;
