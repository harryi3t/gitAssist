'use strict';

module.exports.pattern  = /^monitor(\s.*$|$)/i;
module.exports.command  = 'monitor :[user/repo] [org/repo]';
module.exports.run = run;

var putAccount = require('../api/accounts/put.js');
var getAccount = require('../api/accounts/get.js');

function run(commandText,callback) {
  console.log('\nStarting addMonitoredRepo');
  var replyMessageText = '';

  var commandParts = commandText.trim().split(' '); 
  if(commandParts.length === 1 || 
    (commandParts.length===2 && commandParts[1] === '')){
    replyMessageText = "`Error: Missing Repository`";
    callback(replyMessageText);
    return;
  }
  else if(commandParts.length > 2){
    replyMessageText = '`Error: Invalid Parameter`\nCorrect Usage:' + 
      '`monitor repo :[user/repo] [org/repo]`\n' +
      'Eg. `monitor repo harryi3t/slackassist`';
    callback(replyMessageText);
    return;
  }
  else if (!_isValidRepo(commandParts[1])) {
    replyMessageText = '`Error: Invalid Repository Name`\n' +
      'Correct Syntax for Repository is `user/repo` or `org/repo`\n' + 
      'Eg. `harryi3t/slackassist`';
    callback(replyMessageText);
    return;
  }

  var repo = commandParts[1];

  updateAccount(repo,callback);
}

function _isValidRepo(repo) {
  var pattern = /[a-zA-Z_]+\/[a-zA-Z_]+/i;
  return repo.search(pattern) === 0;
}

function getNullOrValue(value) {
  if (typeof value === 'undefined')
    return null;
  return value;
}

function updateAccount(newRepoToMonitor,callback){
  getAccount(function(err,account){
    if(err){
      console.error('err', err);
      var replyMessageText = "`Error: Database Error`";
      callback(replyMessageText);
    }
    else{
      // If the new value is not present then check for the old value
     account.monitoredRepos.push(newRepoToMonitor);
      putAccount(account, function(err, data) {
        console.log('Data Returned from putAccount',data);
        var replyMessageText = '';
        if (err) {
          replyMessageText = 'These was some error. :-1::skin-tone-4:\nLeave us a mail about this issue';
          console.log(err);
        }
        else
          replyMessageText = 'The Repository is now monitored. :+1::skin-tone-4: ';

        callback(replyMessageText);
      });
    }

  });
}
