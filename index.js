var express = require('express')
var bodyParser = require('body-parser')

var app = express()
var jsonParser = bodyParser.json()

app.post('/send-email', jsonParser, function (req, res) {
  res.send(req.hostname) // Req.hostname needs to be compared to a whitelist. If exists, send the email :D
})

app.listen(3000, function () {
  console.log('Listening on port 3000')
})
