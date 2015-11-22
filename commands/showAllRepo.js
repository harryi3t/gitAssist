'use strict';

var getAccount = require('../api/accounts/get.js');

module.exports.pattern = /^show all (repos|repositories)$/i;
module.exports.command  = 'show all repos|repositories';
module.exports.run = run;

function run(commandText,callback){

  _getRepos(function(err,repos){
    if(err)
      var replyMessageText = 'Error while getting the repositories: ' + err;
    else  
      var replyMessageText = 'Your private repositories are: ```' + repos + '```';
    callback(replyMessageText);
  });
}

function _getRepos(callback){
  getAccount(function(err, data) {
    if (err) 
      callback(err);
    else{
      var repoList = '';
      data.privateRepos.forEach(function(repo){
        repoList += '\n' + repo;
      });
      callback(null,repoList);
    }
  });
}