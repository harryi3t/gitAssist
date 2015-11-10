'use strict';

module.exports.findAndRun = findAndRun;

var fs=require('fs');
var __dir='./commands/';
var data={};

console.log('\nRunning commandMap');

var map = [];

function findAndRun(message,replyMessage){
  console.log("Searching for commands....");
  var match = false;
  var run;
  map.every(function(command){  // fun way of breaking from forEach
    if(message.text.search(command.pattern) == 0){
      console.log("command matched");
      match = true;
      run = command.run;
      return false;
    }
    return true;
  });
  if(match)
    run(message,replyMessage,map);
  else{
    console.error("No match found");
    replyMessage.text = "Command Not Found.\nEnter help to know allowed commands."
  }

}

fs.readdir(__dir,function(err,files){
    if (err) throw err;
    var c=0;
    files.forEach(function(file){
      console.log('Requiring Command: ',file);
      var commandFile = require(__dir+file);
      map.push({
        pattern : commandFile.pattern,
        run : commandFile.run,
        command : commandFile.command
      });
    });
});

