import { render, screen } from "@testing-library/react"
import Blog from "./Blog"

describe("<Blog />", () => {
  const mockLikeHandler = vi.fn()
  const blog = {
    title: "Things I Don't Know as of 2018",
    author: "Dan Abramov",
    url: "https://overreacted.io/things-i-dont-know-as-of-2018/",
    user: {
      username: "mluukkai",
    },
    likes: 2,
  }
  const mockDeleteHandler = vi.fn()
  describe("when the user is not logged in", () => {
    beforeEach(() => {
      const blogUser = null
      render(
        <Blog
          blog={blog}
          user={blogUser}
          handleDelete={mockDeleteHandler}
          handleLike={mockLikeHandler}
        />,
      )
    })

    test("Blog information and the number of likes are displayed to unauthenticated users, buttons are not displayed", () => {
      const title = screen.findByText("Things I Don't Know as of 2018")
      expect(title).toBeDefined()
      const author = screen.findByText("Dan Abramov")
      expect(author).toBeDefined()
      const url = screen.queryByText(
        "https://overreacted.io/things-i-dont-know-as-of-2018/",
      )
      expect(url).toBeDefined()
      const likes = screen.queryByText("likes 2")
      expect(likes).toBeDefined()
      const likeButton = screen.queryByText("like")
      expect(likeButton).toBeNull()
      const removeButton = screen.queryByText("remove")
      expect(removeButton).toBeNull()
    })
  })
  describe("when not the blog's creator is logged in", () => {
    beforeEach(() => {
      const blogUser = {
        username: "anotheruser",
      }
      render(
        <Blog
          blog={blog}
          user={blogUser}
          handleDelete={mockDeleteHandler}
          handleLike={mockLikeHandler}
        />,
      )
    })
    test("Blog information and the number of likes are displayed to authenticated users, only the like button is displayed, remove button is not displayed", () => {
      const title = screen.findByText("Things I Don't Know as of 2018")
      expect(title).toBeDefined()
      const author = screen.findByText("Dan Abramov")
      expect(author).toBeDefined()
      const url = screen.queryByText(
        "https://overreacted.io/things-i-dont-know-as-of-2018/",
      )
      expect(url).toBeDefined()
      const likes = screen.queryByText("likes 2")
      expect(likes).toBeDefined()
      const likeButton = screen.queryByText("like")
      expect(likeButton).toBeDefined()
      const removeButton = screen.queryByText("remove")
      expect(removeButton).toBeNull()
    })
  })
  describe("when the blog's creator is logged in", () => {
    beforeEach(() => {
      const blogUser = {
        username: "mluukkai",
      }
      render(
        <Blog
          blog={blog}
          user={blogUser}
          handleDelete={mockDeleteHandler}
          handleLike={mockLikeHandler}
        />,
      )
    })
    test("Blog information and the number of likes are displayed to authenticated users, both like and remove buttons are displayed", () => {
      const title = screen.findByText("Things I Don't Know as of 2018")
      expect(title).toBeDefined()
      const author = screen.findByText("Dan Abramov")
      expect(author).toBeDefined()
      const url = screen.queryByText(
        "https://overreacted.io/things-i-dont-know-as-of-2018/",
      )
      expect(url).toBeDefined()
      const likes = screen.queryByText("likes 2")
      expect(likes).toBeDefined()
      const likeButton = screen.queryByText("like")
      expect(likeButton).toBeDefined()
      const removeButton = screen.queryByText("remove")
      expect(removeButton).toBeDefined()
    })
  })
})
