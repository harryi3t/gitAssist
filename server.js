'use strict';

var SlackAssistBot = require('./lib/SlackAssist');
var express = require('express');
var app = express(); // create our app w/ express
var morgan = require('morgan'); // log requests to the console (express4)
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var router = express.Router();
var path = require('path');
var methodOverride = require('method-override');
var postAccount = require('./api/accounts/post.js');

var token = process.env.BOT_API_KEY;

var slackAssistBot = new SlackAssistBot({token: token});

var mimeTypes = {
  "css" : "text/css",
  "js"  : "text/javascript",
  "ico" : "image/x-icon",
  "jpg" : "image/jpeg", 
  "jpeg" : "image/jpeg",
  "png" : "image/png", 
};

app.set('view engine', 'ejs');
app.set('views', __dirname + '/www/public/views');
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

app.get('/www/*', function(req, res) {
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
  console.log('code reveived: ',req.query.code);
  getAccessToken(req.query.code,function(err,data){
    if(err){
     res.render('pages/app',{error:err});
    }else{
      res.render('pages/app',{status:"Successfully Authenticated"});
    }
  });
});

app.get('/*', function(req, res) {
  res.render('pages/app');
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('listening on', port);
});

function getAccessToken(code,callback) {
  var Client = require('node-rest-client').Client;
  var client = new Client();

  var args = {
    data: {
      client_id       : "4cb2e781eaea4040f99d", 
      client_secret   : process.env.BOT_CLIENT_SECRET, 
      code            : code, 
      redirect_uri    : "http://localhost:3000/auth/github"
    },
    headers: {
      "Content-Type": "application/json"
    }
  };

  console.log("\nCalling github for getting access_token\n");

  client.post("https://github.com/login/oauth/access_token", args, function(data, response) {
    var message = data.toString();
    console.log("Message reveived: ",message);
    var firstWord = message.split('=')[0];
    if(firstWord === 'access_token'){
      var token = message.split("=")[1].split("&")[0];
      var account = {token : token , url : null};
      postAccount(account,function(err,data){
        if(err)
          callback("Error in saving data to db: "+err);
        else
          callback(null)
      });
    }else{
      if( message.split("=")[1] === 'bad_verification_code&error_description')
        callback("The Code sent is expired. Please click on the button again.");
      else  
        callback(message.split("=")[1]); // erro message
    }
  });
}

slackAssistBot.run();
