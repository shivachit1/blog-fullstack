const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

// normal logger to display console message
logger.info('connecting to', config.MONGODB_URI)

// connecting mongoDB
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())

app.use(express.static('build'))
app.use(express.json())

// middleware to check every request made to the server
app.use(middleware.requestLogger)
// middleware to extract token from authorization header
app.use(middleware.tokenExtractor)

// routes for api
app.use('/api/login', loginRouter)
app.use('/api/users',usersRouter)
app.use('/api/blogs', blogsRouter)


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app