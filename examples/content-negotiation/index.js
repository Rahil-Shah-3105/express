const logger = console;
'use strict'

var express = require('../../');
var app = module.exports = express();
var users = require('./db');

// so either you can deal with different types of formatting
// for expected response in index.js
app.get('/', function(req, res){
logger.debug(`>>> Entering GET_root(req=${req},res=${res})`);
  res.format({
    html: function(){
	logger.debug('>>> Entering html()');
      res.send('<ul>' + users.map(function(user){
		logger.debug('>>> Entering send()');
	logger.debug('<<< Exiting html()');
        return '<li>' + user.name + '</li>';
      }).join('') + '</ul>');
    },

    text: function(){
	logger.debug('>>> Entering text()');
      res.send(users.map(function(user){
		logger.debug('<<< Exiting send()');
	logger.debug('<<< Exiting text()');
        return ' - ' + user.name + '\n';
      }).join(''));
    },

    json: function(){
	logger.debug('>>> Entering json()');
      res.json(users);
	logger.debug('<<< Exiting json()');
    }
  });
});

// or you could write a tiny middleware like
// this to add a layer of abstraction
// and make things a bit more declarative:

function format(path) {
logger.debug(`>>> Entering format(path=${path})`);
  var obj = require(path);
  return function(req, res){
logger.debug(`>>> Entering function(req=${req},res=${res})`);
    res.format(obj);
	logger.debug(`<<< Exiting format(path=${path})`);
  };
}

app.get('/users', format('./users'));

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
