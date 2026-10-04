import { useEffect } from "react"
import NavBar from "./components/NavBar"
import Notification from "./components/Notification"
import Blog from "./components/Blog"
import UserList from "./components/UserList"
import User from "./components/User"
import LoginForm from "./components/LoginForm"
import BlogForm from "./components/BlogForm"
import BlogList from "./components/BlogList"
import ErrorBoundary from "./components/ErrorBoundary"
import NotFound from "./components/NotFound"
import { Routes, Route } from "react-router-dom"
import { Container } from "@mui/material"
import { useBlogActions } from "./blogStore"
import { useUserActions } from "./loginUserStore"
import { useUsersActions } from "./usersStore"

const App = () => {
  const { initialize: initializeBlogs } = useBlogActions()
  const { initialize: initializeUser } = useUserActions()
  const { initialize: initializeUsers } = useUsersActions()

  useEffect(() => {
    initializeBlogs()
    initializeUser()
    initializeUsers()
  }, [initializeBlogs, initializeUser, initializeUsers])

  return (
    <Container>
      <NavBar />
      <ErrorBoundary>
        <Notification />
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/blogs/:id" element={<Blog />} />
          <Route path="/users/:id" element={<User />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/create" element={<BlogForm />} />
          <Route path="/" element={<BlogList />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </Container>
  )
}

export default App
