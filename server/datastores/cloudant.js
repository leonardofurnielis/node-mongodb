'use strict';

const Cloudant = require('@cloudant/cloudant');
const connections = require('./connections');

module.exports = (conn) => {
  if (
    connections[conn].uri &&
    connections[conn].iamApiKey &&
    connections[conn].adapter === 'cloudant'
  ) {
    return Cloudant({
      url: connections[conn].uri,
      plugins: { iamauth: { iamApiKey: connections[conn].iamApiKey } },
    });
  }
};
