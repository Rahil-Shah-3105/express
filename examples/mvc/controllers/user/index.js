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
logger.info(`list(req=${req}, res=${res}, next=${next}): NERCCIP-AUDIT: Electronic perimeter — Record access recorded for the audit trail`, { "event.action": "list" });
};

exports.edit = function(req, res, next){
  res.render('edit', { user: req.user });
logger.info(`edit(req=${req}, res=${res}, next=${next}): NERCCIP-AUDIT: Electronic perimeter — State change recorded for the audit trail`, { "event.action": "edit" });
};

exports.show = function(req, res, next){
  res.render('show', { user: req.user });
};

exports.update = function(req, res, next){
  var body = req.body;
logger.info(`update(req=${req}, res=${res}, next=${next}): NERCCIP-AUDIT: Monitoring coverage — State change recorded for the audit trail`, { "event.action": "update" });
  req.user.name = body.user.name;
  res.message('Information updated!');
  res.redirect('/user/' + req.user.id);
};
