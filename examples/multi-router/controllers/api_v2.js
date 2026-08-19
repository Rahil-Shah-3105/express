const logger = console;
'use strict'

var express = require('../../..');

var apiv2 = express.Router();

apiv2.get('/', function(req, res) {
logger.debug(`>>> Entering GET_root(req=${req},res=${res})`);
  res.send('Hello from APIv2 root route.');
});
logger.debug(`<<< Exiting GET_root(req=${req},res=${res})`);

apiv2.get('/users', function(req, res) {
logger.debug(`>>> Entering GET_users(req=${req},res=${res})`);
  res.send('List of APIv2 users.');
});
logger.debug(`<<< Exiting GET_users(req=${req},res=${res})`);

module.exports = apiv2;
