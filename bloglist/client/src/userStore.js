import { create } from "zustand"
import loginService from "./services/login"
import userService from "./services/persistentUser"
import blogService from "./services/blogs"

const useUserStore = create((set) => ({
  user: null,

  actions: {
    initialize: () => {
      const user = userService.getUser()
      if (user) {
        blogService.setToken(user.token)
        set({ user })
      }
    },

    login: async (credentials) => {
      const user = await loginService.login(credentials)
      userService.saveUser(user)
      blogService.setToken(user.token)
      set({ user })
      return user
    },

    logout: () => {
      userService.removeUser()
      blogService.setToken(null)
      set({ user: null })
    },
  },
}))

export default useUserStore

export const useUser = () => useUserStore((state) => state.user)
export const useUserActions = () => useUserStore((state) => state.actions)
