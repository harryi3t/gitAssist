'use strict';

var self = get;
module.exports = self;

var URL = require('./Model.js');

function get(callback) {
  console.log('\nStarting api|url|get');

  URL.findOne({},function (err, URLs) {
    if (err) {
      console.error('Error: ', err.errors.text.message);
      callback(err.errors.text.message);
    }
    callback(null,URLs);
  });
}