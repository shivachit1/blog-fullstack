const listHelper = require('../utils/list_helper')

// getting blog list containing many  blogs from blog.js
const manyBlog = require('../blog')

test('dummy returns one', () => {
  const blogs = []

  // Testing empty dummy blogs and expected 1 as default
  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  test('of empty array is zero', () => {
    // testing of empty list total likes as 0
    expect(listHelper.totalLikes([])).toBe(0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    // Testing total likes of blog list containing single blog
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('of a bigger list is calculated right', () => {
    //testing total likes of imported blogs (calculated sum mannually from list to be 36)
    const result = listHelper.totalLikes(manyBlog)
    expect(result).toBe(36)
  })
})

describe('favorite blog', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]
  test('of empty array is zero', () => {
    // testing favorite blog to be {} if checked with empty array
    expect(listHelper.favoriteBlog([])).toEqual({})
  })

  test('when list has only one blog, equals the favBlog of that', () => {
    // testing of blog array with single blog, favorite by default
    const result = listHelper.favoriteBlog(listWithOneBlog)
    expect(result).toEqual(listWithOneBlog[0])
  })

  test('of a bigger list is calculated right', () => {

    // calling method favoriteBlog(array) to get favorite blog from blog list using helper
    const result = listHelper.favoriteBlog(manyBlog)

    // blog with most likes from blog list data
    const fav = {
      _id: '5a422b3a1b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0
    }
    // testing if helper.favorite method return blog equal to fav blog above
    expect(result).toEqual(fav)
  })
})

describe('most blogs', () => {

  test('showing most blogger', () => {
    // getting blogger with most blogs from blogs list
    const result = listHelper.mostBlogs(manyBlog)
    const blogger = {
      author: 'Robert C. Martin',
      blogs: 3
    }
    // testing if return value from helper equal to above blogger
    expect(result).toEqual(blogger)
  })

})


describe('most likes', () => {

  test('showing max author blog likes', () => {
    // getting blogger after adding all likes from his/her blogs in total
    const result = listHelper.mostLikes(manyBlog)
    const blogger = {
      author: 'Edsger W. Dijkstra',
      likes: 17
    }
    // testing if return value from helper equal to above blogger
    expect(result).toEqual(blogger)

  })

})