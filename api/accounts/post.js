'use strict';

var self = post;
module.exports = self;

var URL = require('./Model.js');

function post(githubUrl,callback) {
  console.log('\nStarting api|URL|post| setting url'+githubUrl);

  URL.remove({},function(err){
    if(err)
      console.log(err);

    URL.create({
      url : githubUrl
    }, function (err, data) {
      if (err)
        console.log(err);
      if(callback){
        callback(data.url);
      }
    });

  });
}
