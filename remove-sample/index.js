const AWS = require('aws-sdk')
const Express = require('express')
const app = new Express()

const endpoint = AWS.Endpoint(process.env['SAMPLES_DYNAMO_ENDPOINT'])
const TableName = process.env['SAMPLES_TABLE_NAME']

app.use(Express.json())

app.delete('/api/samples/:sampleId', (req, res) => {
  var config = {
    apiVersion: '2012-08-10',
    endpoint
  }

  var db = new AWS.DynamoDB(config)

  var params = {
    TableName,
    Key: {
      id: {
        S: req.params.sampleId
      }
    }
  }

  db.deleteItem(params, (err, data) => {
    if (err) {
      console.log(`Failed to delete sample with id ${req.params.sampleId}: ${err}`)
      res.status(500).json({message: 'something went wrong!'})
    } else {
      res.status(201).json({message: `Succesfully deleted sample with id ${req.params.sampleId}`})
    }
  })
})

exports.handler = app.handle.bind(app)
