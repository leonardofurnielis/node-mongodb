'use strict';

const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const connections = require('./connections');

mongoose.Promise = global.Promise;

module.exports = (conn) => {
  const options = {
    dbName: `${conn}`,
    minPoolSize: 10,
  };

  // DB uses ssl Certificate File
  if (connections[conn].sslCA) {
    options.sslCA = fs.readFileSync(
      path.join(__dirname, `../env/${connections[conn].ssl_ca_file}`)
    );
  }

  let connection;

  if (connections[conn].uri && connections[conn].adapter === 'mongodb') {
    connection = mongoose.createConnection(connections[conn].uri, options);

    // Connection throws an error
    connection.on('error', (err) => console.error(err));
  }

  return connection;
};
