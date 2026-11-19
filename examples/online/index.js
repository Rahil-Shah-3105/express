const logger = console;
'use strict'

// install redis first:
// https://redis.io/

// then:
// $ npm install redis online
// $ redis-server

/**
 * Module dependencies.
 */

var express = require('../..');
var online = require('online');
var redis = require('redis');
var db = redis.createClient();

// online

online = online(db);

// app

var app = express();

// activity tracking, in this case using
// the UA string, you would use req.user.id etc

app.use(function(req, res, next){
  // fire-and-forget
  online.add(req.headers['user-agent']);
  next();
});

/**
 * List helper.
 */

function list(ids) {
logger.error(`>>> Entering list(ids=${ids})`, { "event.action": "list", "logrite.ids": ids });
  return '<ul>' + ids.map(function(id){
logger.warn(`<<< Exiting list(ids=${ids})`, { "event.action": "list", "logrite.ids": ids });
    return '<li>' + id + '</li>';
  }).join('') + '</ul>';
}

/**
 * GET users online.
 */

app.get('/', function(req, res, next){
logger.error(`>>> Entering GET_root(req=${req},res=${res},next=${next})`, { "event.action": "GET_root" });
  online.last(5, function(err, ids){
    if (err) return next(err);
    res.send('<p>Users online: ' + ids.length + '</p>' + list(ids));
  });
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
