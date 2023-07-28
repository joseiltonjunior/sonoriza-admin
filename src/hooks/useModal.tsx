import React, { createContext, useContext, useState } from 'react'

interface ModalInfoProps {
  description: string
  confirm: () => void
  title: string
  singleButton?: boolean
}

interface ModalStateProps extends ModalInfoProps {
  visible: boolean
}

interface ModalContextData {
  modalState: ModalStateProps
  openModal({ description, confirm, title }: ModalInfoProps): void
  closeModal(): void
}

const ModalContext = createContext<ModalContextData>({} as ModalContextData)

export function ModalProvider({ children }: React.PropsWithChildren) {
  const [modalState, setState] = useState({
    visible: false,
    description: '',
    confirm: () => {},
    title: '',
  })

  const openModal = (payload: ModalStateProps) => {
    document.body.style.overflow = 'hidden'
    setState({ ...payload, visible: true })
  }

  const closeModal = () => {
    document.body.style.overflow = 'auto'
    setState({ visible: false, description: '', confirm: () => {}, title: '' })
  }

  return (
    <ModalContext.Provider
      value={{
        modalState,
        closeModal,
        openModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  )
}

export function useModal(): ModalContextData {
  const context = useContext(ModalContext)

  if (!context) {
    throw new Error('useModal must be used within an ModalProvider')
  }

  return context
}
