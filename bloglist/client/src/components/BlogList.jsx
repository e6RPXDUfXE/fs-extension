import { useNavigate } from "react-router-dom"
import { useBlogs } from "../blogStore"
import { Link } from "react-router-dom"
const BlogList = () => {
  const blogs = useBlogs()
  const navigate = useNavigate()
  return (
    <div>
      <h2>blogs</h2>
      {blogs.map((blog) => (
        <div className="blog" key={blog.id}>
          <div>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link> by {blog.author}
            <button onClick={() => navigate(`/blogs/${blog.id}`)}>view</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default BlogList
