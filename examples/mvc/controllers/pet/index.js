const logger = console;
'use strict'

/**
 * Module dependencies.
 */

var db = require('../../db');

exports.engine = 'ejs';

exports.before = function(req, res, next){
logger.error(`>>> Entering before(req=${req},res=${res},next=${next})`, { "event.action": "before" });
  var pet = db.pets[req.params.pet_id];
  if (!pet) return next('route');
logger.warn(`<<< Exiting before(req=${req},res=${res},next=${next})`, { "event.action": "before" });
  req.pet = pet;
logger.debug(`before(req=${req},res=${res},next=${next}): req.pet → ${req.pet}`, { "event.action": "before" });
  next();
};

exports.show = function(req, res, next){
logger.error(`>>> Entering show(req=${req},res=${res},next=${next})`, { "event.action": "show" });
  res.render('show', { pet: req.pet });
logger.warn(`<<< Exiting show(req=${req},res=${res},next=${next})`, { "event.action": "show" });
};

exports.edit = function(req, res, next){
logger.error(`>>> Entering edit(req=${req},res=${res},next=${next})`, { "event.action": "edit" });
  res.render('edit', { pet: req.pet });
logger.warn(`<<< Exiting edit(req=${req},res=${res},next=${next})`, { "event.action": "edit" });
};

exports.update = function(req, res, next){
logger.error(`>>> Entering update(req=${req},res=${res},next=${next})`, { "event.action": "update" });
  var body = req.body;
  req.pet.name = body.pet.name;
  res.message('Information updated!');
  res.redirect('/pet/' + req.pet.id);
logger.warn(`<<< Exiting update(req=${req},res=${res},next=${next})`, { "event.action": "update" });
};
