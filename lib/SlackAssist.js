"use strict";

var util = require('util');
var path = require('path');
var fs = require('fs');
var Bot = require('slackbots');
var _ = require('underscore');

//var async = require('async');

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
  this._loadBotUser();
  this._firstRunCheck();
};

SlackAssistBot.prototype._loadBotUser = function() {
  var self = this;
  this.user = this.users.filter(function(user) {
    return user.name === 'gitassist';
  });
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
  if(!this._isChatMessage(message))
    return;
  
  var isChannel = this._isChannelConversation(message);
  var isBot = this.globalUsers[message.user].is_bot;
  var isDirect = message.channel[0] === 'D' ? true:false;

  if(isBot)
    return;
  console.log(message);

  if (isChannel)
    this._replyChannerWithSameMessage(message);
  else if (isDirect)
    this._replyUserWithSameMessage(message);
};

SlackAssistBot.prototype._isChatMessage = function(message) {
  return message.type === 'message';
};

SlackAssistBot.prototype._isChannelConversation = function(message) {
  if(!this.globalChannels[message.channel])
    return false;
  if(typeof(this.globalChannels[message.channel]) === 'undefined')
    return false;

  var channelName = this.globalChannels[message.channel].name;
  return channelName === 'test' ? true:false;
};

SlackAssistBot.prototype._replyChannerWithSameMessage = function(message) {
  var channelName = this.globalChannels[message.channel].name;
  this.postMessageToChannel(channelName, message.text, {
    as_user: true
  });
};

SlackAssistBot.prototype._replyUserWithSameMessage = function(message) {
  var userId = this.globalUsers[message.user].name;
  console.log('sending '+userId+' '+message.text);

  this.postMessageToUser(userId, message.text, {
    as_user: true
  });
};

module.exports = SlackAssistBot;