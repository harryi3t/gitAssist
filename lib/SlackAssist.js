"use strict";

var util = require('util');
var path = require('path');
var fs = require('fs');
var Bot = require('slackbots');
var _ = require('underscore');
var mongoose = require('mongoose');
var async = require('async');

var mongoUrl = process.env.BOT_MONGO_URL || 'mongodb://localhost';
mongoose.connect(mongoUrl);

var getAccount = require('../api/accounts/get.js');
var commandMap = require('../commandMap.js');

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
  getAccount(function(err,data){
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
  if(message.type !== 'message') // filters out event messages
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

  commandMap.findAndRun(message,this._reply.bind(this));

};

SlackAssistBot.prototype._reply = function(replyMessage) {
  if(replyMessage.channel){
    this.postMessageToChannel(replyMessage.channel, replyMessage.text, {
      as_user: true
    });
  }
  else{
    this.postMessageToUser(replyMessage.user, replyMessage.text, {
      as_user: true
    });
  }
};

// Removes its own tag (@gitassist) from message
SlackAssistBot.prototype._removeSelfTag = function(message){
  if(message.text.indexOf('<@' + this.bot.id + '>') > -1){
    message.text = message.text.slice(14); //lenght of <@UserID>
  }
  message.text = message.text.trim();
}

SlackAssistBot.prototype._hasSelfTag = function(message){
  return message.text.indexOf('<@' + this.bot.id + '>') > -1;
}


module.exports = SlackAssistBot;