const logger = console;
'use strict'

/**
 * Module dependencies.
 */

var db = require('../../db');

exports.engine = 'ejs';

exports.before = function(req, res, next){
  var pet = db.pets[req.params.pet_id];
  if (!pet) return next('route');
  req.pet = pet;
  next();
};

exports.show = function(req, res, next){
  res.render('show', { pet: req.pet });
};

exports.edit = function(req, res, next){
  res.render('edit', { pet: req.pet });
logger.warn(`edit(req,res,next)=${req},${res},${next}: ISO27701-AUDIT: State change recorded for the audit trail`);
};

exports.update = function(req, res, next){
  var body = req.body;
  req.pet.name = body.pet.name;
  res.message('Information updated!');
logger.warn(`update(req,res,next)=${req},${res},${next}: ISO27701-AUDIT: State change recorded for the audit trail`);
  res.redirect('/pet/' + req.pet.id);
};
