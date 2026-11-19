const logger = console;
'use strict'

/**
 * Module dependencies.
 */

var express = require('../..');
var hash = require('pbkdf2-password')()
var path = require('node:path');
var session = require('express-session');

var app = module.exports = express();

// config

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// middleware

app.use(express.urlencoded())
app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'shhhh, very secret'
}));

// Session-persisted message middleware

app.use(function(req, res, next){
  var err = req.session.error;
  var msg = req.session.success;
  delete req.session.error;
  delete req.session.success;
  res.locals.message = '';
  if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
  if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
  next();
});

// placeholder database

var users = {
  tj: { name: 'tj' }
};

// when you create a user, generate a salt
// and hash the password ('foobar' is the pass here)

hash({ password: 'foobar' }, function (err, pass, salt, hash) {
  if (err) throw err;
  // store the salt & hash in the "db"
  users.tj.salt = salt;
  users.tj.hash = hash;
});


// Authenticate using our plain-object database of doom!

function authenticate(name, pass, fn) {
logger.error(`>>> Entering authenticate(name=${name},pass=${pass},fn=${fn})`, { "event.action": "authenticate", "logrite.name": name, "logrite.pass": pass, "logrite.fn": fn });
  if (!module.parent) console.log('authenticating %s:%s', name, pass);
  var user = users[name];
  // query the db for the given username
  if (!user) return fn(null, null)
  // apply the same algorithm to the POSTed password, applying
  // the hash against the pass / salt, if there is a match we
  // found the user
  hash({ password: pass, salt: user.salt }, function (err, pass, salt, hash) {
    if (err) return fn(err);
    if (hash === user.hash) return fn(null, user)
    fn(null, null)
  });
}

function restrict(req, res, next) {
logger.error(`>>> Entering restrict(req=${req},res=${res},next=${next})`, { "event.action": "restrict" });
  if (req.session.user) {
    next();
  } else {
    req.session.error = 'Access denied!';
    res.redirect('/login');
	logger.warn(`<<< Exiting restrict(req=${req},res=${res},next=${next})`, { "event.action": "restrict" });
  }
}

app.get('/', function(req, res){
logger.error(`>>> Entering GET_root(req=${req},res=${res})`, { "event.action": "GET_root" });
  res.redirect('/login');
});

app.get('/restricted', restrict, function(req, res){
logger.error(`>>> Entering GET_restricted(req=${req},res=${res})`, { "event.action": "GET_restricted" });
  res.send('Wahoo! restricted area, click to <a href="/logout">logout</a>');
});

app.get('/logout', function(req, res){
logger.error(`>>> Entering GET_logout(req=${req},res=${res})`, { "event.action": "GET_logout" });
  // destroy the user's session to log them out
  // will be re-created next request
  req.session.destroy(function(){
    res.redirect('/');
  });
});

app.get('/login', function(req, res){
logger.error(`>>> Entering GET_login(req=${req},res=${res})`, { "event.action": "GET_login" });
  res.render('login');
});

app.post('/login', function (req, res, next) {
logger.error(`>>> Entering POST_login(req=${req},res=${res},next=${next})`, { "event.action": "POST_login" });
  if (!req.body) return res.sendStatus(400)
  authenticate(req.body.username, req.body.password, function(err, user){
    if (err) return next(err)
    if (user) {
      // Regenerate session when signing in
      // to prevent fixation
      req.session.regenerate(function(){
        // Store the user's primary key
        // in the session store to be retrieved,
        // or in this case the entire user object
        req.session.user = user;
        req.session.success = 'Authenticated as ' + user.name
          + ' click to <a href="/logout">logout</a>. '
          + ' You may now access <a href="/restricted">/restricted</a>.';
        res.redirect(req.get('Referrer') || '/');
      });
    } else {
      req.session.error = 'Authentication failed, please check your '
        + ' username and password.'
        + ' (use "tj" and "foobar")';
      res.redirect('/login');
	logger.warn(`<<< Exiting POST_login(req=${req},res=${res},next=${next})`, { "event.action": "POST_login" });
    }
  });
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
