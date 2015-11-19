'use strict';

var self = put;
module.exports = self;

var ACCOUNTS = require('./Model.js');

function put(account, callback) {
  console.log('Inside put. account:', account);

  ACCOUNTS.findOne({}, function(err, data) {
    if (err){
      console.log('err', err);
      return;
    }

    console.log('findOne Account',data);

    if (!data) 
      data = {
        url: null,
        token: null,
        repositories: []
      };

    // If the new value is not present then check for the old value
    var url = getNullOrValue(account.url) || getNullOrValue(data.url);
    var token = getNullOrValue(account.token) || getNullOrValue(data.token);
    var repositories = getNullOrValue(account.repositories) ||
      getNullOrValue(data.repositories);


    var newAccount = {
      url: url,
      token: token,
      repositories: repositories ? repositories : []
    };

    console.log('new/updated account',newAccount);

    var update = { $set: newAccount };

    if (data._id) // data was already present in db so update it
      ACCOUNTS.findByIdAndUpdate(data._id, update, function(err, data) {
        if (err)
          console.log(err);
        console.log('update data', data);
        if(callback)
          callback(null, data);
      });
    else
      ACCOUNTS.create(newAccount, function(err, data) {
        if (err){
          if (callback) {
            callback(err);
          }else
            console.error(err);
        }
        console.log(data);
        if (callback) {
          callback(null, data);
        }
      });
  });
}

function getNullOrValue(value) {
  if (typeof value === 'undefined')
    return null;
  return value;
}