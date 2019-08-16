const express = require('express')
const app = new express()
const logger = require('@rearc/noop-log')
const path = require('path')

app.use(logger.requestLogger)

app.use(express.static(path.join(__dirname, 'dist')))

app.get('*', function (request, response) {
  response.sendFile(path.resolve(__dirname, 'dist/index.html'))
})

app.listen(80)
