import { create } from "zustand"

const useNotificationStore = create((set) => ({
  notification: {
    text: "",
    type: "",
  },
  actions: {
    setNotification: (text, type) => {
      set(() => ({ notification: { text, type } }))
      setTimeout(() => {
        set(() => ({ notification: { text: "", type: "" } }))
      }, 5000)
    },
  },
}))

export default useNotificationStore

export const useNotification = () =>
  useNotificationStore((state) => state.notification)
export const useNotificationActions = () =>
  useNotificationStore((state) => state.actions)
