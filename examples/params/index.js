const logger = console;
'use strict'

/**
 * Module dependencies.
 */

var createError = require('http-errors')
var express = require('../../');
var app = module.exports = express();

// Faux database

var users = [
  { name: 'tj' }
  , { name: 'tobi' }
  , { name: 'loki' }
  , { name: 'jane' }
  , { name: 'bandit' }
];

// Convert :to and :from to integers

app.param(['to', 'from'], function(req, res, next, num, name){
  req.params[name] = parseInt(num, 10);
  if( isNaN(req.params[name]) ){
    next(createError(400, 'failed to parseInt '+num));
  } else {
    next();
  }
});

// Load user by id

app.param('user', function(req, res, next, id){
  req.user = users[id]
  if (req.user) {
    next();
  } else {
    next(createError(404, 'failed to find user'));
  }
});

/**
 * GET index.
 */

app.get('/', function(req, res){
logger.error(`>>> Entering GET_root(req=${req},res=${res})`, { "event.action": "GET_root" });
  res.send('Visit /user/0 or /users/0-2');
});

/**
 * GET :user.
 */

app.get('/user/:user', function (req, res) {
logger.error(`>>> Entering GET_user_user(req=${req},res=${res})`, { "event.action": "GET_user_user" });
  res.send('user ' + req.user.name);
});

/**
 * GET users :from - :to.
 */

app.get('/users/:from-:to', function (req, res) {
logger.error(`>>> Entering GET_users_from_to(req=${req},res=${res})`, { "event.action": "GET_users_from_to" });
  var from = req.params.from;
  var to = req.params.to;
  var names = users.map(function(user){ return user.name; });
  res.send('users ' + names.slice(from, to + 1).join(', '));
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
