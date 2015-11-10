'use strict';

module.exports.pattern = /get url/i;
module.exports.command  = 'get url';
module.exports.run = run;

function run(message,replyMessage){
  replyMessage.text = 'Get URL is under development';
}