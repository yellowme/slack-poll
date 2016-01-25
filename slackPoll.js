var express = require('express')
var bodyParser = require('body-parser');
var request = require('request');

var app = express()
var port = process.env.PORT || 3000;

// body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
var token = 'xoxp-10646294659-10653225857-19287466564-d7da7e5682'
var propertiesObject = { token:token, query:'Who wants to go to lunch now?' };

var emojis = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

function getParams(string){

  //replace single quote with double quote bcos single quote is retained when forming final text
  string = string.replace(/'/g, '"');

  //regex to find matches for poll options
  var regExp = /\[(.*?)\]/g;
  var matches = (string).match(regExp);

  //trim string to remove option from question
  var trimmedString = string.replace(regExp, '');
  for (i=0; i<matches.length; i++) {
    matches[i] = matches[i].replace(/[\[\]']+/g,'')
  }
  console.log(trimmedString);
  console.log(matches);

  //forming the final questions with option
  var text = '' + trimmedString + '\n'
  for (i =0; i<matches.length; i++) {
    var num = i+1;
    text = text + num + '. ' + matches[i] + '\n';
  }

  //return final question with options, and the question alone for message search
  return [text, trimmedString, matches];
}





function searchMessages(query, callback) {
  request({url:"https://slack.com/api/search.messages", qs:query}, function(err, response, body) {
    if(err) { console.log(err); return; }
    var channel = JSON.parse(response.body).messages.matches[0].channel.id;
    var ts = JSON.parse(response.body).messages.matches[0].ts;
    callback([channel,ts]);
  });
}

function addReaction (num, channel, ts) {
  var params = { token:'xoxp-10646294659-10653225857-19287466564-d7da7e5682', name:num, channel:channel, timestamp:ts };
  request({url:"https://slack.com/api/reactions.add", qs:params}, function(err, response, body) {
    if(err) { console.log(err); return; }
    console.log(response.body);
  });
}

app.post('/hello', function (req, res) {
  //get text
  //split text
  //return as mcqs
  //search messages
  //post reactions 1,2,3
  console.log(req.body);
  console.log('Ping-ed!');
  var userName = req.body.user_name;
  var text = req.body.text;
  var response = getParams(text);
  var botPayload = {
    response_type: "in_channel",
    text : response[0]
  };
  console.log("text= " +response[1]);
  var smResponse = searchMessages({token:token, query:response[1]}, function (result) {
    console.log(result);
    for (i=response[2].length-1; i>=0; i--) {
      addReaction(emojis[i], result[0], result[1]);
    }
  });
  // avoid infinite loop
  if (userName !== 'slackbot') {
    return res.status(200).json(botPayload);
  } else {
    return res.status(200).end();
  }
})
 
var server = app.listen(port, function () {

  var port = server.address().port

  console.log("Example app listening at port %s", port)

})