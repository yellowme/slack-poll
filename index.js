const express = require('express')
const config = require('./config')
const controller = require('./controller')
const morgan = require('morgan')

const port = config.PORT

const app = express()

// App config
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

// Route controllers
app.post('/poll', controller.pollPost)
app.post('/hook', controller.hookPost)

module.exports = app
app.listen(port, () => {
  console.log(`=>> App listen on ${port}`)
})
