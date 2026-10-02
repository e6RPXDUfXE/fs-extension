import { useState, useEffect } from "react"
import Notification from "./components/Notification"
import Blog from "./components/Blog"
import LoginForm from "./components/LoginForm"
import BlogForm from "./components/BlogForm"
import BlogList from "./components/BlogList"
import ErrorBoundary from "./components/ErrorBoundary"
import NotFound from "./components/NotFound"
import blogService from "./services/blogs"
import loginService from "./services/login"
import { Routes, Route, Link, useMatch, useNavigate } from "react-router-dom"
import { Container, AppBar, Toolbar, Button, Typography } from "@mui/material"

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(sortedBlogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showNotification = (text, type) => {
    setNotification({ text, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials)
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      showNotification(`Welcome ${user.name}`, "success")
      navigate("/")
    } catch {
      showNotification("Wrong credentials", "error")
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser")
    setUser(null)
    showNotification("You have been logged out", "success")
    navigate("/")
  }

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      showNotification(
        `A new blog "${returnedBlog.title}" by ${returnedBlog.author} added`,
        "success",
      )
      navigate("/")
    } catch (error) {
      showNotification(
        `Error creating blog:  ${error.response.data.error}`,
        "error",
      )
    }
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter((b) => b.id !== blog.id))
        showNotification(
          `Blog "${blog.title}" by ${blog.author} removed`,
          "success",
        )
        navigate("/")
      } catch (error) {
        showNotification(
          `Error deleting blog: ${error.response.data.error}`,
          "error",
        )
      }
    }
  }

  const handleLike = async (updatedBlog) => {
    try {
      const returnedBlog = await blogService.update(updatedBlog.id, updatedBlog)
      const updatedBlogs = blogs.map((blog) =>
        blog.id === returnedBlog.id ? returnedBlog : blog,
      )
      const sortedBlogs = updatedBlogs.sort((a, b) => b.likes - a.likes)
      setBlogs(sortedBlogs)
    } catch (error) {
      showNotification(
        `Error updating blog: ${error.response.data.error}`,
        "error",
      )
    }
  }

  const match = useMatch("/blogs/:id")

  const blog = match ? blogs.find((b) => b.id === match.params.id) : null

  const hoverStyle = { "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } }

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Blog App
          </Typography>
          <Button color="inherit" component={Link} to="/" sx={hoverStyle}>
            blogs
          </Button>
          {user && (
            <Button
              color="inherit"
              component={Link}
              to="/create"
              sx={hoverStyle}
            >
              new blog
            </Button>
          )}
          {user ? (
            <Button color="inherit" onClick={handleLogout} sx={hoverStyle}>
              logout
            </Button>
          ) : (
            <Button
              color="inherit"
              component={Link}
              to="/login"
              sx={hoverStyle}
            >
              login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <ErrorBoundary>
        <Notification notification={notification} />

        <Routes>
          <Route
            path="/login"
            element={<LoginForm handleLogin={handleLogin} />}
          />
          <Route
            path="/blogs/:id"
            element={
              <Blog
                blog={blog}
                user={user}
                handleDelete={handleDelete}
                handleLike={handleLike}
              />
            }
          />
          <Route path="/create" element={<BlogForm createBlog={addBlog} />} />
          <Route path="/" element={<BlogList blogs={blogs} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </Container>
  )
}

export default App
