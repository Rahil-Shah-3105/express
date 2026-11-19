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
logger.info(`edit(req=${req}, res=${res}, next=${next}): PCI-AUDIT: Audit coverage — State change recorded for the audit trail`, { "event.action": "edit" });
};

exports.update = function(req, res, next){
  var body = req.body;
  req.pet.name = body.pet.name;
logger.info(`update(req=${req}, res=${res}, next=${next}): PCI-AUDIT [Req. 10.7]: Security control failure — State change recorded for the audit trail`, { "event.action": "update" });
  res.message('Information updated!');
  res.redirect('/pet/' + req.pet.id);
};
