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
    TableName,
    Item: {
      id: req.body.id,
      name: req.body.name,
      aisle: req.body.aisle
    }
  }

  db.put(params, (err, data) => {
    if (err) {
      console.log(`Failed to put item ${req.body.id} with name ${req.body.name} in ${req.body.aisle}: ${err.message}`)
      res.status(500).json({message: 'something went wrong!'})
    } else {
      res.status(201).json({message: `added ${req.body.name} in aisle ${req.body.aisle} with id ${req.body.id}`})
    }
  })
})

exports.handler = app.handle.bind(app)
