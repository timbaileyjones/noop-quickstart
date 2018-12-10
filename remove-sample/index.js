const AWS = require('aws-sdk')
const Express = require('express')
const app = new Express()

AWS.config.update({region: 'us-east-1'})

app.use(Express.json())

app.delete('/api/samples/:sampleId', (req, res) => {
  var db = new AWS.DynamoDB({apiVersion: '2012-10-08'})

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
      console.log(`Failed to put item ${req.body.id} with name ${req.body.name} in ${req.body.aisle}: ${err}`)
      res.status(500).json({message: 'something went wrong!'})
    } else {
      res.status(204)
    }
  })
})

exports.handler = app.handle.bind(app)
