'use strict';

module.exports.pattern = /get url/i;
module.exports.command  = 'get url';
module.exports.run = run;

function run(commandText,callback){
  var replyMessageText = '`Get URL is under development`';
  callback(replyMessageText);
}