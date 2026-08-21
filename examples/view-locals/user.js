const logger = console;
'use strict'

module.exports = User;

// faux model

function User(name, age, species) {
logger.debug(`>>> Entering User(name=${name},age=${age},species=${species})`);
  this.name = name;
  this.age = age;
  this.species = species;
logger.debug(`User(name=${name},age=${age},species=${species}): age → ${age}`);
}

User.all = function(fn){
logger.debug(`>>> Entering function(fn=${fn})`);
  // process.nextTick makes sure this function API
  // behaves in an asynchronous manner, like if it
  // was a real DB query to read all users.
  process.nextTick(function(){
	logger.debug('>>> Entering nextTick()');
    fn(null, users);
  });
logger.debug(`<<< Exiting function(fn=${fn})`);
};

User.count = function(fn){
  process.nextTick(function(){
    fn(null, users.length);
  });
};

// faux database

var users = [];

users.push(new User('Tobi', 2, 'ferret'));
users.push(new User('Loki', 1, 'ferret'));
users.push(new User('Jane', 6, 'ferret'));
users.push(new User('Luna', 1, 'cat'));
users.push(new User('Manny', 1, 'cat'));
