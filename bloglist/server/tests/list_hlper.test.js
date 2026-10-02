const { test, describe } = require("node:test")
const assert = require("node:assert")
const listHelper = require("../utils/list_helper")

test("dummy returns one", () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe("total likes", () => {
  test("of empty list is zero", () => {
    const blogs = []

    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 0)
  })

  test("when list has only one blog equals the likes of that", () => {
    const listWithOneBlog = [
      {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
        likes: 5,
        __v: 0,
      },
    ]

    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test("of a bigger list is calculated right", () => {
    const listWithMultipleBlogs = [
      {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
        likes: 5,
        __v: 0,
      },
      {
        _id: "5a422aa71b54a676234d17f9",
        title: "Another Blog",
        author: "John Doe",
        url: "https://example.com/blog2",
        likes: 10,
        __v: 0,
      },
    ]

    const result = listHelper.totalLikes(listWithMultipleBlogs)
    assert.strictEqual(result, 15)
  })
})

describe("favorite blog", () => {
  test("of empty list is null", () => {
    const blogs = []

    const result = listHelper.favoriteBlog(blogs)
    assert.strictEqual(result, null)
  })

  test("when list has only one blog is that blog", () => {
    const blogs = [
      {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
      },
    ]
    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
    })
  })

  test("of a bigger list is the one with most likes", () => {
    const blogs = [
      {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
      },
      {
        _id: "5a422aa71b54a676234d17f9",
        title: "Another Blog",
        author: "John Doe",
        url: "https://example.com/blog2",
        likes: 10,
      },
    ]
    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, {
      _id: "5a422aa71b54a676234d17f9",
      title: "Another Blog",
      author: "John Doe",
      url: "https://example.com/blog2",
      likes: 10,
    })
  })
})

describe("most blogs", () => {
  test("of empty list is null", () => {
    const blogs = []

    const result = listHelper.mostBlogs(blogs)
    assert.strictEqual(result, null)
  })

  test("when list has only one blog is that author with 1 blog", () => {
    const blogs = [
      {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
      },
    ]

    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      blogs: 1,
    })
  })
  test("of a bigger list is the author with most blogs", () => {
    const blogs = [
      {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
      },
      {
        _id: "5a422aa71b54a676234d17f9",
        title: "Another Blog",
        author: "John Doe",
        url: "https://example.com/blog2",
        likes: 10,
      },
      {
        _id: "5a422aa71b54a676234d17fa",
        title: "Yet Another Blog",
        author: "John Doe",
        url: "https://example.com/blog3",
        likes: 15,
      },
    ]

    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, {
      author: "John Doe",
      blogs: 2,
    })
  })
})

describe("most likes", () => {
  test("of empty list is null", () => {
    const blogs = []

    const result = listHelper.mostLikes(blogs)
    assert.strictEqual(result, null)
  })

  test("when list has only one blog is that author with most likes", () => {
    const blogs = [
      {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
      },
    ]

    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      likes: 5,
    })
  })
  test("of a bigger list is the author with most likes", () => {
    const blogs = [
      {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
      },
      {
        _id: "5a422aa71b54a676234d17f9",
        title: "Another Blog",
        author: "John Doe",
        url: "https://example.com/blog2",
        likes: 10,
      },
      {
        _id: "5a422aa71b54a676234d17fa",
        title: "Yet Another Blog",
        author: "John Doe",
        url: "https://example.com/blog3",
        likes: 15,
      },
    ]

    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, {
      author: "John Doe",
      likes: 25,
    })
  })
})
