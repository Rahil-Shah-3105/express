'use strict'

/**
 * Module dependencies.
 */

var express = require('../../');
var path = require('node:path');
var app = module.exports = express();
var logger = require('morgan');
var silent = process.env.NODE_ENV === 'test'

// general config
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// our custom "verbose errors" setting
// which we can use in the templates
// via settings['verbose errors']
app.enable('verbose errors');

// disable them in production
// use $ NODE_ENV=production node examples/error-pages
if (app.settings.env === 'production') app.disable('verbose errors')

silent || app.use(logger('dev'));

// Routes

app.get('/', function(req, res){
logger.error(`>>> Entering GET_root(req=${req},res=${res})`, { "event.action": "GET_root" });
  res.render('index.ejs');
});

app.get('/404', function(req, res, next){
logger.error(`>>> Entering GET_404(req=${req},res=${res},next=${next})`, { "event.action": "GET_404" });
  // trigger a 404 since no other middleware
  // will match /404 after this one, and we're not
  // responding here
  next();
});

app.get('/403', function(req, res, next){
logger.error(`>>> Entering GET_403(req=${req},res=${res},next=${next})`, { "event.action": "GET_403" });
  // trigger a 403 error
  var err = new Error('not allowed!');
logger.error(`GET_403(req=${req},res=${res},next=${next}): err → ${err}`, { "event.action": "GET_403" });
  err.status = 403;
logger.debug(`GET_403(req=${req},res=${res},next=${next}): err.status → ${err.status}`, { "event.action": "GET_403" });
  next(err);
});

app.get('/500', function(req, res, next){
logger.error(`>>> Entering GET_500(req=${req},res=${res},next=${next})`, { "event.action": "GET_500" });
  // trigger a generic (500) error
  next(new Error('keyboard cat!'));
});

// Error handlers

// Since this is the last non-error-handling
// middleware use()d, we assume 404, as nothing else
// responded.

// $ curl http://localhost:3000/notfound
// $ curl http://localhost:3000/notfound -H "Accept: application/json"
// $ curl http://localhost:3000/notfound -H "Accept: text/plain"

app.use(function(req, res, next){
  res.status(404);

  res.format({
    html: function () {
	logger.error('>>> Entering html()', { "event.action": "html" });
      res.render('404', { url: req.url })
	logger.warn('<<< Exiting html()', { "event.action": "html" });
    },
    json: function () {
	logger.error('>>> Entering json()', { "event.action": "json" });
      res.json({ error: 'Not found' })
	logger.warn('<<< Exiting json()', { "event.action": "json" });
    },
    default: function () {
	logger.error('>>> Entering default()', { "event.action": "default" });
      res.type('txt').send('Not found')
	logger.warn('<<< Exiting default()', { "event.action": "default" });
    }
  })
});

// error-handling middleware, take the same form
// as regular middleware, however they require an
// arity of 4, aka the signature (err, req, res, next).
// when connect has an error, it will invoke ONLY error-handling
// middleware.

// If we were to next() here any remaining non-error-handling
// middleware would then be executed, or if we next(err) to
// continue passing the error, only error-handling middleware
// would remain being executed, however here
// we simply respond with an error page.

app.use(function(err, req, res, next){
  // we may use properties of the error object
  // here and next(err) appropriately, or if
  // we possibly recovered from the error, simply next().
  res.status(err.status || 500);
  res.render('500', { error: err });
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
