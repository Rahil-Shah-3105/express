const logger = console;
'use strict'

/**
 * Module dependencies.
 */

var db = require('../../db');

exports.name = 'pet';
exports.prefix = '/user/:user_id';

exports.create = function(req, res, next){
logger.debug(`>>> Entering create(req=${req},res=${res},next=${next})`);
  var id = req.params.user_id;
  var user = db.users[id];
logger.debug(`create(req=${req},res=${res},next=${next}): id → ${id}`);
  var body = req.body;
  if (!user) return next('route');
logger.debug(`<<< Exiting create(req=${req},res=${res},next=${next})`);
  var pet = { name: body.pet.name };
  pet.id = db.pets.push(pet) - 1;
  user.pets.push(pet);
  res.message('Added pet ' + body.pet.name);
  res.redirect('/user/' + id);
};
