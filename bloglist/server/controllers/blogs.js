const blogsRouter = require("express").Router()
const Blog = require("../models/blog")
const { userExtractor } = require("../utils/middleware")

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post("/", userExtractor, async (request, response) => {
  const body = request.body
  if (!body.title || !body.url) {
    return response.status(400).json({ error: "title or url missing" })
  }

  const user = request.user

  if (!user) {
    return response.status(400).json({ error: "UserId missing or not valid" })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  await savedBlog.populate("user", { username: 1, name: 1 })
  response.status(201).json(savedBlog)
})

blogsRouter.delete("/:id", userExtractor, async (request, response) => {
  const user = request.user
  if (!user) {
    return response.status(400).json({ error: "UserId missing or not valid" })
  }
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).end()
  }
  if (user._id.toString() !== blog.user.toString()) {
    return response
      .status(401)
      .json({ error: "user not the owner of the blog" })
  }
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put("/:id", async (request, response) => {
  const { title, author, url, likes } = request.body

  const notetoUpdate = await Blog.findById(request.params.id)
  if (!notetoUpdate) {
    return response.status(404).end()
  }

  notetoUpdate.title = title || notetoUpdate.title
  notetoUpdate.author = author || notetoUpdate.author
  notetoUpdate.url = url || notetoUpdate.url
  notetoUpdate.likes = likes !== undefined ? likes : notetoUpdate.likes

  const updatedBlog = await notetoUpdate.save()
  await updatedBlog.populate("user", { username: 1, name: 1 })
  response.json(updatedBlog)
})

module.exports = blogsRouter
