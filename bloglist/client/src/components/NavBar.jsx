import { Link, useNavigate } from "react-router-dom"
import { AppBar, Toolbar, Button, Typography } from "@mui/material"
import { useUser, useUserActions } from "../userStore"
import { useNotificationActions } from "../notificationStore"

const NavBar = () => {
  const user = useUser()
  const { logout } = useUserActions()
  const { setNotification } = useNotificationActions()
  const navigate = useNavigate()

  const hoverStyle = { "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } }

  const handleLogout = () => {
    logout()
    setNotification("You have been logged out", "success")
    navigate("/")
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Blog App
        </Typography>

        <Button color="inherit" component={Link} to="/" sx={hoverStyle}>
          blogs
        </Button>

        {user && (
          <Button color="inherit" component={Link} to="/create" sx={hoverStyle}>
            new blog
          </Button>
        )}

        {user ? (
          <Button color="inherit" onClick={handleLogout} sx={hoverStyle}>
            logout
          </Button>
        ) : (
          <Button color="inherit" component={Link} to="/login" sx={hoverStyle}>
            login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default NavBar
