'use strict';

var self = post;
module.exports = self;

var ACCOUNTS = require('./Model.js');

function post(account,callback) {
  console.log('Inside post. account:',account);

  ACCOUNTS.remove({},function(err){
    if(err)
      console.log(err);

    var url = getNullOrValue(account.url);
    var token = getNullOrValue(account.token);
    var repositories = getNullOrValue(account.repositories);


    var newAccount = {
      url: url,
      token: token,
      repositories: repositories ? repositories : []
    };

    ACCOUNTS.create(newAccount, function (err, data) {
      if (err)
        console.log(err);
      console.log(data);
      if(callback){
        callback(data.url);
      }
    });

  });
}

function getNullOrValue(value){
  if(typeof value === 'undefined')
    return null;
  return value;
}
