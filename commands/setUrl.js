'use strict';

module.exports.pattern  = /set\surl\s<?[a-zA-Z0-9_:\/\.]+>?/i;
module.exports.command  = 'set url :email';
module.exports.run = run;

var async = require('async');
var postAccount = require('../api/accounts/post.js');

function run(commandText,callback) {
  var replyMessageText = '';

  var commandParts = commandText.trim().split(' ');
  if (!_isValidUrl(commandParts[2])) {
    replyMessageText = 'Invalid URL. Only github urls are allowed\n' + 
      'Did you forget to prepend `http://` or `https://`';
    callback(replyMessageText);
    return;
  }

  var url = commandParts[2];
  var account = {
    url: url
  };

  //replyMessageText = 'This should not be seen';

  postAccount(account, function(err, data) {
    if (err) {
      replyMessageText = 'These was some error. :-1::skin-tone-4:\nLeave us a mail about this issue';
      console.log(err);
    }
    else
      replyMessageText = 'Your repository url is successfully set. :+1::skin-tone-4: ';

    callback(replyMessageText);
  });
}

function _isValidUrl(url) {
  var pattern = /<(http:\/\/|https:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_]+\/[a-zA-Z0-9_]+>/i;
  return url.search(pattern) == 0;
}