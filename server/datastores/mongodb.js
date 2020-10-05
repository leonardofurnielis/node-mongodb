'use strict';

const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const connections = require('./connections');

mongoose.Promise = global.Promise;

module.exports = (conn) => {
  const options = {
    dbName: `${conn}`,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    poolSize: 100,
  };

  // DB uses sslCA Certificate
  if (connections[conn].sslCA) {
    options.sslCA = fs.readFileSync(path.join(__dirname, `../../ca/${connections[conn].sslCA}`));
  }

  let connection;

  if (connections[conn].uri && connections[conn].adapter === 'mongodb') {
    connection = mongoose.createConnection(connections[conn].uri, options);

    // Connection throws an error
    connection.on('error', (err) => {
      return console.error(err);
    });
  }

  return connection;
};
