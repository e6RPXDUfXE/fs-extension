import { useUser } from "../usersStore"
import { useParams, Link } from "react-router-dom"
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material"

const User = () => {
  const { id } = useParams()
  const user = useUser(id)

  if (!user) {
    return (
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h5" color="text.secondary">
          User not found
        </Typography>
      </Box>
    )
  }

  return (
    <Card
      sx={{
        maxWidth: 700,
        mx: "auto",
        mt: 4,
        borderRadius: 3,
        boxShadow: 3,
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 3,
          }}
        >
          <Avatar
            sx={{
              width: 64,
              height: 64,
              fontSize: 28,
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </Avatar>

          <Box>
            <Typography variant="h4" fontWeight="bold">
              {user.name}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {user.blogs.length} blogs added
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
          Added blogs
        </Typography>

        {user.blogs.length === 0 ? (
          <Typography color="text.secondary">
            This user has not added any blogs yet.
          </Typography>
        ) : (
          <List disablePadding>
            {user.blogs.map((blog) => (
              <ListItem key={blog.id} disablePadding>
                <ListItemButton
                  component={Link}
                  to={`/blogs/${blog.id}`}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                  }}
                >
                  <ListItemText primary={blog.title} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  )
}

export default User
