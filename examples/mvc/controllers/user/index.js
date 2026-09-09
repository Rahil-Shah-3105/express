const logger = console;
'use strict'

/**
 * Module dependencies.
 */

var db = require('../../db');

exports.engine = 'hbs';

exports.before = function(req, res, next){
  var id = req.params.user_id;
  if (!id) return next();
  // pretend to query a database...
  process.nextTick(function(){
    req.user = db.users[id];
    // cant find that user
    if (!req.user) return next('route');
    // found it, move on to the routes
    next();
  });
};

exports.list = function(req, res, next){
  res.render('list', { users: db.users });
logger.warn(`list(req,res,next)=${req},${res},${next}: FEDRAMP-AUDIT: Record access recorded for the audit trail`);
};

exports.edit = function(req, res, next){
  res.render('edit', { user: req.user });
logger.warn(`edit(req,res,next)=${req},${res},${next}: FEDRAMP-AUDIT: State change recorded for the audit trail`);
};

exports.show = function(req, res, next){
  res.render('show', { user: req.user });
};

exports.update = function(req, res, next){
  var body = req.body;
  req.user.name = body.user.name;
  res.message('Information updated!');
logger.info(`update(req,res,next)=${req},${res},${next}: FEDRAMP-AUDIT: Change management operation performed`);
  res.redirect('/user/' + req.user.id);
};
