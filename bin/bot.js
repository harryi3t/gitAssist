'use strict';

var SlackAssistBot = require('../lib/SlackAssist');

var token = process.env.BOT_API_KEY;

var slackAssistBot = new SlackAssistBot({
  token: token
});

// Just to keep the app running on heroku
var http = require('http');
var port = process.env.PORT || 3000;

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(port, "127.0.0.1");

console.log('Server running');

slackAssistBot.run();
