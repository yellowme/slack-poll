var express = require('express')
var bodyParser = require('body-parser');
var request = require('request');

var app = express()
var port = process.env.PORT || 3000;

// body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
var token = 'xoxp-10646294659-10653225857-19287466564-d7da7e5682'
var propertiesObject = { token:token, query:'Who wants to go to lunch now?' };


function getParams(string){
  var regExp = /\[(.*?)\]/g;
  var matches = (string).match(regExp);
  var trimmedString = string.replace(regExp, '').trim();
  for (i=0; i<matches.length; i++) {
    matches[i] = matches[i].replace(/[\[\]']+/g,'')
  }
  console.log(trimmedString);
  console.log(matches);
  var text = '' + trimmedString + '\n'
  for (i =0; i<matches.length; i++) {
    var num = i+1;
    text = text + num + '. ' + matches[i] + '\n';
  }
  return text;
}


//getParams("who wants lunch? [yes] [no]");


function searchMessages(query) {
  request({url:"https://slack.com/api/search.messages", qs:query}, function(err, response, body) {
    if(err) { console.log(err); return; }
    var channel = JSON.parse(response.body).messages.matches[0].channel.id;
    var ts = JSON.parse(response.body).messages.matches[0].ts;
    return [channel,ts]
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
    text : response
  };

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