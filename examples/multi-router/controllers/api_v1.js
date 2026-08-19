const logger = console;
'use strict'

var express = require('../../..');

var apiv1 = express.Router();

apiv1.get('/', function(req, res) {
logger.debug(`>>> Entering GET_root(req=${req},res=${res})`);
  res.send('Hello from APIv1 root route.');
});
logger.debug(`<<< Exiting GET_root(req=${req},res=${res})`);

apiv1.get('/users', function(req, res) {
logger.debug(`>>> Entering GET_users(req=${req},res=${res})`);
  res.send('List of APIv1 users.');
});
logger.debug(`<<< Exiting GET_users(req=${req},res=${res})`);

module.exports = apiv1;
