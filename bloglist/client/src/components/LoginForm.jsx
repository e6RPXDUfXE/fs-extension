import { useState } from "react"
import { TextField, Button } from "@mui/material"
const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (event) => {
    event.preventDefault()
    await handleLogin({ username, password })
    setUsername("")
    setPassword("")
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
        <div>
          <Button style={{ marginTop: 10 }} variant="contained" type="submit">
            login
          </Button>
        </div>
      </form>
    </div>
  )
}

export default LoginForm
