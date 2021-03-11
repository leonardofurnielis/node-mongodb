/* eslint-disable global-require */

'use strict';

const express = require('express');

const app = express();
const environmentLoader = require('./environment');
const logLoader = require('./log');
const httpLoader = require('./http');
const routesLoader = require('./routes');
const bootstrapLoader = require('./bootstrap');
const securityLoader = require('./security');

environmentLoader();

logLoader();

httpLoader(app);

routesLoader(app);

bootstrapLoader();

securityLoader();

module.exports = app;
