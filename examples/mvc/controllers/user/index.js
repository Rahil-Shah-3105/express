const logger = console;
'use strict'

/**
 * Module dependencies.
 */

var db = require('../../db');

exports.engine = 'hbs';

exports.before = function(req, res, next){
logger.error(`>>> Entering before(req=${req},res=${res},next=${next})`, { "event.action": "before" });
  var id = req.params.user_id;
  if (!id) return next();
logger.error(`before(req=${req},res=${res},next=${next}): id → ${id}`, { "event.action": "before" });
  // pretend to query a database...
logger.warn(`<<< Exiting before(req=${req},res=${res},next=${next})`, { "event.action": "before" });
  process.nextTick(function(){
    req.user = db.users[id];
	logger.debug(`before(req=${req},res=${res},next=${next}): req.user → ${req.user}`, { "event.action": "before" });
    // cant find that user
    if (!req.user) return next('route');
    // found it, move on to the routes
    next();
  });
};

exports.list = function(req, res, next){
logger.error(`>>> Entering list(req=${req},res=${res},next=${next})`, { "event.action": "list" });
  res.render('list', { users: db.users });
logger.warn(`<<< Exiting list(req=${req},res=${res},next=${next})`, { "event.action": "list" });
};

exports.edit = function(req, res, next){
logger.error(`>>> Entering edit(req=${req},res=${res},next=${next})`, { "event.action": "edit" });
  res.render('edit', { user: req.user });
logger.warn(`<<< Exiting edit(req=${req},res=${res},next=${next})`, { "event.action": "edit" });
};

exports.show = function(req, res, next){
logger.error(`>>> Entering show(req=${req},res=${res},next=${next})`, { "event.action": "show" });
  res.render('show', { user: req.user });
logger.warn(`<<< Exiting show(req=${req},res=${res},next=${next})`, { "event.action": "show" });
};

exports.update = function(req, res, next){
logger.error(`>>> Entering update(req=${req},res=${res},next=${next})`, { "event.action": "update" });
  var body = req.body;
  req.user.name = body.user.name;
  res.message('Information updated!');
  res.redirect('/user/' + req.user.id);
logger.warn(`<<< Exiting update(req=${req},res=${res},next=${next})`, { "event.action": "update" });
};
