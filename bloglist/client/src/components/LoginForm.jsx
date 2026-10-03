import { useState } from "react"
import { TextField, Button } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { useUserActions } from "../userStore"
import { useNotificationActions } from "../notificationStore"

const LoginForm = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const { login } = useUserActions()
  const { setNotification } = useNotificationActions()
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const user = await login({ username, password })
      setNotification(`Welcome ${user.name}`, "success")
      setUsername("")
      setPassword("")
      navigate("/")
    } catch {
      setNotification("Wrong credentials", "error")
    }
  }

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            size="small"
            label="Username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          <TextField
            size="small"
            margin="normal"
            label="Password"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <Button style={{ marginTop: 10 }} variant="contained" type="submit">
          login
        </Button>
      </form>
    </div>
  )
}

export default LoginForm
