// logging message
const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params)
  }
}

// logging error
const error = (...params) => {
  console.error(...params)
}

module.exports = {
  info, error
}