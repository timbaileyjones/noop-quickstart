const AWS = require('aws-sdk')
const Express = require('express')
const app = new Express()

const endpoint = new AWS.Endpoint(process.env['SAMPLES_ENDPOINT'])
const TableName = process.env['SAMPLES_TABLE']

app.use(Express.json())

app.delete('/api/samples/:sampleId', (req, res) => {
  var config = {
    apiVersion: '2012-08-10',
    endpoint
  }

  var db = new AWS.DynamoDB.DocumentClient({ service: new AWS.DynamoDB(config) })

  var params = {
    TableName,
    Key: {
      id: req.params.sampleId
    }
  }

  db.delete(params, (err, data) => {
    if (err) {
      console.log(`Failed to delete sample with id ${req.params.sampleId}: ${err.message}`)
      res.status(500).json({message: 'something went wrong!'})
    } else {
      res.status(200).json({message: `Succesfully deleted sample with id ${req.params.sampleId}`})
    }
  })
})

exports.handler = app.handle.bind(app)
