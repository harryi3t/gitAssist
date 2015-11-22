'use strict';

var self = put;
module.exports = self;

var ACCOUNTS = require('./Model.js');

function put(newAccount, callback) {
  console.log('\nInside put. newAccount:', newAccount);

  var update = { $set: newAccount };

  if (newAccount._id) // data was already present in db so update it
    ACCOUNTS.findByIdAndUpdate(newAccount._id, update, function(err, oldAccount) {
      if (err)
        console.log(err);
      console.log('\nUpdated Account', newAccount);
      if(callback)
        callback(null, newAccount);
    });
  else
    ACCOUNTS.create(newAccount, function(err, data) {
      if (err){
        if (callback) {
          callback(err);
        }else
          console.error(err);
      }
      console.log('\nNew Account Created',data);
      if (callback) {
        callback(null, data);
      }
    });
}