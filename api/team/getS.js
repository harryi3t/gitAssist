'use strict';

var self = get;
module.exports = self;

var TEAM = require('./Model.js');

function get(callback) {
  console.log('\nStarting api|teams|get');

  TEAM.find({},function (err, team) {
    if (err) {
      console.error('Error: ', err.errors.text.message);
      callback(err.errors.text.message);
    }
    console.log('\nGetTeam:',team);
    callback(null,team);
  });
}