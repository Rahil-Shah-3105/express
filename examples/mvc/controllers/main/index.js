const logger = console;
'use strict'

exports.index = function(req, res){
  res.redirect('/users');
logger.info(`ENTERING: index() method`);
logger.warn(`ENTERING: index() method`);
};
