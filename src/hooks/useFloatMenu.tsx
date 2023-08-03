import { createContext, useContext, useState, ReactNode } from 'react'

interface FloatMenuProps {
  isVisible: boolean
  show: (isVisible: boolean) => void
}

const FloatMenuContext = createContext<FloatMenuProps | undefined>(undefined)

interface FloatMenuProviderProps {
  children: ReactNode
}

export function FloatMenuProvider({ children }: FloatMenuProviderProps) {
  const [isVisible, setIsVisible] = useState(false)

  const show = (isVisible: boolean) => {
    setIsVisible(isVisible)
  }

  return (
    <FloatMenuContext.Provider value={{ isVisible, show }}>
      {children}
    </FloatMenuContext.Provider>
  )
}

export function useFloatMenu(): FloatMenuProps {
  const context = useContext(FloatMenuContext)
  if (!context) {
    throw new Error(
      'useFloatMenuContext must be used within a FloatMenuProvider',
    )
  }
  return context
}
