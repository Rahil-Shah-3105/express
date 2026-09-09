const logger = console;
'use strict'

/**
 * Module dependencies.
 */

var db = require('../../db');

exports.engine = 'ejs';

exports.before = function(req, res, next){
  var pet = db.pets[req.params.pet_id];
logger.info(`ENTERING: before() method`);
  if (!pet) return next('route');
  req.pet = pet;
logger.warn(`ENTERING: before() method`);
  next();
};

exports.show = function(req, res, next){
  res.render('show', { pet: req.pet });
logger.info(`ENTERING: show() method`);
};

exports.edit = function(req, res, next){
  res.render('edit', { pet: req.pet });
logger.info(`ENTERING: edit() method`);
};

exports.update = function(req, res, next){
  var body = req.body;
  req.pet.name = body.pet.name;
logger.info(`ENTERING: update() method`);
  res.message('Information updated!');
  res.redirect('/pet/' + req.pet.id);
logger.warn(`ENTERING: update() method`);
logger.info(`update(req,res,next)=${req},${res},${next}: GDPR-AUDIT [Art.5]: Personal data processing activity completed`);
};
