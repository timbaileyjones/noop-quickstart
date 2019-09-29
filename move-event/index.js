const AWS = require('aws-sdk')
const Express = require('express')
const app = new Express()

const endpoint = new AWS.Endpoint(process.env['EVENTS_ENDPOINT'])
const TableName = process.env['EVENTS_TABLE']

app.use(Express.json())

app.delete('/api/events/:eventId', (req, res) => {
  var config = {
    apiVersion: '2012-08-10',
    endpoint
  }

  var db = new AWS.DynamoDB.DocumentClient({ service: new AWS.DynamoDB(config) })

  var params = {
    TableName,
    Key: {
      id: req.params.eventId
    }
  }

  db.delete(params, (err, data) => {
    if (err) {
      console.log(`Failed to delete event with id  ${req.params.eventId}: ${err.message}`)
      res.status(500).json({message: 'something went wrong!'})
    } else {
      res.status(200).json({message: `Succesfully deleted event with id ${req.params.eventId}`})
    }
  })
})

exports.handler = app.handle.bind(app)
