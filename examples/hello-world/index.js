const logger = console;
'use strict'

var express = require('../../');

var app = module.exports = express()

app.get('/', function(req, res){
logger.debug(`>>> Entering GET_root(req=${req},res=${res})`);
  res.send('Hello World');
});
logger.debug(`<<< Exiting GET_root(req=${req},res=${res})`);

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
