'use strict';

module.exports.pattern  = /^monitor(\s.*$|$)/i;
module.exports.command  = 'monitor :[user/repo] [org/repo]';
module.exports.run = run;

var Client = require('node-rest-client').Client;

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
  //TODO: use aysnc.series
  getAccount(function(err,account){
    if(err){
      console.error('err', err);
      callback("`Error: Database Error`");
    }
    else{
      //Check if repo is accessible
      _isRepoAccessible(newRepoToMonitor,function(err,response){
        if(err){
          callback(err);
          return;
        }
        if(!response){
          callback("`Error: Repository Invalid or Not Accessible.`");
          return;
        }
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
      });
    }

  });
}

function _isRepoAccessible(repo,callback){
  var access_token = null;
  var client = new Client();
  var args = {
    "headers" : { "User-Agent" : "SlackAssist-App" }
  };

  _getAccessToken(function(err,token){
    if(err){
      console.log(err);
      callback("`Error: TOKEN not found.`\n" +
        "Please authorize here https://gitassist.herokuapp.com");
      return;
    }
    access_token = token;
    console.log("\nCalling github to check the repo");

    client.get("https://api.github.com/repos/" + repo + 
      "?access_token=" + access_token, args, function(response) {
        response = JSON.parse(response.toString());
        if(response.message)
          callback(null,false);
        else
          callback(null,true);
    });
  });
}

function _getAccessToken(callback){
  getAccount(function(err,account){
    if(err || !account.token)
      callback("Token not found");
    else
      callback(null,account.token);
  });
}
//TODO: check scenatio 1 : TOKEN NOT FOUND link should come
