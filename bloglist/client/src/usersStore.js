import { create } from "zustand"
import usersService from "./services/users"

const useUsersStore = create((set) => ({
  users: [],
  actions: {
    initialize: async () => {
      const users = await usersService.getAll()
      set(() => ({ users }))
    },
  },
}))

export default useUsersStore

export const useUsers = () => useUsersStore((state) => state.users)
export const useUsersActions = () => useUsersStore((state) => state.actions)
export const useUser = (id) =>
  useUsersStore((state) => state.users.find((user) => user.id === id))
