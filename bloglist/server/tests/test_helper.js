const Blog = require("../models/blog")
const User = require("../models/user")
const bcrypt = require("bcrypt")

const initialBlogs = [
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
  {
    title: "Another Blog",
    author: "John Doe",
    url: "https://example.com/blog2",
    likes: 10,
  },
  {
    title: "Yet Another Blog",
    author: "John Doe",
    url: "https://example.com/blog3",
    likes: 15,
  },
]

const testUser = {
  username: "root",
  name: "Superuser",
  passwordHash: bcrypt.hashSync("sekret", 10),
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((u) => u.toJSON())
}

module.exports = {
  initialBlogs,
  blogsInDb,
  testUser,
  usersInDb,
}
