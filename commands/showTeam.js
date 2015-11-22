'use strict';

var getAccount = require('../api/team/getS.js');

module.exports.pattern = /^show team$/i;
module.exports.command  = 'show team';
module.exports.run = run;

function run(commandText,callback){

  _getTeam(function(err,users){
    if(err)
      var replyMessageText = 'Error while getting team members: ' + err;
    else  
      var replyMessageText = 'Your team members are (of monitored Repos) \n>>>' + users;
    callback(replyMessageText);
  });
}

function _getTeam(callback){
  getAccount(function(err, team) {
    if (err) 
      callback(err);
    else{
      var users = '';
      team.forEach(function(user){
        // *Name* <https://github.com/username|username>
        users += '\n*' + user.name + '* <' + 
        "https://github.com/" + user.username + '|' + user.username + '>';
      });
      callback(null,users);
    }
  });
}