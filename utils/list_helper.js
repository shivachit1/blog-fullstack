// using lodash as _
const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

// returning total likes
const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }
  return blogs.reduce(reducer,0)
}

// returning most fav blog from list
const favoriteBlog = (blogs) => {
  const reducer = (favBlog, blog) => {
    const mostLikes = blog.likes
    if(!favBlog.likes) {
      favBlog = blog
    }
    else if(mostLikes >= favBlog.likes) {
      favBlog = blog
    }
    return favBlog
  }
  return blogs.reduce(reducer,{})
}

// returning blogger with most blogs
const mostBlogs = (blogs) => {
  // using lodash to create new array
  // chain(blogs) to combine to call other functions with blogs array
  // countBy('author') to count common author from blogs and create array with how many times it is repeated
  // toPairs() to make countby return value to pairs
  // max(_.last) to get max repeated item and make single array
  // value() to get array of single object as value
  const maxAuthor = _.chain(blogs).countBy('author').toPairs().max(_.last).value()
  const maxBlogger = {
    author:maxAuthor[0],
    blogs:maxAuthor[1]
  }
  return maxBlogger
}

const mostLikes = (blogs) => {
  // lodash to make group by author and _.sumBy to add all blogs likes with common author name
  const result = _.chain(blogs).groupBy('author')
    .map((blogs,key) => ({
      'author':key,
      'likes':_.sumBy(blogs,'likes')
    }))
    .maxBy('likes')
    .value()

  return result
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}