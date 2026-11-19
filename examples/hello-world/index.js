const logger = console;
'use strict'

var express = require('../../');

var app = module.exports = express()

app.get('/', function(req, res){
logger.error(`>>> Entering GET_root(req=${req},res=${res})`, { "event.action": "GET_root" });
  res.send('Hello World');
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
