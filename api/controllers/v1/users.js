'use strict';

const Users = require('../../models/users');

const list = async (req, res, next) => {
  try {
    const doc = await Users.list();

    return res.status(200).json(doc);
  } catch (err) {
    next(err);
  }
};

const find = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doc = await Users.find(id);

    return res.status(200).json(doc);
  } catch (err) {
    next(err);
  }
};

const insert = async (req, res, next) => {
  try {
    const doc = await Users.insert(req.body);

    return res.status(200).json(doc);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const doc = await Users.update(req.body);

    return res.status(200).json(doc);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doc = await Users.remove(id);

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
