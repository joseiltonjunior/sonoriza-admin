import { SkeletonTheme } from 'react-loading-skeleton'
// import { ModalProvider } from './useModal'
import colors from 'tailwindcss/colors'

import 'react-loading-skeleton/dist/skeleton.css'
import React from 'react'
import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

export function Hooks({ children }: React.PropsWithChildren) {
  return (
    <>
      <SkeletonTheme
        baseColor={colors.gray[100]}
        highlightColor={colors.gray[300]}
      >
        {children}
      </SkeletonTheme>
      <ToastContainer />
    </>
  )
}
