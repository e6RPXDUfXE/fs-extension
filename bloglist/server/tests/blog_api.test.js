const assert = require("node:assert")
const bcrypt = require("bcrypt")
const { test, after, beforeEach, describe } = require("node:test")
const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const helper = require("./test_helper")
const Blog = require("../models/blog")
const User = require("../models/user")

const api = supertest(app)

describe("when there is initially some notes saved", () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/)
  })

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs")
    //console.log('response.body', response.body)
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test("a specific blog is within the returned blogs", async () => {
    const response = await api.get("/api/blogs")
    const contents = response.body.map((e) => e.title)
    assert(contents.includes("Go To Statement Considered Harmful"))
  })

  test("blog post has id property and not _id", async () => {
    const response = await api.get("/api/blogs")
    assert.notStrictEqual(response.body[0].id, undefined)
    assert.strictEqual(response.body[0]._id, undefined)
  })

  describe("addition of a new note", () => {
    let token = null
    beforeEach(async () => {
      await User.deleteMany({})
      await new User(helper.testUser).save()
      const loginResponse = await api
        .post("/api/login")
        .send({ username: "root", password: "sekret" })
      token = loginResponse.body.token
    })
    test("a valid blog can be added ", async () => {
      const newBlog = {
        title: "async/await simplifies making async calls",
        author: "John Doe",
        url: "https://example.com/blog4",
        likes: 20,
      }

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
      //console.log('blogs at end', blogsAtEnd)

      const contents = blogsAtEnd.map((n) => n.title)
      assert(contents.includes("async/await simplifies making async calls"))
    })

    test("blog without likes property defaults to 0", async () => {
      const newBlog = {
        title: "Blog without likes",
        author: "John Doe",
        url: "https://example.com/blog5",
      }

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
      //console.log('blogs at end', blogsAtEnd)

      const addedBlog = blogsAtEnd.find((b) => b.title === "Blog without likes")
      assert.strictEqual(addedBlog.likes, 0)
    })

    test("blog without title is not added", async () => {
      const newBlog = {
        author: "John Doe",
        url: "https://example.com/blog5",
      }

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test("blog without url is not added", async () => {
      const newBlog = {
        title: "Blog without url",
        author: "John Doe",
      }

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
    test("blog without token is not added", async () => {
      const newBlog = {
        title: "Blog without token",
        author: "John Doe",
        url: "https://example.com/blog6",
      }

      await api.post("/api/blogs").send(newBlog).expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })
  describe("deletion of a blog", () => {
    let token = null
    let userId = null
    beforeEach(async () => {
      await User.deleteMany({})
      const user = await new User(helper.testUser).save()
      userId = user._id
      const loginResponse = await api
        .post("/api/login")
        .send({ username: "root", password: "sekret" })
      token = loginResponse.body.token
      const blog = await Blog.findOne({})
      blog.user = userId
      await blog.save()
    })
    test("succeeds with status code 204 if id is valid", async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart.find(
        (b) => b.user && b.user.toString() === userId.toString(),
      )
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      const titles = blogsAtEnd.map((n) => n.title)
      assert(!titles.includes(blogToDelete.title))

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })
    test("fails with status code 401 if user is not the owner of the blog", async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart.find(
        (b) => b.user && b.user.toString() === userId.toString(),
      )

      const newUser = {
        username: "newuser",
        name: "New User",
        password: "newpassword",
      }
      await api.post("/api/users").send(newUser)
      const loginResponse = await api
        .post("/api/login")
        .send({ username: "newuser", password: "newpassword" })
      const newToken = loginResponse.body.token

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set("Authorization", `Bearer ${newToken}`)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })
  describe("updating a blog", () => {
    test("succeeds with status code 200 if id is valid", async () => {
      const blogsAtStart = await helper.blogsInDb()
      //console.log('blogs at start', blogsAtStart)
      const blogToUpdate = blogsAtStart[0]

      const updatedBlogData = {
        title: "Updated Blog Title",
        author: "Updated Author",
        url: "https://example.com/updated-blog",
        likes: 10,
      }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlogData)
        .expect(200)
        .expect("Content-Type", /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      //console.log('blogs at end', blogsAtEnd)
      const updatedBlog = blogsAtEnd.find((b) => b.id === blogToUpdate.id)
      assert.strictEqual(updatedBlog.title, "Updated Blog Title")
      assert.strictEqual(updatedBlog.author, "Updated Author")
      assert.strictEqual(updatedBlog.url, "https://example.com/updated-blog")
      assert.strictEqual(updatedBlog.likes, 10)
    })
  })
})

describe("when there is initially one user at db", () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash("sekret", 10)
    const user = new User({ username: "root", passwordHash })

    await user.save()
  })

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    }

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    assert(usernames.includes(newUser.username))
  })

  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "salainen",
    }

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes("expected `username` to be unique"))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test("creation fails with proper statuscode and message if username is too short", async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: "ro",
      name: "Superuser",
      password: "salainen",
    }

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    //console.log('result.body.error', result.body.error)
    assert(
      result.body.error.includes("is shorter than the minimum allowed length"),
    )

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test("creation fails with proper statuscode and message if username is missing", async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: "Superuser",
      password: "salainen",
    }

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    //console.log('result.body.error', result.body.error)
    assert(result.body.error.includes("Path `username` is required"))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test("creation fails with proper statuscode and message if password is too short", async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: "newuser",
      name: "New User",
      password: "sa",
    }

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    //console.log('result.body.error', result.body.error)
    assert(
      result.body.error.includes("password must be at least 3 characters long"),
    )

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test("creation fails with proper statuscode and message if password is missing", async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: "newuser",
      name: "New User",
    }

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    //console.log('result.body.error', result.body.error)
    assert(result.body.error.includes("password is required"))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})
