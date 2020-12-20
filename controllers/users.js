const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

// routes for /api/users with GET request
usersRouter.get('/', async (req, res) => {
  // calling join query provided by mongoose to get blogs data and returning with blogs
  // blogs id is linked with User with UserSchema
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, url:1 })
  res.json(users)
})

// routes for /api/users with POST request
// creates new user with given request data
usersRouter.post('/', async (req, res, next) => {
  const body = req.body

  // checking if password is more than 3 characters
  if (body.password.length < 3) {
    return res.status(400).json({ error: 'min 3 letters required for password' })
  }
  const saltRounds = 10
  // making encrpt passwordhash with bcrypt
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  try {
    // saving user to database
    const savedUser = await user.save()
    res.json(savedUser)
  } catch (exception) {
    // returning middleware if error occured when saving user
    next(exception)
  }

})

module.exports = usersRouter