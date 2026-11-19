const logger = console;
'use strict'

/**
 * Module dependencies.
 */

var db = require('../../db');

exports.name = 'pet';
exports.prefix = '/user/:user_id';

exports.create = function(req, res, next){
logger.error(`>>> Entering create(req=${req},res=${res},next=${next})`, { "event.action": "create" });
  var id = req.params.user_id;
  var user = db.users[id];
logger.error(`create(req=${req},res=${res},next=${next}): id → ${id}`, { "event.action": "create" });
  var body = req.body;
  if (!user) return next('route');
logger.warn(`<<< Exiting create(req=${req},res=${res},next=${next})`, { "event.action": "create" });
  var pet = { name: body.pet.name };
  pet.id = db.pets.push(pet) - 1;
  user.pets.push(pet);
  res.message('Added pet ' + body.pet.name);
  res.redirect('/user/' + id);
};
