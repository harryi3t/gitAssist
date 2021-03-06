'use strict';

var self = get;
module.exports = self;

var ACCOUNTS = require('./Model.js');

function get(callback) {
  console.log('\nStarting api|accounts|get');

  ACCOUNTS.findOne({},function (err, account) {
    if (err) {
      console.error('Error: ', err.errors.text.message);
      callback(err.errors.text.message);
    }
    if(!account)
    account = {
      _id : null,
      url : null,
      token : null,
      privateRepos : [],
      monitoredRepos: []
    };

    console.log('\nGetAccount:',account);
    callback(null,account);
  });
}