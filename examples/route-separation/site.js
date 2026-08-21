const logger = console;
'use strict'

exports.index = function(req, res){
logger.debug(`>>> Entering index(req=${req},res=${res})`);
  res.render('index', { title: 'Route Separation Example' });
logger.debug(`<<< Exiting index(req=${req},res=${res})`);
};
