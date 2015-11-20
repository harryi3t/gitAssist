'use strict';

var self = get;
module.exports = self;

var ACCOUNTS = require('./Model.js');

function get(callback) {
  console.log('\nStarting api|url|get');

  ACCOUNTS.findOne({},function (err, account) {
    if (err) {
      console.error('Error: ', err.errors.text.message);
      callback(err.errors.text.message);
    }
    if(!account)
    account = {
      url : null,
      token : null,
      privateRepos : []
    };

    console.log(account);
    callback(null,account);
  });
}