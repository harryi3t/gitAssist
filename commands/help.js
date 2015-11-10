'use strict';

module.exports.pattern = /help/i;
module.exports.command  = 'help';
module.exports.run = run;

function run(commandText,map,callback){
  console.log('map in',map);
  var replyMessageText = 'Supported Commands are:\n```';
  map.forEach(function(command){
    replyMessageText += command.command + '\n';
  });
  replyMessageText += '```';
  callback(replyMessageText);
}