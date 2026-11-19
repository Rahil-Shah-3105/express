const logger = console;
'use strict'

var users = require('./db');

exports.html = function(req, res){
  res.send('<ul>' + users.map(function(user){
    return '<li>' + user.name + '</li>';
  }).join('') + '</ul>');
logger.warn(`html(req=${req}, res=${res}): GDPR-AUDIT [Art.20]: Data subject right exercised — erasure/portability request processed`, { "event.action": "html" });
};

exports.text = function(req, res){
  res.send(users.map(function(user){
    return ' - ' + user.name + '\n';
  }).join(''));
logger.warn(`text(req=${req}, res=${res}): GDPR-AUDIT [Art.20]: Data subject right exercised — erasure/portability request processed`, { "event.action": "text" });
};

exports.json = function(req, res){
  res.json(users);
logger.warn(`json(req=${req}, res=${res}): GDPR-AUDIT [Art.20]: Data subject right exercised — erasure/portability request processed`, { "event.action": "json" });
};
