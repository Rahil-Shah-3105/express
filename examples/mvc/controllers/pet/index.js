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
logger.warn(`edit(req=${req}, res=${res}, next=${next}): GDPR-AUDIT [Art. 6]: Lawfulness of processing — State change recorded for the audit trail`, { "event.action": "edit" });
};

exports.update = function(req, res, next){
  var body = req.body;
  req.pet.name = body.pet.name;
logger.info(`update(req=${req}, res=${res}, next=${next}): GDPR-AUDIT [Art. 25]: Data protection by design and by default — State change recorded for the audit trail`, { "event.action": "update" });
  res.message('Information updated!');
  res.redirect('/pet/' + req.pet.id);
};
