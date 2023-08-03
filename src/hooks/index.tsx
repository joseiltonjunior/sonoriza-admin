import { SkeletonTheme } from 'react-loading-skeleton'
import { ModalProvider } from './useModal'
import colors from 'tailwindcss/colors'
import { store } from '@/storage'
import { Provider } from 'react-redux'

import { Analytics } from '@vercel/analytics/react'

import 'react-loading-skeleton/dist/skeleton.css'
import React from 'react'
import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
import { FormProvider } from './useForm'
import { FloatMenuProvider } from './useFloatMenu'

export function Hooks({ children }: React.PropsWithChildren) {
  return (
    <>
      <Provider store={store}>
        <ModalProvider>
          <FloatMenuProvider>
            <FormProvider>
              <SkeletonTheme
                baseColor={colors.gray[100]}
                highlightColor={colors.gray[300]}
              >
                {children}
              </SkeletonTheme>
              <ToastContainer />
            </FormProvider>
          </FloatMenuProvider>
        </ModalProvider>
      </Provider>
      <Analytics />
    </>
  )
}
