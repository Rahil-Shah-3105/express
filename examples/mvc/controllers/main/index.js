const logger = console;
'use strict'

exports.index = function(req, res){
logger.error(`>>> Entering index(req=${req},res=${res})`, { "event.action": "index" });
  res.redirect('/users');
logger.warn(`<<< Exiting index(req=${req},res=${res})`, { "event.action": "index" });
};
