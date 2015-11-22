'use strict';

var mongoose = require('mongoose');

module.exports = mongoose.model('Team', {
  username: String,
  name: String,
  avatar_url: String,
  url: String
});
