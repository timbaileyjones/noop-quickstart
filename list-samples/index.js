const AWS = require('aws-sdk')
const Express = require('express')
const app = new Express()

const endpoint = new AWS.Endpoint(process.env['SAMPLES_ENDPOINT'])
const TableName = process.env['SAMPLES_TABLE']

app.use(Express.json())

app.all('*', (req, res) => {
  var config = {
    apiVersion: '2012-08-10',
    endpoint
  }

  var db = new AWS.DynamoDB.DocumentClient({ service: new AWS.DynamoDB(config) })

  var params = {
    TableName
  }

  db.scan(params, (err, data) => {
    if (err) {
      console.log(`Failed to scan items: ${err}`)
      res.status(500).json({message: 'something went wrong!'})
    } else {
      res.status(200).json(data.Items)
    }
  })
})

exports.handler = app.handle.bind(app)
