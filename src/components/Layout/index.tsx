import { PropsWithChildren } from 'react'
import { Header } from './Header'
import { Aside } from './Aside'
import { Modal } from '../Modal'
import { FloatMenu } from '../FloatMenu'

interface LayoutProps extends PropsWithChildren {
  isError?: boolean
}

export function Layout({ children, isError }: LayoutProps) {
  return (
    <div className="relative">
      <Modal />
      <FloatMenu />
      <Header isError={isError} />
      <div className="pt-20 flex h-screen">
        <Aside />
        <main className="ml-[350px] w-screen py-20 px-10 md:py-10 md:px-5 base:ml-0">
          {children}
        </main>
      </div>
    </div>
  )
}
