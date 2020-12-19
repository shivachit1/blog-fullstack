const _=require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }
  return blogs.reduce(reducer,0)
}

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


const mostBlogs = (blogs) => {
  const maxAuthor = _.chain(blogs).countBy('author').toPairs().max(_.last).value()
  const maxBlogger = {
    author:maxAuthor[0],
    blogs:maxAuthor[1]
  }
  return maxBlogger
}

const mostLikes = (blogs) => {
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