const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

// getting all blogs with join query which return blogs with user's details
blogsRouter.get('/',async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  res.json(blogs)
})

// getting single blogs from the database
blogsRouter.get('/:id', async (req, res, next) => {
  try{
    const blog = await Blog.findById(req.params.id)

    if (blog) {
      res.json(blog)
    } else {
      res.status(404).end()
    }

  }catch (exception) {
    next(exception)
  }

})

// creating new blogs with given req data
blogsRouter.post('/', async (req, res, next) => {

  const body = req.body

  // getting token from authorization header , middleware function (middleware.tokenExtractor) helps to assign token to req.token
  const token = req.token

  // decoding token with jwt
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }
  //finding user with decoded token
  const user = await User.findById(decodedToken.id)

  // creating new blog with extra user field
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url:body.url,
    likes:body.likes,
    user:user._id
  })

  try {

    const savedBlog = await blog.save()
    const returningBlog = await Blog.findById(savedBlog._id).populate('user', { username: 1, name: 1 })
    // creating blogs reference to user object
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    res.json(returningBlog)

  } catch (exception) {
    next(exception)
  }

})

// deleting single blogs by given id
blogsRouter.delete('/:id',async (req, res, next) => {
  const blogId = req.params.id
  const token = req.token
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }
  const userId = decodedToken.id

  try {
    const blog = await Blog.findById(blogId)
    if(blog.user.toString() === userId.toString()){
      await Blog.findByIdAndRemove(req.params.id)
      res.status(204).end()
    }else{
      res.status(401).end()
    }
  } catch (exception) {
    next(exception)
  }

})

// updating blogs with given id and req data
blogsRouter.put('/:id', async (req, res, next) => {
  const body = req.body
  const blogId = req.params.id


  const blog = {
    title: body.title,
    author: body.author,
    url:body.url,
    likes:body.likes,
    user:body.user
  }

  try {

    const updatedBlog = await Blog.findByIdAndUpdate(blogId, blog, { new: true }).populate('user', { username: 1, name: 1 })
    res.json(updatedBlog)

  } catch (exception) {
    next(exception)
  }

})

module.exports = blogsRouter