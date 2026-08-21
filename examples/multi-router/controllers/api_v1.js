const logger = console;
'use strict'

var express = require('../../..');

var apiv1 = express.Router();

apiv1.get('/', function(req, res) {
logger.debug(`>>> Entering GET_root(req=${req},res=${res})`);
  res.send('Hello from APIv1 root route.');
});

apiv1.get('/users', function(req, res) {
logger.debug(`>>> Entering GET_users(req=${req},res=${res})`);
  res.send('List of APIv1 users.');
});

module.exports = apiv1;
