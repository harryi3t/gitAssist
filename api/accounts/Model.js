'use strict';

var mongoose = require('mongoose');

module.exports = mongoose.model('Accounts', {
  url: String,
  token: String,
  repositories: [String]
});
