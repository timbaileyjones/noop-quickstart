const AWS = require('aws-sdk')
const Express = require('express')
const app = new Express()

AWS.config.update({region: 'us-east-1'})

app.use(Express.json())

app.all('*', (req, res) => {
  var db = new AWS.DynamoDB({apiVersion: '2012-10-08'})

  var params = {
    TableName: process.env['SAMPLES_TABLE_NAME']
  }

  db.scan(params, (err, data) => {
    if (err) {
      console.log(`Failed to scan items: ${err}`)
      res.status(500).json({message: 'something went wrong!'})
    } else {
      res.status(201).json(data)
    }
  })
})

exports.handler = app.handle.bind(app)
