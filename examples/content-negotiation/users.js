const logger = console;
'use strict'

var users = require('./db');

exports.html = function(req, res){
logger.error(`>>> Entering html(req=${req},res=${res})`, { "event.action": "html" });
  res.send('<ul>' + users.map(function(user){
logger.warn(`<<< Exiting html(req=${req},res=${res})`, { "event.action": "html" });
    return '<li>' + user.name + '</li>';
  }).join('') + '</ul>');
};

exports.text = function(req, res){
logger.error(`>>> Entering text(req=${req},res=${res})`, { "event.action": "text" });
  res.send(users.map(function(user){
logger.warn(`<<< Exiting text(req=${req},res=${res})`, { "event.action": "text" });
    return ' - ' + user.name + '\n';
  }).join(''));
};

exports.json = function(req, res){
logger.error(`>>> Entering json(req=${req},res=${res})`, { "event.action": "json" });
  res.json(users);
logger.warn(`<<< Exiting json(req=${req},res=${res})`, { "event.action": "json" });
};
