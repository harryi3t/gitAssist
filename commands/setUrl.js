'use strict';

module.exports.pattern  = /set\surl\s[a-zA-Z0-9_]+/i;
module.exports.command  = 'set url :email';
module.exports.run = run;

function run(message,replyMessage) {

  var commandParts = message.text.trim().split(' ');
  if (!_isValidUrl(commandParts[2])) {
    message.text = 'Invalid URL. Only github urls are allowed :-1::skin-tone-4: ';
    return;
  }

  var url = commandParts[2];
  var account = {
    url: url
  };

  postAccount(account, function(err, data) {
    if (err) {
      message.text = 'These was some error. :-1::skin-tone-4:\nLeave us a mail about this issue';
      console.log(err);
    } else
      message.text = 'Your repository url is successfully set. :+1::skin-tone-4: ';
    self._reply(message);
  });

}

function _isValidUrl(url) {
  var pattern = /<(http:\/\/|https:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_]+\/[a-zA-Z0-9_]+>/i;
  return url.search(pattern) == 0;
}