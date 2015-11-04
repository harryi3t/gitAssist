'use strict';

var SlackAssistBot = require('../lib/SlackAssist');

var token = process.env.BOT_API_KEY;

var slackAssistBot = new SlackAssistBot({
  token: token
});

slackAssistBot.run();