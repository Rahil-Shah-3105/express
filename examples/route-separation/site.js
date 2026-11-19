const logger = console;
'use strict'

exports.index = function(req, res){
logger.error(`>>> Entering index(req=${req},res=${res})`, { "event.action": "index" });
  res.render('index', { title: 'Route Separation Example' });
logger.warn(`<<< Exiting index(req=${req},res=${res})`, { "event.action": "index" });
};
