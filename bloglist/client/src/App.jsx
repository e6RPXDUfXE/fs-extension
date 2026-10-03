import { useEffect } from "react"
import NavBar from "./components/NavBar"
import Notification from "./components/Notification"
import Blog from "./components/Blog"
import LoginForm from "./components/LoginForm"
import BlogForm from "./components/BlogForm"
import BlogList from "./components/BlogList"
import ErrorBoundary from "./components/ErrorBoundary"
import NotFound from "./components/NotFound"
import { Routes, Route } from "react-router-dom"
import { Container } from "@mui/material"
import { useBlogActions } from "./blogStore"
import { useUserActions } from "./userStore"

const App = () => {
  const { initialize: initializeBlogs } = useBlogActions()
  const { initialize: initializeUser } = useUserActions()

  useEffect(() => {
    initializeBlogs()
    initializeUser()
  }, [initializeBlogs, initializeUser])

  return (
    <Container>
      <NavBar />
      <ErrorBoundary>
        <Notification />
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/blogs/:id" element={<Blog />} />
          <Route path="/create" element={<BlogForm />} />
          <Route path="/" element={<BlogList />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </Container>
  )
}

export default App
