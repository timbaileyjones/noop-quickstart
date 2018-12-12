const AWS = require('aws-sdk')
const Express = require('express')
const app = new Express()

AWS.config.update({region: 'us-east-1'})

const aws_access_key_id = process.env.accessKey || 'fakeKey'
const aws_secret_access_key = process.env.secretKey || 'keySecret'
const SAMPLES_TABLE_NAME = process.env['SAMPLES_TABLE_NAME'] || 'samples'

app.use(Express.json())

app.delete('/api/samples/:sampleId', (req, res) => {

  var config = {
    "apiVersion": "2012-08-10",
    "accessKeyId": "aws_access_key_id",
    "secretAccessKey": "aws_secret_access_key",
    "region":"us-east-1"
  }

  var db = new AWS.DynamoDB(config)

  var params = {
    TableName: process.env['SAMPLES_TABLE_NAME'],
    Key: {
      id: {
        S: req.params.sampleId
      }
    }
  }

  db.deleteItem(params, (err, data) => {
    if (err) {
      console.log(`Failed to delete sample with id ${req.params.sampleId}`)
      res.status(500).json({message: 'something went wrong!'})
    } else {
      res.status(201).json({message: `Succesfully deleted sample with id ${req.params.sampleId}`})
    }
  })
})

exports.handler = app.handle.bind(app)
