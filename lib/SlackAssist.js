"use strict";

var util = require('util');
var path = require('path');
var fs = require('fs');
var Bot = require('slackbots');
var _ = require('underscore');
var mongoose = require('mongoose');
var async = require('async');

var mongoUrl = process.env.BOT_MONGO_URL;
mongoose.connect(mongoUrl);

var postUrl = require('../api/url/post.js');
var getUrl = require('../api/url/get.js');

var SlackAssistBot = function Constructor(settings) {
  this.settings = settings;
  this.settings.name = this.settings.name || 'SlackAssistBot';
  this.globalUsers = {};
  this.globalChannels = {};
};

util.inherits(SlackAssistBot, Bot);

SlackAssistBot.prototype.run = function() {
  SlackAssistBot.super_.call(this, this.settings);
  this.on('start', this._onStart);
  this.on('message', this._onMessage);
};

SlackAssistBot.prototype._onStart = function() {
  var self = this;
  this._loadBotUser();
  this._firstRunCheck();
  getUrl(function(err,data){
    if(err){
      console.error('Error:',err);
      self.postMessageToChannel('test', err , {
        as_user: true
      });
    }
    else{
      var mesg = 'Your current repository is: ' + data.url;
      self.postMessageToChannel('test', mesg , {
        as_user: true
      }); 
    }
  });
};

SlackAssistBot.prototype._loadBotUser = function() {
  var self = this;
  this.bot = this.users.filter(function(user) {
    return user.name === 'gitassist';
  })[0];
};

SlackAssistBot.prototype._firstRunCheck = function() {
  var globalUsers = {};
  var globalChannels = {};
  
  _.each(this.users,function(user){
    globalUsers[user.id] = {
      "name" : user.name,
      "id"   : user.id,
      "real_name" : user.real_name,
      "is_bot"  : user.is_bot
    };
  });
  this.globalUsers = globalUsers;

  _.each(this.channels,function(channel){
    globalChannels[channel.id] = {
      "name" : channel.name,
      "id"   : channel.id
    };
  });
  this.globalChannels = globalChannels;

};

SlackAssistBot.prototype._onMessage = function(message) {
  var self = this;
  if(!self._isChatMessage(message)) // filters out event messages
    return;

  message.user = self.globalUsers[message.user].name;
  message.channel = self.globalChannels[message.channel];
  message.channel = (typeof message.channel === 'undefined') ? 
    null :  message.channel.name;

  var isBot = (message.user === self.bot.name);

  if(isBot) return;

  if(message.channel && !this._hasSelfTag(message))
    return; // skip as @bot not used in channel

  this._removeSelfTag(message);

  console.log(message);

  if(_isSetUrlCommand(message)){
    console.log('_isSetUrlCommand valid');
    var url = message.text.trim().split(' ')[2];
    postUrl(url,function(url){
      console.log('callback',url);
      message.text = 'Your repository url is successfully set. :+1::skin-tone-4: ';
      self._reply(message);
    });
  } 
  else{
    console.log('_isSetUrlCommand invalid');
    self._reply(message);
  }

};

SlackAssistBot.prototype._isChatMessage = function(message) {
  return message.type === 'message';
};

SlackAssistBot.prototype._reply = function(message) {
  if(message.channel){
    this.postMessageToChannel(message.channel, message.text, {
      as_user: true
    });
  }
  else{
    this.postMessageToUser(message.user, message.text, {
      as_user: true
    });
  }
};

SlackAssistBot.prototype._checkPossibleCommands = function(message) {
  var userId = this.globalUsers[message.user].name;
  console.log('sending '+userId+' '+message.text);

  this.postMessageToUser(userId, message.text, {
    as_user: true
  });
};



// Removes its own tag (@gitassist) from message
SlackAssistBot.prototype._removeSelfTag = function(message){
  if(message.text.indexOf('<@' + this.bot.id + '>') > -1){
    message.text = message.text.slice(14); //lenght of <@UserID>
  }
}

SlackAssistBot.prototype._hasSelfTag = function(message){
  return message.text.indexOf('<@' + this.bot.id + '>') > -1;
}

function _isSetUrlCommand(message) {
  var commandParts = message.text.trim().split(' ');
  
  if(!commandParts.length == 3 ||
    commandParts[0].toLowerCase() !== 'set' ||
    commandParts[1].toLowerCase() !== 'url'){
    message.text = 'Invalid Command. Please type help for supported commands';
    return false;
  }
  else if(_isValidUrl(commandParts[2])){
    return true;
  }
  else{ 
    message.text = 'Invalid URL. Only github urls are allowed :-1::skin-tone-4: ';
    return false;
  }
};

function _isValidUrl(url){
  var pattern = /<(http:\/\/|https:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_]+\/[a-zA-Z0-9_]+>/i;
  return url.search(pattern) == 0;
}


module.exports = SlackAssistBot;