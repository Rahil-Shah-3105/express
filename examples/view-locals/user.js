const logger = console;
'use strict'

module.exports = User;

// faux model

function User(name, age, species) {
logger.error(`>>> Entering User(name=${name},age=${age},species=${species})`, { "event.action": "User", "logrite.name": name, "logrite.age": age, "logrite.species": species });
  this.name = name;
  this.age = age;
logger.debug(`User(name=${name},age=${age},species=${species}): this.age → ${this.age}`, { "event.action": "User", "logrite.name": name, "logrite.age": age, "logrite.species": species });
logger.debug(`User(name=${name},age=${age},species=${species}): this.name → ${this.name}`, { "event.action": "User", "logrite.name": name, "logrite.age": age, "logrite.species": species });
  this.species = species;
logger.debug(`User(name=${name},age=${age},species=${species}): this.species → ${this.species}`, { "event.action": "User", "logrite.name": name, "logrite.age": age, "logrite.species": species });
logger.warn(`<<< Exiting User(name=${name},age=${age},species=${species})`, { "event.action": "User", "logrite.name": name, "logrite.age": age, "logrite.species": species });
}

User.all = function(fn){
logger.error(`>>> Entering all(fn=${fn})`, { "event.action": "all", "logrite.fn": fn });
  // process.nextTick makes sure this function API
  // behaves in an asynchronous manner, like if it
  // was a real DB query to read all users.
  process.nextTick(function(){
    fn(null, users);
  });
logger.warn(`<<< Exiting all(fn=${fn})`, { "event.action": "all", "logrite.fn": fn });
};

User.count = function(fn){
logger.error(`>>> Entering count(fn=${fn})`, { "event.action": "count", "logrite.fn": fn });
  process.nextTick(function(){
    fn(null, users.length);
  });
logger.warn(`<<< Exiting count(fn=${fn})`, { "event.action": "count", "logrite.fn": fn });
};

// faux database

var users = [];

users.push(new User('Tobi', 2, 'ferret'));
users.push(new User('Loki', 1, 'ferret'));
users.push(new User('Jane', 6, 'ferret'));
users.push(new User('Luna', 1, 'cat'));
users.push(new User('Manny', 1, 'cat'));
