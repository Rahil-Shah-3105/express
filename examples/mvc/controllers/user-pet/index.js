const logger = console;
'use strict'

/**
 * Module dependencies.
 */

var db = require('../../db');

exports.name = 'pet';
exports.prefix = '/user/:user_id';

exports.create = function(req, res, next){
  var id = req.params.user_id;
  var user = db.users[id];
  var body = req.body;
logger.info(`create(req=${req}, res=${res}, next=${next}): CMMC-AUDIT: Media protection — State change recorded for the audit trail ${id}`, { "event.action": "create" });
  if (!user) return next('route');
  var pet = { name: body.pet.name };
  pet.id = db.pets.push(pet) - 1;
  user.pets.push(pet);
  res.message('Added pet ' + body.pet.name);
  res.redirect('/user/' + id);
};
