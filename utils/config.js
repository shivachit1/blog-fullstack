require('dotenv').config()

const PORT = process.env.PORT
let MONGODB_URI = process.env.MONGODB_URI

// assigning test mongodb uri to Mongodb uri
if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.TEST_MONGODB_URI
}

module.exports = {
  MONGODB_URI,
  PORT
}