const AWS = require('aws-sdk')
const Express = require('express')
const app = new Express()

AWS.config.update({region: 'us-east-1'})

app.use(Express.json())

app.all('*', (req, res) => {
  var db = new AWS.DynamoDB({apiVersion: '2012-10-08'})

  var params = {
    TableName: process.env['SAMPLES_TABLE_NAME'],
    Item: {
      id: req.body.id,
      name: req.body.name,
      aisle: req.body.aisle
    }
  }

  db.putItem(params, (err, data) => {
    if (err) {
      console.log(`Failed to put item ${req.body.id} with name ${req.body.name} in ${req.body.aisle}: ${err}`)
      res.status(500).json({message: 'something went wrong!'})
    } else {
      res.status(201).json({message: `added ${req.body.name} in aisle ${req.body.aisle} with id ${req.body.id}`})
    }
  })
})

exports.handler = app.handle.bind(app)
