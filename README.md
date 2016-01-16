# SlackAssist

You can ask this bot about your PR status.

#### Current Status
Implemented plugin style for commands. Each `command` has its own file containing the `regex` that will used to match the command requested and the `run()` method that will do that actual processing for the requested command.

### How to create your own command
  1. create a file `helloWorldCommand.js`
  2. Enter these lines. 

```javascript
    'use strict';

    module.exports.pattern = /say\shello/i;
    module.exports.command  = 'say hello';
    module.exports.run = run;

    function run(commandText,callback){
      var replyMessageText = 'Hello World :simple_smile:';
      callback(replyMessageText);
    }
```

This will show:<br>
![SlackBot Image](https://cloud.githubusercontent.com/assets/5207331/11071548/5f349ee8-8807-11e5-9a17-1edbb14ede16.png)
