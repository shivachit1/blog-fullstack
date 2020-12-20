const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')


describe('Testing /api/users api', () => {
  beforeEach(async () => {

    // deleting all data from database from /api/users
    await User.deleteMany({})

    // creating encrypt passwordHash using bcrypt
    const passwordHash = await bcrypt.hash('sekret', 10)

    // creatiing user
    const user = new User({
      username: 'root',
      name:'test1', passwordHash
    })

    // saving user to database
    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {

    // getting users stored in database with helper (test_helper.js)
    const usersAtStart = await helper.usersInDb()

    // creating new user without passwordHash
    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    // creating new user in database with POST request
    // testing if the POST request, response with status code 200
    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    // getting all users from database and testing if the users list is increased by 1
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    // creating new array of usernames
    // tesing if the array contains the username we created above
    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)

  })

  test('creation fails with proper statuscode and message if username already taken', async () => {

    // getting users list from database using helper
    const usersAtStart = await helper.usersInDb()

    // creating new user with already taken username
    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    // Testing if duplicate username gets rejected with status code 400
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    // testing if response contains error with given value
    expect(result.body.error).toContain('User validation failed: username: Error, expected `username` to be unique. Value: `'+newUser.username+'')

    //  testing users list that there is no change in database
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)

  })
})

// closing mongoose connection
afterAll(() => {
  mongoose.connection.close()
})