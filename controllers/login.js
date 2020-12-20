const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User  = require('../models/user')

// login routes for user authentication
loginRouter.post('/', async (req, res) => {
  const body = req.body

  // finding user from database with given username in req object
  const user = await User.findOne({ username:body.username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error : 'invalid username or password'
    })
  }

  // creating tokenobject before making token with JWT
  const userForToken = {
    username : user.username,
    id:user._id
  }

  // creating token with jwt
  const token = jwt.sign(userForToken, process.env.SECRET)

  res
    .status(200)
    .send({ token, username : user.username , name: user.name })
})

module.exports = loginRouter