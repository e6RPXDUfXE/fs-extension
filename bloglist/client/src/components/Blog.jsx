import {
  Button,
  Card,
  CardContent,
  Link,
  Stack,
  Typography
} from '@mui/material'

const Blog = ({ blog, user, handleDelete, handleLike }) => {
  if (!blog) { return  null }

  const handleLikeClick = async () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1
    }

    handleLike(updatedBlog)
  }

  return (
    <Card
      sx={{
        mx: 'auto',
        mt: 4,
        borderRadius: 3,
        boxShadow: 3,
        transition: '0.2s',

        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h4"
          component="h2"
          fontWeight="bold"
          gutterBottom
        >
          {blog.title}
        </Typography>

        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          by {blog.author}
        </Typography>

        <Link
          href={blog.url}
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          sx={{
            display: 'inline-block',
            mb: 1,
            wordBreak: 'break-all'
          }}
        >
          {blog.url}
        </Link>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Added by {blog.user.name}
        </Typography>

        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center' }}
        >
          <Typography>
            <strong>{blog.likes}</strong> likes
          </Typography>

          {user && (
            <Button
              variant="outlined"
              onClick={handleLikeClick}
            >
              Like
            </Button>
          )}

          {user && blog.user.username === user.username && (
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleDelete(blog)}
            >
              Remove
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

export default Blog