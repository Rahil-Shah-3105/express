const logger = console;
'use strict'

exports.index = function(req, res){
logger.debug(`>>> Entering index(req=${req},res=${res})`);
  res.redirect('/users');
logger.debug(`<<< Exiting index(req=${req},res=${res})`);
};
