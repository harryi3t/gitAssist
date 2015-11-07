'use strict';

var mongoose = require('mongoose');

module.exports = mongoose.model('Accounts', {
  url: {
    type: String,
    required: true
  },
  token: String,
  repositories: [String]
});