import { create } from "zustand"
import blogService from "./services/blogs"

const useBlogStore = create((set) => ({
  blogs: [],
  actions: {
    like: async (blog) => {
      const returnedBlog = await blogService.update(blog.id, {
        ...blog,
        likes: blog.likes + 1,
      })
      set((state) => ({
        blogs: state.blogs
          .map((blog) => (blog.id === returnedBlog.id ? returnedBlog : blog))
          .sort((a, b) => b.likes - a.likes),
      }))
    },
    add: async (blog) => {
      const newBlog = await blogService.create(blog)
      set((state) => ({ blogs: state.blogs.concat(newBlog) }))
    },
    remove: async (id) => {
      await blogService.remove(id)
      set((state) => ({
        blogs: state.blogs.filter((b) => b.id !== id),
      }))
    },
    addComment: async (id, comment) => {
      const updatedBlog = await blogService.addComment(id, comment)
      set((state) => ({
        blogs: state.blogs.map((blog) =>
          blog.id === updatedBlog.id ? updatedBlog : blog,
        ),
      }))
    },
    initialize: async () => {
      const blogs = await blogService.getAll()
      set(() => ({ blogs: blogs.sort((a, b) => b.likes - a.likes) }))
    },
  },
}))

export default useBlogStore

export const useBlogs = () => useBlogStore((state) => state.blogs)
export const useBlogActions = () => useBlogStore((state) => state.actions)
export const useBlog = (id) =>
  useBlogStore((state) => state.blogs.find((blog) => blog.id === id))
