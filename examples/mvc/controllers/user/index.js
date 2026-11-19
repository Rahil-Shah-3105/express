const logger = console;
'use strict'

/**
 * Module dependencies.
 */

var db = require('../../db');

exports.engine = 'hbs';

exports.before = function(req, res, next){
  var id = req.params.user_id;
logger.info(`before(req=${req}, res=${res}, next=${next}): M2614-AUDIT: Outcome 01 user attribution recorded for the audit trail ${id}`, { "event.action": "before" });
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
logger.info(`list(req=${req}, res=${res}, next=${next}): M2614-AUDIT: Log integrity (encrypt + validate) — Record access recorded for the audit trail`, { "event.action": "list" });
};

exports.edit = function(req, res, next){
  res.render('edit', { user: req.user });
logger.info(`edit(req=${req}, res=${res}, next=${next}): M2614-AUDIT: Log integrity (encrypt + validate) — State change recorded for the audit trail`, { "event.action": "edit" });
};

exports.show = function(req, res, next){
  res.render('show', { user: req.user });
};

exports.update = function(req, res, next){
  var body = req.body;
  req.user.name = body.user.name;
  res.message('Information updated!');
  res.redirect('/user/' + req.user.id);
logger.info(`update(req=${req}, res=${res}, next=${next}): M2614-AUDIT: Log Management / data protection — State change recorded for the audit trail`, { "event.action": "update" });
};
