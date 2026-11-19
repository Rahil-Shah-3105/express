const logger = console;
'use strict'

var express = require('../../..');

var apiv1 = express.Router();

apiv1.get('/', function(req, res) {
logger.error(`>>> Entering GET_root(req=${req},res=${res})`, { "event.action": "GET_root" });
  res.send('Hello from APIv1 root route.');
});

apiv1.get('/users', function(req, res) {
logger.error(`>>> Entering GET_users(req=${req},res=${res})`, { "event.action": "GET_users" });
  res.send('List of APIv1 users.');
});

module.exports = apiv1;
