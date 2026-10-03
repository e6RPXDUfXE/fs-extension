import { useNavigate } from "react-router-dom"
import { useBlogs } from "../blogStore"
const BlogList = () => {
  const blogs = useBlogs()
  const navigate = useNavigate()
  return (
    <div>
      <h2>blogs</h2>
      {blogs.map((blog) => (
        <div className="blog" key={blog.id}>
          <div>
            {blog.title} {blog.author}{" "}
            <button onClick={() => navigate(`/blogs/${blog.id}`)}>view</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default BlogList
