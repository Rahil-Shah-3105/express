const logger = console;
'use strict'

exports.index = function(req, res){
  res.render('index', { title: 'Route Separation Example' });
logger.info(`ENTERING: index() method`);
logger.warn(`ENTERING: index() method`);
};
