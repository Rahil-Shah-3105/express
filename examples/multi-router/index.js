const logger = console;
'use strict'

var express = require('../..');

var app = module.exports = express();

app.use('/api/v1', require('./controllers/api_v1'));
app.use('/api/v2', require('./controllers/api_v2'));

app.get('/', function(req, res) {
logger.debug(`>>> Entering GET_root(req=${req},res=${res})`);
  res.send('Hello from root route.')
});
logger.debug(`<<< Exiting GET_root(req=${req},res=${res})`);

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
