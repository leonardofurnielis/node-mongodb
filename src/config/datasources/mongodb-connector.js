'use strict';

const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

mongoose.Promise = global.Promise;

module.exports = (connection = 'MONGODB', sslCAFilename) => {
  const options = {
    dbName: `${connection}`,
    minPoolSize: 10,
  };

  // Db uses ssl Certificate File
  if (sslCAFilename) {
    options.sslCA = fs.readFileSync(path.join(__dirname, `../../${sslCAFilename}`));
  }

  let service;

  if (process.env[`${connection}_URL`]) {
    service = mongoose.createConnection(process.env[`${connection}_URL`], options);

    // Connection throws an error
    service.on('error', (err) => console.error(err));
  }

  return service;
};
