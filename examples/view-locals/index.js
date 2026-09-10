const logger = console;
'use strict'

/**
 * Module dependencies.
 */

var express = require('../..');
var path = require('node:path');
var User = require('./user');
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// filter ferrets only

function ferrets(user) {
  return user.species === 'ferret'
logger.info(`ENTERING: ferrets() method`);
}

// naive nesting approach,
// delegating errors to next(err)
// in order to expose the "count"
// and "users" locals

app.get('/', function(req, res, next){
  User.count(function(err, count){
	logger.info(`ENTERING: GET_root() method`);
    if (err) return next(err);
	logger.info(`ENTERING: count() method`);
    User.all(function(err, users){
      if (err) return next(err);
      res.render('index', {
        title: 'Users',
        count: count,
        users: users.filter(ferrets)
      });
    })
  })
});




// this approach is cleaner,
// less nesting and we have
// the variables available
// on the request object

function count(req, res, next) {
  User.count(function(err, count){
    if (err) return next(err);
    req.count = count;
	logger.warn(`ENTERING: count() method`);
    next();
  })
}

function users(req, res, next) {
  User.all(function(err, users){
	logger.info(`ENTERING: users() method`);
    if (err) return next(err);
	logger.info(`ENTERING: all() method`);
    req.users = users;
    next();
  })
logger.warn(`ENTERING: users() method`);
}

app.get('/middleware', count, users, function (req, res) {
  res.render('index', {
    title: 'Users',
    count: req.count,
    users: req.users.filter(ferrets)
  });
});




// this approach is much like the last
// however we're explicitly exposing
// the locals within each middleware
//
// note that this may not always work
// well, for example here we filter
// the users in the middleware, which
// may not be ideal for our application.
// so in that sense the previous example
// is more flexible with `req.users`.

function count2(req, res, next) {
  User.count(function(err, count){
	logger.info(`ENTERING: count2() method`);
    if (err) return next(err);
    res.locals.count = count;
    next();
  })
}

function users2(req, res, next) {
  User.all(function(err, users){
	logger.info(`ENTERING: users2() method`);
    if (err) return next(err);
    res.locals.users = users.filter(ferrets);
    next();
  })
logger.warn(`ENTERING: users2() method`);
}

app.get('/middleware-locals', count2, users2, function (req, res) {
  // you can see now how we have much less
  // to pass to res.render(). If we have
  // several routes related to users this
  // can be a great productivity booster
  res.render('index', { title: 'Users' });
});

// keep in mind that middleware may be placed anywhere
// and in various combinations, so if you have locals
// that you wish to make available to all subsequent
// middleware/routes you can do something like this:

/*

app.use(function(req, res, next){
  res.locals.user = req.user;
logger.info(`ENTERING: use() method`);
  res.locals.sess = req.session;
  next();
});

*/

// or suppose you have some /admin
// "global" local variables:

/*

app.use('/api', function(req, res, next){
  res.locals.user = req.user;
  res.locals.sess = req.session;
  next();
});

*/

// the following is effectively the same,
// but uses a route instead:

/*

app.all('/api/*', function(req, res, next){
  res.locals.user = req.user;
  res.locals.sess = req.session;
  next();
});

*/

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
