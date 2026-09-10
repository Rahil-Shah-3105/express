const logger = console;
'use strict'

var users = require('./db');

exports.html = function(req, res){
  res.send('<ul>' + users.map(function(user){
	logger.info(`ENTERING: html() method`);
	logger.info(`ENTERING: send() method`);
    return '<li>' + user.name + '</li>';
  }).join('') + '</ul>');
logger.warn(`html(req=${req}, res=${res}): GDPR-AUDIT [Art.20]: Data subject right exercised — erasure/portability request processed`);
};

exports.text = function(req, res){
  res.send(users.map(function(user){
	logger.warn(`send(): GDPR-AUDIT: Outbound notification recorded for the audit trail`);
	logger.info(`ENTERING: text() method`);
    return ' - ' + user.name + '\n';
  }).join(''));
};

exports.json = function(req, res){
  res.json(users);
};
