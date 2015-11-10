'use strict';

module.exports.pattern = /help/i;
module.exports.command  = 'help';
module.exports.run = run;

function run(message,replyMessage,map){

  replyMessage.text = 'Supported Commands are:\n```';
  map.forEach(function(command){
    replyMessage.text += command.command + '\n';
  });
  replyMessage.text += '```';
}