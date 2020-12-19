const listHelper = require('../utils/list_helper')
const manyBlog = require('../blog')

test('dummy returns one', () => {
  const blogs = []

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
    expect(listHelper.totalLikes([])).toBe(0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('of a bigger list is calculated right', () => {
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
    expect(listHelper.favoriteBlog([])).toEqual({})
  })

  test('when list has only one blog, equals the favBlog of that', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    expect(result).toEqual(listWithOneBlog[0])
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.favoriteBlog(manyBlog)
    const fav = {
      _id: '5a422b3a1b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0
    }
    expect(result).toEqual(fav)
  })
})

describe('most blogs', () => {

  test('showing most blogger', () => {
    const result = listHelper.mostBlogs(manyBlog)
    const blogger = {
      author: 'Robert C. Martin',
      blogs: 3
    }
    expect(result).toEqual(blogger)
  })

})


describe('most likes', () => {

  test('showing max author blog likes', () => {
    const result = listHelper.mostLikes(manyBlog)
    const blogger = {
      author: 'Edsger W. Dijkstra',
      likes: 17
    }
    expect(result).toEqual(blogger)

  })

})