import { createContext, useState } from 'react'

const AnecdoteContext = createContext()

export default AnecdoteContext

export const AnecdoteProvider = ({ children }) => {
  const [anecdotes, setAnecdotes] = useState([])

  return (
    <AnecdoteContext.Provider
      value={{
        anecdotes,
        setAnecdotes
      }}
    >
      {children}
    </AnecdoteContext.Provider>
  )
}