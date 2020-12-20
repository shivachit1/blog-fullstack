const Blog = require('../models/blog')
const User = require('../models/user')

// creating initial blogs array
const initialBlogs = [
  {
    title:'How to create Server using Express',
    author:'Shiva Tiwari',
    url:'not available',
    likes:100,
  },
  {
    title:'How to create frontend with React',
    author:'Shiva Tiwari',
    url:'available',
    likes:120,
  }
]

const nonExistingId = async () => {
  const blog = new Blog({
    title:'Will remove this soon',
    author:'Shiva Tiwari',
    url:'available',
    likes:120,
  })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

// blogs in mongodb database
const blogsInDb = async () => {

  // getting all blogs and coverted in json format
  const blogs = await Blog.find({})
  const b = blogs.map(blog => blog.toJSON())
  return b
}

// users from database
const usersInDb = async () => {

  // getting all usersand coverted in json format
  const users = await User.find({})
  return users.map(u => u.toJSON())
}


module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb
}