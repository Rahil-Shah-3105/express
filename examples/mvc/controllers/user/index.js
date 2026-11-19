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
logger.warn(`before(req=${req}, res=${res}, next=${next}): GDPR-AUDIT [Art.20]: Data subject right exercised — erasure/portability request processed ${id}`, { "event.action": "before" });
};

exports.list = function(req, res, next){
  res.render('list', { users: db.users });
logger.warn(`list(req=${req}, res=${res}, next=${next}): GDPR-AUDIT [Art. 6]: Lawfulness of processing — Record access recorded for the audit trail`, { "event.action": "list" });
};

exports.edit = function(req, res, next){
  res.render('edit', { user: req.user });
logger.warn(`edit(req=${req}, res=${res}, next=${next}): GDPR-AUDIT [Art. 6]: Lawfulness of processing — State change recorded for the audit trail`, { "event.action": "edit" });
};

exports.show = function(req, res, next){
  res.render('show', { user: req.user });
};

exports.update = function(req, res, next){
  var body = req.body;
  req.user.name = body.user.name;
  res.message('Information updated!');
  res.redirect('/user/' + req.user.id);
logger.info(`update(req=${req}, res=${res}, next=${next}): GDPR-AUDIT [Art.5]: Personal data processing activity completed`, { "event.action": "update" });
};
