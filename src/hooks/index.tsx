import { SkeletonTheme } from 'react-loading-skeleton'
import { ModalProvider } from './useModal'
import colors from 'tailwindcss/colors'
import { store } from '@/storage'
import { Provider } from 'react-redux'

import 'react-loading-skeleton/dist/skeleton.css'
import React from 'react'
import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
import { FormProvider } from './useForm'

export function Hooks({ children }: React.PropsWithChildren) {
  return (
    <>
      <Provider store={store}>
        <ModalProvider>
          <FormProvider>
            <SkeletonTheme
              baseColor={colors.gray[100]}
              highlightColor={colors.gray[300]}
            >
              {children}
            </SkeletonTheme>
            <ToastContainer />
          </FormProvider>
        </ModalProvider>
      </Provider>
    </>
  )
}
