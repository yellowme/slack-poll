var express = require('express')
var bodyParser = require('body-parser');

var app = express()
var port = process.env.PORT || 3000;

// body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/hello', function (req, res) {
  var userName = req.body.user_name;
  var botPayload = {
    text : 'Hello, ' + userName + '!'
  };

  // avoid infinite loop
  if (userName !== 'slackbot') {
    return res.status(200).json(botPayload);
  } else {
    return res.status(200).end();
  }
  console.log('Ping-ed!');
})
 
var server = app.listen(port, function () {

  var port = server.address().port

  console.log("Example app listening at port %s", port)

})