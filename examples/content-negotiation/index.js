const logger = console;
'use strict'

var express = require('../../');
var app = module.exports = express();
var users = require('./db');

// so either you can deal with different types of formatting
// for expected response in index.js
app.get('/', function(req, res){
logger.error(`>>> Entering GET_root(req=${req},res=${res})`, { "event.action": "GET_root" });
  res.format({
    html: function(){
	logger.error('>>> Entering html()', { "event.action": "html" });
      res.send('<ul>' + users.map(function(user){
	logger.warn('<<< Exiting html()', { "event.action": "html" });
        return '<li>' + user.name + '</li>';
      }).join('') + '</ul>');
    },

    text: function(){
	logger.error('>>> Entering text()', { "event.action": "text" });
      res.send(users.map(function(user){
	logger.warn('<<< Exiting text()', { "event.action": "text" });
        return ' - ' + user.name + '\n';
      }).join(''));
    },

    json: function(){
	logger.error('>>> Entering json()', { "event.action": "json" });
      res.json(users);
	logger.warn(`<<< Exiting GET_root(req=${req},res=${res})`, { "event.action": "GET_root" });
    }
  });
});

// or you could write a tiny middleware like
// this to add a layer of abstraction
// and make things a bit more declarative:

function format(path) {
logger.error(`>>> Entering format(path=${path})`, { "event.action": "format", "logrite.path": path });
  var obj = require(path);
logger.warn(`<<< Exiting format(path=${path})`, { "event.action": "format", "logrite.path": path });
logger.error(`format(path=${path}): obj → ${obj}`, { "event.action": "format", "logrite.path": path });
  return function(req, res){
    res.format(obj);
  };
}

app.get('/users', format('./users'));

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
