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
logger.info(`edit(req=${req}, res=${res}, next=${next}): NYCLL144-AUDIT: Aedt audit — State change recorded for the audit trail`, { "event.action": "edit" });
};

exports.update = function(req, res, next){
  var body = req.body;
  req.pet.name = body.pet.name;
  res.message('Information updated!');
logger.info(`update(req=${req}, res=${res}, next=${next}): NYCLL144-AUDIT: Candidate notice — State change recorded for the audit trail`, { "event.action": "update" });
  res.redirect('/pet/' + req.pet.id);
};
