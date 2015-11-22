'use strict';

module.exports.pattern  = /^set\surl\s<?[a-zA-Z0-9_:\/\.]+>?$/i;
module.exports.command  = 'set url :URL';
module.exports.run = run;

var async = require('async');
var putAccount = require('../api/accounts/put.js');
var getAccount = require('../api/accounts/get.js');

function run(commandText,callback) {
  console.log('\nStarting setUrl');
  var replyMessageText = '';

  var commandParts = commandText.trim().split(' ');
  if (!_isValidUrl(commandParts[2])) {
    replyMessageText = 'Invalid URL. Only github urls are allowed\n' + 
      'Did you forget to prepend `http://` or `https://`';
    callback(replyMessageText);
    return;
  }

  var url = commandParts[2];

  getAccount(function(err,account){
    if(err){
      console.error('err', err);
      var replyMessageText = "`Error: Database Error`";
      callback(replyMessageText);
    }
    else{
      account.url = url;
      putAccount(account, function(err, data) {
        var replyMessageText = '';
        if (err) {
          replyMessageText = 'These was some error. :-1::skin-tone-4:\nLeave us a mail about this issue';
          console.log(err);
        }
        else
          replyMessageText = 'Your current URL has been updated to ' + 
            data.url + ':+1::skin-tone-4: ';

        callback(replyMessageText);
      });
    }
  });
}

function getNullOrValue(value) {
  if (typeof value === 'undefined')
    return null;
  return value;
}

function _isValidUrl(url) {
  var pattern = /<(http:\/\/|https:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_]+\/[a-zA-Z0-9_]+>/i;
  return url.search(pattern) == 0;
}