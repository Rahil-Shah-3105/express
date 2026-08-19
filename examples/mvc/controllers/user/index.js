const logger = console;
'use strict'

/**
 * Module dependencies.
 */

var db = require('../../db');

exports.engine = 'hbs';

exports.before = function(req, res, next){
logger.debug(`>>> Entering before(req=${req},res=${res},next=${next})`);
  var id = req.params.user_id;
  if (!id) return next();
logger.debug(`before(req=${req},res=${res},next=${next}): id → ${id}`);
  // pretend to query a database...
logger.debug(`<<< Exiting before(req=${req},res=${res},next=${next})`);
  process.nextTick(function(){
	logger.debug('>>> Entering nextTick()');
    req.user = db.users[id];
    // cant find that user
    if (!req.user) return next('route');
    // found it, move on to the routes
	logger.debug('<<< Exiting nextTick()');
    next();
  });
};

exports.list = function(req, res, next){
logger.debug(`>>> Entering list(req=${req},res=${res},next=${next})`);
  res.render('list', { users: db.users });
logger.debug(`<<< Exiting list(req=${req},res=${res},next=${next})`);
};

exports.edit = function(req, res, next){
logger.debug(`>>> Entering edit(req=${req},res=${res},next=${next})`);
  res.render('edit', { user: req.user });
logger.debug(`<<< Exiting edit(req=${req},res=${res},next=${next})`);
};

exports.show = function(req, res, next){
logger.debug(`>>> Entering show(req=${req},res=${res},next=${next})`);
  res.render('show', { user: req.user });
logger.debug(`<<< Exiting show(req=${req},res=${res},next=${next})`);
};

exports.update = function(req, res, next){
logger.debug(`>>> Entering update(req=${req},res=${res},next=${next})`);
  var body = req.body;
  req.user.name = body.user.name;
  res.message('Information updated!');
  res.redirect('/user/' + req.user.id);
logger.debug(`<<< Exiting update(req=${req},res=${res},next=${next})`);
};
