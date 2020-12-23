const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {

  // starting test by deleting all blogs from database
  await Blog.deleteMany({})

  //creating new blogs using helper ( test_helper.js )
  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

describe('when there is blogs initially saved', () => {
  test('blogs are returned as json', async () => {

    // getting all blogs from database
    // testing with correct status code and content-type as json
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {

    // testing if the all blogs are returned from database
    const res = await api.get('/api/blogs')
    expect(res.body).toHaveLength(helper.initialBlogs.length)
  })

  test('checking if id property of blogs is defined', async () => {

    // tesing if _id is changed to id with toJSON()
    const res = await api.get('/api/blogs')
    return res.body.map(r => expect(r.id).toBeDefined())
  })

})

describe('Viewing specific blog', () => {
  test('a specific blog can be viewed', async () => {
    // getting all blogs and a single blog we want to view
    const blogsAtStart = await helper.blogsInDb()
    const blogToView = blogsAtStart[0]

    // testing if the server response single blog
    const resultNote = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    // testing if single blog returned equals to blog we wanted to view
    const processedBlogToView = JSON.parse(JSON.stringify(blogToView))
    expect(resultNote.body).toEqual(processedBlogToView)
  })

})

describe('addition of a new blog',() => {
  test('adding new valid blog with authorized user can be added', async () => {

    // creating user for login
    const user = {
      username:'root',
      password:'sekret'
    }

    // logging in user to get token id
    const res = await api
      .post('/api/login')
      .send(user)

    // token after successful login
    const token = res.body.token

    const newBlog = {
      title:'How to create frontend with Vue',
      author:'Shiva Tiwari',
      url:'available',
      likes:120
    }

    // tesing if new bog can be created using authorzied token
    await api
      .post('/api/blogs')
      .set({ Authorization:`Bearer ${token}` })
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    // testing if newly created blog is stored in database and blogs list length is increased by 1
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    // testing if newly created blog contains in blogs list
    const titles = blogsAtEnd.map(r => r.title)
    expect(titles).toContain(
      'How to create frontend with Vue'
    )
  })

  test('adding new blog with unauthorized user is rejected', async () => {

    // creating new blog to be added
    const newBlog = {
      title:'How to create frontend with Vue',
      author:'Shiva Tiwari',
      url:'available',
      likes:120
    }

    // testing if creating new blog by unauthorized user is rejected with status code 401
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    // testing if there is no change in blogs list after POST request
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('new blog added by authorized user with no likes property is added to database, expected default value as 0', async () => {

    // creating user for login
    const user = {
      username:'root',
      password:'sekret'
    }

    // logging in user to get token id
    const res = await api
      .post('/api/login')
      .send(user)

    // token after successful login
    const token = res.body.token

    // creating blog with no likes property
    const newBlog = {
      title: 'how to connect mongo to express server',
      author:'shiva',
      url:'not available'
    }

    // getting response after POST request to create new blog without likes property
    const response = await api
      .post('/api/blogs')
      .set({ Authorization:`Bearer ${token}` })
      .send(newBlog)

    // testing if likes property is created by server as default with value 0
    expect(response.body.likes).toEqual(0)
  })

  test('new blog added by authorized user without title && url properties is not added to database', async () => {

    // creating user for login
    const user = {
      username:'root',
      password:'sekret'
    }

    // logging in user to get token id
    const res = await api
      .post('/api/login')
      .send(user)

    // token after successful login
    const token = res.body.token

    // creating new blog with only author name, no title and url properties are added
    const newBlog = {
      author: 'shiva'
    }

    // testing if POST request without title and url properties gets rejected with status code 400
    await api
      .post('/api/blogs')
      .set({ Authorization:`Bearer ${token}` })
      .send(newBlog)
      .expect(400)

    // testing there is no change in database after POST request
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})


describe('deletion of a blog', () => {
  test('deleting blog by authorized user, creating new blog and deleting same blog succeeds with status code 204', async () => {
    const blogAtStart = await helper.blogsInDb()

    // creating user for login
    const user = {
      username:'root',
      password:'sekret'
    }

    // logging in user to get token id
    const res = await api
      .post('/api/login')
      .send(user)

    // token after successful login
    const token = res.body.token

    const newBlog = {
      title:'How to create frontend with Vue',
      author:'Shiva Tiwari',
      url:'available',
      likes:120
    }

    // creating new blog in order to test deletion on same blog
    const response = await api
      .post('/api/blogs')
      .set({ Authorization:`Bearer ${token}` })
      .send(newBlog)

    // blog object after creating
    const blogToDelete = response.body

    // getting blogs after adding and testing if blogs length is increased by 1
    const blogsAtAddition = await helper.blogsInDb()
    expect(blogsAtAddition).toHaveLength(blogAtStart.length + 1)

    // deleting above created blog with authorized token
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set({ Authorization:`Bearer ${token}` })
      .expect(204)

    // getting blogs after deleting and testing if blogs length is decreased by 1
    const blogsAfterDelete = await helper.blogsInDb()
    expect(blogsAfterDelete).toHaveLength(blogAtStart.length)

    // final test that created blog doesn't exist in blogs list
    const titles = blogsAfterDelete.map(r => r.title)
    expect(titles).not.toContain(blogToDelete.title)
  })
})

describe('updating of a blog', () => {
  test('succeeds updating with status code 200 if id is valid', async () => {

    // creating user for login
    const user = {
      username:'root',
      password:'sekret'
    }

    // logging in user to get token id
    const res = await api
      .post('/api/login')
      .send(user)

    // token after successful login
    const token = res.body.token

    // creating new blog in database
    const newBlog = {
      title:'Working with jest',
      author:'Shiva Tiwari',
      url:'available',
      likes:120
    }

    // creating new blog in order to test updating on same blog
    // response.body contains also creater username, name and id
    const response = await api
      .post('/api/blogs')
      .set({ Authorization:`Bearer ${token}` })
      .send(newBlog)

    // valid id of newly created blog
    const validId = response.body.id

    // blog value create with 120 likes is increased by 10
    const blogToUpdate = {
      title:response.body.title,
      author:response.body.author,
      url:response.body.url,
      likes:response.body.likes + 10,
      user:response.body.user.id
    }

    // updating the likes of previously created blog with 130 likes by authorized user
    const updatedResponse = await api
      .put(`/api/blogs/${validId}`)
      .send(blogToUpdate)
    console.log(updatedResponse.body)
    // testing if likes is sucessfully update and equals to 130
    expect(updatedResponse.body.likes).toEqual(130)
  })
})

// closing mongoose connection after finishing test
afterAll(() => {
  mongoose.connection.close()
})
