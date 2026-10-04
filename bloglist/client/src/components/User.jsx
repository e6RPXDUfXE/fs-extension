import { useUser } from "../usersStore"
import { useParams } from "react-router-dom"
const User = () => {
  const { id } = useParams()
  const user = useUser(id)
  if (!user) {
    return <div>User not found</div>
  }
  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default User
