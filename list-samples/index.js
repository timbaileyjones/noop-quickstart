const AWS = require('aws-sdk')
const Express = require('express')
const app = new Express()

const endpoint = new AWS.Endpoint('$.resources.samples.endpoint')
const TableName = '$.resources.samples.tableName'

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
console.log('Starting scan')
  db.scan(params, (err, data) => {
    console.log('Scan callback received')
    if (err) {
      console.log(`Failed to scan items: ${err.message}`)
      res.status(500).json({message: 'something went wrong!!'})
    } else {
      console.log('Scan successful.')
      res.status(200).json(data.Items)
    }
  })
})

exports.handler = app.handle.bind(app)
