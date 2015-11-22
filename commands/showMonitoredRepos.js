'use strict';

var getAccount = require('../api/accounts/get.js');

module.exports.pattern = /^show (repos|repositories)$/i;
module.exports.command  = 'show repos|repositories';
module.exports.run = run;

function run(commandText,callback){

  _getRepo(function(err,url){
    if(err)
      var replyMessageText = 'Error while getting current repository: ' + err;
    else  
      var replyMessageText = 'Your current repository is: ' + url;
    callback(replyMessageText);
  });
}

function _getRepo(callback){
  getAccount(function(err, data) {
    if (err) 
      callback(err);
    else
      callback(null,data.url);
  });
}