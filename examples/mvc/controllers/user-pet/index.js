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
logger.info(`ENTERING: create() method`);
  var user = db.users[id];
  var body = req.body;
logger.warn(`ENTERING: create() method`);
  if (!user) return next('route');
  var pet = { name: body.pet.name };
  pet.id = db.pets.push(pet) - 1;
  user.pets.push(pet);
logger.warn(`create(req,res,next)=${req},${res},${next}: GDPR-AUDIT: State change recorded for the audit trail ${id}`);
  res.message('Added pet ' + body.pet.name);
  res.redirect('/user/' + id);
};
