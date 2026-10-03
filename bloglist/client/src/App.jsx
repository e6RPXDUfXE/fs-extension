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
import { Routes, Route, Link, useNavigate } from "react-router-dom"
import { Container, AppBar, Toolbar, Button, Typography } from "@mui/material"
import { useNotificationActions } from "./notificationStore"
import { useBlogActions } from "./blogStore"

const App = () => {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const { setNotification: showNotification } = useNotificationActions()
  const { initialize } = useBlogActions()

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

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
        <Notification />

        <Routes>
          <Route
            path="/login"
            element={<LoginForm handleLogin={handleLogin} />}
          />
          <Route path="/blogs/:id" element={<Blog user={user} />} />
          <Route path="/create" element={<BlogForm />} />
          <Route path="/" element={<BlogList />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </Container>
  )
}

export default App
