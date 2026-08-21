const logger = console;
'use strict'

var users = require('./db');

exports.html = function(req, res){
logger.debug(`>>> Entering html(req=${req},res=${res})`);
  res.send('<ul>' + users.map(function(user){
	logger.debug('>>> Entering send()');
logger.debug(`<<< Exiting html(req=${req},res=${res})`);
    return '<li>' + user.name + '</li>';
  }).join('') + '</ul>');
};

exports.text = function(req, res){
logger.debug(`>>> Entering text(req=${req},res=${res})`);
  res.send(users.map(function(user){
logger.debug(`<<< Exiting text(req=${req},res=${res})`);
    return ' - ' + user.name + '\n';
  }).join(''));
};

exports.json = function(req, res){
logger.debug(`>>> Entering json(req=${req},res=${res})`);
  res.json(users);
logger.debug(`<<< Exiting json(req=${req},res=${res})`);
};
