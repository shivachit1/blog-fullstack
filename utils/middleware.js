const logger = require('./logger')

// middleware all the request made to server
const requestLogger = (req,res,next ) => {
  logger.info('Method', req.method)
  logger.info('Path', req.path)
  logger.info('Body', req.body)
  logger.info('---')
  next()

}

// middleware for unknownEndpoint
const unknownEndpoint = (req,res) => {
  res.status(404).send({ error:'unknown endpoint' })
}

// error handler middleware
const errorHandler = (error, req,res,next ) => {
  if(error.name==='CastError') {
    // if id is not no mongodb format
    return res.status(400).send({ error:'malformatted id' })
  }else if(error.name==='ValidationError'){
    return res.status(400).json({ error:error.message })
  }else if(error.name==='MongoError'){
    return res.status(400).json({ error:error.message })
  }else if (error.name === 'JsonWebTokenError') {
    // error handler for invalid token
    return res.status(401).json({
      error: 'invalid token'
    })
  }
  next(error)
}

const tokenExtractor = (req, res, next) => {
  // middleware code that extracts the token from headers
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    // assigns token value back to req
    req.token = authorization.substring(7)
  }
  next()

}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor
}