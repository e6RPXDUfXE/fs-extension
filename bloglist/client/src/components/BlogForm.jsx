import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useBlogActions } from "../blogStore"
import { useNotificationActions } from "../notificationStore"
import { TextField, Button } from "@mui/material"
const BlogForm = () => {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [url, setUrl] = useState("")
  const navigate = useNavigate()
  const { add: createBlog } = useBlogActions()
  const { setNotification } = useNotificationActions()

  const addBlog = async (event) => {
    try {
      event.preventDefault()
      await createBlog({
        title: title,
        author: author,
        url: url,
      })
      setTitle("")
      setAuthor("")
      setUrl("")
      setNotification(`A new blog "${title}" by ${author} added`, "success")
      navigate("/")
    } catch (error) {
      setNotification(
        `Error creating blog:  ${error.response.data.error}`,
        "error",
      )
    }
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          <TextField
            label="Title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            placeholder="write blog title here"
            size="small"
          />
        </div>
        <div>
          <TextField
            label="Author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            placeholder="write blog author here"
            size="small"
            margin="normal"
          />
        </div>
        <div>
          <TextField
            label="URL"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            placeholder="write blog url here"
            size="small"
            margin="normal"
          />
        </div>
        <div>
          <Button style={{ marginTop: 10 }} variant="contained" type="submit">
            create
          </Button>
        </div>
      </form>
    </div>
  )
}

export default BlogForm
