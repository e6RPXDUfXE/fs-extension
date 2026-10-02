var _ = require("lodash")
const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const favorite = blogs.reduce((prev, current) =>
    prev.likes > current.likes ? prev : current,
  )

  return favorite
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const authorCounts = _.countBy(blogs, "author")
  const maxAuthor = _.maxBy(
    _.keys(authorCounts),
    (author) => authorCounts[author],
  )

  return {
    author: maxAuthor,
    blogs: authorCounts[maxAuthor],
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const authorLikes = _.groupBy(blogs, "author")
  const authorLikesSum = _.map(authorLikes, (authorBlogs, author) => ({
    author,
    likes: _.sumBy(authorBlogs, "likes"),
  }))

  const maxAuthor = _.maxBy(authorLikesSum, "likes")

  return maxAuthor
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
