'use strict';

var getAccount = require('../api/accounts/get.js');

module.exports.pattern = /^get all (repos|repositories)$/i;
module.exports.command  = 'get all repos|repositories';
module.exports.run = run;

function run(commandText,callback){

  _getRepos(function(err,repos){
    if(err)
      var replyMessageText = 'Error while getting the repositories: ' + err;
    else  
      var replyMessageText = 'Your repositories are: `' + repos + '`';
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