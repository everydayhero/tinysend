var express = require('express')
var bodyParser = require('body-parser')
var mandrill = require('mandrill-api/mandrill')
var fetch = require('node-fetch')

var app = express()
var jsonParser = bodyParser.json()

var mandrillClient = new mandrill.Mandrill(process.env.MANDRILL_KEY)

app.post('/send-email', jsonParser, function (req, res) {
  fetch('https://heroix.everydayhero.com.au/donations/' + req.body.entity.id + '.pdf?token=' + req.body.entity.token)
    .then(function(response) {
      if (response.status < 300) {
        return true
      } else {
        return false
      }
    }).then(function(okToSend) {
      if (okToSend) {
        mandrillClient.messages.sendTemplate({
          template_name: req.body.template_name,
          template_content: [],
          message: {
            global_merge_vars: [{
              name: 'donorName',
              content: req.body.entity.donor_name
            }],
            subject: req.body.entity.subject,
            from_email: 'help@everydayhero.com.au',
            from_name: req.body.entity.sender_name,
            to: [{email: req.body.entity.email_address}],
            inline_css: true,
            preserve_recipients: false,
          }
        }, function(response) {
          return res.sendStatus(200)
        }, function(err) {
          return res.sendStatus(422)
        })
      } else {
        return res.sendStatus(422)
      }
    })
})

app.get('/health', function (req, res) {
  return res.sendStatus(200)
})

app.listen(3000, function () {
  console.log('Listening on port 3000')
})
