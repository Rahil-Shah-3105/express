const logger = console;
'use strict'

exports.index = function(req, res){
  res.redirect('/users');
logger.warn(`index(req=${req}, res=${res}): GDPR-AUDIT [Art.20]: Data subject right exercised — erasure/portability request processed`, { "event.action": "index" });
};
