var express = require('express')
var bodyParser = require('body-parser');
var request = require('request');

require('dotenv').config();

var app = express();
var port = process.env.PORT || 3000;

// body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
var token = process.env.SLACK_TOKEN
var emojis = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

function getParams(string){
  //replace single quote with double quote bcos single quote is retained when forming final text
  string = string.replace(/'/g, '"');
  //regex to find matches for poll options
  var regExp = /\[(.*?)\]/g;
  var matches = string.match(regExp);
  //trim string to remove option from question
  var trimmedString = string.replace(regExp, '');
  for (i=0; i<matches.length; i++) {
    matches[i] = matches[i].replace(/[\[\]']+/g,'')
  }
  //forming the final questions with option
  var text = trimmedString + '\n'
  for (i =0; i<matches.length; i++) {
    var num = i+1;
    text = text + num + '. ' + matches[i] + '\n';
  }
  //return final question with options, and the question alone for message search
  return [text, trimmedString, matches];
}


function postMessage(payload,callback) {
  request({url:"https://slack.com/api/chat.postMessage", qs:payload}, function(err, response, body) {
    if(err) { console.log('err-->', err); return; }
    var channel = JSON.parse(response.body).channel;
    var ts = JSON.parse(response.body).ts;
    callback([channel,ts]);
  });
}


function addReaction (name, channel, timestamp) {
  var params = { token, name, channel, timestamp };
  console.log('Reaction->>>',params);
  request({url:"https://slack.com/api/reactions.add", qs:params}, function(err, response, body) {
    if(err) { console.log(err); return; }
    console.log('quepaso?',response);
  });
}

app.post('/poll', function (req, res) {
  var userName = req.body.user_name;
  var channel = req.body.channel_id;
  var text = req.body.text;
  var response = getParams(text);
  var botPayload = {
    channel: channel,
    token: token,
    text : response[0],
    username: 'Mr Poller Yellow',
    icon_emoji: ':raising_hand:'
  };

  var pmResponse = postMessage(botPayload, function (result) {
    console.log('result from postMessage-->',result);
    for (var i=response[2].length-1; i>=0; i--) {
      addReaction(emojis[i], result[0], result[1]);
    }
  });
  // avoid infinite loop
  if (userName !== 'slackbot') {
    return res.status(200).end();
  }
})

var server = app.listen(port, function () {
  var port = server.address().port
  console.log("Example app listening at port %s", port)

})