import React from 'react'

const Context = React.createContext()

export function ContextProvider({children}) {
  return (
      <Context.Provider value={{}}>
          {children}
      </Context.Provider>
  )
}

export const Conumer = Context.Consumer
export default ContextProvider


