import { useState } from 'react'
import { TextField, Button } from '@mui/material'
const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = event => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
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
