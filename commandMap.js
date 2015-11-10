'use strict';

module.exports.findAndRun = findAndRun;

var fs=require('fs');
var __dir='./commands/';
var data={};

console.log('\nRunning commandMap');

var map = [];

function findAndRun(message,bot){
  console.log("Searching for commands....");
  var match = false;
  var run, command;

  map.every(function(commandModule){  // fun way of breaking from forEach
    if(message.text.search(commandModule.pattern) === 0){
      console.log("command matched");
      match = true;
      run = commandModule.run;
      command = commandModule.command;
      return false;
    }
    return true;
  });

  if(command === 'help'){
    run(message.text,map,function(replyText){
      message.text = replyText;
      bot._reply(message);
    });
  }
  else if(match){
    run(message.text,function(replyText){
      message.text = replyText;
      bot._reply(message);
    });
  }
  else{
    console.error("No match found");
    message.text = "Command Not Found.\nEnter help to know allowed commands.";
    bot._reply(message);
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

