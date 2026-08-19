const logger = console;
'use strict'

/**
 * Module dependencies.
 */

var db = require('../../db');

exports.engine = 'ejs';

exports.before = function(req, res, next){
logger.debug(`>>> Entering before(req=${req},res=${res},next=${next})`);
  var pet = db.pets[req.params.pet_id];
  if (!pet) return next('route');
logger.debug(`<<< Exiting before(req=${req},res=${res},next=${next})`);
  req.pet = pet;
logger.debug(`before(req=${req},res=${res},next=${next}): req.pet → ${req.pet}`);
  next();
};

exports.show = function(req, res, next){
logger.debug(`>>> Entering show(req=${req},res=${res},next=${next})`);
  res.render('show', { pet: req.pet });
logger.debug(`<<< Exiting show(req=${req},res=${res},next=${next})`);
};

exports.edit = function(req, res, next){
logger.debug(`>>> Entering edit(req=${req},res=${res},next=${next})`);
  res.render('edit', { pet: req.pet });
logger.debug(`<<< Exiting edit(req=${req},res=${res},next=${next})`);
};

exports.update = function(req, res, next){
logger.debug(`>>> Entering update(req=${req},res=${res},next=${next})`);
  var body = req.body;
  req.pet.name = body.pet.name;
  res.message('Information updated!');
  res.redirect('/pet/' + req.pet.id);
logger.debug(`<<< Exiting update(req=${req},res=${res},next=${next})`);
};
