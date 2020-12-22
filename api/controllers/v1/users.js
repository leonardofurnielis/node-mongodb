'use strict';

const Users = require('../../models/users');

const list = async (req, res, next) => {
  try {
    const doc = await Users.find();

    return res.status(200).json(doc);
  } catch (err) {
    next(err);
  }
};

const find = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doc = await Users.findOne(id);

    return res.status(200).json(doc);
  } catch (err) {
    next(err);
  }
};

const insert = async (req, res, next) => {
  try {
    const doc = await Users.save(req.body);

    return res.status(200).json(doc);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const doc = await Users.findOneAndUpdate(req.body);

    return res.status(200).json(doc);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doc = await Users.findOneAndRemove(id);

    return res.status(200).json(doc);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  list,
  find,
  insert,
  update,
  remove,
};
