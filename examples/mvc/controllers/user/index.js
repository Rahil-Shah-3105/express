const logger = console;
'use strict'

/**
 * Module dependencies.
 */

var db = require('../../db');

exports.engine = 'hbs';

exports.before = function(req, res, next){
  var id = req.params.user_id;
logger.info(`ENTERING: before() method`);
  if (!id) return next();
  // pretend to query a database...
  process.nextTick(function(){
	logger.warn(`ENTERING: before() method`);
    req.user = db.users[id];
	logger.info(`ENTERING: nextTick() method`);
    // cant find that user
    if (!req.user) return next('route');
    // found it, move on to the routes
    next();
  });
logger.warn(`before(req=${req}, res=${res}, next=${next}): GDPR-AUDIT [Art.20]: Data subject right exercised — erasure/portability request processed ${id}`);
};

exports.list = function(req, res, next){
  res.render('list', { users: db.users });
logger.info(`ENTERING: list() method`);
};

exports.edit = function(req, res, next){
  res.render('edit', { user: req.user });
logger.info(`ENTERING: edit() method`);
};

exports.show = function(req, res, next){
  res.render('show', { user: req.user });
};

exports.update = function(req, res, next){
  var body = req.body;
  req.user.name = body.user.name;
  res.message('Information updated!');
  res.redirect('/user/' + req.user.id);
logger.info(`ENTERING: update() method`);
logger.warn(`ENTERING: update() method`);
};
