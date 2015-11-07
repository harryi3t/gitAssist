'use strict';

//var SlackAssistBot = require('./lib/SlackAssist');
var express = require('express');
var app = express(); // create our app w/ express
var morgan = require('morgan'); // log requests to the console (express4)
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var router = express.Router();
var path = require('path');

var path = require('path');
var methodOverride = require('method-override');

var token = process.env.BOT_API_KEY;

/*var slackAssistBot = new SlackAssistBot({
  token: token
});*/

var mimeTypes = {
  "css" : "text/css",
  "js"  : "text/javascript"
}

app.use(express.static(__dirname + 'www'));
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({
  'extended': 'true'
})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({
  type: 'application/vnd.api+json'
})); // parse application/vnd.api+json as json
app.use(methodOverride());

app.use('/www/*', function(req, res) {
  var extention = req.originalUrl.split('.').reverse()[0];
  var mimeType = mimeTypes[extention];
  if(typeof mimeType === 'undefined') {
    console.log('undefined type');
    mimeType = 'text/plain';
  }
  res.set('Content-Type', mimeType);
  res.sendFile(path.join(__dirname, req.originalUrl));
});

app.get('/auth/github', function(req, res) {
  console.log(req.query.code);
  res.sendFile(__dirname + '/www/public/app.html'); // load the single view file (angular will handle the page changes on the front-end)
});

app.get('/*', function(req, res) {
  res.sendFile(__dirname + '/www/public/app.html'); // load the single view file (angular will handle the page changes on the front-end)
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('listening on', port);
});

//slackAssistBot.run();